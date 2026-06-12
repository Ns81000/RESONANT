import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/lib/resonant/store";
import { LEVEL_INFO } from "@/lib/resonant/questions";
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

  const averages = useMemo(() => {
    if (!results.length) return { clarity: 0, grammar: 0, confidence: 0 };
    const sum = results.reduce(
      (acc, r) => ({
        clarity: acc.clarity + r.bestScores.clarity,
        grammar: acc.grammar + r.bestScores.grammar,
        confidence: acc.confidence + r.bestScores.confidence,
      }),
      { clarity: 0, grammar: 0, confidence: 0 },
    );
    return {
      clarity: sum.clarity / results.length,
      grammar: sum.grammar / results.length,
      confidence: sum.confidence / results.length,
    };
  }, [results]);

  const allSkipped = useMemo(() => {
    return results.length > 0 && results.every((r) => r.skipped);
  }, [results]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !ref.current) return;
      const ctx = gsap.context(() => {
        // Particle burst
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
  }, []);

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

  return (
    <div
      ref={ref}
      className="min-h-screen bg-surface-dark text-on-dark flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden"
    >
      {/* Particles (only show if not skipped all) */}
      {!allSkipped && (
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

      <div className="relative max-w-2xl">
        <div className="cele caption-up text-on-dark-soft mb-6">
          {allSkipped ? "Practice Incomplete" : "Level complete"}
        </div>
        <h1 className="cele display-xl mb-4">{userName}</h1>
        <p className="cele display-sm text-on-dark-soft mb-2 font-display">
          {LEVEL_INFO[level].title} Level — {allSkipped ? "skipped" : "done."}
        </p>
        {allSkipped ? (
          <p className="cele text-on-dark-soft max-w-md mx-auto mb-12">
            You skipped all the scenarios in this level. Try speaking and answering to complete the
            level and unlock the next one!
          </p>
        ) : isAdvanced ? (
          <p className="cele text-on-dark-soft max-w-md mx-auto mb-12">
            You've completed all three levels. Keep speaking, {userName}. The room is listening.
          </p>
        ) : (
          <p className="cele text-on-dark-soft max-w-md mx-auto mb-12">
            That's ten real corporate scenarios under your belt. Take a breath — then keep going.
          </p>
        )}

        {!allSkipped && (
          <div className="cele flex justify-center gap-6 mb-14">
            <ScoreDial value={averages.clarity} label="Clarity" size={96} />
            <ScoreDial value={averages.grammar} label="Grammar" size={96} />
            <ScoreDial value={averages.confidence} label="Confidence" size={96} />
          </div>
        )}

        <div className="cele flex flex-wrap items-center justify-center gap-3">
          {allSkipped ? (
            <>
              <button onClick={handlePracticeAgain} className="btn-primary !h-14 !px-8">
                Practice this level again <ArrowRight size={18} className="ml-2" />
              </button>
              <button
                onClick={() => navigate({ to: "/" })}
                className="text-sm text-on-dark-soft hover:text-on-dark transition py-2 px-4"
              >
                Back to home
              </button>
            </>
          ) : nextLevel ? (
            <>
              <button onClick={handleNextLevel} className="btn-primary !h-14 !px-7">
                Continue to {LEVEL_INFO[nextLevel].title}
                <ArrowRight size={18} className="ml-2" />
              </button>
              <button onClick={handlePracticeAgain} className="btn-on-dark !h-14">
                Practice this level again
              </button>
              <button
                onClick={() => navigate({ to: "/" })}
                className="text-sm text-on-dark-soft hover:text-on-dark transition py-2 px-4"
              >
                Back to home
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate({ to: "/" })} className="btn-primary !h-14 !px-8">
                Back to home <ArrowRight size={18} className="ml-2" />
              </button>
              <button onClick={handlePracticeAgain} className="btn-on-dark !h-14">
                Practice this level again
              </button>
            </>
          )}
        </div>

        <div className="cele caption-up text-on-dark-soft mt-12">
          {completedLevels.length} of 3 levels complete
        </div>
      </div>
    </div>
  );
}
