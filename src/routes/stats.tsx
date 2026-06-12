import { createFileRoute, Navigate, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  X,
  SkipForward,
  Minus,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";
import { useSession } from "@/lib/resonant/store";
import { LEVEL_INFO, questionsForLevel, QUESTIONS } from "@/lib/resonant/questions";
import type { Level, QuestionResult } from "@/lib/resonant/types";
import logoSvg from "@/components/resonant/logo";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Your Stats — Resonant" }] }),
  component: Stats,
});

const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    const from = 0;
    const to = value;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value]);

  return (
    <span>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function ProgressRing({
  value,
  max,
  size = 130,
  strokeWidth = 7,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth * 2) / 2;
  const C = 2 * Math.PI * r;
  const fraction = max > 0 ? value / max : 0;
  const targetOffset = C * (1 - fraction);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let mounted = true;
    let tween: any = null;
    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !ringRef.current) return;
      tween = gsap.fromTo(
        ringRef.current,
        { strokeDashoffset: C },
        {
          strokeDashoffset: targetOffset,
          duration: 1.6,
          ease: "power3.out",
          delay: 0.3,
        },
      );
    })();
    return () => {
      mounted = false;
      if (tween) tween.kill();
    };
  }, [C, targetOffset]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(20,20,19,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl text-ink" style={{ letterSpacing: "-0.03em" }}>
          <AnimatedCounter value={Math.round(fraction * 100)} suffix="%" />
        </span>
        <span className="caption-up text-[10px] text-muted-tone mt-0.5">Overall</span>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = (value / 10) * 100;
  const color =
    value >= 8 ? "var(--success)" : value >= 5 ? "var(--accent-amber)" : "var(--error)";

  useEffect(() => {
    let mounted = true;
    let tween: any = null;
    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !barRef.current) return;
      tween = gsap.fromTo(
        barRef.current,
        { width: "0%" },
        { width: `${pct}%`, duration: 1.2, ease: "power3.out", delay: 0.5 + delay },
      );
    })();
    return () => {
      mounted = false;
      if (tween) tween.kill();
    };
  }, [pct, delay]);

  return (
    <div className="flex items-center gap-4">
      <span className="caption-up text-xs text-muted-tone w-24 text-right flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-surface-cream-strong overflow-hidden">
        <div ref={barRef} className="h-full rounded-full" style={{ background: color, width: 0 }} />
      </div>
      <span
        className="font-display text-xl w-10 text-right flex-shrink-0"
        style={{ color, letterSpacing: "-0.02em" }}
      >
        {value > 0 ? value.toFixed(1) : "—"}
      </span>
    </div>
  );
}

