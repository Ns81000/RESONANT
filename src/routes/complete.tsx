import { createFileRoute, Navigate, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, X, SkipForward, BarChart2, ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/resonant/store";
import { LEVEL_INFO, questionsForLevel } from "@/lib/resonant/questions";
import { ScoreDial } from "@/components/resonant/ScoreDial";
import type { Level } from "@/lib/resonant/types";

export const Route = createFileRoute("/complete")({
  head: () => ({ meta: [{ title: "Complete — Resonant" }] }),
  component: Complete,
});

function Complete() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const navigate = useNavigate();
  const { userName, level, results, setLevel, resetProgress, completedLevels } = useSession();
  const ref = useRef<HTMLDivElement>(null);

  const questions = useMemo(() => (level ? questionsForLevel(level) : []), [level]);
  const totalQuestions = questions.length;

  const attempted = useMemo(() => results.filter((r) => !r.skipped && r.attempts > 0), [results]);
  const passed = useMemo(() => attempted.filter((r) => r.passed), [attempted]);
  const skipped = useMemo(
    () => results.filter((r) => r.skipped || r.attempts === 0),
    [results],
  );

  const allAttempted = attempted.length === totalQuestions;
  const allPassed = passed.length === totalQuestions;
  const noneAttempted = attempted.length === 0;
  const allQuestionsHaveResult = useMemo(() => {
    return questions.every((qItem) => results.some((r) => r.questionId === qItem.id));
  }, [questions, results]);

  const averages = useMemo(() => {
    if (!attempted.length) return { clarity: 0, grammar: 0, confidence: 0 };
    const sum = attempted.reduce(
      (acc, r) => ({
        clarity: acc.clarity + r.bestScores.clarity,
        grammar: acc.grammar + r.bestScores.grammar,
        confidence: acc.confidence + r.bestScores.confidence,
      }),
      { clarity: 0, grammar: 0, confidence: 0 },
    );
    return {
      clarity: sum.clarity / attempted.length,
      grammar: sum.grammar / attempted.length,
      confidence: sum.confidence / attempted.length,
    };
  }, [attempted]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !ref.current) return;
      const ctx = gsap.context(() => {
        if (!noneAttempted) {
          const particles = ref.current!.querySelectorAll<HTMLSpanElement>(".particle");
          particles.forEach((p, i) => {
            const angle = (i / particles.length) * Math.PI * 2;
            const dist = 200 + Math.random() * 200;
            gsap.fromTo(
              p,
              { x: 0, y: 0, opacity: 1, scale: 0 },
              {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                opacity: 0,
                scale: 1,
                duration: 1.4,
                ease: "power3.out",
                delay: 0.2,
              },
            );
          });
        }
        gsap.from(".cele", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
          delay: 0.6,
        });
      }, ref);
      return () => ctx.revert();
    })();
    return () => {
      mounted = false;
    };
  }, [noneAttempted]);

  if (hydrated && (!userName || !level)) return <Navigate to="/" />;
  if (!hydrated || !level) return <div className="min-h-screen bg-surface-dark" />;

  const isAdvanced = level === "advanced";
  const nextLevel: Level | null =
    level === "beginner" ? "intermediate" : level === "intermediate" ? "advanced" : null;

  const handleNextLevel = () => {
    if (!nextLevel) return;
    setLevel(nextLevel);
    navigate({ to: "/level-intro" });
  };

  const handlePracticeAgain = () => {
    resetProgress();
    navigate({ to: "/level-intro" });
  };

  const headingText = noneAttempted
    ? "Practice Incomplete"
    : allPassed
      ? "Level mastered!"
      : allAttempted
        ? "Level complete."
        : "Session finished.";

  const subtitleText = noneAttempted
    ? "You skipped all the scenarios in this level. Try speaking and answering to complete the level and unlock the next one!"
    : allPassed && isAdvanced
      ? `You've completed all three levels. Keep speaking, ${userName}. The room is listening.`
      : allPassed
        ? "Every scenario nailed. You're ready for what's next."
        : allAttempted
          ? "All scenarios attempted. Keep polishing to master this level."
          : `You attempted ${attempted.length} of ${totalQuestions} scenarios. Go back to finish the rest.`;

  return (
    <div
      ref={ref}
      className="min-h-screen bg-surface-dark text-on-dark flex flex-col items-center px-6 py-12 text-center relative overflow-y-auto overflow-x-hidden"
    >
      {/* Top Actions Row */}
      <div className="w-full max-w-2xl md:max-w-none flex items-center justify-start mb-6 md:absolute md:top-8 md:left-0 md:right-0 md:px-12 md:mb-0 z-50">
        <Link
          to="/"
          className="text-xs text-on-dark-soft hover:text-on-dark transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 uppercase tracking-wider font-semibold"
        >
          <ArrowLeft size={12} /> Back to home
        </Link>
      </div>
      {!noneAttempted && (
        <div className="absolute top-1/2 left-1/2">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="particle absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: i % 3 === 0 ? "var(--accent-amber)" : "var(--primary)" }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-2xl my-auto py-8 w-full">
        <div className="cele caption-up text-on-dark-soft mb-6">{headingText}</div>
        <h1 className="cele display-xl mb-4">{userName}</h1>
        <p className="cele display-sm text-on-dark-soft mb-2 font-display">
          {LEVEL_INFO[level].title} Level
        </p>
        <p className="cele text-on-dark-soft max-w-md mx-auto mb-8">{subtitleText}</p>

        {/* Summary stats */}
        <div className="cele flex items-center justify-center gap-6 mb-8 flex-wrap">
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl text-on-dark">{attempted.length}</span>
            <span className="caption-up text-[10px] text-on-dark-soft mt-1">Attempted</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl" style={{ color: "var(--success)" }}>
              {passed.length}
            </span>
            <span className="caption-up text-[10px] text-on-dark-soft mt-1">Passed</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl text-on-dark-soft">{skipped.length}</span>
            <span className="caption-up text-[10px] text-on-dark-soft mt-1">Skipped</span>
          </div>
        </div>

        {/* Score dials */}
        {attempted.length > 0 && (
          <div className="cele flex items-center justify-center gap-4 sm:gap-6 mb-8 flex-wrap">
            <ScoreDial value={averages.clarity} label="Clarity" size={96} />
            <ScoreDial value={averages.grammar} label="Grammar" size={96} />
            <ScoreDial value={averages.confidence} label="Confidence" size={96} />
          </div>
        )}

        {/* Per-question breakdown grid */}
        <div className="cele mb-10">
          <div className="caption-up text-on-dark-soft mb-4 text-[10px]">Question breakdown</div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-md mx-auto">
            {questions.map((qItem, i) => {
              const result = results.find((r) => r.questionId === qItem.id);
              const isPassed = result && !result.skipped && result.passed;
              const isFailed = result && !result.skipped && !result.passed;
              const isSkipped = result && result.skipped;

              return (
                <div
                  key={qItem.id}
                  className="relative flex items-center justify-center w-full aspect-square rounded-lg text-xs font-mono transition-all"
                  style={{
                    background: isPassed
                      ? "color-mix(in srgb, var(--success) 20%, transparent)"
                      : isFailed
                        ? "color-mix(in srgb, var(--accent-amber) 20%, transparent)"
                        : isSkipped
                          ? "transparent"
                          : "var(--surface-dark-elevated)",
                    border: isSkipped
                      ? "1.5px dashed var(--on-dark-soft)"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                  title={`Q${i + 1}: ${qItem.category} — ${isPassed ? "Passed" : isFailed ? "Not passed" : isSkipped ? "Skipped" : "Not started"}`}
                >
                  {isPassed ? (
                    <Check size={14} style={{ color: "var(--success)" }} />
                  ) : isFailed ? (
                    <X size={14} style={{ color: "var(--accent-amber)" }} />
                  ) : isSkipped ? (
                    <SkipForward size={10} className="text-on-dark-soft opacity-50" />
                  ) : (
                    <span className="text-on-dark-soft opacity-30">{i + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="cele flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {noneAttempted ? (
            <>
              <button
                onClick={handlePracticeAgain}
                className="btn-primary !h-14 !px-8 w-full sm:w-auto"
              >
                Practice this level again <ArrowRight size={18} className="ml-2" />
              </button>
              <button
                onClick={() => navigate({ to: "/" })}
                className="text-sm text-on-dark-soft hover:text-on-dark transition py-2 px-4 w-full sm:w-auto text-center"
              >
                Back to home
              </button>
            </>
          ) : allQuestionsHaveResult ? (
            <>
              {nextLevel ? (
                <button
                  onClick={handleNextLevel}
                  className="btn-primary !h-14 !px-7 w-full sm:w-auto justify-center"
                >
                  Continue to {LEVEL_INFO[nextLevel].title}
                  <ArrowRight size={18} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => navigate({ to: "/" })}
                  className="btn-primary !h-14 !px-8 w-full sm:w-auto justify-center"
                >
                  Back to home <ArrowRight size={18} className="ml-2" />
                </button>
              )}
              
              {!allAttempted ? (
                <button
                  onClick={() => {
                    const firstIncomplete = questions.findIndex((qItem) => {
                      const r = results.find((res) => res.questionId === qItem.id);
                      return !r || !r.passed;
                    });
                    if (firstIncomplete !== -1) {
                      useSession.getState().setCurrentQuestion(firstIncomplete);
                    }
                    navigate({ to: "/practice" });
                  }}
                  className="btn-on-dark !h-14 w-full sm:w-auto justify-center"
                >
                  Continue practicing
                </button>
              ) : (
                <button
                  onClick={handlePracticeAgain}
                  className="btn-on-dark !h-14 w-full sm:w-auto justify-center"
                >
                  Practice this level again
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const firstIncomplete = questions.findIndex((qItem) => {
                    const r = results.find((res) => res.questionId === qItem.id);
                    return !r || !r.passed;
                  });
                  if (firstIncomplete !== -1) {
                    useSession.getState().setCurrentQuestion(firstIncomplete);
                  }
                  navigate({ to: "/practice" });
                }}
                className="btn-primary !h-14 !px-7 w-full sm:w-auto justify-center"
              >
                Continue practicing <ArrowRight size={18} className="ml-2" />
              </button>
            </>
          )}
        </div>

        {/* Stats + completion footer */}
        <div className="cele flex flex-col items-center gap-3 mt-10">
          <div className="caption-up text-on-dark-soft">
            {completedLevels.length} of 3 levels complete
          </div>
          <button
            onClick={() => navigate({ to: "/stats" })}
            className="inline-flex items-center gap-2 text-xs text-primary hover:text-accent-amber transition-colors uppercase tracking-wider font-semibold"
          >
            <BarChart2 size={14} /> View full stats
          </button>
        </div>
      </div>
    </div>
  );
}

