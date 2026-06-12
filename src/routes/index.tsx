import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/resonant/Nav";
import { useSession } from "@/lib/resonant/store";
import { LEVEL_INFO } from "@/lib/resonant/questions";
import logoSvg from "@/components/resonant/logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resonant — Be heard. Be understood. Be remembered." },
      {
        name: "description",
        content:
          "A browser-based AI speaking coach for non-native English speakers. Practice corporate communication across three levels.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const navigate = useNavigate();
  const userName = useSession((s) => s.userName);
  const level = useSession((s) => s.level);
  const currentQuestion = useSession((s) => s.currentQuestion);
  const results = useSession((s) => s.results);

  const hasSession = hydrated && !!userName && !!level;
  const currentLevelCompleted = hasSession && results.length === 10;

  const nextLevel = useMemo(() => {
    if (!level) return null;
    return level === "beginner" ? "intermediate" : level === "intermediate" ? "advanced" : null;
  }, [level]);

  // Which level and question number to display in the UI status
  const displayLevel = currentLevelCompleted && nextLevel ? nextLevel : level;
  const displayQuestionNum = currentLevelCompleted && nextLevel ? 1 : currentQuestion + 1;

  // Status text is shown if the user has an active session
  const showStatus = hasSession;

  const buttonText = useMemo(() => {
    if (!hasSession) return "Start your journey";
    if (currentLevelCompleted && !nextLevel) return `Welcome back, ${userName}`;
    return `Continue, ${userName}`;
  }, [hasSession, currentLevelCompleted, nextLevel, userName]);

  const heroRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any = null;

    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted || !heroRef.current) return;

      ctx = gsap.context(() => {
        const words = lineRefs.current.filter(Boolean);
        gsap.from(words, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
        });
        gsap.from(".hero-cta", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          delay: 0.7,
          ease: "power2.out",
        });
        gsap.from(".hero-sub", { opacity: 0, duration: 1, delay: 0.4 });
      }, heroRef);

      // Revert immediately if component unmounted before context was created
      if (!mounted && ctx) {
        ctx.revert();
      }
    })();

    return () => {
      mounted = false;
      if (ctx) ctx.revert();
    };
  }, []);

  const tagline = [
    { text: "Be heard.", highlight: false },
    { text: "Be understood.", highlight: false },
    { text: "Be remembered.", highlight: true },
  ];

  const handleStart = () => {
    if (hasSession) {
      if (currentLevelCompleted && nextLevel) {
        useSession.getState().setLevel(nextLevel);
      }
      navigate({ to: "/level-intro" });
    } else {
      navigate({ to: "/setup" });
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Nav />

      {/* HERO */}
      <section
        ref={heroRef}
        className="min-h-[auto] pt-28 pb-6 lg:min-h-screen lg:flex lg:items-center px-6 md:px-12 lg:pt-24 lg:pb-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left side text content */}
            <div className="lg:col-span-7">
              <div className="caption-up hero-sub text-muted-tone mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-muted-soft block" />A speaking coach in your browser
              </div>

              <h1 className="display-xl text-ink mb-10 max-w-4xl flex flex-col gap-2 md:gap-3">
                {tagline.map((item, i) => (
                  <span key={i} className="block overflow-hidden">
                    <span
                      ref={(el) => {
                        lineRefs.current[i] = el;
                      }}
                      className="inline-block"
                    >
                      {item.highlight ? (
                        <em className="not-italic text-primary">{item.text}</em>
                      ) : (
                        item.text
                      )}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="hero-sub text-lg md:text-xl text-body max-w-2xl mb-10 leading-relaxed">
                Resonant is an AI-powered speaking coach for non-native English speakers in
                corporate settings. Three levels, real scenarios, honest feedback — all in your
                browser, no login required.
              </p>

              <div className="hero-cta flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={handleStart}
                  className="btn-primary !h-14 !px-7 text-base w-full sm:w-auto justify-center"
                >
                  {buttonText}
                  <ArrowRight size={18} className="ml-2" />
                </button>
                {showStatus && (
                  <span className="text-sm text-muted-tone text-center sm:text-left">
                    {currentLevelCompleted && !nextLevel
                      ? `All levels completed! · ${LEVEL_INFO[level!].title}`
                      : `Question ${displayQuestionNum} of 10 · ${LEVEL_INFO[displayLevel!].title}`}
                  </span>
                )}
              </div>
            </div>

            {/* Right side animated logo illustration */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative select-none">
              {/* Subtle pulsing background aura */}
              <div className="absolute w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-pulse" />

              {/* Clean Stylized Floating Logo Vector */}
              <svg
                width="340"
                height="340"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 w-full max-w-[340px]"
              >
                <defs>
                  {/* Block gradients */}
                  <linearGradient
                    id="blockGradDark"
                    x1="50"
                    y1="90"
                    x2="74"
                    y2="144"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#3d3d3a" />
                    <stop offset="100%" stopColor="#141413" />
                  </linearGradient>
                  <linearGradient
                    id="blockGradCoral"
                    x1="130"
                    y1="60"
                    x2="154"
                    y2="84"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#e8a55a" />
                    <stop offset="100%" stopColor="#cc785c" />
                  </linearGradient>
                </defs>

                {/* The 3 Logo Blocks (Floating/Animate) */}
                <g className="hero-logo-block-1">
                  <rect
                    x="50"
                    y="120"
                    width="24"
                    height="24"
                    rx="6"
                    fill="url(#blockGradDark)"
                    filter="drop-shadow(0px 8px 24px rgba(20,20,19,0.12))"
                  />
                </g>
                <g className="hero-logo-block-2">
                  <rect
                    x="90"
                    y="90"
                    width="24"
                    height="24"
                    rx="6"
                    fill="url(#blockGradDark)"
                    filter="drop-shadow(0px 8px 24px rgba(20,20,19,0.12))"
                  />
                </g>
                <g className="hero-logo-block-3">
                  <rect
                    x="130"
                    y="60"
                    width="24"
                    height="24"
                    rx="6"
                    fill="url(#blockGradCoral)"
                    filter="drop-shadow(0px 8px 24px rgba(204,120,92,0.3))"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-12 py-12 md:py-24 bg-canvas md:bg-surface-soft">
        <div className="max-w-6xl mx-auto">
          <div className="caption-up text-muted-tone mb-4">How it works</div>
          <h2 className="display-lg text-ink mb-8 md:mb-16 max-w-2xl">A coach, not a quiz.</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                t: "Choose your level",
                d: "Pick Beginner, Intermediate, or Advanced. Each tier targets the corporate scenarios you actually face.",
              },
              {
                n: "02",
                t: "Speak the answer",
                d: "Tap record. Speak freely, or read a polished script. Real audio in, real evaluation out — no typing.",
              },
              {
                n: "03",
                t: "See the feedback",
                d: "Clarity, grammar, and confidence — scored. Specific fixes, a coach's note. Retry until it lands.",
              },
            ].map((s) => (
              <div key={s.n} className="card-cream">
                <div className="caption-up text-primary mb-6">{s.n}</div>
                <h3 className="display-sm text-ink mb-3">{s.t}</h3>
                <p className="text-body leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEVELS */}
      <section className="px-6 md:px-12 py-12 md:py-24 bg-canvas md:bg-surface-dark text-ink md:text-on-dark">
        <div className="max-w-6xl mx-auto">
          <div className="caption-up text-muted-tone md:text-on-dark-soft mb-4">Three levels</div>
          <h2 className="display-lg mb-3 max-w-2xl text-ink md:text-on-dark">
            From your first introduction to your boardroom voice.
          </h2>
          <p className="text-body md:text-on-dark-soft max-w-xl mb-8 md:mb-16">
            Each level is ten questions. Difficulty escalates deliberately.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {(["beginner", "intermediate", "advanced"] as const).map((lvl, i) => (
              <div
                key={lvl}
                className="p-6 md:p-8 rounded-xl border border-white/10 hover:border-primary/60 transition-colors group bg-surface-dark-elevated text-on-dark"
              >
                <div className="caption-up text-primary mb-5">Level 0{i + 1}</div>
                <h3 className="display-sm mb-4 text-on-dark">{LEVEL_INFO[lvl].title}</h3>
                <p className="text-on-dark-soft leading-relaxed text-sm mb-8">
                  {LEVEL_INFO[lvl].description}
                </p>
                <div className="caption-up text-on-dark-soft">10 questions · 15–90s each</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REDESIGNED CTA BAND */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-canvas">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-surface-dark-elevated border border-white/10 px-6 py-10 md:px-8 md:py-16 text-center hover:border-primary/60 transition-colors group">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="caption-up text-primary tracking-[0.2em] mb-4 block">
                Take the first step
              </span>
              <h2 className="display-lg text-on-dark mb-6 leading-tight">
                Your voice deserves <br className="hidden sm:inline" />
                <span className="text-primary italic font-serif">to be heard.</span>
              </h2>
              <p className="text-on-dark-soft max-w-md mx-auto mb-8 text-base md:text-lg leading-relaxed">
                Develop your presence, grammar, and confidence with real-time browser feedback.
                Start coaching in under a minute.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStart}
                  className="btn-primary !h-14 !px-7 text-base w-full sm:w-auto justify-center"
                >
                  {hasSession ? "Continue your journey" : "Start coaching now"}
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>

              {/* Sub-badge features */}
              <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] md:text-xs text-on-dark-soft tracking-wider uppercase font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Browser-based
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Zero login required
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 100% Privacy Focused
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-10 bg-surface-dark text-on-dark-soft">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4 items-start md:items-center text-sm">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span dangerouslySetInnerHTML={{ __html: logoSvg("#faf9f5") }} />
            <span className="font-display text-on-dark text-lg">Resonant</span>
          </Link>
          <div className="caption-up">© Built for speakers everywhere</div>
        </div>
      </footer>
    </div>
  );
}
