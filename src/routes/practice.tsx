import { createFileRoute, Navigate, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Pause,
  RotateCw,
  Mic,
  FileText,
  ChevronRight,
  Quote,
} from "lucide-react";
import { useSession } from "@/lib/resonant/store";
import { questionsForLevel } from "@/lib/resonant/questions";
import { personalize } from "@/lib/resonant/personalize";
import { randomFact } from "@/lib/resonant/funFacts";
import { recordAudio, blobToBase64 } from "@/lib/resonant/audio";
import { analyzeSpeech } from "@/lib/resonant/analyze.functions";
import { useServerFn } from "@tanstack/react-start";
import { RecordButton } from "@/components/resonant/RecordButton";
import { OrbVisualizer } from "@/components/resonant/OrbVisualizer";
import { ScoreDial } from "@/components/resonant/ScoreDial";
import type { EvaluationResponse } from "@/lib/resonant/types";
import logoSvg from "@/components/resonant/logo";

export const Route = createFileRoute("/practice")({
  head: () => ({ meta: [{ title: "Practice — Resonant" }] }),
  component: Practice,
});

type Stage = "PROMPT" | "MODE" | "RECORDING" | "PROCESSING" | "FEEDBACK";

function Practice() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const navigate = useNavigate();
  const { userName, level, currentQuestion, results: sessionResults, setCurrentQuestion, pushResult, completeLevel } =
    useSession();
  const analyze = useServerFn(analyzeSpeech);

  const questions = useMemo(() => (level ? questionsForLevel(level) : []), [level]);
  const q = questions[currentQuestion];

  const hasExistingResult = useMemo(() => {
    return sessionResults.some((r) => r.questionId === q?.id);
  }, [sessionResults, q?.id]);

  const [stage, setStage] = useState<Stage>("PROMPT");
  const [mode, setMode] = useState<"free" | "scripted" | null>(null);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "done">("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [funFact, setFunFact] = useState("");
  const [evalResult, setEvalResult] = useState<EvaluationResponse | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hangUpOpen, setHangUpOpen] = useState(false);
  const stopRef = useRef<{ stop: () => void; onStop: (cb: () => void) => void }>({
    stop: () => {},
    onStop: () => {},
  });
  const stageRef = useRef<HTMLDivElement>(null);

  // animate stage transitions
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !stageRef.current) return;
      const ctx = gsap.context(() => {
        gsap.from(".stage-in", {
          opacity: 0,
          y: 20,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
        });
      }, stageRef);
      return () => ctx.revert();
    })();
    return () => {
      mounted = false;
    };
  }, [stage, currentQuestion]);

  // Keyboard: space to start/stop recording
  const handleRecordButton = useCallback(() => {
    if (stage === "RECORDING") {
      if (recordingState === "idle") {
        handleStartRecording();
      } else if (recordingState === "recording") {
        stopRef.current.stop();
      }
    }
  }, [stage, recordingState, mode]); // Need mode in dependency if handleStartRecording needs it

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && stage === "RECORDING" && !hangUpOpen) {
        e.preventDefault();
        handleRecordButton();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, hangUpOpen, handleRecordButton]);

  if (hydrated && (!userName || !level)) return <Navigate to="/setup" />;
  if (!hydrated || !q || !level) return <div className="min-h-screen bg-canvas" />;

  const prompt = personalize(q.prompt, userName);
  const providedText = q.providedText ? personalize(q.providedText, userName) : null;
  const totalQuestions = questions.length;

  const handleModeSelect = (selectedMode: "free" | "scripted") => {
    setMode(selectedMode);
    setError(null);
    setAudioBlob(null);
    setRecordingState("idle");
    setStage("RECORDING");
    setRemaining(q.timeLimitSeconds);
  };

  const handleStartRecording = async () => {
    if (!mode) return;
    setError(null);
    setRecordingState("recording");
    try {
      const blob = await recordAudio({
        maxSeconds: q.timeLimitSeconds,
        onLevel: setAudioLevel,
        onTick: setRemaining,
        signal: stopRef.current,
      });
      if (blob.size < 2000) {
        setError("That was a bit short. Give it another go.");
        setRecordingState("idle");
        return;
      }
      setAudioBlob(blob);
      setRecordingState("done");
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("denied") ||
        msg.includes("NotAllowed")
      ) {
        setError("Microphone access was denied. Please allow microphone in your browser settings.");
      } else if (msg.includes("NotFound")) {
        setError("No microphone detected. Please connect one and try again.");
      } else {
        setError(msg.slice(0, 160));
      }
      setRecordingState("idle");
    }
  };

  const handleSubmitRecording = async () => {
    if (!audioBlob || !mode) return;
    setFunFact(randomFact());
    setStage("PROCESSING");
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      const startedAt = Date.now();
      const result = await analyze({
        data: {
          audioBase64,
          questionPrompt: prompt,
          level,
          mode,
          timeLimitSeconds: q.timeLimitSeconds,
          userName,
        },
      });
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1500) await new Promise((r) => setTimeout(r, 1500 - elapsed));
      setEvalResult(result);
      setAttempts((n) => n + 1);
      pushResult({
        questionId: q.id,
        attempts: 1,
        bestScores: result.scores,
        passed: result.passed,
        skipped: false,
      });
      setStage("FEEDBACK");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("MODE");
    }
  };

  const handleRetry = () => {
    setEvalResult(null);
    setStage("MODE");
  };

  const advance = () => {
    setAttempts(0);
    setEvalResult(null);
    setMode(null);
    if (currentQuestion + 1 >= totalQuestions) {
      const currentResults = useSession.getState().results;
      const allFinished = questions.every((qItem) =>
        currentResults.some((r) => r.questionId === qItem.id)
      );

      if (allFinished) {
        completeLevel(level);
        const firstIncomplete = questions.findIndex((qItem) => {
          const r = currentResults.find((res) => res.questionId === qItem.id);
          return !r || !r.passed;
        });
        if (firstIncomplete !== -1) {
          useSession.getState().setCurrentQuestion(firstIncomplete);
        }
      }
      navigate({ to: "/complete" });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setStage("PROMPT");
    }
  };

  const handleNext = () => {
    advance();
  };

  const handleSkip = () => {
    // Allow skipping after at least one attempt or from prompt stage
    pushResult({
      questionId: q.id,
      attempts: 0,
      bestScores: evalResult?.scores ?? { clarity: 0, grammar: 0, confidence: 0 },
      passed: false,
      skipped: true,
    });
    advance();
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top progress */}
      <header className="px-4 sm:px-6 md:px-12 py-5 flex items-center justify-between border-b border-hairline-soft">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <span dangerouslySetInnerHTML={{ __html: logoSvg("#cc785c") }} />
          <span className="font-display text-base sm:text-lg text-ink hidden min-[400px]:inline">Resonant</span>
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-4">
          <span className="caption-up text-xs text-muted-tone whitespace-nowrap">
            {String(currentQuestion + 1).padStart(2, "0")} /{" "}
            {String(totalQuestions).padStart(2, "0")}
          </span>
          <div className="flex gap-1 sm:gap-1.5 items-center">
            {questions.map((qItem, i) => {
              const result = sessionResults.find((r) => r.questionId === qItem.id);
              const isCurrent = i === currentQuestion;
              let bg = "var(--hairline)";
              let border = "none";
              let w = 6;
              if (isCurrent) {
                bg = "var(--primary)";
                w = 22;
              } else if (result && !result.skipped && result.passed) {
                bg = "var(--success)";
              } else if (result && !result.skipped && !result.passed) {
                bg = "var(--accent-amber)";
              } else if (result && result.skipped) {
                bg = "transparent";
                border = "1.5px dashed var(--muted-soft)";
              }
              return (
                <span
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: w,
                    height: 6,
                    background: bg,
                    border,
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
          <button
            onClick={() => setHangUpOpen(true)}
            className="text-sm text-muted-tone hover:text-ink transition inline-flex items-center gap-1.5"
            aria-label="Pause session"
          >
            <Pause size={14} /> <span className="hidden sm:inline">Pause</span>
          </button>
        </div>
      </header>

      <main
        ref={stageRef}
        className="flex-1 px-6 md:px-12 pt-16 pb-8 md:py-12 flex flex-col items-center relative overflow-y-auto overflow-x-hidden"
      >
        {/* Top Actions Row */}
        {stage !== "PROCESSING" && (
          <div className="w-full max-w-3xl flex items-center justify-between absolute top-6 left-0 right-0 px-6 md:px-12 md:max-w-none pointer-events-none z-10">
            {/* Left side: Back/Prev navigation */}
            <div className="pointer-events-auto">
              {(stage !== "RECORDING" || (stage === "RECORDING" && recordingState === "idle")) ? (
                stage === "RECORDING" ? (
                  <button
                    onClick={() => setStage("MODE")}
                    className="btn-nav"
                    aria-label="Back to mode selection"
                  >
                    <ArrowLeft size={12} /> Back to Mode
                  </button>
                ) : stage === "MODE" ? (
                  <button
                    onClick={() => setStage("PROMPT")}
                    className="btn-nav"
                    aria-label="Back to prompt screen"
                  >
                    <ArrowLeft size={12} /> Back to Prompt
                  </button>
                ) : stage === "FEEDBACK" ? (
                  <button
                    onClick={() => {
                      if (currentQuestion > 0) {
                        setCurrentQuestion(currentQuestion - 1);
                        setStage("PROMPT");
                      } else {
                        navigate({ to: "/level-intro" });
                      }
                    }}
                    className="btn-nav"
                    aria-label="Previous question or back"
                  >
                    <ArrowLeft size={12} /> {currentQuestion === 0 ? "Back" : "Previous"}
                  </button>
                ) : // stage === "PROMPT"
                currentQuestion > 0 ? (
                  <button
                    onClick={() => {
                      setCurrentQuestion(currentQuestion - 1);
                      setStage("PROMPT");
                    }}
                    className="btn-nav"
                    aria-label="Previous question"
                  >
                    <ArrowLeft size={12} /> Previous
                  </button>
                ) : (
                  <button
                    onClick={() => navigate({ to: "/level-intro" })}
                    className="btn-nav"
                    aria-label="Back to level introduction"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                )
              ) : (
                <div className="w-1" />
              )}
            </div>

            {/* Right side: Skip button */}
            <div className="pointer-events-auto">
              {stage === "PROMPT" ? (
                hasExistingResult ? (
                  <button
                    onClick={advance}
                    className="btn-nav"
                    aria-label="Next question"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="btn-nav"
                    aria-label="Skip this question"
                  >
                    Skip <ChevronRight size={12} />
                  </button>
                )
              ) : (
                <div className="w-1" />
              )}
            </div>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="w-full max-w-3xl my-auto py-4">
          {stage === "PROMPT" && (
            <div className="text-center">
              <div className="stage-in caption-up text-muted-tone mb-6">{q.category}</div>
              <h1 className="stage-in display-lg text-ink mb-10 leading-tight">{prompt}</h1>
              <div className="stage-in inline-flex items-center gap-2 badge-neutral mb-12">
                <span>⏱</span> Up to {q.timeLimitSeconds} seconds
              </div>
              <div className="stage-in flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => setStage("MODE")} className="btn-primary !h-14 !px-8 w-full sm:w-auto">
                  Choose how to answer <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {stage === "MODE" && (
            <div>
              <div className="stage-in caption-up text-muted-tone mb-4">{q.category}</div>
              <h2 className="stage-in display-md text-ink mb-10 leading-tight">{prompt}</h2>

              {error && (
                <div
                  className="stage-in mb-6 px-4 py-3 rounded-md text-sm"
                  style={{
                    background: "color-mix(in srgb, var(--error) 12%, transparent)",
                    color: "var(--error)",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                className={`stage-in grid gap-4 ${providedText ? "md:grid-cols-2" : "md:grid-cols-1"}`}
              >
                <button
                  onClick={() => handleModeSelect("free")}
                  className="text-left p-5 md:p-6 rounded-xl border-2 border-hairline hover:border-primary hover:-translate-y-0.5 transition-all bg-canvas"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <Mic size={18} />
                    </span>
                    <h3 className="display-sm text-ink">Speak freely</h3>
                  </div>
                  <p className="text-sm text-body">
                    Respond in your own words. We evaluate content, fluency, and structure.
                  </p>
                </button>

                {providedText && (
                  <button
                    onClick={() => handleModeSelect("scripted")}
                    className="text-left p-5 md:p-6 rounded-xl border-2 border-hairline hover:border-primary hover:-translate-y-0.5 transition-all bg-canvas"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-10 h-10 rounded-full bg-surface-dark text-on-dark flex items-center justify-center">
                        <FileText size={18} />
                      </span>
                      <h3 className="display-sm text-ink">Read & speak</h3>
                    </div>
                    <p className="text-sm text-body mb-4">
                      Read this aloud. We evaluate fluency and delivery — not what you say.
                    </p>
                    <div className="card-cream !p-4 text-sm text-body-strong font-display italic leading-relaxed">
                      "{providedText}"
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {stage === "RECORDING" && (
            <div className="flex flex-col items-center text-center">
              <div className="stage-in caption-up text-primary mb-4 flex items-center gap-2">
                {recordingState === "recording" ? (
                  <><span className="w-2 h-2 rounded-full bg-error animate-pulse" /> Recording</>
                ) : recordingState === "done" ? (
                  <><span className="w-2 h-2 rounded-full bg-success" /> Review Response</>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-primary" /> Ready to Start</>
                )}
              </div>
              <h2 className="stage-in font-display text-2xl md:text-3xl text-ink mb-8 max-w-2xl leading-snug">
                {prompt}
              </h2>
              {mode === "scripted" && providedText && (
                <div className="stage-in card-cream !p-5 mb-6 max-w-2xl mx-auto font-display italic text-lg md:text-xl text-body-strong leading-relaxed">
                  "{providedText}"
                </div>
              )}

              {error && (
                <div
                  className="stage-in mb-6 px-4 py-3 rounded-md text-sm"
                  style={{
                    background: "color-mix(in srgb, var(--error) 12%, transparent)",
                    color: "var(--error)",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="stage-in mb-4">
                <RecordButton
                  state={recordingState}
                  audioLevel={audioLevel}
                  onClick={recordingState === "idle" ? handleStartRecording : () => stopRef.current.stop()}
                />
              </div>
              {recordingState === "recording" && (
                <div className="stage-in caption-up text-muted-tone">
                  {Math.ceil(remaining)}s remaining · tap or press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-card text-ink text-[10px] font-mono">
                    space
                  </kbd>{" "}
                  to stop
                </div>
              )}

              {recordingState === "done" && (
                <div className="stage-in flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto items-center justify-center">
                  <button onClick={() => setRecordingState("idle")} className="btn-nav py-3 px-6 text-sm w-full sm:w-auto">
                    Restart
                  </button>
                  <button onClick={handleSubmitRecording} className="text-sm font-semibold tracking-wide uppercase px-6 py-3 rounded-full bg-ink hover:bg-black text-white transition-colors shadow-md w-full sm:w-auto">
                    Submit Response
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === "PROCESSING" && (
            <div className="fixed inset-0 z-30 bg-surface-dark text-on-dark flex flex-col items-center justify-center px-6 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-breath"
                  style={{
                    background: "radial-gradient(circle, var(--primary) 0%, transparent 65%)",
                  }}
                />
              </div>
              <div className="relative max-w-2xl">
                <div className="badge-coral mb-8 inline-block">Analyzing your response</div>
                <p className="display-md mb-6 font-display italic">"{funFact}"</p>
                <p className="caption-up text-on-dark-soft">Resonant · communication fact</p>
              </div>
            </div>
          )}

          {stage === "FEEDBACK" && evalResult && (
            <FeedbackView
              evalResult={evalResult}
              attempts={attempts}
              userName={userName}
              onRetry={handleRetry}
              onNext={handleNext}
              canForceNext={attempts >= 3}
              isLast={currentQuestion + 1 >= totalQuestions}
              hasPassedPreviously={sessionResults.find((r) => r.questionId === q.id)?.passed ?? false}
            />
          )}
        </div>
      </main>

      {hangUpOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm flex items-center justify-center px-6 animate-fade-in"
          onClick={() => setHangUpOpen(false)}
        >
          <div
            className="bg-canvas rounded-2xl p-10 max-w-md w-full text-center shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-surface-card flex items-center justify-center">
              <Pause size={22} className="text-primary" />
            </div>
            <h3 className="display-sm text-ink mb-3">Take a breath, {userName}.</h3>
            <p className="text-body mb-8 leading-relaxed">Progress saved. Ready when you are.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setHangUpOpen(false)} className="btn-primary w-full">
                Keep going
              </button>
              <button
                onClick={() => {
                  setHangUpOpen(false);
                  navigate({ to: "/" });
                }}
                className="text-sm text-muted-tone hover:text-ink transition py-2"
              >
                Save & exit to home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackView({
  evalResult,
  attempts,
  userName,
  onRetry,
  onNext,
  canForceNext,
  isLast,
  hasPassedPreviously,
}: {
  evalResult: EvaluationResponse;
  attempts: number;
  userName: string;
  onRetry: () => void;
  onNext: () => void;
  canForceNext: boolean;
  isLast: boolean;
  hasPassedPreviously?: boolean;
}) {
  const allPassed =
    evalResult.scores.clarity >= 6 &&
    evalResult.scores.grammar >= 6 &&
    evalResult.scores.confidence >= 6;
  const canAdvance = allPassed || canForceNext || !!hasPassedPreviously;

  return (
    <div className="space-y-6 mt-4">
      <div className="stage-in flex items-center justify-between">
        <div className="caption-up text-muted-tone">Your response, {userName}</div>
        {allPassed && <span className="badge-coral">Passed</span>}
      </div>

      <div className="stage-in relative card-dark overflow-hidden">
        <Quote size={64} className="absolute -top-3 -left-2 text-on-dark/10" />
        <div className="caption-up text-on-dark-soft mb-4 relative">Transcript</div>
        <p className="font-display italic text-xl leading-relaxed relative">
          {evalResult.transcript}
        </p>
      </div>

      <div className="stage-in card-cream">
        <div className="caption-up text-muted-tone mb-6">Scores</div>
        <div className="flex flex-wrap justify-around gap-6">
          <ScoreDial value={evalResult.scores.clarity} label="Clarity" />
          <ScoreDial value={evalResult.scores.grammar} label="Grammar" />
          <ScoreDial value={evalResult.scores.confidence} label="Confidence" />
        </div>
      </div>

      <div className="space-y-3">
        {evalResult.feedbackItems.map((item, i) => (
          <div key={i} className="stage-in card-cream !p-6">
            <div className="badge-coral mb-3">{item.type}</div>
            <p className="text-ink font-medium mb-2">{item.issue}</p>
            <p className="text-body text-sm leading-relaxed">→ {item.fix}</p>
          </div>
        ))}
      </div>

      <div className="stage-in card-coral">
        <div className="caption-up text-on-primary/70 mb-3">Coach note</div>
        <p className="text-on-primary text-lg leading-relaxed font-display italic">
          {evalResult.coachNote}
        </p>
      </div>

      <div className="stage-in flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-hairline-soft">
        <div className="text-sm text-muted-tone">
          Attempt {attempts}
          {attempts >= 3 && " · you can advance any time"}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button onClick={onRetry} className="btn-nav py-3 px-6 text-sm w-full sm:w-auto justify-center">
            <RotateCw size={16} className="mr-1.5" /> Try again
          </button>
          <button onClick={onNext} disabled={!canAdvance} className="btn-primary w-full sm:w-auto justify-center">
            {isLast ? "Finish level" : "Next question"} <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>

      {!canAdvance && (
        <p className="stage-in text-xs text-muted-tone text-center">
          Reach 6.0+ in all three scores to advance, or retry three times to unlock.
        </p>
      )}
    </div>
  );
}
