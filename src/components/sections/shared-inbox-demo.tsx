"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRightLeft, ChartColumn, Check, CheckCheck, Funnel, Inbox, Search, Settings, Sparkles, Tag, UserRound, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoPlayback } from "@/lib/use-sequence";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Panel } from "@/components/product/surface";
import { ChannelIcon } from "@/components/product/channel-icon";
import { ChatBubble, ChatComposer, ChatSurface } from "@/components/product/chat";
import { EASE, TypingIndicator, enterTransition, swapTransition } from "@/components/product/motion-primitives";
import { conversations } from "@/data/conversations";
import { inboxDemo, inboxStage } from "@/data/inbox-demo";

const DURATIONS = inboxDemo.stages.map((s) => s.duration);
const S = {
  arrive: inboxStage("arrive"),
  select: inboxStage("select"),
  typing: inboxStage("typing"),
  reply: inboxStage("reply"),
  customer: inboxStage("customer"),
  intent: inboxStage("intent"),
  assign: inboxStage("assign"),
  agentTyping: inboxStage("agentTyping"),
  agent: inboxStage("agent"),
  done: inboxStage("done"),
  outro: inboxStage("outro"),
};
// Everyone except Priya — her conversation is the one that arrives live.
const otherConversations = conversations.filter((c) => c.name !== inboxDemo.customer.name);

export function InboxDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, iteration, reduced } = useDemoPlayback(ref, DURATIONS, { initialDelay: inboxDemo.startDelay, amount: 0.3 });
  const s = reduced ? S.done : stage;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="inbox" data-stage={inboxDemo.stages[s].id} className="relative">
        <Panel className="flex h-[600px] overflow-hidden shadow-panel">
          <InboxRail />
          <ConversationList s={s} />
          <ConversationPane s={s} listKey={reduced ? "static" : `loop-${iteration}`} />
        </Panel>
      </div>
    </MotionConfig>
  );
}

