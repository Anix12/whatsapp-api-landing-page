import type { Tone } from "@/components/ui/badge";

export type Channel = "whatsapp" | "instagram" | "facebook" | "website";

export type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  channel: Channel;
  tags: { label: string; tone: Tone }[];
  active?: boolean;
};

/** Shared-inbox conversation list. Sample data only. */
export const conversations: Conversation[] = [
  { id: "c1", name: "Priya Sharma", preview: "Hi! Can you share the brochure for the design program?", time: "2m", unread: 1, channel: "whatsapp", tags: [{ label: "New Lead", tone: "green" }, { label: "Course Enquiry", tone: "purple" }], active: true },
  { id: "c2", name: "Rahul Mehta", preview: "Do you have a demo available this week?", time: "5m", unread: 1, channel: "whatsapp", tags: [{ label: "Demo Request", tone: "blue" }] },
  { id: "c3", name: "Sneha Kapoor", preview: "Can you share the pricing?", time: "12m", channel: "instagram", tags: [{ label: "Pricing", tone: "amber" }] },
  { id: "c4", name: "Amit Verma", preview: "I'd like to know more about the batches", time: "30m", channel: "whatsapp", tags: [{ label: "Follow Up", tone: "purple" }] },
  { id: "c5", name: "Karan Patel", preview: "Thanks! I'll review and get back to you", time: "1h", channel: "website", tags: [{ label: "Interested", tone: "green" }] },
  { id: "c6", name: "Neha Singh", preview: "When is the next batch starting?", time: "2h", channel: "facebook", tags: [{ label: "Course Enquiry", tone: "purple" }] },
];

export type ChatMessage = {
  id: string;
  from: "customer" | "agent" | "bot";
  text: string;
  time: string;
  quickReplies?: string[];
  attachment?: { name: string; size: string };
};
