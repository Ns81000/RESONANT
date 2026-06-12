import { Link } from "@tanstack/react-router";
import logoSvg from "@/components/resonant/logo";

interface NavProps {
  variant?: "light" | "dark";
}

export function Nav({ variant = "light" }: NavProps) {
  const isDark = variant === "dark";
  return (
    <header
      className={`absolute top-0 left-0 right-0 z-20 px-6 md:px-12 py-5 flex items-center justify-between border-b ${
        isDark
          ? "text-on-dark border-white/10 bg-surface-dark"
          : "text-ink border-hairline/60 bg-canvas"
      }`}
    >
      <Link to="/" className="flex items-center gap-2.5">
        <span
          dangerouslySetInnerHTML={{ __html: logoSvg(isDark ? "#faf9f5" : "#141413", "#cc785c") }}
          className="block"
        />
        <span className="font-display text-xl font-medium tracking-tight">Resonant</span>
      </Link>
      <div
        className={`caption-up text-[10px] sm:text-[12px] ${isDark ? "text-on-dark-soft" : "text-muted-tone"}`}
      >
        Words that resonate
      </div>
    </header>
  );
}
