import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/badge";
import { IconTile, type TileTone } from "./surface";
import { Sparkline } from "./charts";

/** Icon + label + value tile (campaign metrics, segments). */
export function MetricCard({
  label,
  value,
  icon,
  tone = "green",
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  className?: string;
}) {
  const bg: Record<Tone, string> = {
    green: "bg-brand-50/60",
    purple: "bg-accent-50/70",
    amber: "bg-amber-50/70",
    blue: "bg-sky-50/70",
    gray: "bg-soft",
    rose: "bg-rose-50/70",
    teal: "bg-teal-50/70",
  };
  return (
    <div data-metric={label} className={cn("flex items-center gap-2.5 rounded-xl p-2.5", bg[tone], className)}>
      <IconTile icon={icon} tone={tone as TileTone} size="sm" className="bg-white shadow-[0_1px_2px_rgb(16_24_40/0.06)]" />
      <div className="min-w-0">
        <p className="truncate text-[11px] text-muted">{label}</p>
        <p className="text-[15px] font-semibold tracking-tight text-ink">{value}</p>
      </div>
    </div>
  );
}

/** KPI with trend delta, optional sparkline. */
export function KpiCard({
  label,
  value,
  delta,
  positive = true,
  spark,
  sparkColor = "#00b86b",
  icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  positive?: boolean;
  spark?: number[];
  sparkColor?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  const Trend = positive ? TrendingUp : TrendingDown;
  return (
    <div data-kpi={label} className={cn("rounded-xl border border-line bg-white p-3.5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-medium text-muted">{label}</p>
        {icon && <IconTile icon={icon} tone="green" size="sm" />}
      </div>
      <p className="mt-1 text-[22px] leading-tight font-semibold tracking-tight text-ink">{value}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        {delta && (
          <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold", positive ? "text-brand-700" : "text-rose-600")}>
            <Trend className="size-3" />
            {delta}
          </span>
        )}
        {spark && <Sparkline data={spark} color={sparkColor} className="h-6 w-16" />}
      </div>
    </div>
  );
}
