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
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--hairline)"
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
          <span className="font-display text-3xl text-ink" style={{ letterSpacing: "-0.02em" }}>
            {animated.toFixed(1)}
          </span>
        </div>
      </div>
      <span className="caption-up text-muted-tone">{label}</span>
    </div>
  );
}
