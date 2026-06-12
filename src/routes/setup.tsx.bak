import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Sprout, Briefcase, Crown, Check } from "lucide-react";
import { Nav } from "@/components/resonant/Nav";
import { useSession } from "@/lib/resonant/store";
import { LEVEL_INFO } from "@/lib/resonant/questions";
import { titleCase } from "@/lib/resonant/personalize";
import type { Level } from "@/lib/resonant/types";

export const Route = createFileRoute("/setup")({
  head: () => ({ meta: [{ title: "Get started — Resonant" }] }),
  component: Setup,
});

const LEVEL_ICONS: Record<Level, React.ComponentType<{ size?: number; className?: string }>> = {
  beginner: Sprout,
  intermediate: Briefcase,
  advanced: Crown,
};

function Setup() {
  const navigate = useNavigate();
  const setName = useSession((s) => s.setName);
  const setLevel = useSession((s) => s.setLevel);
  const existingName = useSession((s) => s.userName);
  const completedLevels = useSession((s) => s.completedLevels);

  const [step, setStep] = useState<1 | 2>(existingName ? 2 : 1);
  const [nameInput, setNameInput] = useState(existingName || "");
  const [selected, setSelected] = useState<Level | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    let animationTimeout: ReturnType<typeof setTimeout> | undefined;
    let animationContext: { revert: () => void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !containerRef.current) return;

      // Defer until React has committed the step swap.
      animationTimeout = setTimeout(() => {
        if (!mounted || !containerRef.current) return;

        animationContext = gsap.context(() => {
          gsap.from(".setup-rise", {
            y: 24,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
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
  }, [step]);

  const handleNameSubmit = () => {
    const name = titleCase(nameInput);
    if (name.length < 2) return;
    setName(name);
    setStep(2);
  };

  const handleLevelSubmit = () => {
    if (!selected) return;
    setLevel(selected);
    navigate({ to: "/level-intro" });
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Nav />
      <main ref={containerRef} className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-4xl">
          {step === 1 ? (
            <div className="text-center">
              <div className="setup-rise caption-up text-muted-tone mb-6">Step 01</div>
              <h1 className="setup-rise display-lg text-ink mb-8 max-w-2xl mx-auto">
                What should we call you?
              </h1>
              <div className="setup-rise max-w-md mx-auto">
                <input
                  autoFocus
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                  placeholder="Your name"
                  maxLength={20}
                  className="input-field text-center text-lg !h-14"
                />
                <button
                  onClick={handleNameSubmit}
                  disabled={titleCase(nameInput).length < 2}
                  className="btn-primary mt-6 !h-14 !px-7"
                >
                  Continue <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setStep(1)}
                className="setup-rise mb-8 btn-nav"
                aria-label="Back to previous step"
              >
                <ArrowLeft size={12} /> Back
              </button>
              <div className="setup-rise caption-up text-muted-tone mb-6">Step 02</div>
              <h1 className="setup-rise display-lg text-ink mb-3 max-w-3xl">
                Welcome, {useSession.getState().userName || "friend"}.
              </h1>
              <p className="setup-rise text-body mb-12 text-lg">
                Choose where you are today. You can always change later.
              </p>

              <div className="setup-rise grid md:grid-cols-3 gap-4 mb-10">
                {(["beginner", "intermediate", "advanced"] as Level[]).map((lvl, i) => {
                  const Icon = LEVEL_ICONS[lvl];
                  const isSelected = selected === lvl;
                  const isCompleted = completedLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelected(lvl)}
                      className={`relative text-left p-7 rounded-xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? "border-primary bg-surface-card shadow-lg -translate-y-1"
                          : "border-hairline bg-canvas hover:border-ink/30 hover:-translate-y-0.5"
                      }`}
                    >
                      {isCompleted && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] caption-up text-success">
                          <Check size={12} /> done
                        </span>
                      )}
                      <div className="flex items-start justify-between mb-5">
                        <span
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-primary text-on-primary" : "bg-surface-card text-primary"}`}
                        >
                          <Icon size={20} />
                        </span>
                        <span className="caption-up text-muted-tone">Level 0{i + 1}</span>
                      </div>
                      <div className="display-sm text-ink mb-2">{LEVEL_INFO[lvl].title}</div>
                      <div className="text-sm text-body leading-relaxed mb-4">
                        {LEVEL_INFO[lvl].subtitle}
                      </div>
                      <div className="caption-up text-muted-tone">
                        10 questions · {LEVEL_INFO[lvl].estMinutes}
                      </div>
                      <span
                        className="absolute left-0 right-0 bottom-0 h-1 transition-transform origin-left"
                        style={{
                          background: "var(--primary)",
                          transform: isSelected ? "scaleX(1)" : "scaleX(0)",
                          transition: "transform 0.35s ease",
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="setup-rise text-center">
                <button
                  onClick={handleLevelSubmit}
                  disabled={!selected}
                  className="btn-primary !h-14 !px-8"
                >
                  Begin <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
