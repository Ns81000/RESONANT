import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/resonant/store";
import { LEVEL_INFO } from "@/lib/resonant/questions";
import { randomFact } from "@/lib/resonant/funFacts";

export const Route = createFileRoute("/level-intro")({
  head: () => ({ meta: [{ title: "Ready — Resonant" }] }),
  component: LevelIntro,
});

function LevelIntro() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const navigate = useNavigate();
  const { userName, level, currentQuestion } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fact, setFact] = useState("");

  useEffect(() => {
    setFact(randomFact());
  }, []);

  useEffect(() => {
    let mounted = true;
    let animationContext: { revert: () => void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !containerRef.current) return;

      // Only run animation if target elements exist in the DOM to avoid warnings
      const elements = containerRef.current.querySelectorAll(".li-step");
      if (elements.length === 0) return;

      animationContext = gsap.context(() => {
        gsap.from(".li-step", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
        });
      }, containerRef.current);

      // Revert immediately if unmounted during the async import/initialization
      if (!mounted && animationContext) {
        animationContext.revert();
      }
    })();

    return () => {
      mounted = false;
      if (animationContext) {
        animationContext.revert();
      }
    };
  }, []);

  if (hydrated && (!userName || !level)) return <Navigate to="/setup" />;
  if (!hydrated || !level) return <div className="min-h-screen bg-surface-dark" />;

  const info = LEVEL_INFO[level];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-surface-dark text-on-dark flex flex-col items-center px-6 pt-12 pb-12 md:py-12 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 animate-breath"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 65%)" }}
        />
      </div>

      {/* Top Actions Row */}
      <div className="w-full max-w-2xl md:max-w-none flex items-center justify-between mb-6 md:absolute md:top-8 md:left-0 md:right-0 md:px-12 md:mb-0 z-50">
        <button
          onClick={() => navigate({ to: "/setup" })}
          className="text-xs text-on-dark-soft hover:text-on-dark transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 uppercase tracking-wider font-semibold"
        >
          <ArrowLeft size={12} /> Change Level
        </button>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center">
        <div className="max-w-2xl w-full mx-auto py-4 flex flex-col justify-center">
          <div className="li-step caption-up text-on-dark-soft mb-6">
            10 questions · Real scenarios
          </div>
          <h1 className="li-step display-xl mb-6">{info.title} Level</h1>
          <p className="li-step text-on-dark-soft text-lg max-w-md mx-auto mb-3 leading-relaxed">
            {info.description}
          </p>
          <p className="li-step font-display text-2xl text-on-dark mb-10 md:mb-12">
            You've got this, {userName}.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="li-step w-full flex justify-center">
              <button
                onClick={() => navigate({ to: "/practice" })}
                className="h-14 px-10 text-sm text-on-dark hover:text-white transition-all duration-300 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 uppercase tracking-wider font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-white/25 hover:-translate-y-0.5 inline-flex items-center justify-center group cursor-pointer w-full sm:w-auto"
              >
                {currentQuestion > 0 ? "Continue Practice" : "Begin Practice"}
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Anchored at bottom on desktop, flows normally on mobile */}
        <div className="li-step w-full max-w-md mx-auto mt-8 md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-center z-10">
          <div className="text-[10px] caption-up text-on-dark-soft mb-2 tracking-wider">
            Communication Fact
          </div>
          <p className="text-sm text-on-dark italic leading-relaxed">"{fact}"</p>
        </div>
      </div>
    </div>
  );
}
