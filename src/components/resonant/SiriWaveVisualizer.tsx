import { useEffect, useRef } from "react";

interface Props {
  level: number; // 0..1 instantaneous audio level
  active: boolean;
  height?: number;
}

// Custom brand-aligned curves for the SiriWave "Classic" style
const curves = [
  { attenuation: -2, lineWidth: 1.5, opacity: 0.22, color: "#e8a55a" }, // accent-amber
  { attenuation: -6, lineWidth: 1.5, opacity: 0.30, color: "#c64545" }, // error-crimson
  { attenuation: 4, lineWidth: 1.75, opacity: 0.50, color: "#df9378" }, // warm-terracotta
  { attenuation: 2, lineWidth: 2.0, opacity: 0.70, color: "#b35d43" }, // deep-terracotta
  { attenuation: 1, lineWidth: 3.0, opacity: 1.0, color: "#cc785c" },  // primary-coral
];

// Helper to convert hex colors to rgba with transparency
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SiriWaveVisualizer({ level, active, height = 140 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const levelRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Handle high-DPI (Retina) scaling and resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const centerY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // 1. Noise gate to filter out mic baseline static / room noise
      const noiseFloor = 0.022;
      let rawLevel = 0;
      if (level > noiseFloor) {
        // Map volume above noise floor and apply a gain multiplier to make speech visible
        rawLevel = Math.min(1.0, (level - noiseFloor) * 3.5);
      }

      const targetLevel = active ? rawLevel : 0.0;

      // 2. Asymmetric Envelope Follower: Fast attack (0.5), smooth release (0.12)
      const isRising = targetLevel > levelRef.current;
      const factor = isRising ? 0.5 : 0.12;
      levelRef.current = levelRef.current + (targetLevel - levelRef.current) * factor;
      const l = levelRef.current;

      // 3. Dynamic phase speed: moves fast when speaking, crawls slowly when silent
      const isSpeaking = l > 0.015;
      const speed = isSpeaking ? 0.08 + l * 0.06 : 0.015;
      phaseRef.current = (phaseRef.current + speed) % (Math.PI * 2);

      // 4. Amplitude mapping (always maintain a tiny breathing scale when silent)
      const displayAmplitude = Math.max(0.04, l);
      const baseAmplitude = displayAmplitude * (h * 0.4); 
      const FREQ = 6.0; // Spatial frequency (number of wave cycles)

      curves.forEach((curve) => {
        ctx.beginPath();
        ctx.lineWidth = curve.lineWidth;
        ctx.strokeStyle = hexToRgba(curve.color, curve.opacity);

        // SiriWave Classic math: sin(FREQ * x - phase) * attenuation(x)
        // x goes from -2 to 2 across the width of the canvas
        for (let i = 0; i < w; i += 2) {
          const x = -2 + (i / w) * 4;
          
          // Attenuation bell curve
          const att = Math.pow(4 / (4 + Math.pow(x, 4)), 4);
          
          // Wave equation
          const y = centerY + Math.sin(FREQ * x - phaseRef.current) * att * baseAmplitude * (1 / curve.attenuation);

          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [level, active]);

  return (
    <div className="w-full flex items-center justify-center overflow-visible" style={{ height }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-xl pointer-events-none select-none"
        style={{ height }}
      />
    </div>
  );
}
export default SiriWaveVisualizer;
