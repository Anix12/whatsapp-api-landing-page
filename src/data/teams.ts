import { Headphones, Megaphone, Target, type LucideIcon } from "lucide-react";
import type { Tone } from "@/components/ui/badge";

export type TeamId = "marketing" | "sales" | "support";

export const teams: { id: TeamId; label: string; shortLabel: string; icon: LucideIcon; title: string; description: string; points: string[] }[] = [
  {
    id: "marketing",
    label: "Marketing",
    shortLabel: "Marketing",
    icon: Megaphone,
    title: "Launch campaigns that feed sales directly",
    description: "Plan WhatsApp broadcasts, target the right segments, and see which messages actually start conversations.",
    points: ["WhatsApp campaigns & approved templates", "Behaviour-based audience segments", "Message-level performance"],
  },
  {
    id: "sales",
    label: "Sales",
    shortLabel: "Sales",
    icon: Target,
    title: "Work the hottest leads first",
    description: "Leads arrive qualified, scored and assigned — so reps spend time closing, not sorting.",
    points: ["Lead pipeline with deal values", "AI qualification scores", "Follow-up reminders and ownership"],
  },
  {
    id: "support",
    label: "Customer Support",
    shortLabel: "Support",
    icon: Headphones,
    title: "Resolve faster with AI at your side",
    description: "A shared queue with AI-drafted replies and clean handoffs between bots, agents and sales.",
    points: ["Shared inbox with assignment", "AI-suggested replies", "Bot-to-agent handoffs with context"],
  },
];

/** Sample data for team previews. */
export const templatePerformance = [
  { name: "spring_launch_v2", sent: "12,480", read: 71, clicks: "18.9%" },
  { name: "cart_reminder_24h", sent: "3,210", read: 64, clicks: "22.4%" },
  { name: "webinar_invite", sent: "5,870", read: 58, clicks: "11.2%" },
  { name: "festive_offer_hi", sent: "8,040", read: 69, clicks: "15.7%" },
];

export const salesLeads: { name: string; interest: string; score: number; stage: string; tone: Tone; next: string }[] = [
  { name: "Priya Sharma", interest: "Design Program", score: 92, stage: "Qualified", tone: "purple", next: "Call at 4:00 PM" },
  { name: "Rahul Mehta", interest: "Team plan · 25 seats", score: 81, stage: "Demo booked", tone: "blue", next: "Demo tomorrow" },
  { name: "Sneha Kapoor", interest: "Pricing enquiry", score: 64, stage: "Contacted", tone: "amber", next: "Send proposal" },
  { name: "Amit Verma", interest: "Weekend batch", score: 47, stage: "New", tone: "gray", next: "Auto follow-up" },
];

export const supportQueue: { name: string; issue: string; sla: string; handledBy: "ai" | "agent"; tone: Tone; status: string }[] = [
  { name: "Neha Singh", issue: "When is the next batch starting?", sla: "2m", handledBy: "ai", tone: "purple", status: "AI answering" },
  { name: "Karan Patel", issue: "Payment link isn't working", sla: "4m", handledBy: "agent", tone: "amber", status: "Escalated" },
  { name: "Isha Rao", issue: "Can I change my class timing?", sla: "9m", handledBy: "agent", tone: "blue", status: "Assigned" },
];
