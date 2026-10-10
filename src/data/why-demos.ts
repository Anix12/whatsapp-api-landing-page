import type { Channel } from "@/data/conversations";
import type { Tone } from "@/components/ui/badge";

/**
 * "Why LeadsZone" card demos — scripts and stage timings (sample data).
 * Each card has its own stage list; stage 0 is the resting frame between
 * loops, and `startDelay` staggers the very first run of each card.
 */

type Stage<Id extends string> = { id: Id; duration: number };
const indexer =
  <Id extends string>(stages: readonly Stage<Id>[]) =>
  (id: Id) =>
    stages.findIndex((s) => s.id === id);

/* ---------------- Card 1 — Never Miss a Lead (~8.6s + rest) ---------------- */

export const leadInboxDemo = {
  startDelay: 400,
  stages: [
    { id: "rest", duration: 1400 }, //       two existing conversations
    { id: "incoming", duration: 1000 }, //   new WhatsApp enquiry slides in
    { id: "unread", duration: 900 }, //      unread badge 2 → 3
    { id: "tagged", duration: 1200 }, //     "New Lead" tag
    { id: "captured", duration: 2400 }, //   "Lead automatically captured"
    { id: "settled", duration: 3200 }, //    part of the list; resting on complete state
  ],
  existing: [
    { id: "c2", name: "Rahul Mehta", preview: "Do you have a demo available this week?", time: "5m", channel: "whatsapp" as Channel, tag: { label: "Demo Request", tone: "blue" as Tone } },
    { id: "c3", name: "Sneha Kapoor", preview: "Can you share the pricing?", time: "12m", channel: "instagram" as Channel, tag: { label: "Pricing", tone: "amber" as Tone } },
  ],
  incoming: { id: "new", name: "Aisha Khan", preview: "Hi! I'd like to know more about your services.", time: "now", channel: "whatsapp" as Channel },
  unread: { before: 2, after: 3 },
} as const;
export const leadInboxStage = indexer(leadInboxDemo.stages);

/* ---------------- Card 2 — Respond Faster (~8.7s + rest) ---------------- */

export const respondDemo = {
  startDelay: 1900, // ~1.5s after card 1
  stages: [
    { id: "rest", duration: 1100 },
    { id: "message", duration: 1000 }, //    customer asks about a demo
    { id: "typing", duration: 1300 }, //     AI typing dots
    { id: "reply", duration: 900 }, //       automated answer
    { id: "options", duration: 1000 }, //    quick-reply buttons
    { id: "status", duration: 1300 }, //     "AI replied automatically"
    { id: "followup", duration: 2800 }, //   "Follow-up scheduled" (rests on complete state)
    { id: "outro", duration: 600 }, //       conversation fades before the loop
  ],
  customer: { name: "Neha Singh" },
  message: { text: "Hi! Do you offer a free demo?", time: "10:24 AM" },
  reply: { text: "Absolutely! 👋 You can book a free demo with our team.", time: "10:24 AM" },
  options: ["Book a Demo", "Learn More"],
  status: "AI replied automatically",
  followUp: "Follow-up scheduled · Tomorrow",
} as const;
export const respondStage = indexer(respondDemo.stages);

/* ---------------- Card 3 — Close More Deals (~12.6s + rest) ---------------- */

export const pipelineDemo = {
  startDelay: 3400, // ~3s after card 1
  stages: [
    { id: "rest", duration: 1100 },
    { id: "new", duration: 1300 }, //        deal appears in New
    { id: "chat", duration: 1200 }, //       WhatsApp conversation indicator
    { id: "contacted", duration: 1300 }, //  → Contacted
    { id: "ai", duration: 1200 }, //         AI qualification badge
    { id: "qualified", duration: 1300 }, //  → Qualified
    { id: "agent", duration: 1200 }, //      sales agent assigned
    { id: "won", duration: 1100 }, //        → Won
    { id: "success", duration: 900 }, //     green check
    { id: "counter", duration: 2600 }, //    Won count +1 (rests on complete state)
    { id: "outro", duration: 600 },
  ],
  columns: [
    { label: "New", count: 24, dot: "bg-sky-500", lead: { name: "Aarav Patel", note: "Product inquiry" } },
    { label: "Contacted", count: 18, dot: "bg-amber-500", lead: { name: "Karan Mehta", note: "Follow-up" } },
    { label: "Qualified", count: 12, dot: "bg-accent-500", lead: { name: "Sneha Kapoor", note: "Needs proposal" } },
    { label: "Won", count: 8, dot: "bg-brand-500", lead: { name: "Aditya Verma", note: "Closed · Pro" } },
  ],
  deal: { name: "Riya Mehta", note: "Course enquiry", agent: "Arjun Mehra" },
  won: { before: 8, after: 9 },
} as const;
export const pipelineStage = indexer(pipelineDemo.stages);
