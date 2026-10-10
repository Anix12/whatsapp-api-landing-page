import {
  CalendarClock,
  CircleQuestionMark,
  Database,
  Funnel,
  GitBranch,
  MessageCircle,
  Bot,
  UserPlus,
  UserCheck,
  BellRing,
  SquareKanban,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/components/ui/badge";

export type FlowNode = {
  id: string;
  step?: number;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "green" | "purple" | "blue" | "amber";
  status?: { label: string; tone: Tone };
};

/** AI Automation builder — linear trunk. */
export const flowTrunk: FlowNode[] = [
  { id: "trigger", step: 1, title: "New WhatsApp Message", description: "Customer sends a message", icon: MessageCircle, tone: "green", status: { label: "Trigger", tone: "green" } },
  { id: "ask", step: 2, title: "Ask Qualifying Questions", description: "Enquiry volume, needs, timeline", icon: CircleQuestionMark, tone: "purple", status: { label: "AI step", tone: "purple" } },
  { id: "check", step: 3, title: "Check Conditions", description: "If enquiries ≥ 100/day", icon: Funnel, tone: "blue", status: { label: "Condition", tone: "gray" } },
];

/** Branch outcomes after the condition. */
export const flowBranches: (FlowNode & { result: string; resultNote: string })[] = [
  { id: "qualified", title: "High-Intent Lead", description: "Assign to sales team", icon: UserCheck, tone: "green", status: { label: "Qualified", tone: "green" }, result: "Assign to Sales", resultNote: "Round-robin" },
  { id: "followup", title: "Send Follow-Up", description: "If not ready now", icon: CalendarClock, tone: "blue", status: { label: "Nurture", tone: "blue" }, result: "Follow up in 3 days", resultNote: "Scheduled" },
  { id: "crm", title: "Add to CRM", description: "Save lead with tags", icon: Database, tone: "purple", status: { label: "New Lead", tone: "purple" }, result: "CRM profile created", resultNote: "Pricing Enquiry" },
];

export const qualifyingQuestions = [
  "How many enquiries do you get daily?",
  "Which channels do you use today?",
  "When do you want to start?",
];

/** Dark "journey" section — six stages. */
export const journeyStages: { title: string; description: string; icon: LucideIcon; accent: "green" | "purple" }[] = [
  { title: "New WhatsApp Enquiry", description: "A customer messages your business number or clicks an ad.", icon: MessageCircle, accent: "green" },
  { title: "Lead Created in CRM", description: "Contact, source and first message are saved automatically.", icon: UserPlus, accent: "green" },
  { title: "AI Qualifies the Lead", description: "Asks your questions and scores intent in the chat.", icon: Bot, accent: "purple" },
  { title: "Sales Rep Assigned", description: "Routed by team, territory or round-robin rules.", icon: GitBranch, accent: "purple" },
  { title: "Follow-Up Triggered", description: "Reminders and templates go out on schedule.", icon: BellRing, accent: "purple" },
  { title: "Moves Through Pipeline", description: "Stage updates as the conversation progresses.", icon: SquareKanban, accent: "green" },
];
