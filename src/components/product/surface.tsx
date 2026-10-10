import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconLike } from "@/components/ui/badge";

/** Base white card used for every product-UI panel. */
export function Panel({
  className,
  children,
  float,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { float?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white",
        float ? "shadow-float" : "shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 items-center gap-2">
        {Icon && <Icon className="size-4 shrink-0 text-brand-700" strokeWidth={2.25} />}
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-ink">{title}</p>
          {subtitle && <p className="truncate text-[11px] text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

const tileTones = {
  green: "bg-brand-50 text-brand-700",
  purple: "bg-accent-50 text-accent-500",
  blue: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  gray: "bg-line-soft text-ink-soft",
  teal: "bg-teal-50 text-teal-600",
  solidGreen: "bg-brand-500 text-white",
  solidPurple: "bg-accent-500 text-white",
} as const;

export type TileTone = keyof typeof tileTones;

export function IconTile({
  icon: Icon,
  tone = "green",
  size = "md",
  className,
}: {
  icon: IconLike;
  tone?: TileTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        size === "sm" && "size-7 rounded-lg [&_svg]:size-3.5",
        size === "md" && "size-9 rounded-xl [&_svg]:size-[18px]",
        size === "lg" && "size-11 rounded-xl [&_svg]:size-5",
        tileTones[tone],
        className,
      )}
    >
      <Icon className="" />
    </span>
  );
}

/** Small time-range selector chip shown in dashboard headers. */
export function RangeChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line bg-white px-2 py-1 text-[11px] font-medium whitespace-nowrap text-ink-soft">
      {children}
      <svg viewBox="0 0 12 12" className="size-3 text-subtle" aria-hidden>
        <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    </span>
  );
}
