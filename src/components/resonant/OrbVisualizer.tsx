import { useEffect, useRef } from "react";

interface Props {
  level: number; // 0..1 instantaneous audio level
  active: boolean;
  size?: number;
}

/**
 * Organic listening orb — concentric breathing rings + soft glow effects that
 * respond to voice. Replaces the spiky waveform with something quieter and
 * more in line with the cream/coral editorial theme.
 * Fully responsive and optimized to run at 60fps across all devices.
 */
export function OrbVisualizer({ level, active, size = 240 }: Props) {
  const smoothRef = useRef(0);
  const timeRef = useRef(0);
  const ring1 = useRef<SVGCircleElement>(null);
  const ring2 = useRef<SVGCircleElement>(null);
  const ring3 = useRef<SVGCircleElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const core = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      // Advance time for base breathing animation
      timeRef.current += 0.015;

      // Create a subtle breathing carrier wave (slow sine wave)
      // When idle (active=false), we breathe very gently.
      // When recording (active=true), we combine the voice level with the breath.
      const breathPulse = (Math.sin(timeRef.current * 1.5) + 1) * 0.04; // 0 .. 0.08
      const targetLevel = active ? level + breathPulse : breathPulse;

      // Smooth follow so motion feels breath-like, not jittery
      smoothRef.current = smoothRef.current * 0.8 + targetLevel * 0.2;
      const l = smoothRef.current;

      // Radii calculations fully proportional to size
      const r1 = size * 0.12 + l * (size * 0.08); // Inner ring
      const r2 = size * 0.20 + l * (size * 0.12); // Middle ring
      const r3 = size * 0.30 + l * (size * 0.16); // Outer ring
      const haloR = size * 0.16 + l * (size * 0.10); // Glow halo
      const coreR = size * 0.05 + l * (size * 0.03); // Solid core

      if (ring1.current) {
        ring1.current.setAttribute("r", String(r1));
        ring1.current.setAttribute("opacity", String(0.45 - l * 0.15));
      }
      if (ring2.current) {
        ring2.current.setAttribute("r", String(r2));
        ring2.current.setAttribute("opacity", String(0.25 - l * 0.10));
      }
      if (ring3.current) {
        ring3.current.setAttribute("r", String(r3));
        ring3.current.setAttribute("opacity", String(0.15 - l * 0.05));
      }
      if (halo.current) {
        halo.current.setAttribute("r", String(haloR));
        halo.current.setAttribute("opacity", String(active ? 0.22 + l * 0.10 : 0.08 + l * 0.04));
      }
      if (core.current) {
        core.current.setAttribute("r", String(coreR));
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [level, active, size]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible select-none pointer-events-none">
        <defs>
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.55" />
          </radialGradient>
          {/* Hardware-accelerated SVG glow filter */}
          <filter id="orb-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={size * 0.025} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer breathing rings */}
        <circle
          ref={ring3}
          cx={size / 2}
          cy={size / 2}
          r={size * 0.3}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1"
          opacity={0.15}
        />
        <circle
          ref={ring2}
          cx={size / 2}
          cy={size / 2}
          r={size * 0.2}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.25"
          opacity={0.25}
          filter="url(#orb-glow)"
        />
        <circle
          ref={ring1}
          cx={size / 2}
          cy={size / 2}
          r={size * 0.12}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          opacity={0.45}
          filter="url(#orb-glow)"
        />

        {/* Inner glow halo */}
        <circle
          ref={halo}
          cx={size / 2}
          cy={size / 2}
          r={size * 0.16}
          fill="url(#orb-core)"
          opacity={0.08}
          filter="url(#orb-glow)"
        />

        {/* Solid core (will sit just behind the main record button) */}
        <circle
          ref={core}
          cx={size / 2}
          cy={size / 2}
          r={size * 0.05}
          fill="var(--primary)"
          opacity={active ? 0.3 : 0.8}
        />
      </svg>
      
      {active && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="caption-up text-primary/60 font-semibold tracking-widest text-[10px]" style={{ transform: "translateY(110px)" }}>
            listening
          </span>
        </span>
      )}
    </div>
  );
}
