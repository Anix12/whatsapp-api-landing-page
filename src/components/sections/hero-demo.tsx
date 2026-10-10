"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import { Bot, Check, Database, Megaphone, RotateCcw, Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSequence, usePageVisible, usePrefersReducedMotion } from "@/lib/use-sequence";
import { EASE, RollingNumber, TypingIndicator, enterTransition, floatTransition, swapTransition } from "@/components/product/motion-primitives";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { SampleTag, StatusBadge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Panel, IconTile } from "@/components/product/surface";
import { PhoneMockup } from "@/components/product/phone-mockup";
import { ChatBubble, ChatComposer, ChatHeader, ChatSurface } from "@/components/product/chat";
import { KpiCard } from "@/components/product/metric-card";
import {
  HERO_FINAL_STAGE,
  HERO_STAGES,
  heroCustomer,
  heroKpis,
  heroScript,
  heroWorkflowSteps,
  stageIndex,
  type StepState,
} from "@/data/hero-demo";

/* ------------------------------------------------------------------ */
/* Motion tokens                                                       */
/* ------------------------------------------------------------------ */

const enter = enterTransition;
const floatIn = floatTransition;
const swap = swapTransition;

const DURATIONS = HERO_STAGES.map((s) => s.duration);
const S = {
  msg1: stageIndex("msg1"),
  typing1: stageIndex("typing1"),
  reply1: stageIndex("reply1"),
  msg2: stageIndex("msg2"),
  typing2: stageIndex("typing2"),
  reply2: stageIndex("reply2"),
  select: stageIndex("select"),
  answer: stageIndex("answer"),
  captured: stageIndex("captured"),
  qualified: stageIndex("qualified"),
  crm: stageIndex("crm"),
  outro: stageIndex("outro"),
};

/* ------------------------------------------------------------------ */
/* Controller                                                          */
/* ------------------------------------------------------------------ */

export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.25 });
  const pageVisible = usePageVisible();
  const reduced = usePrefersReducedMotion();

  const { stage, iteration, restart } = useSequence(DURATIONS, { playing: inView && pageVisible && !reduced });
  // Reduced motion: show the finished story, fully static.
  const s = reduced ? HERO_FINAL_STAGE : stage;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} data-hero-visual data-hero-stage={HERO_STAGES[s].id} className="relative mx-auto flex w-full max-w-[620px] items-center justify-center">
        <div aria-hidden className="bg-dots absolute inset-8 -z-10 rounded-[40px] [mask-image:radial-gradient(closest-side,black,transparent)]" />
        <HeroKpiStack s={s} />
        <div className="relative z-0 shrink-0">
          <HeroPhone s={s} listKey={reduced ? "static" : `loop-${iteration}`} />
          <HeroLeadNotification s={s} />
          <HeroQualifiedBadge s={s} />
          <HeroCrmToast s={s} />
        </div>
        <HeroWorkflowPreview s={s} complete={reduced} />
        {!reduced && <ReplayButton onReplay={restart} />}
        <p className="sr-only">
          Product demo: a customer messages on WhatsApp, the AI assistant replies and qualifies them, and the lead is added to
          the CRM.
        </p>
      </div>
    </MotionConfig>
  );
}

