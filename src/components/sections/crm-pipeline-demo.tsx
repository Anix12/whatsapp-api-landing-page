"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { Bell, Building, CalendarCheck, Check, ChevronDown, Plus, Sparkles, Trophy, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoPlayback } from "@/lib/use-sequence";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { SampleTag, StatusBadge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Panel, IconTile, type TileTone } from "@/components/product/surface";
import { LeadCard } from "@/components/product/lead-card";
import { CountUp, EASE, RollingNumber, swapTransition } from "@/components/product/motion-primitives";
import { pipeline, type StageId } from "@/data/leads";
import { crmDemo, crmStage } from "@/data/crm-demo";

const DURATIONS = crmDemo.stages.map((s) => s.duration);
const S = {
  captured: crmStage("captured"),
  qualified: crmStage("qualified"),
  assigned: crmStage("assigned"),
  contacted: crmStage("contacted"),
  followup: crmStage("followup"),
  qualifiedCol: crmStage("qualifiedCol"),
  won: crmStage("won"),
  success: crmStage("success"),
  hold: crmStage("hold"),
  outro: crmStage("outro"),
};
const moveTransition = { duration: 0.65, ease: EASE };

/** Which column the demo deal sits in at stage `s` (null = not on the board yet). */
function dealColumn(s: number): StageId | null {
  if (s >= S.won) return "won";
  if (s >= S.qualifiedCol) return "qualified";
  if (s >= S.contacted) return "contacted";
  if (s >= S.captured) return "new";
  return null;
}

/**
 * On narrow screens the board scrolls sideways; keep the active deal's column in view.
 * Only acts when the board actually overflows, and stops following for the rest of the
 * loop as soon as the visitor scrolls/touches the board themselves.
 */
function useFollowColumn(column: StageId | null, iteration: number, reduced: boolean) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const userTookOver = useRef(false);

  useEffect(() => {
    userTookOver.current = false; // each new loop may follow again
  }, [iteration]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const takeOver = () => (userTookOver.current = true);
    el.addEventListener("pointerdown", takeOver);
    el.addEventListener("touchstart", takeOver, { passive: true });
    el.addEventListener("wheel", takeOver, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", takeOver);
      el.removeEventListener("touchstart", takeOver);
      el.removeEventListener("wheel", takeOver);
    };
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || userTookOver.current || el.scrollWidth <= el.clientWidth + 1) return;
    const col = el.querySelector<HTMLElement>(`[data-stage="${column ?? "new"}"]`);
    if (!col) return;
    const left = Math.max(0, col.offsetLeft - (el.clientWidth - col.offsetWidth) / 2);
    el.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [column, reduced]);

  return scrollerRef;
}

