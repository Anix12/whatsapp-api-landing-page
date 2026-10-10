"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRightLeft, Bot, Check, CircleCheck, Eye, Lock, RefreshCw, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoPlayback } from "@/lib/use-sequence";
import { Avatar } from "@/components/ui/avatar";
import { SampleTag, StatusBadge } from "@/components/ui/badge";
import { Panel } from "@/components/product/surface";
import { EASE, swapTransition } from "@/components/product/motion-primitives";
import { supportQueue } from "@/data/teams";
import { supportDemo, supportStage } from "@/data/teams-demo";

const DURATIONS = supportDemo.stages.map((s) => s.duration);
const S = {
  incoming: supportStage("incoming"),
  assign: supportStage("assign"),
  note: supportStage("note"),
  sync: supportStage("sync"),
  resolved: supportStage("resolved"),
  hold: supportStage("hold"),
  outro: supportStage("outro"),
};

/** Cross-fade content in place (fixed slot, no layout shift). */
function Swap({ k, className, children }: { k: string; className?: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={k} className={cn("inline-flex", className)} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={swapTransition}>
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

export function SupportDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, reduced } = useDemoPlayback(ref, DURATIONS, { initialDelay: supportDemo.startDelay, amount: 0.3 });
  const s = reduced ? S.hold : stage;
  const live = s !== S.outro;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="support" data-stage={supportDemo.stages[s].id} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <SupportQueue s={s} live={live} />
        <div className="flex flex-col gap-3">
          <SuggestedReply s={s} live={live} />
          <HandoffCard s={s} live={live} />
        </div>
      </div>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* Queue (customer conversations)                                      */
/* ------------------------------------------------------------------ */

function SupportQueue({ s, live }: { s: number; live: boolean }) {
  const syncing = s === S.sync;
  const synced = s > S.sync && live;
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <p className="text-[13px] font-semibold whitespace-nowrap text-ink">Support queue</p>
        <span className="flex h-5 items-center gap-2 whitespace-nowrap">
          <AnimatePresence initial={false}>
            {(syncing || synced) && (
              <motion.span
                key="crm"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={swapTransition}
                className="hidden items-center gap-1 text-[10.5px] font-medium whitespace-nowrap sm:inline-flex"
              >
                {syncing ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, ease: "easeInOut" }} className="inline-flex text-accent-500">
                      <RefreshCw className="size-3" />
                    </motion.span>
                    <span className="text-accent-600">{supportDemo.crm.syncing}</span>
                  </>
                ) : (
                  <>
                    <CircleCheck className="size-3 text-brand-700" />
                    <span className="text-brand-700">CRM synced</span>
                  </>
                )}
              </motion.span>
            )}
          </AnimatePresence>
          <SampleTag />
        </span>
      </div>
      <ul>
        {supportQueue.map((q) => {
          const active = q.name === supportDemo.activeName && s >= S.incoming && live;
          const isLive = q.name === supportDemo.activeName;
          const status = !isLive
            ? { k: "static", tone: q.tone, icon: q.handledBy === "ai" ? Bot : UserRound, label: q.status }
            : s >= S.resolved
              ? { k: "resolved", tone: "green" as const, icon: Check, label: "Resolved" }
              : s >= S.assign
                ? { k: "assigned", tone: "blue" as const, icon: UserRound, label: `Assigned · ${supportDemo.agent.firstName}` }
                : { k: "escalated", tone: q.tone, icon: UserRound, label: q.status };
          return (
            <li
              key={q.name}
              data-conversation={isLive ? "live" : undefined}
              className={cn("relative flex items-start gap-2.5 border-b border-line-soft px-4 py-3 transition-colors duration-500 last:border-0", active ? "bg-brand-50/60" : "bg-white")}
            >
              <motion.span className="absolute inset-y-0 left-0 w-0.5 origin-top bg-brand-500" initial={false} animate={{ scaleY: active ? 1 : 0 }} transition={swapTransition} />
              <Avatar name={q.name} size="sm" whatsapp />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[12.5px] font-semibold text-ink">{q.name}</p>
                  <span className="flex items-center gap-1.5">
                    {isLive && (
                      <motion.span
                        className="inline-flex size-4 items-center justify-center rounded-full bg-brand-700 text-[9px] font-semibold text-white"
                        initial={false}
                        animate={{ opacity: s === S.incoming ? 1 : 0, scale: s === S.incoming ? 1 : 0.6 }}
                        transition={swapTransition}
                        aria-hidden={s !== S.incoming}
                      >
                        1
                      </motion.span>
                    )}
                    <span className="text-[10.5px] text-subtle">{isLive && s >= S.incoming && s < S.resolved && live ? "now" : q.sla}</span>
                  </span>
                </div>
                <p className="truncate text-[11.5px] text-muted">{q.issue}</p>
                <div className="mt-1.5 flex h-[18px] items-center gap-1.5">
                  <Swap k={status.k}>
                    <StatusBadge tone={status.tone} icon={status.icon}>
                      {status.label}
                    </StatusBadge>
                  </Swap>
                  {isLive && s >= S.assign && live && (
                    <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={swapTransition}>
                      <Avatar name={supportDemo.agent.name} size="xs" />
                    </motion.span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Customer-facing: suggested reply                                    */
/* ------------------------------------------------------------------ */

function SuggestedReply({ s, live }: { s: number; live: boolean }) {
  const sent = s >= S.resolved && live;
  return (
    <Panel className="border-accent-200 bg-accent-50/60 p-4">
      <p className="flex items-center justify-between gap-2 text-[12px] font-semibold text-accent-600">
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3.5" /> Suggested reply
        </span>
        <span className="text-[10.5px] font-medium text-muted">Customer-facing</span>
      </p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{supportDemo.reply}</p>
      <div className="mt-3 flex h-[26px] gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-white transition-colors duration-500",
            sent ? "bg-brand-700" : "bg-accent-500",
          )}
        >
          <Swap k={sent ? "sent" : "use"}>
            {sent ? (
              <span className="inline-flex items-center gap-1">
                <Check className="size-3" strokeWidth={3} /> Sent by {supportDemo.agent.firstName}
              </span>
            ) : (
              "Use reply"
            )}
          </Swap>
        </span>
        <span className={cn("rounded-lg border border-accent-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-accent-600 transition-opacity duration-300", sent && "opacity-0")}>Edit</span>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Internal: handoff + team note (visually separate from the chat)     */
/* ------------------------------------------------------------------ */

function HandoffCard({ s, live }: { s: number; live: boolean }) {
  const assigned = s >= S.assign && live;
  const resolved = s >= S.resolved && live;
  const footer = resolved ? "resolved" : s >= S.note && live ? "note" : "context";
  return (
    <Panel className="p-4">
      <p className="flex items-center justify-between gap-1.5 text-[12px] font-semibold text-ink">
        <span className="flex items-center gap-1.5">
          <ArrowRightLeft className="size-3.5 text-brand-700" /> Handoff
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-muted">
          <Lock className="size-3" /> Internal
        </span>
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-50 px-2 py-1 text-[11.5px] font-medium text-accent-600">
          <Bot className="size-3.5" /> LeadsZone AI
        </span>
        <span className="relative h-px flex-1">
          <span className="absolute inset-0 border-t border-dashed border-[#d0d5dd]" />
          <motion.span className="absolute inset-0 origin-left bg-brand-400" initial={false} animate={{ scaleX: assigned ? 1 : 0 }} transition={{ duration: 0.7, ease: EASE }} />
          {s === S.assign && (
            <motion.span
              aria-hidden
              className="absolute top-1/2 -mt-[3px] size-1.5 rounded-full bg-brand-500 shadow-[0_0_0_3px_rgb(0_184_107/0.18)]"
              initial={{ left: "0%", opacity: 1 }}
              animate={{ left: "100%", opacity: [1, 1, 0] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2 py-1 text-[11.5px] font-medium text-brand-700 ring-2 transition-shadow duration-500",
            assigned ? "ring-brand-200" : "ring-transparent",
          )}
        >
          <Avatar name={supportDemo.agent.name} size="xs" /> {supportDemo.agent.firstName}
        </span>
      </div>
      {/* fixed-height footer: context line → internal note → resolved */}
      <div className="relative mt-2.5 h-[42px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={footer} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={swapTransition} className="absolute inset-0">
            {footer === "note" ? (
              <div className="flex h-full items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5">
                <Avatar name={supportDemo.teammate.name} size="xs" className="mt-px" />
                <p className="min-w-0 text-[10.5px] leading-snug text-amber-800">
                  <span className="font-semibold">{supportDemo.teammate.firstName} added a note · </span>
                  {supportDemo.note}
                </p>
              </div>
            ) : footer === "resolved" ? (
              <p className="flex h-full items-center gap-1.5 text-[11.5px] font-medium text-brand-700">
                <span className="inline-flex size-4 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                Resolved by {supportDemo.agent.firstName} · {supportDemo.crm.synced}
              </p>
            ) : (
              <p className="flex h-full items-center gap-1.5 text-[11px] text-muted">
                <Eye className="size-3.5 shrink-0" /> Full chat history and tags travel with the conversation.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Panel>
  );
}