function Stats() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const navigate = useNavigate();
  const { userName, level, results, allResults, completedLevels } = useSession();
  const [activeTab, setActiveTab] = useState<Level>(level ?? "beginner");
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const getResultsForLevel = useCallback(
    (lvl: Level): QuestionResult[] => {
      if (lvl === level) return results;
      return allResults[lvl] ?? [];
    },
    [level, results, allResults],
  );

  const totalAttempted = useMemo(() => {
    return LEVELS.reduce((sum, lvl) => {
      const r = getResultsForLevel(lvl);
      return sum + r.filter((x) => !x.skipped && x.attempts > 0).length;
    }, 0);
  }, [getResultsForLevel]);

  const totalPassed = useMemo(() => {
    return LEVELS.reduce((sum, lvl) => {
      const r = getResultsForLevel(lvl);
      return sum + r.filter((x) => !x.skipped && x.passed).length;
    }, 0);
  }, [getResultsForLevel]);

  const overallAvg = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const lvl of LEVELS) {
      const r = getResultsForLevel(lvl);
      for (const x of r) {
        if (!x.skipped && x.attempts > 0) {
          sum += (x.bestScores.clarity + x.bestScores.grammar + x.bestScores.confidence) / 3;
          count++;
        }
      }
    }
    return count > 0 ? sum / count : 0;
  }, [getResultsForLevel]);

  const activeQuestions = useMemo(() => questionsForLevel(activeTab), [activeTab]);
  const activeResults = useMemo(() => getResultsForLevel(activeTab), [activeTab, getResultsForLevel]);

  const levelAverages = useMemo(() => {
    const attempted = activeResults.filter((r) => !r.skipped && r.attempts > 0);
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
  }, [activeResults]);

  const levelAttempted = useMemo(
    () => activeResults.filter((r) => !r.skipped && r.attempts > 0).length,
    [activeResults],
  );
  const levelPassed = useMemo(
    () => activeResults.filter((r) => !r.skipped && r.passed).length,
    [activeResults],
  );

  // GSAP: Entry animation
  useEffect(() => {
    let mounted = true;
    let animationTimeout: ReturnType<typeof setTimeout> | undefined;
    let animationContext: { revert: () => void } | null = null;
    if (!hydrated) return;

    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !containerRef.current) return;

      animationTimeout = setTimeout(() => {
        if (!mounted || !containerRef.current) return;
        animationContext = gsap.context(() => {
          gsap.from(".stat-hero", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          });
          gsap.from(".stat-section", {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.3,
          });
        }, containerRef);
      }, 0);
    })();

    return () => {
      mounted = false;
      if (animationTimeout) clearTimeout(animationTimeout);
      if (animationContext) {
        animationContext.revert();
      }
    };
  }, [hydrated]);

  // GSAP: Tab Switch animation for cards
  useEffect(() => {
    let mounted = true;
    let animationTimeout: ReturnType<typeof setTimeout> | undefined;
    let animationContext: { revert: () => void } | null = null;
    if (!hydrated) return;

    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !gridRef.current) return;

      animationTimeout = setTimeout(() => {
        if (!mounted || !gridRef.current) return;
        animationContext = gsap.context(() => {
          gsap.from(".q-card", {
            scale: 0.9,
            opacity: 0,
            duration: 0.45,
            stagger: 0.03,
            ease: "power2.out",
          });
        }, gridRef);
      }, 0);
    })();

    return () => {
      mounted = false;
      if (animationTimeout) clearTimeout(animationTimeout);
      if (animationContext) {
        animationContext.revert();
      }
    };
  }, [activeTab, hydrated]);

  if (hydrated && !userName) return <Navigate to="/" />;
  if (!hydrated) return <div className="min-h-screen bg-canvas" />;

  const totalQuestions = QUESTIONS.length;

  return (
    <div ref={containerRef} className="min-h-screen bg-canvas text-ink">
      {/* Header */}
      <header className="px-4 md:px-12 py-5 flex items-center justify-between border-b border-hairline bg-canvas">
        <Link to="/" className="flex items-center gap-2.5">
          <span dangerouslySetInnerHTML={{ __html: logoSvg("#141413", "#cc785c") }} />
          <span className="font-display text-xl font-medium tracking-tight text-ink">Resonant</span>
        </Link>
        <button
          onClick={() => {
            const allCompleted = completedLevels.length === 3;
            navigate({ to: (level && !allCompleted) ? "/level-intro" : "/" });
          }}
          className="text-xs text-muted-tone hover:text-ink transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-hairline bg-white hover:bg-surface-soft shadow-sm uppercase tracking-wider font-semibold"
        >
          <ArrowLeft size={12} /> Back
        </button>
      </header>

      <main className="px-4 md:px-12 py-8 md:py-16 max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* TOP ROW: 3 Dashboard cards parallel on desktop view */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 stat-hero">
          
          {/* Card 1: User Profile & Circular Progress */}
          <div className="bg-white border border-hairline rounded-2xl p-5 md:p-6 flex flex-col items-center justify-between shadow-[0_4px_20px_rgba(20,20,19,0.015)] min-h-[270px] md:min-h-[290px]">
            <div className="text-center w-full">
              <div className="caption-up text-muted-tone mb-1 flex items-center justify-center gap-2">
                <span className="w-3 h-px bg-hairline block" />
                Profile
                <span className="w-3 h-px bg-hairline block" />
              </div>
              <h1 className="display-sm text-ink mb-4 font-display truncate w-full px-2" title={userName}>
                {userName}
              </h1>
            </div>
            
            <div className="flex justify-center mb-2">
              <ProgressRing value={totalAttempted} max={totalQuestions} size={130} strokeWidth={7} />
            </div>
          </div>

          {/* Card 2: Performance Counter Metrics */}
          <div className="bg-white border border-hairline rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(20,20,19,0.015)] min-h-[270px] md:min-h-[290px]">
            <div className="text-center w-full">
              <div className="caption-up text-muted-tone mb-4 flex items-center justify-center gap-2">
                <span className="w-3 h-px bg-hairline block" />
                Performance
                <span className="w-3 h-px bg-hairline block" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 xs:gap-2 w-full my-auto">
              <div className="flex flex-col items-center justify-center p-2 xs:p-2.5 rounded-xl bg-surface-soft/60">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                  <Target size={15} style={{ color: "var(--primary)" }} />
                </div>
                <span className="font-display text-2xl xs:text-3xl text-ink leading-none">
                  <AnimatedCounter value={totalAttempted} />
                </span>
                <span className="caption-up text-[9px] xs:text-[10px] text-muted-soft mt-1 text-center">Attempted</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 xs:p-2.5 rounded-xl bg-surface-soft/60">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5" style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
                  <Trophy size={15} style={{ color: "var(--success)" }} />
                </div>
                <span className="font-display text-2xl xs:text-3xl text-success leading-none">
                  <AnimatedCounter value={totalPassed} />
                </span>
                <span className="caption-up text-[9px] xs:text-[10px] text-muted-soft mt-1 text-center">Passed</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 xs:p-2.5 rounded-xl bg-surface-soft/60">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5" style={{ background: "color-mix(in srgb, var(--accent-amber) 10%, transparent)" }}>
                  <TrendingUp size={15} style={{ color: "var(--accent-amber)" }} />
                </div>
                <span className="font-display text-2xl xs:text-3xl text-accent-amber leading-none">
                  <AnimatedCounter value={overallAvg} decimals={1} />
                </span>
                <span className="caption-up text-[9px] xs:text-[10px] text-muted-soft mt-1 text-center">Avg Score</span>
              </div>
            </div>

            <div className="text-xs text-muted-soft text-center mt-2">
              Practice regularly to refine your averages
            </div>
          </div>

          {/* Card 3: Level Completion Status */}
          <div className="bg-white border border-hairline rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(20,20,19,0.015)] min-h-[270px] md:min-h-[290px]">
            <div className="text-center w-full">
              <div className="caption-up text-muted-tone mb-4 flex items-center justify-center gap-2">
                <span className="w-3 h-px bg-hairline block" />
                Level Status
                <span className="w-3 h-px bg-hairline block" />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full my-auto">
              {LEVELS.map((lvl) => {
                const isComplete = completedLevels.includes(lvl);
                const r = getResultsForLevel(lvl);
                const att = r.filter((x) => !x.skipped && x.attempts > 0).length;
                return (
                  <div
                    key={lvl}
                    className="flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs"
                    style={{
                      background: isComplete
                        ? "color-mix(in srgb, var(--success) 6%, transparent)"
                        : "var(--surface-soft)",
                      borderColor: isComplete ? "color-mix(in srgb, var(--success) 20%, transparent)" : "var(--hairline-soft)",
                    }}
                  >
                    <span className="caption-up text-[11px] font-semibold text-body">
                      {LEVEL_INFO[lvl].title}
                    </span>
                    {isComplete ? (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-success uppercase tracking-wider">
                        <Check size={11} className="stroke-[3]" /> Complete
                      </div>
                    ) : att > 0 ? (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-accent-amber uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" /> In Progress
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-soft uppercase tracking-wider opacity-60">
                        <Minus size={11} /> Not Started
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Tabs switcher, Question Breakdown & Metrics */}
        <div className="bg-white border border-hairline rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_4px_20px_rgba(20,20,19,0.015)] stat-section">
          
          {/* Header row with Tab Switcher & Stats Summary */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 md:mb-8 border-b border-hairline/80 pb-6">
            <div className="w-full lg:w-auto">
              <h2 className="caption-up text-xs text-muted-tone mb-2">Select Level</h2>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-soft border border-hairline/80 w-full sm:w-fit">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveTab(lvl)}
                    className="flex-1 sm:flex-initial text-center py-2 sm:px-4 rounded-lg text-[10px] xs:text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-200"
                    style={{
                      background: activeTab === lvl ? "var(--primary)" : "transparent",
                      color: activeTab === lvl ? "var(--on-primary)" : "var(--muted)",
                    }}
                  >
                    {LEVEL_INFO[lvl].title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center h-9 px-2.5 sm:px-3 rounded-lg bg-surface-soft border border-hairline-soft">
                <span className="font-display text-lg text-ink font-medium leading-none">
                  {levelAttempted}
                  <span className="text-xs text-muted-soft font-sans ml-0.5">/{activeQuestions.length}</span>
                </span>
                <span className="text-muted-tone text-[10px] xs:text-[11px] uppercase tracking-wider ml-1.5 leading-none whitespace-nowrap">Attempted</span>
              </div>
              <div className="flex items-center h-9 px-2.5 sm:px-3 rounded-lg bg-surface-soft border border-hairline-soft">
                <span className="font-display text-lg text-success font-medium leading-none">{levelPassed}</span>
                <span className="text-muted-tone text-[10px] xs:text-[11px] uppercase tracking-wider ml-1.5 leading-none whitespace-nowrap">Passed</span>
              </div>
              <div className="flex items-center h-9 px-2.5 sm:px-3 rounded-lg bg-surface-soft border border-hairline-soft">
                {completedLevels.includes(activeTab) ? (
                  <span className="inline-flex items-center gap-1 text-success text-[10px] xs:text-[11px] uppercase tracking-wider font-semibold leading-none whitespace-nowrap">
                    <Check size={12} className="stroke-[3]" /> Complete
                  </span>
                ) : (
                  <span className="text-muted-tone text-[10px] xs:text-[11px] uppercase tracking-wider font-semibold leading-none whitespace-nowrap">In progress</span>
                )}
              </div>
            </div>
          </div>

          {/* Question Breakdown Grid */}
          <div className="mb-8">
            <h3 className="caption-up text-xs text-muted-tone mb-4">Question Breakdown</h3>
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {activeQuestions.map((qItem, i) => {
                const result = activeResults.find((r) => r.questionId === qItem.id);
                const isPassed = result && !result.skipped && result.passed;
                const isFailed = result && !result.skipped && !result.passed;
                const isSkipped = result && result.skipped;
                const hasResult = result && !result.skipped && result.attempts > 0;

                let statusColor = "bg-white";
                let borderColor = "border-hairline";
                
                // High-contrast text colors without using container opacity filters
                let labelColor = "text-muted-soft";
                let categoryColor = "text-body";
                let statusTextColor = "text-muted-soft";

                if (isPassed) {
                  statusColor = "bg-success/5";
                  borderColor = "border-success/50";
                  labelColor = "text-muted-tone";
                  categoryColor = "text-ink";
                } else if (isFailed) {
                  statusColor = "bg-accent-amber/5";
                  borderColor = "border-accent-amber/50";
                  labelColor = "text-muted-tone";
                  categoryColor = "text-ink";
                } else if (isSkipped) {
                  statusColor = "bg-surface-soft/30";
                  borderColor = "border-dashed border-muted-soft/60";
                  labelColor = "text-muted-soft";
                  categoryColor = "text-body";
                } else {
                  statusColor = "bg-white";
                  borderColor = "border-hairline";
                  labelColor = "text-muted-soft";
                  categoryColor = "text-body";
                }

                const avgScore = hasResult
                  ? ((result.bestScores.clarity + result.bestScores.grammar + result.bestScores.confidence) / 3).toFixed(1)
                  : null;

                return (
                  <div
                    key={qItem.id}
                    className={`q-card relative p-3.5 xs:p-4 rounded-xl transition-colors duration-200 hover:scale-[1.02] border ${statusColor} ${borderColor}`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`caption-up text-[11px] ${labelColor}`}>Q{i + 1}</span>
                      {isPassed ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-success/10">
                          <Check size={11} className="text-success stroke-[3]" />
                        </div>
                      ) : isFailed ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-accent-amber/10">
                          <X size={11} className="text-accent-amber stroke-[3]" />
                        </div>
                      ) : isSkipped ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-surface-soft">
                          <SkipForward size={9} className="text-muted-soft opacity-60" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-surface-soft" />
                      )}
                    </div>

                    {/* Category (Not bolded, font-medium) */}
                    <p className={`text-sm ${categoryColor} font-medium mb-1 truncate`}>{qItem.category}</p>

                    {/* Score or status */}
                    {avgScore ? (
                      <div className="flex items-baseline gap-0.5">
                        <span
                          className="font-display text-2xl font-medium"
                          style={{
                            color: isPassed ? "var(--success)" : "var(--accent-amber)",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {avgScore}
                        </span>
                        <span className="text-[11px] text-muted-soft">/10</span>
                      </div>
                    ) : isSkipped ? (
                      <span className={`text-xs ${statusTextColor} italic`}>Skipped</span>
                    ) : (
                      <span className={`text-xs ${statusTextColor}`}>Not started</span>
                    )}

                    {/* Attempt count */}
                    {hasResult && (
                      <div className="mt-2 text-[11px] text-muted-soft font-medium">
                        {result.attempts} attempt{result.attempts !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Averages Score Bars */}
          {levelAttempted > 0 && (
            <div className="bg-surface-soft/60 border border-hairline-soft p-5 md:p-6 rounded-2xl">
              <div className="caption-up text-xs text-muted-tone mb-4">Level Averages</div>
              <div className="space-y-4">
                <ScoreBar label="Clarity" value={levelAverages.clarity} delay={0} />
                <ScoreBar label="Grammar" value={levelAverages.grammar} delay={0.1} />
                <ScoreBar label="Confidence" value={levelAverages.confidence} delay={0.2} />
              </div>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <section className="text-center pt-4 pb-4 stat-section">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {level ? (
              <button
                onClick={() => navigate({ to: "/practice" })}
                className="btn-primary !h-14 !px-7 w-full sm:w-auto justify-center"
              >
                Continue practicing
              </button>
            ) : (
              <button
                onClick={() => navigate({ to: "/setup" })}
                className="btn-primary !h-14 !px-7 w-full sm:w-auto justify-center"
              >
                Start practicing
              </button>
            )}
            <button
              onClick={() => navigate({ to: "/" })}
              className="btn-secondary !h-14 !px-7 w-full sm:w-auto justify-center bg-white"
            >
              Back to home
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