export function CrmBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, iteration, reduced } = useDemoPlayback(ref, DURATIONS, { initialDelay: crmDemo.startDelay, amount: 0.25 });
  const s = reduced ? S.hold : stage;
  const column = dealColumn(s);
  const scrollerRef = useFollowColumn(column, iteration, reduced);
  const onBoard = column !== null;
  const open = column !== null && column !== "won";

  const counts = { ...crmDemo.counts };
  if (column) counts[column] += 1;
  const sum = crmDemo.summary;
  const summary = [
    { label: "Open pipeline", value: open ? sum.openPipeline.withDeal : sum.openPipeline.base },
    { label: "Won this month", value: column === "won" ? sum.wonThisMonth.withDeal : sum.wonThisMonth.base, highlight: column === "won" },
    { label: "Avg. deal cycle", value: sum.avgCycle },
    { label: "Follow-ups due today", value: sum.followUpsToday },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="crm" data-stage={crmDemo.stages[s].id} className="relative mt-14 lg:mt-16">
        <Panel className="overflow-hidden shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-3">
              <IconTile icon={Building} tone="gray" size="md" />
              <div>
                <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                  Property Sales Pipeline <SampleTag />
                </p>
                <p className="flex items-center gap-1 text-[11.5px] text-muted">
                  <RollingNumber value={crmDemo.openDealsBase + (open ? 1 : 0)} animateChange={open} /> open deals · Updated just now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <AvatarStack names={["Arjun Mehra", "Sofia Alvarez", "Lucas Romero", "Maya Chen"]} extra={3} />
              <span className="hidden items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[12px] font-medium text-ink-soft sm:inline-flex">
                All teams <ChevronDown className="size-3.5 text-subtle" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-semibold text-white">
                <Plus className="size-3.5" /> New deal
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px border-b border-line bg-line md:grid-cols-4">
            {summary.map((item) => (
              <div key={item.label} className="bg-white px-5 py-3">
                <dt className="text-[11.5px] text-muted">{item.label}</dt>
                <dd className={cn("relative h-6 overflow-hidden text-[16px] font-semibold tracking-tight transition-colors duration-500", item.highlight ? "text-brand-700" : "text-ink")}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={item.value} className="absolute inset-0" initial={{ y: "60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-60%", opacity: 0 }} transition={swapTransition}>
                      {item.value}
                    </motion.span>
                  </AnimatePresence>
                </dd>
              </div>
            ))}
          </dl>

          {/* layoutScroll keeps the card's move animation correct while this container scrolls */}
          <motion.div
            ref={scrollerRef}
            layoutScroll
            tabIndex={0}
            role="region"
            aria-label="Sales pipeline board — scroll sideways to see all stages"
            className="scrollbar-none relative overflow-x-auto rounded-b-2xl focus-visible:outline-offset-[-2px]"
          >
            <LayoutGroup id={`crm-${iteration}`}>
              <div className="grid min-w-[880px] grid-cols-4 gap-3 p-4 sm:p-5">
                {pipeline.map((stage) => (
                  <div key={stage.id} data-stage={stage.id} className="flex h-[548px] min-w-0 flex-col gap-2.5 overflow-hidden rounded-2xl bg-soft p-2.5">
                    <div className="flex items-center justify-between px-1 pt-0.5">
                      <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                        <span className={cn("size-2 rounded-full", stage.dot)} />
                        {stage.label}
                      </span>
                      <span className="rounded-md bg-white px-1.5 text-[11px] font-medium text-muted ring-1 ring-line">
                        <RollingNumber value={counts[stage.id]} animateChange={column === stage.id} />
                      </span>
                    </div>
                    {onBoard && column === stage.id && (
                      <motion.div
                        layoutId="crm-demo-deal"
                        // Fades in only when first captured; column moves are pure layout (transform) animations.
                        initial={stage.id === "new" ? { opacity: 0, y: -10 } : false}
                        animate={{ opacity: s === S.outro ? 0 : 1, y: 0 }}
                        transition={{ ...moveTransition, opacity: { duration: 0.4 } }}
                      >
                        <DemoDealCard s={s} />
                      </motion.div>
                    )}
                    {stage.leads.map((lead) => (
                      <motion.div key={lead.id} layout="position" transition={moveTransition}>
                        <LeadCard lead={lead} />
                      </motion.div>
                    ))}
                    <motion.span layout="position" transition={moveTransition} className="rounded-lg border border-dashed border-line py-1.5 text-center text-[11px] text-subtle">
                      + {stage.count - stage.leads.length} more
                    </motion.span>
                  </div>
                ))}
              </div>
            </LayoutGroup>
          </motion.div>
        </Panel>
        <EventCard s={s} />
      </div>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* The moving deal                                                     */
/* ------------------------------------------------------------------ */

function dealStatus(s: number) {
  const st = crmDemo.status;
  if (s >= S.success) return { key: "won", text: st.won, icon: <Trophy className="size-3" />, cls: "bg-brand-50 text-brand-700" };
  if (s >= S.followup) return { key: "followup", text: st.followup, icon: <CalendarCheck className="size-3" />, cls: "bg-amber-50 text-amber-700" };
  if (s >= S.assigned) return { key: "assigned", text: st.assigned, icon: <UserCheck className="size-3" />, cls: "bg-sky-50 text-sky-700" };
  if (s >= S.qualified) return { key: "qualified", text: st.qualified, icon: <Sparkles className="size-3" />, cls: "bg-accent-50 text-accent-600" };
  return { key: "captured", text: st.captured, icon: <WhatsAppIcon className="size-3" />, cls: "bg-brand-50 text-brand-700" };
}

function DemoDealCard({ s }: { s: number }) {
  const lead = crmDemo.lead;
  const qualified = s >= S.qualified;
  const assigned = s >= S.assigned;
  const won = s >= S.success;
  const status = dealStatus(s);
  return (
    <article
      data-lead={lead.id}
      className={cn(
        "relative rounded-xl border bg-white p-3 transition-[border-color,box-shadow] duration-500",
        won ? "border-brand-400 shadow-[0_0_0_3px_rgb(0_184_107/0.10)]" : "border-accent-400 shadow-[0_0_0_3px_rgb(108_77_255/0.10)]",
      )}
    >
      <AnimatePresence>
        {won && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={swapTransition}
            className="absolute -top-2 -right-2 inline-flex size-5 items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-white"
          >
            <Check className="size-3" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
      <div className="flex items-start gap-2.5">
        <Avatar name={lead.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[12.5px] font-semibold text-ink">{lead.name}</p>
            <WhatsAppIcon className="size-3.5 shrink-0 text-[#25d366]" />
          </div>
          <p className="truncate text-[11px] text-muted">{lead.detail}</p>
        </div>
      </div>
      {/* fixed-height rows: content swaps, the card never resizes mid-move */}
      <div className="mt-2.5 flex h-5 items-center justify-between gap-2">
        <span className="text-[13px] font-semibold tracking-tight text-ink">{lead.value}</span>
        <div className="flex items-center gap-1.5">
          <AnimatePresence initial={false}>
            {qualified && (
              <motion.span key="score" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={swapTransition}>
                <StatusBadge tone="purple" icon={Sparkles}>
                  AI · <CountUp value={qualified ? lead.score : 0} duration={1.1} />
                </StatusBadge>
              </motion.span>
            )}
            {assigned && (
              <motion.span key="agent" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={swapTransition}>
                <Avatar name={lead.agent} size="xs" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="relative mt-2.5 h-[26px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={status.key}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={swapTransition}
            className={cn("absolute inset-0 flex items-center gap-1.5 truncate rounded-lg px-2 text-[10.5px] font-medium", status.cls)}
          >
            {status.icon}
            <span className="truncate">{status.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Floating event card (md+) — reuses the reminder card slot           */
/* ------------------------------------------------------------------ */

function EventCard({ s }: { s: number }) {
  const ev = crmDemo.events;
  const event =
    s >= S.success && s < S.outro
      ? { key: "won", icon: Trophy, tone: "solidGreen" as TileTone, ...ev.won }
      : s >= S.followup && s < S.won
        ? { key: "followup", icon: CalendarCheck, tone: "amber" as TileTone, ...ev.followup }
        : s >= S.assigned && s < S.followup
          ? { key: "assigned", icon: UserCheck, tone: "blue" as TileTone, ...ev.assigned }
          : s >= S.captured && s < S.assigned
            ? { key: "captured", icon: WhatsAppIcon, tone: "solidGreen" as TileTone, ...ev.captured }
            : { key: "reminder", icon: Bell, tone: "purple" as TileTone, title: "Reminder for Priya", meta: "Send viewing confirmation · 4:00 PM" };
  return (
    <Panel float data-crm-float={event.key} className="absolute -bottom-6 left-6 hidden w-[264px] overflow-hidden p-3 md:block lg:-left-6">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={event.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={swapTransition} className="flex items-center gap-3">
          <IconTile icon={event.icon} tone={event.tone} size="md" />
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-ink">{event.title}</p>
            <p className="truncate text-[11.5px] text-muted">{event.meta}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}
