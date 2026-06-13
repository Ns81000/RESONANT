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

function buildSystemInstruction() {
  return `You are Resonant Coach — a highly professional, direct, and candid communication trainer for non-native English speakers in corporate settings. Your coaching style is constructive, objective, and realistic. You never sugarcoat mistakes, offer generic platitudes, or provide empty praise. You hold the user to real-world business standards.

Evaluate the user's spoken response across THREE dimensions, each 0–10:
1. CLARITY — structure, logical flow, lack of ambiguity.
2. GRAMMAR — accuracy of English grammar, level-appropriate.
3. CONFIDENCE — assertiveness, pace, filler words, professional tone.

Scoring rubric:
- Beginner: Encourage attempts, but score honestly. Grammar errors should be flagged.
- Intermediate: Score strictly. Expect mostly correct grammar, solid sentence structure, and clear flow. Do not pass if they hesitate excessively or make basic grammar mistakes.
- Advanced: Score with executive-level rigor. Expect polished, persuasive, and structured business communication. Hesitations, filler words, or informal vocabulary should significantly drop the score.

Return ONLY a JSON object matching this schema (no markdown, no prose, no backticks):
{
  "transcript": "verbatim transcription of what was said",
  "scores": { "clarity": number, "grammar": number, "confidence": number },
  "feedbackItems": [ { "type": "grammar|clarity|vocabulary|filler", "issue": "issue desc (max 15 words)", "fix": "fix suggestion (max 15 words)" } ],
  "coachNote": "addressed to the user by name, referencing what they said, max 60 words. State exactly what they did well, but be highly candid and direct about their main weakness. Avoid generic empty praise. If their scores are low, explain why they failed to meet the standard.",
  "passed": boolean
}

Rules:
- feedbackItems: 1–4 entries, identifying actual issues and how to resolve them. Keep descriptions extremely concise (max 15 words each).
- passed: true if all three scores >= 6.0.
- coachNote MUST be realistic, direct, and use the user's name. Max 60 words.
- Avoid overly soft or positive platitudes like "Excellent response!" if the scores are mediocre (6.0 - 7.5) or failing (< 6.0). Be professional, constructive, and demanding.
- If audio is too short or unclear, return transcript "[unclear]" with scores around 4 and a coachNote explaining that the speech could not be evaluated and asking the user to retry with clear delivery.`;
}

function buildUserPrompt(level: Level, prompt: string, mode: string, name: string, timeLimit: number) {
  return `Evaluate the attached audio file.
User Name: ${name}
Target Level: ${level}
Question Prompt: "${prompt}"
Input Mode: ${mode === "scripted" ? "Read & speak (scripted reading)" : "Speak freely (own words)"}
Time Limit: ${timeLimit} seconds`;
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

    const systemPrompt = buildSystemInstruction();
    const userPrompt = buildUserPrompt(
      data.level,
      data.questionPrompt,
      data.mode,
      data.userName,
      data.timeLimitSeconds,
    );
    const body = {
      systemInstruction: {
        parts: [
          { text: systemPrompt }
        ]
      },
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "audio/wav", data: data.audioBase64 } },
            { text: userPrompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.15,
        maxOutputTokens: 600,
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
