"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ChartNoAxesColumn, Check, ChevronRight, Database, Minus, Play, Plus, Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoPlayback } from "@/lib/use-sequence";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { Panel, IconTile } from "@/components/product/surface";
import { PhoneMockup } from "@/components/product/phone-mockup";
import { ChatBubble, ChatComposer, ChatHeader, ChatSurface } from "@/components/product/chat";
import { Connector, WorkflowNode, type NodeState } from "@/components/product/workflow-node";
import { EASE, TypingIndicator, enterTransition, swapTransition } from "@/components/product/motion-primitives";
import { flowBranches, flowTrunk, qualifyingQuestions } from "@/data/automation";
import { automationDemo, automationStage } from "@/data/automation-demo";

const DURATIONS = automationDemo.stages.map((s) => s.duration);
const S = {
  message: automationStage("message"),
  typing: automationStage("typing"),
  ask: automationStage("ask"),
  select: automationStage("select"),
  answer: automationStage("answer"),
  check: automationStage("check"),
  branch: automationStage("branch"),
  assign: automationStage("assign"),
  crm: automationStage("crm"),
  hold: automationStage("hold"),
  outro: automationStage("outro"),
};

/* ------------------------------------------------------------------ */
/* State derivation — the single source of truth for chat + canvas     */
/* ------------------------------------------------------------------ */

function trunkState(id: string, s: number): NodeState {
  if (id === "trigger") return s >= S.typing ? "done" : s >= S.message ? "active" : "idle";
  if (id === "ask") return s >= S.check ? "done" : s >= S.typing ? "active" : "idle";
  /* check */ return s >= S.branch ? "done" : s >= S.check ? "active" : "idle";
}

function branchState(id: string, s: number): NodeState {
  if (s < S.branch) return "idle";
  if (id === "qualified") return s >= S.assign ? "done" : "active";
  if (id === "crm") return s >= S.crm ? "done" : "dimmed";
  return "dimmed"; // follow-up never fires for a high-volume lead
}

export function AutomationVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, iteration, reduced } = useDemoPlayback(ref, DURATIONS, { initialDelay: automationDemo.startDelay, amount: 0.25 });
  const s = reduced ? S.hold : stage;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="automation" data-stage={automationDemo.stages[s].id} className="mt-14 grid items-start gap-8 lg:mt-16 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="relative mx-auto hidden lg:block">
          <AutomationPhone s={s} listKey={reduced ? "static" : `loop-${iteration}`} />
          <PhoneEventCard s={s} />
        </div>
        <WorkflowBuilder s={s} motionOn={!reduced} />
      </div>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* Phone                                                               */
/* ------------------------------------------------------------------ */

function AutomationPhone({ s, listKey }: { s: number; listKey: string }) {
  const m = automationDemo.messages;
  const items: { key: string; align: "start" | "end" | "center"; node: React.ReactNode }[] = [];
  if (s >= S.message) items.push({ key: "enquiry", align: "start", node: <ChatBubble compact message={{ id: "au-enquiry", from: "customer", ...m.enquiry }} /> });
  if (s === S.typing) items.push({ key: "typing", align: "end", node: <TypingIndicator label="AI reply" /> });
  if (s >= S.ask) {
    items.push({ key: "ai", align: "end", node: <ChatBubble compact message={{ id: "au-ai", from: "bot", ...m.ai }} /> });
    items.push({ key: "options", align: "end", node: <ReplyOptions selected={s >= S.select} /> });
  }
  if (s >= S.answer) {
    items.push({ key: "answer", align: "start", node: <ChatBubble compact className="[&>div]:min-w-[84px]" message={{ id: "au-answer", from: "customer", text: automationDemo.selected, time: m.answerTime }} /> });
    items.push({
      key: "tag",
      align: "center",
      node: (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-medium text-accent-600 shadow-[0_1px_1px_rgb(16_24_40/0.06)] ring-1 ring-accent-100">
          <Sparkles className="size-3" /> {automationDemo.qualificationTag}
        </span>
      ),
    });
  }

  return (
    <PhoneMockup className="w-[264px]" screenClassName="h-[540px]">
      <ChatHeader name={automationDemo.customer.name} />
      <ChatSurface className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 pt-4 pb-1 [mask-image:linear-gradient(to_bottom,transparent,black_40px)]">
        <motion.div key={listKey} className="flex flex-col gap-2.5" initial={false} animate={{ opacity: s === S.outro ? 0 : 1 }} transition={{ duration: 0.45, ease: EASE }}>
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.key}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={enterTransition}
                className={cn("flex flex-col", item.align === "start" && "items-start", item.align === "end" && "items-end", item.align === "center" && "items-center")}
              >
                {item.node}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ChatSurface>
      <ChatComposer className="bg-chat pt-1" />
    </PhoneMockup>
  );
}