function ReplayButton({ onReplay }: { onReplay: () => void }) {
  return (
    <button
      type="button"
      onClick={onReplay}
      aria-label="Replay product demo"
      className="absolute -bottom-16 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-white/80 px-3 py-1.5 text-[12px] font-medium text-muted backdrop-blur transition-colors hover:border-[#d0d5dd] hover:text-ink md:-bottom-[72px]"
    >
      <RotateCcw className="size-3.5" /> Replay demo
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Phone conversation                                                  */
/* ------------------------------------------------------------------ */

type ChatItem = { key: string; node: React.ReactNode; side: "in" | "out" | "center" };

function buildConversation(s: number): ChatItem[] {
  const items: ChatItem[] = [];
  const msg = (id: string, from: "customer" | "bot", text: string, time: string) => (
    <ChatBubble message={{ id, from, text, time }} compact />
  );
  if (s >= S.msg1) items.push({ key: "msg1", side: "in", node: msg("msg1", "customer", heroScript.msg1.text, heroScript.msg1.time) });
  if (s === S.typing1) items.push({ key: "typing1", side: "out", node: <TypingIndicator /> });
  if (s >= S.reply1) items.push({ key: "reply1", side: "out", node: msg("reply1", "bot", heroScript.reply1.text, heroScript.reply1.time) });
  if (s >= S.msg2) items.push({ key: "msg2", side: "in", node: msg("msg2", "customer", heroScript.msg2.text, heroScript.msg2.time) });
  if (s === S.typing2) items.push({ key: "typing2", side: "out", node: <TypingIndicator /> });
  if (s >= S.reply2) {
    items.push({ key: "reply2", side: "out", node: msg("reply2", "bot", heroScript.reply2.text, heroScript.reply2.time) });
    items.push({ key: "options", side: "out", node: <ReplyOptions selected={s >= S.select ? heroScript.selected : null} /> });
  }
  if (s >= S.answer) {
    items.push({ key: "answer", side: "in", node: msg("answer", "customer", heroScript.selected, heroScript.answerTime) });
    items.push({ key: "qualification", side: "center", node: <QualificationChip /> });
  }
  return items;
}

export function HeroPhone({ s, listKey }: { s: number; listKey: string }) {
  const items = buildConversation(s);
  return (
    <PhoneMockup className="w-[272px] sm:w-[280px]" screenClassName="h-[540px] sm:h-[560px]">
      <ChatHeader name={heroCustomer.name} status="online" />
      <ChatSurface className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 pt-4 pb-1 [mask-image:linear-gradient(to_bottom,transparent,black_56px)]">
        {/* Fresh list per loop: the old one is already faded out, so it unmounts without exit animations. */}
        <motion.div
          key={listKey}
          className="flex flex-col gap-2.5"
          initial={false}
          animate={{ opacity: s === S.outro ? 0 : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="mx-auto rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-medium text-muted">Today</span>
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.key}
                layout="position"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={enter}
                className={cn(
                  "flex flex-col",
                  item.side === "in" && "items-start",
                  item.side === "out" && "items-end",
                  item.side === "center" && "items-center",
                )}
              >
                {item.node}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ChatSurface>
      <ChatComposer voice className="bg-chat pt-1" />
      <MobileEventBanner s={s} />
    </PhoneMockup>
  );
}

function ReplyOptions({ selected }: { selected: string | null }) {
  return (
    <div className="flex w-[85%] max-w-[280px] flex-col gap-1">
      {heroScript.options.map((o) => {
        const isSelected = o === selected;
        return (
          <span
            key={o}
            className={cn(
              "flex items-center justify-center gap-1 rounded-xl py-1.5 text-center text-[11.5px] font-medium shadow-[0_1px_1px_rgb(16_24_40/0.06)] ring-1 transition-[background-color,color,box-shadow] duration-300",
              isSelected ? "bg-brand-50 text-brand-700 ring-brand-200" : "bg-white text-sky-700 ring-transparent",
            )}
          >
            {isSelected && <Check className="size-3" strokeWidth={3} />}
            {o}
          </span>
        );
      })}
    </div>
  );
}

function QualificationChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-medium text-accent-600 shadow-[0_1px_1px_rgb(16_24_40/0.06)] ring-1 ring-accent-100">
      <Sparkles className="size-3" /> {heroScript.qualification}
    </span>
  );
}

/** Mobile-only: lead events surface as a push-style banner inside the phone. */
function MobileEventBanner({ s }: { s: number }) {
  const event =
    s === S.captured
      ? { key: "captured", title: "New lead captured", meta: "via WhatsApp", badge: <StatusBadge tone="blue">New Lead</StatusBadge> }
      : s === S.qualified
        ? { key: "qualified", title: "Lead qualified", meta: "High intent · Sales", badge: <StatusBadge tone="green" dot>Qualified</StatusBadge> }
        : s === S.crm
          ? { key: "crm", title: "Lead added to CRM", meta: "Pipeline updated", badge: <Check className="size-4 text-brand-700" strokeWidth={2.75} /> }
          : null;
  return (
    <div className="pointer-events-none absolute inset-x-2 top-[88px] z-10 md:hidden">
      <AnimatePresence mode="wait">
        {event && (
          <motion.div
            key={event.key}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={floatIn}
            className="flex items-center gap-2.5 rounded-2xl border border-line bg-white/95 p-2.5 shadow-float backdrop-blur"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#25d366] text-white">
              <WhatsAppIcon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-ink">{event.title}</p>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="truncate text-[11px] text-muted">{event.meta}</p>
                {event.badge}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floating cards (md+)                                                */
/* ------------------------------------------------------------------ */

const floatMotion = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, transition: { duration: 0.25 } },
  transition: floatIn,
};

export function HeroLeadNotification({ s }: { s: number }) {
  const show = s >= S.captured && s < S.outro;
  const qualified = s >= S.qualified;
  return (
    <AnimatePresence>
      {show && (
        <motion.div {...floatMotion} data-hero-float="lead" className="absolute -top-12 -left-24 z-20 hidden w-[212px] md:block">
          <Panel float className="p-2.5">
            <div className="flex items-center gap-2.5">
              <span className="relative">
                <Avatar name={heroCustomer.name} size="md" />
                <span className="absolute -right-1 -bottom-1 inline-flex size-4 items-center justify-center rounded-full bg-[#25d366] text-white ring-2 ring-white">
                  <WhatsAppIcon className="size-2.5" />
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-ink">New lead captured</p>
                <p className="truncate text-[11px] text-muted">{heroCustomer.name}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-line-soft pt-2">
              <span className="inline-flex items-center gap-1 text-[10.5px] whitespace-nowrap text-muted">
                <WhatsAppIcon className="size-3 text-[#25d366]" /> Source: WhatsApp
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={qualified ? "qualified" : "new"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={swap}
                >
                  {qualified ? (
                    <StatusBadge tone="green" icon={Check}>Qualified</StatusBadge>
                  ) : (
                    <StatusBadge tone="blue" dot>New Lead</StatusBadge>
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HeroQualifiedBadge({ s }: { s: number }) {
  const show = s >= S.qualified && s < S.outro;
  return (
    <AnimatePresence>
      {show && (
        <motion.div {...floatMotion} data-hero-float="qualified" className="absolute -right-20 -bottom-8 z-20 hidden w-[196px] md:block">
          <Panel float className="p-3">
            <div className="flex items-center gap-2">
              <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...swap, delay: 0.15 }}>
                <IconTile icon={UserCheck} tone="solidGreen" size="sm" />
              </motion.span>
              <div>
                <p className="text-[12px] font-semibold text-ink">High intent lead</p>
                <p className="text-[11px] text-muted">Assigned to Sales Team</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <StatusBadge tone="green" dot>Qualified</StatusBadge>
              <AvatarStack names={["Arjun Mehra", "Sofia Alvarez"]} size="xs" extra={2} />
            </div>
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HeroCrmToast({ s }: { s: number }) {
  const show = s >= S.crm && s < S.outro;
  return (
    <AnimatePresence>
      {show && (
        <motion.div {...floatMotion} data-hero-float="crm" className="absolute bottom-6 -left-24 z-20 hidden md:block">
          <Panel float className="flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand-500 text-white">
              <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...swap, delay: 0.15 }}>
                <Check className="size-3.5" strokeWidth={3} />
              </motion.span>
            </span>
            <span className="text-[12px] font-semibold whitespace-nowrap text-ink">Lead added to CRM</span>
            <Database className="size-3.5 text-subtle" />
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* KPIs                                                                */
/* ------------------------------------------------------------------ */

export function HeroKpiStack({ s }: { s: number }) {
  const captured = s >= S.captured;
  const qualified = s >= S.qualified;
  return (
    <div data-hero-kpis className="relative z-10 -mr-5 hidden w-[150px] shrink-0 flex-col gap-3 md:flex">
      <KpiCard
        label="New leads"
        value={<RollingNumber value={captured ? heroKpis.newLeads.after : heroKpis.newLeads.before} animateChange={captured} />}
        delta="40%"
        spark={[4, 6, 5, 8, 7, 10, 12]}
        className={cn("shadow-float ring-2 transition-shadow duration-500", s === S.captured ? "ring-brand-200" : "ring-transparent")}
      />
      <KpiCard
        label="Qualified"
        value={<RollingNumber value={qualified ? heroKpis.qualified.after : heroKpis.qualified.before} animateChange={qualified} />}
        delta="32%"
        spark={[3, 4, 6, 5, 7, 8, 9]}
        sparkColor="#6c4dff"
        className={cn("shadow-float ring-2 transition-shadow duration-500", s === S.qualified ? "ring-accent-200" : "ring-transparent")}
      />
      <KpiCard label="Sales closed" value={String(heroKpis.salesClosed)} delta="28%" spark={[2, 3, 3, 5, 4, 6, 7]} className="shadow-float" />
      <SampleTag className="self-start" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Workflow                                                            */
/* ------------------------------------------------------------------ */

function stepState(s: number, step: (typeof heroWorkflowSteps)[number], complete: boolean): StepState {
  if (complete || s >= stageIndex(step.doneAt)) return "done";
  if (s >= stageIndex(step.activeAt)) return "active";
  return "idle";
}

export function HeroWorkflowPreview({ s, complete }: { s: number; complete: boolean }) {
  return (
    <div className="relative z-10 -ml-5 hidden w-[210px] shrink-0 flex-col gap-3 md:flex">
      <Panel float data-hero-workflow className="p-3">
        <p className="mb-2.5 flex items-center gap-1.5 px-0.5 text-[12px] font-semibold text-ink">
          <Bot className="size-3.5 text-accent-500" /> Automate conversations
        </p>
        <ol className="flex flex-col">
          {heroWorkflowSteps.map((step, i) => {
            const state = stepState(s, step, complete);
            const last = i === heroWorkflowSteps.length - 1;
            return (
              <li key={step.title} data-hero-step={i} data-state={state} className="flex flex-col">
                <div
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border p-2 transition-[background-color,border-color,box-shadow] duration-400",
                    state === "active" ? "border-brand-200 bg-brand-50/60 shadow-[0_0_0_3px_rgb(0_184_107/0.08)]" : "border-line-soft bg-white",
                  )}
                >
                  <span className="relative inline-flex size-7 shrink-0">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={state === "done" ? "done" : "icon"}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={swap}
                        className="absolute inset-0"
                      >
                        {state === "done" ? (
                          <IconTile icon={Check} tone="solidGreen" size="sm" />
                        ) : (
                          <IconTile icon={step.icon} tone={state === "active" ? step.tone : "gray"} size="sm" className="transition-colors duration-300" />
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-[11.5px] leading-4 font-semibold transition-colors duration-300", state === "idle" ? "text-ink-soft" : "text-ink")}>
                      {step.title}
                    </p>
                    <p className="text-[10.5px] text-muted">{step.note}</p>
                  </div>
                  {/* slot always reserved so text never reflows when a step activates */}
                  <span className="relative flex size-2 shrink-0" aria-hidden>
                    {state === "active" && (
                      <>
                        <span className="absolute inset-0 animate-ping rounded-full bg-brand-400 opacity-50" />
                        <span className="relative size-2 rounded-full bg-brand-500" />
                      </>
                    )}
                  </span>
                </div>
                {!last && (
                  <span
                    aria-hidden
                    className={cn(
                      "ml-[22px] h-2.5 w-px border-l transition-colors duration-300",
                      state === "done" ? "border-solid border-brand-400" : "border-dashed border-[#d0d5dd]",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </Panel>
      <Panel float className="p-3">
        <div className="flex items-center gap-2">
          <IconTile icon={Megaphone} tone="green" size="sm" />
          <p className="text-[12px] font-semibold text-ink">Broadcast campaign</p>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <AvatarStack names={["Isha Rao", "Dev Malhotra", "Kavya Iyer"]} size="xs" />
          <span className="text-[11px] font-semibold text-brand-700">+1.2K recipients</span>
        </div>
      </Panel>
    </div>
  );
}
