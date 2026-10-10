"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { BadgeCheck, CalendarClock, ChartSpline, Check, ChevronRight, Eye, Megaphone, MousePointerClick, Send, CircleCheck, UserCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoPlayback } from "@/lib/use-sequence";
import { SampleTag, StatusBadge } from "@/components/ui/badge";
import { Panel, PanelHeader, IconTile } from "@/components/product/surface";
import { PhoneMockup } from "@/components/product/phone-mockup";
import { ChatBubble, ChatComposer, ChatHeader, ChatSurface, QuickReplies } from "@/components/product/chat";
import { ChannelIcon } from "@/components/product/channel-icon";
import { MetricCard } from "@/components/product/metric-card";
import { Sparkline } from "@/components/product/charts";
import { CountUp, EASE, enterTransition, swapTransition } from "@/components/product/motion-primitives";
import { audienceSegments } from "@/data/marketing";
import { campaignDemo, campaignStage } from "@/data/marketing-demo";

const DURATIONS = campaignDemo.stages.map((s) => s.duration);
const S = {
  ready: campaignStage("ready"),
  sending: campaignStage("sending"),
  delivered: campaignStage("delivered"),
  read: campaignStage("read"),
  engaged: campaignStage("engaged"),
  captured: campaignStage("captured"),
  done: campaignStage("done"),
  outro: campaignStage("outro"),
};

export function CampaignVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, iteration, reduced } = useDemoPlayback(ref, DURATIONS, { initialDelay: campaignDemo.startDelay, amount: 0.3 });
  const s = reduced ? S.done : stage;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} data-demo="campaign" data-stage={campaignDemo.stages[s].id} className="grid items-center gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
        <div className="relative mx-auto md:ml-10">
          <CampaignPhone s={s} listKey={reduced ? "static" : `loop-${iteration}`} />
          <CampaignSentCard s={s} instant={reduced} />
          <CampaignEventCard s={s} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <CampaignPerformance s={s} instant={reduced} />
          <AudienceSegments s={s} />
          <CampaignScheduler s={s} />
        </div>
      </div>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* Phone                                                               */
/* ------------------------------------------------------------------ */

