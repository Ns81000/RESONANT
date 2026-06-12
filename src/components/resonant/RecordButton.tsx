import { Mic, Square, Check } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
  state: "idle" | "recording" | "done" | "processing";
  audioLevel?: number;
  onClick: () => void;
}

export function RecordButton({ state, audioLevel = 0, onClick }: Props) {
  const size = 80;
  
  // We use GSAP to animate ripples if recording
  const ripplesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let mounted = true;
    let ctx: gsap.Context | null = null;
    
    const animateRipples = async () => {
      if (state !== "recording" || !ripplesRef.current) return;
      const { gsap } = await import("gsap");
      if (!mounted) return;
      
      ctx = gsap.context(() => {
        // Animate the ripples based on audio level
        const scale = 1 + (audioLevel / 100) * 1.5; // Max scale 2.5
        gsap.to(".audio-ripple", {
          scale: scale,
          opacity: Math.max(0.1, 0.4 - (audioLevel / 100) * 0.3),
          duration: 0.15,
          ease: "power2.out",
          stagger: 0.05
        });
      }, ripplesRef);
    };
    
    animateRipples();
    
    return () => {
      mounted = false;
      if (ctx) ctx.revert();
    };
  }, [audioLevel, state]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size * 2.5, height: size * 2.5 }}>
      {/* Ripples container */}
      {state === "recording" && (
        <div ref={ripplesRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="audio-ripple absolute rounded-full bg-error" style={{ width: size, height: size }} />
          <div className="audio-ripple absolute rounded-full bg-error" style={{ width: size * 1.1, height: size * 1.1, opacity: 0.2 }} />
          <div className="audio-ripple absolute rounded-full bg-error" style={{ width: size * 1.2, height: size * 1.2, opacity: 0.1 }} />
        </div>
      )}

      <button
        onClick={onClick}
        disabled={state === "processing"}
        className="group relative z-10 rounded-full flex items-center justify-center text-white transition-all active:scale-95 hover:scale-105"
        style={{
          width: size,
          height: size,
          background:
            state === "idle"
              ? "var(--primary)"
              : state === "recording"
                ? "var(--ink)"
                : state === "done"
                  ? "var(--success, #22c55e)"
                  : "var(--muted, #94a3b8)",
          boxShadow:
            state === "recording"
              ? "0 0 0 6px color-mix(in srgb, var(--primary) 18%, transparent), 0 10px 28px -10px rgba(20,20,19,0.45)"
              : "0 10px 28px -10px rgba(204,120,92,0.55)",
        }}
        aria-label={
          state === "idle"
            ? "Start recording"
            : state === "recording"
              ? "Stop recording"
              : state === "done"
                ? "Recording completed"
                : "Processing"
        }
      >
        {state === "idle" && <Mic size={26} />}
        {state === "recording" && <Square fill="white" size={22} />}
        {state === "done" && <Check size={26} />}
        {state === "processing" && (
          <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
      </button>
    </div>
  );
}