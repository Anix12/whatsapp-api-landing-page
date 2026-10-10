import { Bot, CircleCheckBig, Database, UserPlus, type LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import type { IconLike } from "@/components/ui/badge";
import type { TileTone } from "@/components/product/surface";

/**
 * Hero product demo — script and timeline. Pure data: the controller in
 * `hero-demo.tsx` only reads these values, so copy/timings can change freely.
 */

export const HERO_STAGES = [
  { id: "idle", duration: 600 }, //         empty chat, beat before the story starts
  { id: "msg1", duration: 1100 }, //        customer asks for details
  { id: "typing1", duration: 1400 }, //     AI typing indicator
  { id: "reply1", duration: 1800 }, //      AI asks what service
  { id: "msg2", duration: 1100 }, //        customer: solution for my business
  { id: "typing2", duration: 1300 }, //     AI typing indicator
  { id: "reply2", duration: 1800 }, //      AI asks volume + quick-reply options
  { id: "select", duration: 700 }, //       customer taps "100+ enquiries"
  { id: "answer", duration: 1700 }, //      answer bubble + qualification chip
  { id: "captured", duration: 3000 }, //    New Lead Captured
  { id: "qualified", duration: 3000 }, //   New Lead → Qualified, assigned to sales
  { id: "crm", duration: 3200 }, //         Lead added to CRM
  { id: "outro", duration: 700 }, //        conversation fades before the loop restarts
] as const;

export type HeroStageId = (typeof HERO_STAGES)[number]["id"];

export const stageIndex = (id: HeroStageId) => HERO_STAGES.findIndex((s) => s.id === id);

/** Fully-played state, used for reduced motion and as the resting frame. */
export const HERO_FINAL_STAGE = stageIndex("crm");

export const heroCustomer = { name: "Rahul Mehta", firstName: "Rahul" };

export const heroScript = {
  msg1: { text: "Hi! I'm interested in your services. Can you share more details?", time: "10:24 AM" },
  reply1: { text: "Hi! 👋 Absolutely. I'd be happy to help. What type of service are you looking for?", time: "10:24 AM" },
  msg2: { text: "I'm looking for a solution for my business.", time: "10:25 AM" },
  reply2: { text: "Great! How many customer enquiries do you handle each day?", time: "10:25 AM" },
  options: ["Under 20", "20–100", "100+ enquiries"],
  selected: "100+ enquiries",
  answerTime: "10:25 AM",
  qualification: "Qualified · 100+ enquiries/day",
};

/** Demo KPI values before/after the lead lands (sample data). */
export const heroKpis = {
  newLeads: { before: 324, after: 325 },
  qualified: { before: 198, after: 199 },
  salesClosed: 76,
};

export type StepState = "idle" | "active" | "done";

export const heroWorkflowSteps: {
  title: string;
  note: string;
  icon: IconLike | LucideIcon;
  tone: TileTone;
  /** stage index at which the step becomes active / done */
  activeAt: HeroStageId;
  doneAt: HeroStageId;
}[] = [
  { title: "Message received", note: "Customer writes in", icon: WhatsAppIcon, tone: "green", activeAt: "msg1", doneAt: "typing1" },
  { title: "AI responded", note: "Replies & asks", icon: Bot, tone: "purple", activeAt: "typing1", doneAt: "captured" },
  { title: "Lead captured", note: "Contact saved", icon: UserPlus, tone: "blue", activeAt: "captured", doneAt: "qualified" },
  { title: "Lead qualified", note: "Assigned to sales", icon: CircleCheckBig, tone: "rose", activeAt: "qualified", doneAt: "crm" },
  { title: "CRM updated", note: "Pipeline synced", icon: Database, tone: "amber", activeAt: "crm", doneAt: "outro" },
];
