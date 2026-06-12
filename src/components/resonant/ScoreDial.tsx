import { useEffect, useRef, useState } from "react";

interface Props {
  value: number; // 0..10
  label: string;
  size?: number;
}

const colorFor = (v: number) =>
  v >= 8 ? "var(--success)" : v >= 5 ? "var(--accent-amber)" : "var(--error)";

export function ScoreDial({ value, label, size = 120 }: Props) {
  const r = (size - 16) / 2;
  const C = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const dur = 1000;
    const from = 0;
    const to = value;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(from + (to - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value]);

  const color = colorFor(value);
  const offset = C * (1 - animated / 10);

  return (
    <div className="flex flex-col items-center gap-2 w-20 sm:w-24 md:w-28">
      <div className="relative w-full aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            className="opacity-15"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl sm:text-3xl text-current" style={{ letterSpacing: "-0.02em" }}>
            {animated.toFixed(1)}
          </span>
        </div>
      </div>
      <span className="caption-up text-[10px] sm:text-xs text-muted-tone text-center">{label}</span>
    </div>
  );
}

