"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Timer, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoPlayback } from "@/lib/use-sequence";
import { Avatar } from "@/components/ui/avatar";
import { SampleTag } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Panel, PanelHeader, RangeChip } from "@/components/product/surface";
import { KpiCard } from "@/components/product/metric-card";
import { AreaChart, BarChart, DonutChart, ProgressBar } from "@/components/product/charts";
import { CountUp, EASE, swapTransition } from "@/components/product/motion-primitives";
import { conversionByMonth, leadSources, leadsSeries, teamResponse } from "@/data/analytics";
import { analyticsDemo, analyticsStage } from "@/data/analytics-demo";

const DURATIONS = analyticsDemo.stages.map((s) => s.duration);
const S = {
  load: analyticsStage("load"),
  line: analyticsStage("line"),
  bars: analyticsStage("bars"),
  donut: analyticsStage("donut"),
  team: analyticsStage("team"),
  hold: analyticsStage("hold"),
  outro: analyticsStage("outro"),
};
const LAST = leadsSeries.length - 1;
const bars = conversionByMonth.map((d) => ({ label: d.month, value: d.value }));

export function AnalyticsDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, reduced } = useDemoPlayback(ref, DURATIONS, { initialDelay: analyticsDemo.startDelay, amount: 0.3 });
  const s = reduced ? S.hold : stage;
  // Transitions run only while playing forward; loop resets and reduced motion jump instantly.
  const animate = !reduced && s > 0;
  const k = analyticsDemo.kpis;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="analytics" data-stage={analyticsDemo.stages[s].id}>
        <Panel className="bg-soft p-3 shadow-panel sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
              Overview <SampleTag />
            </p>
            <RangeChip>Last 30 days</RangeChip>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Reveal s={s} i={0}>
              <KpiCard
                label="New leads"
                value={<CountUp value={s >= S.line ? k.newLeads.final : s >= S.load ? k.newLeads.opening : 0} duration={s >= S.line ? 1.2 : 1.6} instant={!animate} />}
                delta="+12%"
                className={highlight(s === S.line, "brand")}
              />
            </Reveal>
            <Reveal s={s} i={1}>
              <KpiCard
                label="Avg. first reply"
                value={<SwapText text={s >= S.team ? k.reply.final : s >= S.load ? k.reply.opening : "—"} />}
                delta="−18%"
                className={highlight(s === S.team, "brand")}
              />
            </Reveal>
            <Reveal s={s} i={2}>
              <KpiCard
                label="Won deals"
                value={<CountUp value={s >= S.bars ? k.wonDeals.final : s >= S.load ? k.wonDeals.opening : 0} duration={1.2} instant={!animate} />}
                delta={analyticsDemo.growth}
                className={highlight(s === S.bars, "accent")}
              />
            </Reveal>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Reveal s={s} i={3}>
              <LeadsChartCard s={s} animate={animate} />
            </Reveal>
            <Reveal s={s} i={4}>
              <LeadSourcesCard s={s} animate={animate} />
            </Reveal>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Reveal s={s} i={5}>
              <TeamResponseCard s={s} animate={animate} />
            </Reveal>
            <Reveal s={s} i={6}>
              <ConversionCard s={s} animate={animate} />
            </Reveal>
          </div>
        </Panel>
      </div>
    </MotionConfig>
  );
}

const highlight = (on: boolean, tone: "brand" | "accent") =>
  cn("ring-2 transition-shadow duration-500", on ? (tone === "brand" ? "ring-brand-200" : "ring-accent-200") : "ring-transparent");

/** Staggered soft fade for each card as the dashboard "loads"; dims again before the loop resets. */
function Reveal({ s, i, children }: { s: number; i: number; children: React.ReactNode }) {
  const shown = s >= S.load && s !== S.outro;
  return (
    <motion.div
      className="h-full [&>*]:h-full"
      initial={false}
      animate={{ opacity: shown ? 1 : 0.55, y: shown ? 0 : 4 }}
      transition={{ duration: 0.5, ease: EASE, delay: shown && s === S.load ? i * 0.07 : 0 }}
    >
      {children}
    </motion.div>
  );
}

