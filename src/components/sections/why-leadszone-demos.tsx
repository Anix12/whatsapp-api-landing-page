"use client";

import { useRef } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { Bot, CalendarClock, ChartNoAxesColumn, Check, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoPlayback } from "@/lib/use-sequence";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge, type Tone } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { ChannelIcon } from "@/components/product/channel-icon";
import { ChatBubble, ChatSurface } from "@/components/product/chat";
import { EASE, RollingNumber, TypingIndicator, enterTransition, floatTransition, swapTransition } from "@/components/product/motion-primitives";
import type { Channel } from "@/data/conversations";
import { leadInboxDemo, leadInboxStage, pipelineDemo, pipelineStage, respondDemo, respondStage } from "@/data/why-demos";

// Stable references so the sequencer effect never restarts on re-render.
const LEAD_DURATIONS = leadInboxDemo.stages.map((s) => s.duration);
const RESPOND_DURATIONS = respondDemo.stages.map((s) => s.duration);
const PIPELINE_DURATIONS = pipelineDemo.stages.map((s) => s.duration);

const moveTransition = { duration: 0.6, ease: EASE };

/* ================================================================== */
/* Card 1 — Never Miss a Lead                                          */
/* ================================================================== */

const L = {
  incoming: leadInboxStage("incoming"),
  unread: leadInboxStage("unread"),
  tagged: leadInboxStage("tagged"),
  captured: leadInboxStage("captured"),
  settled: leadInboxStage("settled"),
};

