import { cn } from "@/lib/utils";

/**
 * Lightweight SVG charts — no chart library. Paths are computed once so
 * Phase 2 can animate stroke-dashoffset / bar heights.
 */

function toPoints(data: number[], w: number, h: number, pad = 2) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return data.map((v, i) => [
    (i / (data.length - 1)) * w,
    pad + (1 - (v - min) / range) * (h - pad * 2),
  ]);
}

function smoothPath(points: number[][]) {
  return points.reduce((d, [x, y], i, arr) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = arr[i - 1];
    const cx = (px + x) / 2;
    return `${d} C${cx},${py} ${cx},${y} ${x},${y}`;
  }, "");
}

export function Sparkline({ data, color = "#00b86b", className }: { data: number[]; color?: string; className?: string }) {
  const pts = toPoints(data, 100, 30, 3);
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </svg>
  );
}

/**
 * `drawn` (optional) animates the line left to right with CSS transitions:
 * 0 = hidden, 1 = fully drawn. `animate` false makes changes instant (resets, reduced motion).
 * Omit both for the original static chart.
 */
export function AreaChart({
  data,
  color = "#6c4dff",
  highlightIndex,
  drawn,
  animate = true,
  drawMs = 1600,
  className,
}: {
  data: number[];
  color?: string;
  highlightIndex?: number;
  drawn?: number;
  animate?: boolean;
  drawMs?: number;
  className?: string;
}) {
  const w = 400;
  const h = 140;
  const pts = toPoints(data, w, h, 10);
  const line = smoothPath(pts);
  const area = `${line} L${w},${h} L0,${h} Z`;
  const id = `area-${color.replace("#", "")}`;
  const hp = highlightIndex !== undefined ? pts[highlightIndex] : undefined;
  const live = drawn !== undefined;
  const progress = drawn ?? 1;
  const t = (prop: string, ms: number, delay = 0) => (live && animate ? `${prop} ${ms}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms` : "none");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("w-full overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="#eaecf0" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={area} fill={`url(#${id})`} style={live ? { opacity: progress >= 1 ? 1 : 0, transition: t("opacity", 600, drawMs * 0.6) } : undefined} />
      <path
        data-chart-line
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        {...(live && { pathLength: 1, strokeDasharray: 1, style: { strokeDashoffset: 1 - progress, transition: t("stroke-dashoffset", drawMs) } })}
      />
      {/* data points (every 5th day + the latest) appear as the line passes them */}
      {live &&
        pts.map(([x, y], i) =>
          i % 5 === 4 || i === pts.length - 1 ? (
            <circle
              key={i}
              data-chart-point={i}
              cx={x}
              cy={y}
              r={2.5}
              fill="#fff"
              stroke={color}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              style={{ opacity: progress >= 1 ? 1 : 0, transition: t("opacity", 250, (i / (pts.length - 1)) * drawMs) }}
            />
          ) : null,
        )}
      {hp && (
        <line
          x1={hp[0]}
          x2={hp[0]}
          y1={hp[1]}
          y2={h}
          stroke={color}
          strokeOpacity={0.35}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
          style={live ? { opacity: progress >= 1 ? 1 : 0, transition: t("opacity", 300, drawMs) } : undefined}
        />
      )}
    </svg>
  );
}

/** `swept` (0–1, optional) grows segments in with a CSS transition; `highlight` dims the others. */
export function DonutChart({
  segments,
  size = 120,
  thickness = 16,
  swept,
  highlight,
  animate = true,
  children,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  thickness?: number;
  swept?: number;
  highlight?: string;
  animate?: boolean;
  children?: React.ReactNode;
}) {
  const live = swept !== undefined;
  const sweep = swept ?? 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  const gap = 3;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={s.label}
              data-donut-segment={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(len * sweep - gap, 0)} ${c}`}
              strokeDashoffset={-offset * sweep}
              style={
                live
                  ? {
                      opacity: highlight && highlight !== s.label ? 0.4 : 1,
                      transition: animate
                        ? `stroke-dasharray 900ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, opacity 400ms ease`
                        : "none",
                    }
                  : undefined
              }
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      {children && <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>}
    </div>
  );
}

/** `grown` (0–1, optional) scales bars up from the baseline with a staggered transform transition. */
export function BarChart({
  data,
  highlight,
  grown,
  animate = true,
  className,
}: {
  data: { label: string; value: number }[];
  highlight?: string;
  grown?: number;
  animate?: boolean;
  className?: string;
}) {
  const live = grown !== undefined;
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className={cn("flex h-full items-end gap-2", className)}>
      {data.map((d, i) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <div
            data-bar={d.label}
            className={cn("w-full max-w-7 origin-bottom rounded-md", d.label === highlight ? "bg-accent-500" : "bg-accent-100")}
            style={{
              height: `${(d.value / max) * 100}%`,
              ...(live && {
                transform: `scaleY(${grown})`,
                transition: animate ? `transform 700ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, background-color 500ms ease` : "none",
              }),
            }}
          />
          <span className="text-[10px] text-subtle">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** `filled` (0–1, optional) scales the bar in from the left with a transform transition. */
export function ProgressBar({
  value,
  color = "bg-accent-500",
  filled,
  animate = true,
  delayMs = 0,
  className,
}: {
  value: number;
  color?: string;
  filled?: number;
  animate?: boolean;
  delayMs?: number;
  className?: string;
}) {
  const live = filled !== undefined;
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line-soft", className)}>
      <div
        data-progress
        className={cn("h-full origin-left rounded-full", color)}
        style={{
          width: `${value}%`,
          ...(live && {
            transform: `scaleX(${filled})`,
            transition: animate ? `transform 800ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms` : "none",
          }),
        }}
      />
    </div>
  );
}
