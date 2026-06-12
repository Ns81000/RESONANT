import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { EvaluationResponse, Level } from "./types";

const InputSchema = z.object({
  audioBase64: z.string().min(1),
  questionPrompt: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  mode: z.enum(["free", "scripted"]),
  timeLimitSeconds: z.number(),
  userName: z.string(),
});

const FeedbackItemSchema = z.object({
  type: z.enum(["grammar", "clarity", "vocabulary", "filler"]),
  issue: z.string(),
  fix: z.string(),
});

const EvalSchema = z.object({
  transcript: z.string(),
  scores: z.object({
    clarity: z.number().min(0).max(10),
    grammar: z.number().min(0).max(10),
    confidence: z.number().min(0).max(10),
  }),
  feedbackItems: z.array(FeedbackItemSchema).min(1).max(4),
  coachNote: z.string(),
  passed: z.boolean(),
});

function buildPrompt(level: Level, prompt: string, mode: string, name: string, timeLimit: number) {
  return `You are Resonant Coach — a warm, precise communication trainer for non-native English speakers in corporate settings.

The user (${name}) is at the ${level} level. They have just spoken for up to ${timeLimit} seconds in response to:
"${prompt}"

Their input mode was: ${mode === "scripted" ? "Read & speak (scripted reading)" : "Speak freely (own words)"}

Evaluate across THREE dimensions, each 0–10:
1. CLARITY — structure, logical flow, lack of ambiguity.
2. GRAMMAR — accuracy of English grammar, level-appropriate.
3. CONFIDENCE — assertiveness, pace, filler words, professional tone.

Scoring rubric:
- Beginner: score generously, reward attempts.
- Intermediate: score accurately, expect mostly correct grammar.
- Advanced: score strictly, expect polished, executive-grade communication.

Return ONLY a JSON object matching this schema (no markdown, no prose):
{
  "transcript": "verbatim transcription of what was said",
  "scores": { "clarity": number, "grammar": number, "confidence": number },
  "feedbackItems": [ { "type": "grammar|clarity|vocabulary|filler", "issue": "...", "fix": "..." } ],
  "coachNote": "one warm paragraph, max 80 words, addressed to ${name}, referencing what they actually said.",
  "passed": boolean
}

Rules:
- feedbackItems: 1–4 entries, most important issues only.
- passed: true if all three scores >= 6.0.
- coachNote MUST reference something specific they said and use the name "${name}".
- If audio is too short or unclear, return transcript "[unclear]" with scores around 4 and a friendly coachNote asking ${name} to try again.`;
}

// ---------- Key pool ----------
// Supports either GEMINI_API_KEYS (comma-separated) for rotation/failover,
// or a single GEMINI_API_KEY. Per-request round-robin + retry on rate limit.
function getKeyPool(): string[] {
  const multi = process.env.GEMINI_API_KEYS;
  if (multi) {
    const keys = multi
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (keys.length) return keys;
  }
  const single = process.env.GEMINI_API_KEY;
  return single ? [single] : [];
}

let rotationCursor = 0;
function nextStartIndex(len: number) {
  const i = rotationCursor % len;
  rotationCursor = (rotationCursor + 1) % len;
  return i;
}

async function callGemini(apiKey: string, body: unknown): Promise<Response> {
  const model = "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const analyzeSpeech = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<EvaluationResponse> => {
    const pool = getKeyPool();
    if (pool.length === 0)
      throw new Error("No Gemini API keys configured (set GEMINI_API_KEY or GEMINI_API_KEYS).");

    const prompt = buildPrompt(
      data.level,
      data.questionPrompt,
      data.mode,
      data.userName,
      data.timeLimitSeconds,
    );
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "audio/wav", data: data.audioBase64 } },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 800,
      },
    };

    const start = nextStartIndex(pool.length);
    let lastErr = "";
    let res: Response | null = null;
    // Try every key once; on 429/5xx rotate, on other errors fail fast.
    for (let i = 0; i < pool.length; i++) {
      const key = pool[(start + i) % pool.length];
      // brief jittered backoff between retries
      if (i > 0) await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
      try {
        const r = await callGemini(key, body);
        if (r.ok) {
          res = r;
          break;
        }
        const txt = await r.text();
        lastErr = `Gemini ${r.status}: ${txt.slice(0, 200)}`;
        // Only retry on rate-limit / transient
        if (r.status !== 429 && r.status < 500) {
          throw new Error(lastErr);
        }
      } catch (e) {
        lastErr = e instanceof Error ? e.message : String(e);
      }
    }
    if (!res) throw new Error(`All Gemini keys failed. Last: ${lastErr}`);

    const json = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Model did not return JSON");
      parsed = JSON.parse(m[0]);
    }

    const validated = EvalSchema.safeParse(parsed);
    if (!validated.success) {
      return {
        transcript: "[Unable to process audio clearly]",
        scores: { clarity: 5, grammar: 5, confidence: 5 },
        feedbackItems: [
          {
            type: "clarity",
            issue: "Audio quality made analysis difficult.",
            fix: "Try recording again in a quieter environment.",
          },
        ],
        coachNote: `${data.userName}, we had trouble processing this response clearly. Try again in a quieter environment.`,
        passed: false,
      };
    }
    return validated.data;
  });