function InboxRail() {
  const items = [Inbox, Users, ChartColumn, Settings];
  return (
    <div className="hidden w-14 shrink-0 flex-col items-center gap-2 bg-brand-900 py-4 sm:flex">
      <span className="mb-2 inline-flex size-9 items-center justify-center rounded-xl bg-white/10 text-white">
        <ChannelIcon channel="whatsapp" size="sm" className="bg-transparent" />
      </span>
      {items.map((Icon, i) => (
        <span key={i} className={cn("inline-flex size-9 items-center justify-center rounded-xl", i === 0 ? "bg-white text-brand-900" : "text-white/60")}>
          <Icon className="size-[18px]" />
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Conversation list                                                   */
/* ------------------------------------------------------------------ */

function ConversationList({ s }: { s: number }) {
  const filters = [
    { label: "All", count: 24, active: true },
    { label: "Unassigned", count: 6 },
    { label: "Mine", count: 8 },
  ];
  return (
    <div className="hidden w-[244px] shrink-0 flex-col border-r border-line md:flex">
      <div className="space-y-3 border-b border-line-soft p-3.5">
        <p className="text-[14px] font-semibold text-ink">
          All Conversations <span className="ml-1 rounded-md bg-line-soft px-1.5 text-[11px] text-muted">24</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-line bg-soft px-2.5 text-[11.5px] text-subtle">
            <Search className="size-3.5" /> Search name, tag…
          </div>
          <span className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted">
            <Funnel className="size-3.5" />
          </span>
        </div>
        <div className="flex gap-1">
          {filters.map((f) => (
            <span key={f.label} className={cn("rounded-md px-2 py-1 text-[11px] font-medium", f.active ? "bg-brand-50 text-brand-700" : "text-muted")}>
              {f.label} {f.count}
            </span>
          ))}
        </div>
      </div>
      <ul className="flex-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {s >= S.arrive && (
            <motion.li
              key="live"
              layout="position"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={enterTransition}
            >
              <LiveConversationRow s={s} />
            </motion.li>
          )}
          {otherConversations.map((c) => (
            <motion.li key={c.id} layout="position" transition={enterTransition} data-conversation={c.id} className="flex gap-2.5 border-b border-line-soft px-3.5 py-3">
              <span className="relative h-fit">
                <Avatar name={c.name} size="md" />
                <ChannelIcon channel={c.channel} size="xs" className="absolute -right-1 -bottom-1 ring-2 ring-white" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[12.5px] font-semibold text-ink">{c.name}</p>
                  <span className="text-[10.5px] text-subtle">{c.time}</span>
                </div>
                <p className="truncate text-[11.5px] text-muted">{c.preview}</p>
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  {c.tags[0] && (
                    <StatusBadge tone={c.tags[0].tone} className="text-[10px]">
                      {c.tags[0].label}
                    </StatusBadge>
                  )}
                  {c.unread && (
                    <span className="inline-flex size-4 items-center justify-center rounded-full bg-brand-700 text-[9px] font-semibold text-white">{c.unread}</span>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function LiveConversationRow({ s }: { s: number }) {
  const selected = s >= S.select;
  const assigned = s >= S.assign;
  return (
    <div
      data-conversation="live"
      className={cn(
        "relative flex gap-2.5 border-b border-line-soft px-3.5 py-3 transition-colors duration-500",
        selected ? "bg-brand-50/60" : "bg-brand-50",
      )}
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-0.5 origin-top bg-brand-500"
        initial={false}
        animate={{ scaleY: selected ? 1 : 0 }}
        transition={swapTransition}
      />
      <span className="relative h-fit">
        <Avatar name={inboxDemo.customer.name} size="md" />
        <ChannelIcon channel="whatsapp" size="xs" className="absolute -right-1 -bottom-1 ring-2 ring-white" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[12.5px] font-semibold text-ink">{inboxDemo.customer.name}</p>
          <span className={cn("text-[10.5px]", selected ? "text-subtle" : "font-semibold text-brand-700")}>now</span>
        </div>
        <p className="truncate text-[11.5px] text-muted">{inboxDemo.listPreview}</p>
        <div className="mt-1.5 flex h-[18px] items-center justify-between gap-1">
          <Swap k={assigned ? "sales" : "new"}>
            {assigned ? (
              <StatusBadge tone="purple" className="text-[10px]">Sales Enquiry</StatusBadge>
            ) : (
              <StatusBadge tone="green" className="text-[10px]">New Lead</StatusBadge>
            )}
          </Swap>
          <Swap k={s >= S.done ? "assigned" : selected ? "none" : "unread"}>
            {s >= S.done ? (
              <span className="flex items-center gap-1 text-[10px] font-medium text-brand-700">
                <Avatar name={inboxDemo.agent.name} size="xs" className="[&>span]:size-4 [&>span]:text-[7px]" />
                {inboxDemo.agent.firstName}
              </span>
            ) : !selected ? (
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-brand-700 text-[9px] font-semibold text-white">1</span>
            ) : null}
          </Swap>
        </div>
      </div>
    </div>
  );
}

/** Cross-fades content when `k` changes, without affecting layout. */
function Swap({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={k} className="inline-flex" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={swapTransition}>
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Conversation pane                                                   */
/* ------------------------------------------------------------------ */

type Item = { key: string; align: "start" | "end" | "center"; node: React.ReactNode };

function buildThread(s: number): Item[] {
  const m = inboxDemo.messages;
  const items: Item[] = [];
  if (s >= S.select) items.push({ key: "first", align: "start", node: <ChatBubble message={{ id: "ib-first", from: "customer", ...m.first }} /> });
  if (s === S.typing) items.push({ key: "typing", align: "end", node: <TypingIndicator label="LeadsZone AI" /> });
  if (s >= S.reply) {
    items.push({ key: "ai", align: "end", node: <ChatBubble message={{ id: "ib-ai", from: "bot", ...m.ai }} /> });
    items.push({
      key: "options",
      align: "end",
      node: (
        <div className="flex w-[85%] max-w-[300px] flex-col items-end gap-1">
          <div className="flex w-full gap-1">
            {inboxDemo.quickReplies.map((o) => (
              <span key={o} className="flex-1 rounded-xl bg-white py-1.5 text-center text-[12px] font-medium whitespace-nowrap text-sky-700 shadow-[0_1px_1px_rgb(16_24_40/0.06)]">
                {o}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 pr-1 text-[10px] font-medium text-accent-500">
            <CheckCheck className="size-3" /> {inboxDemo.aiStatus}
          </span>
        </div>
      ),
    });
  }
  if (s >= S.customer) items.push({ key: "customer", align: "start", node: <ChatBubble message={{ id: "ib-customer", from: "customer", ...m.customer }} /> });
  if (s >= S.intent)
    items.push({
      key: "status",
      align: "center",
      node: (
        <div className="flex flex-wrap items-center justify-center gap-1">
          <SystemChip tone="purple" icon={<Sparkles className="size-3" />}>{inboxDemo.intent}</SystemChip>
          <AnimatePresence initial={false}>
            {s >= S.assign && (
              <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={enterTransition}>
                <SystemChip tone="green" icon={<ArrowRightLeft className="size-3" />}>{inboxDemo.handoff}</SystemChip>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ),
    });
  if (s === S.agentTyping) items.push({ key: "agentTyping", align: "end", node: <TypingIndicator human label={inboxDemo.agent.firstName} /> });
  if (s >= S.agent)
    items.push({
      key: "agent",
      align: "end",
      node: (
        <div className="flex flex-col items-end gap-1.5">
          <span className="inline-flex items-center gap-1 pr-1 text-[10px] font-medium text-brand-700">
            <UserRound className="size-3" /> {inboxDemo.agent.firstName} · {inboxDemo.agent.role}
          </span>
          <ChatBubble message={{ id: "ib-agent", from: "agent", ...m.agent }} />
        </div>
      ),
    });
  return items;
}

function ConversationPane({ s, listKey }: { s: number; listKey: string }) {
  const selected = s >= S.select;
  const assigned = s >= S.assign;
  const items = buildThread(s);
  const suggestion = s >= S.agent ? inboxDemo.suggestions.after : s >= S.intent ? inboxDemo.suggestions.handoff : inboxDemo.suggestions.early;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Header + context stay mounted; they only fade, so the layout never moves. */}
      <motion.div initial={false} animate={{ opacity: selected ? 1 : 0.35 }} transition={swapTransition}>
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Avatar name={inboxDemo.customer.name} size="md" whatsapp />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-ink">{inboxDemo.customer.name}</p>
            <p className="truncate text-[11px] text-muted">{inboxDemo.customer.phone}</p>
          </div>
          <AssistToggle mode={assigned ? "human" : "ai"} />
        </div>
        <div data-inbox-context className="flex items-center justify-between gap-2 border-b border-line-soft bg-white px-4 py-2">
          <div className="flex min-w-0 items-center gap-1 overflow-hidden">
            <Tag className="mr-0.5 size-3.5 shrink-0 text-subtle" />
            <Swap k={assigned ? "sales" : "new"}>
              {assigned ? <StatusBadge tone="purple">Sales Enquiry</StatusBadge> : <StatusBadge tone="green">New Lead</StatusBadge>}
            </Swap>
          </div>
          <Swap k={s >= S.done ? "done" : assigned ? "assigned" : "open"}>
            {assigned ? (
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-ink-soft">
                <Avatar name={inboxDemo.agent.name} size="xs" />
                Assigned · {inboxDemo.agent.firstName}
                {s >= S.done && (
                  <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-brand-500 text-white">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                )}
              </span>
            ) : (
              <span className="text-[11px] text-subtle">Unassigned</span>
            )}
          </Swap>
        </div>
      </motion.div>

      <ChatSurface className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-4 py-3 [mask-image:linear-gradient(to_bottom,transparent,black_72px)]">
        <motion.div
          key={listKey}
          className="flex flex-col gap-2"
          initial={false}
          animate={{ opacity: s === S.outro ? 0 : 1 }}
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

      <div className="border-t border-line bg-white pt-2.5">
        <div data-inbox-suggestion className="mx-3 mb-2 flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50/70 px-2.5 py-1.5">
          <Sparkles className="size-3.5 shrink-0 text-accent-500" />
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={suggestion}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={swapTransition}
                className="truncate text-[11.5px] text-ink-soft"
              >
                <span className="font-semibold text-accent-600">Suggested:</span> {suggestion}
              </motion.p>
            </AnimatePresence>
          </div>
          <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[10.5px] font-semibold text-accent-600 ring-1 ring-accent-200">Insert</span>
        </div>
        <ChatComposer className="px-3" />
      </div>
    </div>
  );
}

/** AI / Human reply-mode switch; the active pill slides between options. */
function AssistToggle({ mode }: { mode: "ai" | "human" }) {
  const options = [
    { id: "ai", label: "AI", icon: Sparkles, color: "text-accent-500" },
    { id: "human", label: "Human", icon: UserRound, color: "text-brand-700" },
  ] as const;
  return (
    <div role="group" aria-label="Reply mode" className="inline-flex rounded-lg bg-line-soft p-0.5 text-[11px] font-semibold">
      {options.map((o) => {
        const active = mode === o.id;
        return (
          <span key={o.id} className={cn("relative inline-flex items-center gap-1 px-2 py-1 transition-colors duration-300", active ? o.color : "text-muted")}>
            {active && (
              <motion.span layoutId="inbox-mode-pill" transition={swapTransition} className="absolute inset-0 rounded-md bg-white shadow-[0_1px_2px_rgb(16_24_40/0.08)]" />
            )}
            <o.icon className="relative size-3" />
            <span className="relative">{o.label}</span>
          </span>
        );
      })}
    </div>
  );
}

function SystemChip({ tone, icon, children }: { tone: "purple" | "green"; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10.5px] font-medium whitespace-nowrap shadow-[0_1px_1px_rgb(16_24_40/0.06)] ring-1",
        tone === "purple" ? "text-accent-600 ring-accent-100" : "text-brand-700 ring-brand-100",
      )}
    >
      {icon}
      {children}
    </span>
  );
}
