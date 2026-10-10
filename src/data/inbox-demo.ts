/**
 * Shared Inbox live demo — script and timeline (sample data, ~16s loop).
 * Stage 0 is the rest frame between loops.
 */
export const inboxDemo = {
  startDelay: 400,
  stages: [
    { id: "rest", duration: 1000 },
    { id: "arrive", duration: 1100 }, //         Priya's conversation lands in the list, unread
    { id: "select", duration: 1100 }, //         auto-selected, message shown in chat
    { id: "typing", duration: 1400 }, //         AI typing
    { id: "reply", duration: 1100 }, //          AI reply + quick replies + "AI replied"
    { id: "customer", duration: 1300 }, //       customer asks for sales
    { id: "intent", duration: 1500 }, //         "Intent detected: Sales Enquiry"
    { id: "assign", duration: 2100 }, //         handoff AI → Arjun, tag + assignee update
    { id: "agentTyping", duration: 1200 }, //    Arjun typing
    { id: "agent", duration: 1000 }, //          human reply
    { id: "done", duration: 2800 }, //           "Assigned · Arjun" ✓ — rests on the complete state
    { id: "outro", duration: 600 }, //           conversation fades before the loop
  ],
  customer: { name: "Priya Sharma", phone: "+91 98765 43210" },
  agent: { name: "Arjun Mehra", firstName: "Arjun", role: "Sales" },
  listPreview: "Hi! I'd like to know more about your pricing.",
  messages: {
    first: { text: "Hi! I'd like to know more about your pricing.", time: "10:24 AM" },
    ai: { text: "Hi Priya! 👋 I'd be happy to help. Would you like to see our plans or speak with our team?", time: "10:24 AM" },
    customer: { text: "I'd like to speak with someone from sales.", time: "10:25 AM" },
    agent: { text: "Hi Priya! I'm Arjun from LeadsZone. I'd be happy to help you choose the right plan.", time: "10:26 AM" },
  },
  quickReplies: ["View Plans", "Talk to Sales"],
  aiStatus: "AI replied",
  intent: "Intent detected: Sales Enquiry",
  handoff: "AI → Human handoff · Assigned to Arjun",
  suggestions: {
    early: "Share the pricing plans overview",
    handoff: "Hand off to Sales — Arjun is available",
    after: "Send the plan comparison PDF",
  },
} as const;

export const inboxStage = (id: (typeof inboxDemo.stages)[number]["id"]) => inboxDemo.stages.findIndex((s) => s.id === id);
