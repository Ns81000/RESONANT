import { Link } from "@tanstack/react-router";
import { BarChart2 } from "lucide-react";
import logoSvg from "@/components/resonant/logo";
import { useSession } from "@/lib/resonant/store";

interface NavProps {
  variant?: "light" | "dark";
}

export function Nav({ variant = "light" }: NavProps) {
  const isDark = variant === "dark";
  const userName = useSession((s) => s.userName);
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
      <div className="flex items-center gap-4">
        {userName && (
          <Link
            to="/stats"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              isDark
                ? "text-on-dark-soft hover:text-primary"
                : "text-muted-tone hover:text-primary"
            }`}
          >
            <BarChart2 size={14} />
            <span className="hidden sm:inline">Stats</span>
          </Link>
        )}
        <div
          className={`caption-up text-[10px] sm:text-[12px] ${isDark ? "text-on-dark-soft" : "text-muted-tone"}`}
        >
          Words that resonate
        </div>
      </div>
    </header>
  );
}

