import { Mic, Square, Check } from "lucide-react";

interface Props {
  state: "idle" | "recording" | "done" | "processing";
  audioLevel?: number;
  onClick: () => void;
}

export function RecordButton({ state, onClick }: Props) {
  const size = 80; // Button diameter

  return (
    <div
      className="relative inline-flex items-center justify-center transition-all duration-300"
      style={{ width: size, height: size }}
    >
      {/* Main record button */}
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
              ? "0 0 0 6px color-mix(in srgb, var(--primary) 18%, transparent), 0 8px 24px -8px rgba(20,20,19,0.3)"
              : "0 8px 24px -8px rgba(204,120,92,0.45)",
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