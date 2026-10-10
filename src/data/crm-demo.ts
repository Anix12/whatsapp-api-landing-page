import type { StageId } from "@/data/leads";

/**
 * CRM pipeline live demo — script, timeline and dashboard numbers (sample data, ~19s loop).
 * Counts stay consistent: open deals = New + Contacted + Qualified; the demo deal is
 * worth ₹1.8 Cr and moves from the open pipeline into Won.
 */
export const crmDemo = {
  startDelay: 400,
  stages: [
    { id: "rest", duration: 1000 },
    { id: "captured", duration: 2200 }, //    WhatsApp enquiry → card enters New
    { id: "qualified", duration: 2800 }, //   AI Qualified, score 92, High Intent
    { id: "assigned", duration: 1300 }, //    assigned to Arjun
    { id: "contacted", duration: 1700 }, //   → Contacted
    { id: "followup", duration: 1500 }, //    follow-up scheduled · Tomorrow
    { id: "qualifiedCol", duration: 1500 }, // → Qualified
    { id: "won", duration: 1600 }, //         → Won
    { id: "success", duration: 2400 }, //     ✓ "Deal won · Neha Kapoor"
    { id: "hold", duration: 2600 }, //        rest on the completed pipeline
    { id: "outro", duration: 600 }, //        demo card fades before the loop
  ],
  lead: {
    id: "demo-neha",
    name: "Neha Kapoor",
    detail: "3-bed · Andheri West",
    value: "₹1.8 Cr",
    score: 92,
    agent: "Arjun Mehra",
  },
  /** Base column counts (before the demo deal is added). */
  counts: { new: 12, contacted: 8, qualified: 5, won: 3 } as Record<StageId, number>,
  summary: {
    openPipeline: { base: "₹18.4 Cr", withDeal: "₹20.2 Cr" },
    wonThisMonth: { base: "₹12.4 Cr", withDeal: "₹14.2 Cr" },
    avgCycle: "18 days",
    followUpsToday: "7",
  },
  openDealsBase: 25,
  status: {
    captured: "Lead captured from WhatsApp",
    qualified: "High Intent · AI Qualified",
    assigned: "Assigned to Arjun",
    followup: "Follow-up scheduled · Tomorrow",
    won: "Deal won",
  },
  events: {
    captured: { title: "Lead captured from WhatsApp", meta: "Neha Kapoor · New lead" },
    assigned: { title: "Assigned to Arjun", meta: "Sales · Round-robin" },
    followup: { title: "Follow-up scheduled", meta: "Tomorrow, 11:00 AM" },
    won: { title: "Deal won · Neha Kapoor", meta: "₹1.8 Cr · 3-bed Andheri West" },
  },
} as const;

export type CrmStageId = (typeof crmDemo.stages)[number]["id"];
export const crmStage = (id: CrmStageId) => crmDemo.stages.findIndex((s) => s.id === id);