function SwapText({ text }: { text: string }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={text} initial={{ y: "60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-60%", opacity: 0 }} transition={swapTransition} className="tabular-nums">
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function LeadsChartCard({ s, animate }: { s: number; animate: boolean }) {
  const drawn = s >= S.line ? 1 : 0;
  // Mirror AreaChart's 140-unit viewBox with 10-unit padding to place the marker on today's point.
  const min = Math.min(...leadsSeries);
  const max = Math.max(...leadsSeries);
  const markerTop = ((10 + (1 - (leadsSeries[LAST] - min) / (max - min)) * 120) / 140) * 100;
  return (
    <Panel className="relative p-4">
      <PanelHeader title="Leads created" subtitle="Daily, all channels" />
      <div className="relative mt-3">
        <AreaChart data={leadsSeries} highlightIndex={LAST} drawn={drawn} animate={animate} drawMs={1500} className="h-[140px]" />
        <AnimatePresence>
          {drawn === 1 && (
            <>
              <motion.span
                key="marker"
                aria-hidden
                className="absolute left-full size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent-500 shadow"
                style={{ top: `${markerTop}%` }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ...swapTransition, delay: animate ? 1.45 : 0 }}
              />
              <motion.div
                key="tooltip"
                data-chart-tooltip
                className="absolute top-0 right-5 flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-1.5 whitespace-nowrap shadow-float"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: animate ? 1.55 : 0 }}
              >
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#25d366] text-white">
                  <WhatsAppIcon className="size-3.5" />
                </span>
                <span>
                  <span className="block text-[12px] leading-tight font-semibold text-ink">{analyticsDemo.today} leads today</span>
                  <span className="block text-[10.5px] text-brand-700">{analyticsDemo.total.toLocaleString("en-US")} this month</span>
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}

function LeadSourcesCard({ s, animate }: { s: number; animate: boolean }) {
  const swept = s >= S.donut ? 1 : 0;
  const hl = s >= S.donut ? analyticsDemo.highlightSource : undefined;
  return (
    <Panel className="p-4">
      <PanelHeader title="Lead sources" />
      <div className="mt-3 flex items-center gap-2.5">
        <DonutChart segments={leadSources} size={84} thickness={12} swept={swept} highlight={hl} animate={animate}>
          <span className="text-[15px] font-semibold text-ink">
            <CountUp value={s >= S.donut ? analyticsDemo.total : 0} duration={1} instant={!animate} />
          </span>
          <span className="text-[10px] text-muted">leads</span>
        </DonutChart>
        <ul className="grid min-w-0 flex-1 gap-2">
          {leadSources.map((src) => {
            const dim = hl && hl !== src.label;
            return (
              <li key={src.label} className="flex items-center justify-between gap-1.5 text-[11px]">
                <span className={cn("flex items-center gap-1 whitespace-nowrap transition-colors duration-400", hl === src.label ? "font-semibold text-ink" : dim ? "text-muted" : "text-ink-soft")}>
                  {/* de-emphasis lives on the colour dot; text stays AA-readable */}
                  <span className={cn("size-2 rounded-full transition-opacity duration-400", dim ? "opacity-40" : "opacity-100")} style={{ background: src.color }} />
                  {src.label}
                </span>
                <span className={cn("font-semibold transition-colors duration-400", dim ? "text-muted" : "text-ink")}>{src.value}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}

function TeamResponseCard({ s, animate }: { s: number; animate: boolean }) {
  return (
    <Panel className="p-4">
      <PanelHeader icon={Timer} title="Team response time" />
      <ul className="mt-3.5 grid gap-3">
        {teamResponse.map((t, i) => (
          <li key={t.name} className="flex items-center gap-2.5">
            <Avatar name={t.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between text-[11.5px]">
                <span className="font-medium text-ink">{t.name.split(" ")[0]}</span>
                <span className="text-muted">{t.time}</span>
              </div>
              <ProgressBar value={t.pct} filled={s >= S.team ? 1 : 0} animate={animate} delayMs={i * 120} />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ConversionCard({ s, animate }: { s: number; animate: boolean }) {
  const grown = s >= S.bars;
  const growth = s >= S.team;
  return (
    <Panel className="p-4">
      <PanelHeader
        icon={TrendingUp}
        title="Conversion over time"
        action={
          <span className="relative inline-flex h-5 items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {grown && (
                <motion.span
                  key={growth ? "growth" : "won"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={swapTransition}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap text-brand-700"
                >
                  {analyticsDemo.kpis.wonDeals.final} won
                  {growth && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-1.5 py-px ring-1 ring-brand-200">
                      <TrendingUp className="size-3" /> {analyticsDemo.growth}
                    </span>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        }
      />
      <BarChart data={bars} highlight={grown ? analyticsDemo.latestMonth : undefined} grown={grown ? 1 : 0} animate={animate} className="mt-4 h-[118px]" />
    </Panel>
  );
}
