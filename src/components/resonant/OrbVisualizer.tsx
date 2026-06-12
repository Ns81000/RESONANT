import { useEffect, useRef } from "react";

interface Props {
  level: number; // 0..1 instantaneous audio level
  active: boolean;
  size?: number;
}

/**
 * Organic listening orb — concentric breathing rings + soft particles that
 * respond to voice. Replaces the spiky waveform with something quieter and
 * more in line with the cream/coral editorial theme.
 */
export function OrbVisualizer({ level, active, size = 220 }: Props) {
  const smoothRef = useRef(0);
  const ring1 = useRef<SVGCircleElement>(null);
  const ring2 = useRef<SVGCircleElement>(null);
  const ring3 = useRef<SVGCircleElement>(null);
  const core = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      // Smooth follow so motion feels breath-like, not jittery
      smoothRef.current = smoothRef.current * 0.82 + level * 0.18;
      const l = smoothRef.current;

      const base = size / 2;
      const r1 = 28 + l * 22;
      const r2 = 52 + l * 38;
      const r3 = 80 + l * 56;
      const coreR = 14 + l * 10;

      if (ring1.current) {
        ring1.current.setAttribute("r", String(r1));
        ring1.current.setAttribute("opacity", String(0.55 - l * 0.15));
      }
      if (ring2.current) {
        ring2.current.setAttribute("r", String(r2));
        ring2.current.setAttribute("opacity", String(0.32 - l * 0.1));
      }
      if (ring3.current) {
        ring3.current.setAttribute("r", String(r3));
        ring3.current.setAttribute("opacity", String(0.18 - l * 0.05));
      }
      if (core.current) {
        core.current.setAttribute("r", String(coreR));
      }
      // unused but reserved for future micro-particles
      void base;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [level, size]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        {/* Outer breathing rings */}
        <circle
          ref={ring3}
          cx={size / 2}
          cy={size / 2}
          r={80}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1"
          opacity={0.18}
        />
        <circle
          ref={ring2}
          cx={size / 2}
          cy={size / 2}
          r={52}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.25"
          opacity={0.32}
        />
        <circle
          ref={ring1}
          cx={size / 2}
          cy={size / 2}
          r={28}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          opacity={0.55}
        />
        {/* Inner glow halo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={36}
          fill="url(#orb-core)"
          opacity={active ? 0.18 : 0.08}
          className={active ? "animate-breath" : ""}
        />
        {/* Solid core */}
        <circle ref={core} cx={size / 2} cy={size / 2} r={14} fill="var(--primary)" />
      </svg>
      {active && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="caption-up text-primary/70" style={{ transform: "translateY(120px)" }}>
            listening
          </span>
        </span>
      )}
    </div>
  );
}