function ReplyOptions({ selected }: { selected: boolean }) {
  return (
    <div className="flex w-[85%] max-w-[280px] gap-1">
      {automationDemo.options.map((o) => {
        const isSelected = selected && o === automationDemo.selected;
        return (
          <span
            key={o}
            className={cn(
              "flex flex-1 items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium whitespace-nowrap shadow-[0_1px_1px_rgb(16_24_40/0.06)] ring-1 transition-[background-color,color,box-shadow] duration-300",
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

/** Phone-side status: "Qualified lead" then "Lead added to CRM", in one slot. */
function PhoneEventCard({ s }: { s: number }) {
  const event = s >= S.crm && s < S.outro ? "crm" : s >= S.assign && s < S.outro ? "qualified" : null;
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6, transition: { duration: 0.25 } }}
          transition={{ duration: 0.45, ease: EASE }}
          data-automation-float={event}
          className="absolute -right-10 -bottom-5 z-10"
        >
          <Panel float className="overflow-hidden px-3 py-2.5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={event} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={swapTransition} className="flex items-center gap-2.5">
                <IconTile icon={event === "crm" ? Database : UserCheck} tone={event === "crm" ? "solidPurple" : "solidGreen"} size="sm" />
                <div>
                  <p className="text-[12px] font-semibold whitespace-nowrap text-ink">{event === "crm" ? automationDemo.crmToast.title : automationDemo.qualifiedToast.title}</p>
                  <p className="text-[10.5px] whitespace-nowrap text-muted">{event === "crm" ? automationDemo.crmToast.meta : automationDemo.qualifiedToast.meta}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Workflow canvas                                                     */
/* ------------------------------------------------------------------ */

function WorkflowBuilder({ s, motionOn }: { s: number; motionOn: boolean }) {
  const completed = s >= S.crm;
  return (
    <Panel className="overflow-hidden shadow-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <IconTile icon={Sparkles} tone="purple" size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">Inbound lead qualification</p>
            <p className="truncate text-[11px] text-muted">Workflow · Live run</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center rounded-lg border border-line text-muted sm:inline-flex">
            <Minus className="size-7 p-1.5" />
            <span className="border-x border-line px-2 text-[11px] font-medium">100%</span>
            <Plus className="size-7 p-1.5" />
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={completed ? "done" : "active"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={swapTransition}>
              {completed ? <StatusBadge tone="green" icon={Check}>Completed</StatusBadge> : <StatusBadge tone="green" icon={Play}>Active</StatusBadge>}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-dots relative px-4 py-8 sm:px-8">
        {/* Trunk */}
        <div className="mx-auto flex max-w-[360px] flex-col">
          {flowTrunk.map((node, i) => (
            <div key={node.id}>
              <div className="relative">
                <WorkflowNode node={node} state={trunkState(node.id, s)}>
                  {node.id === "ask" && (
                    <NodeDetail done={s >= S.answer} doneText={automationDemo.qualificationTag} pendingText="Waiting for reply…" tone="purple" />
                  )}
                  {node.id === "check" && (
                    <NodeDetail done={s >= S.check} doneText={automationDemo.conditionMatched} pendingText={automationDemo.conditionRule} tone="green" />
                  )}
                </WorkflowNode>
                {node.id === "ask" && <QuestionsPopover />}
              </div>
              {i < flowTrunk.length - 1 && (
                <TravelConnector active={i === 0 ? s >= S.typing : s >= S.check} travelling={motionOn && (i === 0 ? s === S.typing : s === S.check)} />
              )}
            </div>
          ))}
        </div>

        {/* Branches */}
        <BranchConnector active={s >= S.branch} travelling={motionOn && s === S.branch} />
        <div className="grid gap-4 md:grid-cols-3 md:gap-3">
          {flowBranches.map((b, i) => {
            const state = branchState(b.id, s);
            const lit = state === "active" || state === "done";
            return (
              <div key={b.id} data-branch={b.id} className="flex flex-col">
                {i > 0 && <Connector className="md:hidden" dashed />}
                <WorkflowNode node={b} state={state} className="flex-1" />
                <Connector dashed active={lit} />
                <BranchResult branch={b} s={s} state={state} />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <span className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-accent-200 bg-white px-4 py-2 text-[12.5px] font-semibold text-accent-600 shadow-card">
            <ChartNoAxesColumn className="size-4" />
            {["Automate", "Qualify", "Route", "Grow"].map((w, i) => (
              <span key={w} className="inline-flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 text-accent-400" />}
                {w}
              </span>
            ))}
          </span>
        </div>
      </div>
    </Panel>
  );
}

/** Fixed-height detail line inside a node: pending text cross-fades to the result (no layout shift). */
function NodeDetail({ done, doneText, pendingText, tone }: { done: boolean; doneText: string; pendingText: string; tone: "purple" | "green" }) {
  return (
    <div className="relative mt-2.5 h-6 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={done ? "done" : "pending"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={swapTransition}
          className="absolute inset-0 flex items-center"
        >
          {done ? (
            <StatusBadge tone={tone} icon={tone === "purple" ? Sparkles : Check}>
              {doneText}
            </StatusBadge>
          ) : (
            <span className="text-[11px] text-subtle">{pendingText}</span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Existing connector plus a one-shot dot that travels down it when the next node activates. */
function TravelConnector({ active, travelling }: { active: boolean; travelling: boolean }) {
  return (
    <div className="relative">
      <Connector active={active} />
      {travelling && (
        <motion.span
          aria-hidden
          className="absolute top-0 left-1/2 -ml-[3px] size-1.5 rounded-full bg-brand-500 shadow-[0_0_0_3px_rgb(0_184_107/0.18)]"
          initial={{ y: -2, opacity: 0 }}
          animate={{ y: [0, 18], opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function QuestionsPopover() {
  return (
    <div
      data-node-detail="questions"
      className="absolute top-1/2 left-[calc(100%+20px)] hidden w-[196px] -translate-y-1/2 rounded-xl border border-accent-200 bg-accent-50 p-3 xl:block"
    >
      <span aria-hidden className="absolute top-1/2 -left-5 w-5 border-t border-dashed border-accent-400/70" />
      <ul className="grid gap-1.5">
        {qualifyingQuestions.map((q) => (
          <li key={q} className="flex items-start gap-1.5 text-[11.5px] leading-snug text-accent-600">
            <ChevronRight className="mt-px size-3 shrink-0" /> {q}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Splits one line into three; the path to "Qualified" turns green when that branch fires. */
function BranchConnector({ active, travelling }: { active: boolean; travelling: boolean }) {
  const line = (on: boolean) => (on ? "border-solid border-brand-400" : "border-dashed border-accent-400/70");
  return (
    <div aria-hidden className="relative mx-auto h-10 md:h-12">
      <span className={cn("absolute top-0 left-1/2 h-1/2 border-l transition-colors duration-500", line(active))} />
      {/* horizontal: left half (to Qualified) lights up, right half stays dashed */}
      <span className={cn("absolute top-1/2 right-1/2 left-[16.66%] hidden border-t transition-colors duration-500 md:block", line(active))} />
      <span className="absolute top-1/2 right-[16.66%] left-1/2 hidden border-t border-dashed border-accent-400/70 md:block" />
      <span className={cn("absolute top-1/2 bottom-0 left-1/2 border-l transition-colors duration-500 md:hidden", line(active))} />
      <span className={cn("absolute top-1/2 bottom-0 left-[16.66%] hidden border-l transition-colors duration-500 md:block", line(active))} />
      {["left-1/2", "left-[83.33%]"].map((pos) => (
        <span key={pos} className={cn("absolute top-1/2 bottom-0 hidden border-l border-dashed border-accent-400/70 md:block", pos)} />
      ))}
      <span
        className={cn(
          "absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white transition-colors duration-500",
          active ? "border-brand-400" : "border-accent-400",
        )}
      />
      {travelling && (
        <>
          {/* desktop: centre → left → down to the Qualified branch */}
          <motion.span
            className="absolute -mt-[3px] -ml-[3px] hidden size-1.5 rounded-full bg-brand-500 shadow-[0_0_0_3px_rgb(0_184_107/0.18)] md:block"
            initial={{ left: "50%", top: "0%", opacity: 1 }}
            animate={{ left: ["50%", "50%", "16.66%", "16.66%"], top: ["0%", "50%", "50%", "100%"], opacity: [1, 1, 1, 0] }}
            transition={{ duration: 1, ease: "easeInOut", times: [0, 0.3, 0.75, 1] }}
          />
          {/* mobile: straight down (Qualified is the first stacked branch) */}
          <motion.span
            className="absolute left-1/2 -ml-[3px] size-1.5 rounded-full bg-brand-500 md:hidden"
            initial={{ top: "0%", opacity: 1 }}
            animate={{ top: ["0%", "100%"], opacity: [1, 0] }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
}

function BranchResult({ branch, s, state }: { branch: (typeof flowBranches)[number]; s: number; state: NodeState }) {
  const assigned = branch.id === "qualified" && s >= S.assign;
  const crmDone = branch.id === "crm" && s >= S.crm;
  return (
    <div
      data-branch-result={branch.id}
      className={cn(
        "flex min-h-[84px] flex-col justify-between rounded-xl border bg-white p-3 shadow-card transition-[border-color,opacity] duration-500",
        assigned || crmDone ? "border-brand-200" : "border-line",
        state === "dimmed" && "border-dashed border-[#d0d5dd] bg-soft shadow-none",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={assigned ? "assigned" : crmDone ? "crm-done" : "idle"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={swapTransition}
          className="flex flex-1 flex-col justify-between"
        >
          <p className={cn("text-[12px] font-semibold", state === "dimmed" ? "text-muted" : "text-ink")}>{assigned ? "Assigned to Sales Team" : branch.result}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            {branch.id === "qualified" &&
              (assigned ? (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
                  <Avatar name={automationDemo.agent.name} size="sm" /> Arjun
                </span>
              ) : (
                <AvatarStack names={["Arjun Mehra", "Sofia Alvarez", "Lucas Romero"]} size="sm" extra={2} />
              ))}
            {branch.id === "followup" && <span className="text-[11px] text-muted">Send pricing details</span>}
            {branch.id === "crm" && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
                <Avatar name={automationDemo.customer.name} size="sm" whatsapp /> {automationDemo.customer.name}
              </span>
            )}
            {assigned || crmDone ? (
              <StatusBadge tone="green" icon={Check}>{assigned ? "Assigned" : "Completed"}</StatusBadge>
            ) : (
              <StatusBadge tone={state === "dimmed" || branch.id === "qualified" ? "gray" : branch.id === "followup" ? "blue" : "purple"}>{branch.resultNote}</StatusBadge>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