function CampaignPhone({ s, listKey }: { s: number; listKey: string }) {
  const m = campaignDemo.message;
  return (
    <PhoneMockup className="w-[250px]" screenClassName="h-[520px]">
      <ChatHeader name="Lumen Store" status="Business account" verified />
      <ChatSurface className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 pt-4 pb-1 [mask-image:linear-gradient(to_bottom,transparent,black_40px)]">
        <motion.div
          key={listKey}
          className="flex flex-col gap-2"
          initial={false}
          animate={{ opacity: s === S.outro ? 0 : 1 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span className="mx-auto rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-medium text-muted">Today</span>
          <AnimatePresence initial={false}>
            {s >= S.delivered && (
              <motion.div key="promo" className="flex flex-col gap-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={enterTransition}>
                <div data-campaign-message className="w-[88%] overflow-hidden rounded-2xl rounded-tl-md bg-white p-1.5 shadow-[0_1px_1px_rgb(16_24_40/0.06)]">
                  <PromoCreative />
                  <div className="px-1.5 pt-2 pb-1">
                    <p className="text-[12.5px] font-semibold text-ink">{m.greeting}</p>
                    <p className="mt-0.5 text-[12px] leading-[1.45] text-ink-soft">{m.body}</p>
                    <p className="mt-1 text-right text-[10px] text-muted">{m.time}</p>
                  </div>
                </div>
                <QuickReplies options={[...m.buttons]} compact className="w-[88%]" />
              </motion.div>
            )}
            {s >= S.engaged && (
              <motion.div key="reply" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={enterTransition}>
                {/* The phone belongs to the customer, so their reply is the outgoing bubble. */}
                <ChatBubble compact message={{ id: "cm-reply", from: "agent", ...campaignDemo.reply }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </ChatSurface>
      <ChatComposer className="bg-chat pt-1" />
    </PhoneMockup>
  );
}

/** CSS-only promotional creative — no stock imagery. */
function PromoCreative() {
  return (
    <div className="relative h-[118px] overflow-hidden rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-900 p-3 text-white">
      <span className="absolute -top-8 -right-6 size-28 rounded-full bg-white/15" />
      <span className="absolute -right-2 bottom-[-30px] size-20 rounded-full bg-white/10" />
      <span className="absolute top-5 right-5 size-12 rotate-12 rounded-2xl bg-white/90 shadow-lg" />
      <span className="absolute top-8 right-10 size-9 -rotate-6 rounded-xl bg-brand-100 shadow-md" />
      <p className="text-[10px] font-medium tracking-wide uppercase opacity-80">Just launched</p>
      <p className="mt-0.5 text-[17px] leading-tight font-semibold">
        New
        <br />
        Collection
      </p>
      <span className="mt-2 inline-block rounded-md bg-white px-1.5 py-0.5 text-[10.5px] font-bold text-brand-700">20% OFF</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floating cards                                                      */
/* ------------------------------------------------------------------ */

function CampaignSentCard({ s, instant }: { s: number; instant: boolean }) {
  return (
    <Panel float data-campaign-float="sent" className="absolute -top-5 -left-5 z-10 w-[150px] p-3 sm:-left-16">
      <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted">
        <Megaphone className="size-3.5 text-brand-700" /> Campaign sent
      </p>
      <p className="mt-0.5 text-[19px] font-semibold tracking-tight text-ink">
        <CountUp value={s >= S.sending ? campaignDemo.metrics.sent : 0} duration={2.6} instant={instant} />
      </p>
      <Sparkline data={[3, 5, 4, 6, 5, 8, 7, 10, 12]} className="mt-1 h-6 w-full" />
    </Panel>
  );
}

/** One floating slot: "Template approved" becomes "Interested lead captured" — never two cards stacked. */
function CampaignEventCard({ s }: { s: number }) {
  const captured = s >= S.captured && s < S.outro;
  return (
    <Panel float data-campaign-float={captured ? "lead" : "template"} className="absolute -bottom-5 -left-5 z-10 overflow-hidden px-3 py-2.5 sm:-left-14">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={captured ? "lead" : "template"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={swapTransition}
          className="flex items-center gap-2"
        >
          <IconTile icon={captured ? UserCheck : BadgeCheck} tone={captured ? "solidPurple" : "solidGreen"} size="sm" />
          <div>
            <p className="text-[12px] font-semibold whitespace-nowrap text-ink">{captured ? campaignDemo.lead.title : "Template approved"}</p>
            <p className="text-[10.5px] whitespace-nowrap text-muted">
              {captured ? campaignDemo.lead.meta : `${campaignDemo.campaign.template} · Marketing`}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard panels                                                    */
/* ------------------------------------------------------------------ */

function CampaignPerformance({ s, instant }: { s: number; instant: boolean }) {
  const { metrics } = campaignDemo;
  const tiles = [
    { label: "Sent", icon: Send, tone: "green" as const, value: s >= S.sending ? metrics.sent : 0, duration: 2.6 },
    { label: "Delivered", icon: CircleCheck, tone: "blue" as const, value: s >= S.delivered ? metrics.delivered : 0, duration: 1.4 },
    { label: "Read", icon: Eye, tone: "purple" as const, value: s >= S.read ? metrics.read : 0, duration: 1.4 },
    { label: "Clicked", icon: MousePointerClick, tone: "amber" as const, value: s >= S.engaged ? metrics.clicked : 0, duration: 1.2 },
  ];
  return (
    <Panel className="p-4">
      <PanelHeader icon={ChartSpline} title="Campaign performance" action={<SampleTag />} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {tiles.map((t) => (
          <MetricCard key={t.label} label={t.label} icon={t.icon} tone={t.tone} value={<CountUp value={t.value} duration={t.duration} instant={instant} />} />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1">
        {(["whatsapp", "instagram", "facebook", "website"] as const).map((c) => (
          <ChannelIcon key={c} channel={c} size="xs" />
        ))}
        <span className="ml-1 text-[10.5px] text-muted">Lead sources</span>
      </div>
    </Panel>
  );
}

function AudienceSegments({ s }: { s: number }) {
  const selected = s >= S.ready;
  return (
    <Panel className="p-4">
      <PanelHeader
        icon={Users}
        title="Audience segments"
        action={
          <span className="inline-flex items-center text-[11.5px] font-medium text-brand-700">
            View all <ChevronRight className="size-3.5" />
          </span>
        }
      />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {audienceSegments.map((m) => {
          const isAudience = m.label === campaignDemo.campaign.audience;
          return (
            <div key={m.label} className="relative">
              <MetricCard
                {...m}
                className={cn("ring-2 transition-shadow duration-300", isAudience && selected ? "ring-brand-400" : "ring-transparent")}
              />
              <AnimatePresence>
                {isAudience && selected && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={swapTransition}
                    className="absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-white"
                    role="img"
                    aria-label="Selected audience"
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function CampaignScheduler({ s }: { s: number }) {
  const status = s >= S.captured ? "completed" : s >= S.sending ? "sending" : "scheduled";
  // Progress fills across sending + delivered; resets instantly between loops.
  const progress = s >= S.delivered ? 1 : s >= S.sending ? 0.55 : 0;
  const progressDuration = s === S.sending ? 1.6 : s === S.delivered ? 1.7 : 0;
  return (
    <Panel className="p-4">
      <PanelHeader icon={CalendarClock} title="Campaign scheduler" action={<StatusBadge tone="green" dot>Live</StatusBadge>} />
      <div className="mt-3 rounded-xl border border-line-soft bg-soft p-2.5">
        <div className="flex items-center gap-3">
          <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-400 to-brand-900">
            <span className="absolute top-2 right-1.5 size-4 rotate-12 rounded-md bg-white/90" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-ink">{campaignDemo.campaign.name}</p>
            <p className="truncate text-[11px] text-muted">
              {campaignDemo.campaign.schedule} · {campaignDemo.metrics.sent.toLocaleString("en-US")} recipients
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={status} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={swapTransition}>
              {status === "completed" ? (
                <StatusBadge tone="green" icon={Check}>Completed</StatusBadge>
              ) : status === "sending" ? (
                <StatusBadge tone="green" dot>Sending</StatusBadge>
              ) : (
                <StatusBadge tone="purple">Scheduled</StatusBadge>
              )}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
          <motion.div
            className="h-full origin-left rounded-full bg-brand-500"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: progressDuration, ease: "easeOut" }}
          />
        </div>
      </div>
    </Panel>
  );
}
