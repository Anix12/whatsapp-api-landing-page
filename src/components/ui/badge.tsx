import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tone = "green" | "purple" | "amber" | "blue" | "gray" | "rose" | "teal";

const toneClasses: Record<Tone, string> = {
  green: "bg-brand-50 text-brand-700 ring-brand-200/70",
  purple: "bg-accent-50 text-accent-600 ring-accent-200/70",
  amber: "bg-amber-50 text-amber-700 ring-amber-200/70",
  blue: "bg-sky-50 text-sky-700 ring-sky-200/70",
  gray: "bg-line-soft text-ink-soft ring-line",
  rose: "bg-rose-50 text-rose-700 ring-rose-200/70",
  teal: "bg-teal-50 text-teal-700 ring-teal-200/70",
};

/** Compact status/tag pill used inside product previews. */
export function StatusBadge({
  tone = "gray",
  icon: Icon,
  dot,
  className,
  children,
}: {
  tone?: Tone;
  icon?: LucideIcon;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium leading-4 ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {Icon && <Icon className="size-3" strokeWidth={2.25} />}
      {children}
    </span>
  );
}

export type IconLike = LucideIcon | React.ComponentType<{ className?: string }>;

/** Eyebrow label shown above section headlines. */
export function Eyebrow({
  icon: Icon,
  tone = "purple",
  className,
  children,
}: {
  icon?: IconLike;
  tone?: "green" | "purple" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-medium",
        tone === "green" && "border-brand-200/80 bg-brand-50 text-brand-700",
        tone === "purple" && "border-accent-200/80 bg-accent-50 text-accent-600",
        tone === "dark" && "border-white/15 bg-white/5 text-white/80",
        className,
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      {children}
    </span>
  );
}

/** Tiny "Sample data" marker for illustrative dashboards. */
export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-line-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-subtle",
        className,
      )}
    >
      Sample data
    </span>
  );
}