export function LeadInboxDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, reduced } = useDemoPlayback(ref, LEAD_DURATIONS, { initialDelay: leadInboxDemo.startDelay });
  const s = reduced ? L.settled : stage;
  const hasNew = s >= L.incoming;
  const arriving = s >= L.incoming && s < L.settled;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="lead-inbox" data-stage={leadInboxDemo.stages[s].id} className="flex h-full gap-3 p-4">
        <div className="flex flex-col gap-2 pt-12">
          {(["whatsapp", "instagram", "facebook", "website"] as const).map((c) => (
            <ChannelIcon
              key={c}
              channel={c}
              size="sm"
              className={cn(
                "ring-offset-2 ring-offset-soft transition-shadow duration-300",
                c === "whatsapp" && s >= L.incoming && s < L.captured ? "ring-2 ring-brand-300" : "ring-0",
              )}
            />
          ))}
        </div>
        <div className="relative min-w-0 flex-1 rounded-2xl border border-line bg-white p-3 shadow-card">
          <div className="mb-1.5 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
              <WhatsAppIcon className="size-4 text-[#25d366]" /> Leads
            </p>
            <StatusBadge tone="green">
              <RollingNumber value={s >= L.unread ? leadInboxDemo.unread.after : leadInboxDemo.unread.before} animateChange={s >= L.unread} /> new
            </StatusBadge>
          </div>
          <ul className="flex flex-col">
            <AnimatePresence initial={false} mode="popLayout">
              {hasNew && (
                <motion.li
                  key={leadInboxDemo.incoming.id}
                  layout="position"
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={enterTransition}
                >
                  <LeadRow
                    {...leadInboxDemo.incoming}
                    highlight={arriving}
                    unread={1}
                    tag={s >= L.tagged ? { label: "New Lead", tone: "green" } : null}
                  />
                </motion.li>
              )}
              {leadInboxDemo.existing.map((c) => (
                <motion.li key={c.id} layout="position" transition={enterTransition}>
                  <LeadRow {...c} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <AnimatePresence>
            {s === L.captured && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4, transition: { duration: 0.25 } }}
                transition={floatTransition}
                className="absolute inset-x-3 bottom-2.5 flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2 shadow-float"
              >
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-400 text-white">
                  <Zap className="size-3.5" fill="currentColor" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-ink">Lead automatically captured</span>
                <Check className="size-3.5 shrink-0 text-brand-700" strokeWidth={2.75} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}

function LeadRow({
  name,
  preview,
  time,
  channel,
  tag,
  unread,
  highlight,
}: {
  name: string;
  preview: string;
  time: string;
  channel: Channel;
  tag?: { label: string; tone: Tone } | null;
  unread?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "-mx-1.5 flex gap-2.5 rounded-lg border-b border-line-soft px-1.5 py-1.5 transition-colors duration-700",
        highlight ? "bg-brand-50/80" : "bg-transparent",
      )}
    >
      <span className="relative h-fit">
        <Avatar name={name} size="sm" />
        <ChannelIcon channel={channel} size="xs" className="absolute -right-1 -bottom-1 size-3.5 ring-2 ring-white [&_svg]:size-2" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[12px] font-semibold text-ink">{name}</p>
          <span className={cn("text-[10px]", unread ? "font-semibold text-brand-700" : "text-subtle")}>{time}</span>
        </div>
        <p className="truncate text-[11px] text-muted">{preview}</p>
        {/* fixed-height tag line so the row never grows when a tag appears */}
        <div className="mt-1 flex h-[18px] items-center justify-between">
          <AnimatePresence initial={false}>
            {tag && (
              <motion.span key={tag.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={swapTransition}>
                <StatusBadge tone={tag.tone} className="text-[10px]">
                  {tag.label}
                </StatusBadge>
              </motion.span>
            )}
          </AnimatePresence>
          {unread ? (
            <span className="inline-flex size-4 items-center justify-center rounded-full bg-brand-700 text-[9px] font-semibold text-white">{unread}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Card 2 — Respond Faster                                             */
/* ================================================================== */

const R = {
  message: respondStage("message"),
  typing: respondStage("typing"),
  reply: respondStage("reply"),
  options: respondStage("options"),
  status: respondStage("status"),
  followup: respondStage("followup"),
  outro: respondStage("outro"),
};

export function RespondDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, iteration, reduced } = useDemoPlayback(ref, RESPOND_DURATIONS, { initialDelay: respondDemo.startDelay });
  const s = reduced ? R.followup : stage;

  const items: { key: string; align: "start" | "end" | "center"; node: React.ReactNode }[] = [];
  if (s >= R.message)
    items.push({ key: "message", align: "start", node: <ChatBubble compact message={{ id: "rd-msg", from: "customer", ...respondDemo.message }} /> });
  if (s === R.typing) items.push({ key: "typing", align: "end", node: <TypingIndicator label="AI reply" /> });
  if (s >= R.reply) items.push({ key: "reply", align: "end", node: <ChatBubble compact message={{ id: "rd-reply", from: "agent", ...respondDemo.reply }} /> });
  if (s >= R.options) items.push({ key: "options", align: "end", node: <InlineQuickReplies options={respondDemo.options} /> });
  if (s >= R.status)
    items.push({
      key: "status",
      align: "center",
      node: (
        // Both statuses share one row so the opening message stays in view.
        <div className="flex flex-wrap items-center justify-center gap-1">
          <SystemChip tone="purple" icon={<Sparkles className="size-3" />}>{respondDemo.status}</SystemChip>
          <AnimatePresence initial={false}>
            {s >= R.followup && (
              <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={enterTransition}>
                <SystemChip tone="green" icon={<CalendarClock className="size-3" />}>{respondDemo.followUp}</SystemChip>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ),
    });

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="respond" data-stage={respondDemo.stages[s].id} className="flex h-full flex-col p-4">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-line">
          <div className="flex items-center gap-2.5 border-b border-line bg-white px-3 py-1.5">
            <Avatar name={respondDemo.customer.name} size="sm" whatsapp />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-ink">{respondDemo.customer.name}</p>
              <p className="text-[10px] text-muted">online</p>
            </div>
            <StatusBadge tone="purple" icon={Bot}>Auto-reply on</StatusBadge>
          </div>
          <ChatSurface className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 py-2 [mask-image:linear-gradient(to_bottom,transparent,black_10px)]">
            <motion.div
              key={reduced ? "static" : `loop-${iteration}`}
              className="flex flex-col gap-2"
              initial={false}
              animate={{ opacity: s === R.outro ? 0 : 1 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.key}
                    layout="position"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={enterTransition}
                    className={cn(
                      "flex flex-col",
                      item.align === "start" && "items-start",
                      item.align === "end" && "items-end",
                      item.align === "center" && "items-center",
                    )}
                  >
                    {item.node}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </ChatSurface>
        </div>
      </div>
    </MotionConfig>
  );
}

/** Two quick-reply buttons side by side — keeps the card's conversation compact. */
function InlineQuickReplies({ options }: { options: readonly string[] }) {
  return (
    <div className="flex w-[85%] max-w-[280px] gap-1">
      {options.map((o) => (
        <span key={o} className="flex-1 rounded-xl bg-white py-1.5 text-center text-[11.5px] font-medium whitespace-nowrap text-sky-700 shadow-[0_1px_1px_rgb(16_24_40/0.06)]">
          {o}
        </span>
      ))}
    </div>
  );
}

function SystemChip({ tone, icon, children }: { tone: "purple" | "green"; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap shadow-[0_1px_1px_rgb(16_24_40/0.06)] ring-1",
        tone === "purple" ? "text-accent-600 ring-accent-100" : "text-brand-700 ring-brand-100",
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/* ================================================================== */
/* Card 3 — Close More Deals                                           */
/* ================================================================== */

const P = {
  newDeal: pipelineStage("new"),
  chat: pipelineStage("chat"),
  contacted: pipelineStage("contacted"),
  ai: pipelineStage("ai"),
  qualified: pipelineStage("qualified"),
  agent: pipelineStage("agent"),
  won: pipelineStage("won"),
  success: pipelineStage("success"),
  counter: pipelineStage("counter"),
  outro: pipelineStage("outro"),
};

export function PipelineDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, iteration, reduced } = useDemoPlayback(ref, PIPELINE_DURATIONS, { initialDelay: pipelineDemo.startDelay });
  const s = reduced ? P.counter : stage;

  const showDeal = s >= P.newDeal;
  const dealColumn = s >= P.won ? 3 : s >= P.qualified ? 2 : s >= P.contacted ? 1 : 0;
  const wonCount = s >= P.counter ? pipelineDemo.won.after : pipelineDemo.won.before;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="pipeline" data-stage={pipelineDemo.stages[s].id} className="flex h-full flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
            <ChartNoAxesColumn className="size-4 text-brand-700" /> Sales pipeline
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700">
            <Bot className="size-3.5" /> Auto-updated
          </span>
        </div>
        <LayoutGroup id={`pipeline-${iteration}`}>
          <div className="grid flex-1 grid-cols-4 gap-1.5">
            {pipelineDemo.columns.map((col, i) => (
              <div key={col.label} data-stage-column={i} className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-white p-1.5 ring-1 ring-line">
                <div className="px-0.5">
                  <span className="flex items-center gap-1 truncate text-[10.5px] font-semibold text-ink">
                    <span className={cn("size-1.5 shrink-0 rounded-full", col.dot)} />
                    {col.label}
                  </span>
                  <span className="flex items-center gap-[3px] text-[10px] text-subtle">
                    {i === 3 ? <RollingNumber value={wonCount} animateChange={s >= P.counter} /> : col.count} leads
                  </span>
                </div>
                {showDeal && dealColumn === i && (
                  <motion.div
                    layoutId="pipeline-deal"
                    // Fade in only on first appearance; column moves are pure layout (transform) animations.
                    initial={i === 0 ? { opacity: 0, y: 6 } : false}
                    animate={{ opacity: s === P.outro ? 0 : 1, y: 0 }}
                    transition={{ ...moveTransition, opacity: { duration: 0.4 } }}
                  >
                    <DealCard s={s} />
                  </motion.div>
                )}
                <motion.div layout="position" transition={moveTransition} className="rounded-lg border border-line-soft bg-soft/60 p-1.5">
                  <Avatar name={col.lead.name} size="xs" />
                  <p className="mt-1 truncate text-[10.5px] font-semibold text-ink">{col.lead.name.split(" ")[0]}</p>
                  <p className="truncate text-[9.5px] text-muted">{col.lead.note}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </LayoutGroup>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2">
          <span className="text-[11.5px] font-medium text-brand-700">Won this month</span>
          <span className="text-[13px] font-semibold text-brand-700">
            <RollingNumber value={wonCount} animateChange={s >= P.counter} /> deals
          </span>
        </div>
      </div>
    </MotionConfig>
  );
}

function DealCard({ s }: { s: number }) {
  const won = s >= P.success;
  const status =
    s >= P.success
      ? { key: "won", icon: <Check className="size-2.5" strokeWidth={3} />, text: "Won", className: "text-brand-700" }
      : s >= P.agent
        ? { key: "agent", icon: <Avatar name={pipelineDemo.deal.agent} size="xs" className="[&>span]:size-3.5 [&>span]:text-[7px]" />, text: "Arjun", className: "text-ink-soft" }
        : s >= P.ai
          ? { key: "ai", icon: <Sparkles className="size-2.5" />, text: "AI: Hot", className: "text-accent-600" }
          : s >= P.chat
            ? { key: "chat", icon: <WhatsAppIcon className="size-2.5 text-[#25d366]" />, text: "Chatting", className: "text-ink-soft" }
            : null;
  return (
    <div
      className={cn(
        "relative rounded-lg border bg-white p-1.5 shadow-card transition-colors duration-500",
        won ? "border-brand-400" : "border-accent-200",
      )}
    >
      <AnimatePresence>
        {won && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={swapTransition}
            className="absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-white"
          >
            <Check className="size-2.5" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
      <Avatar name={pipelineDemo.deal.name} size="xs" />
      <p className="mt-1 truncate text-[10.5px] font-semibold text-ink">{pipelineDemo.deal.name.split(" ")[0]}</p>
      {/* fixed-height status line: swaps content without resizing the card */}
      <div className="relative h-3.5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {status ? (
            <motion.span
              key={status.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={swapTransition}
              className={cn("absolute inset-0 flex items-center gap-1 truncate text-[9.5px] font-medium", status.className)}
            >
              {status.icon}
              {status.text}
            </motion.span>
          ) : (
            <motion.span key="note" exit={{ opacity: 0 }} className="absolute inset-0 truncate text-[9.5px] text-muted">
              {pipelineDemo.deal.note}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
