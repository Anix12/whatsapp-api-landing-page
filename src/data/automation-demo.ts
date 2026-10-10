/**
 * AI Automation live workflow demo — script and timeline (sample data, ~18.7s loop).
 * Every stage drives BOTH the WhatsApp chat and the workflow canvas, so they stay in sync.
 */
export const automationDemo = {
  startDelay: 400,
  stages: [
    { id: "rest", duration: 1000 },
    { id: "message", duration: 1500 }, //   enquiry arrives            → Trigger node active
    { id: "typing", duration: 1300 }, //    AI typing                  → Trigger done, AI node active
    { id: "ask", duration: 1600 }, //       AI asks + 3 options        → AI node active
    { id: "select", duration: 800 }, //     customer taps "100+"
    { id: "answer", duration: 1600 }, //    answer + "High Volume Lead" → AI node done (qualified)
    { id: "check", duration: 1800 }, //     condition node evaluates   → "Condition matched"
    { id: "branch", duration: 1500 }, //    Qualified branch activates, others dimmed
    { id: "assign", duration: 2200 }, //    assigned to sales team ✓
    { id: "crm", duration: 2400 }, //       lead added to CRM, workflow Completed
    { id: "hold", duration: 2400 }, //      rest on the completed workflow
    { id: "outro", duration: 600 }, //      chat fades before the loop
  ],
  customer: { name: "Riya Mehta" },
  agent: { name: "Arjun Mehra", team: "Sales Team" },
  messages: {
    enquiry: { text: "Hi! I'm interested in your services. Can you share pricing?", time: "10:24 AM" },
    ai: { text: "Of course! How many customer enquiries does your business receive daily?", time: "10:24 AM" },
    answerTime: "10:25 AM",
  },
  options: ["Under 50", "50–100", "100+"],
  selected: "100+",
  qualificationTag: "High Volume Lead",
  conditionMatched: "Condition matched: 100+ enquiries",
  conditionRule: "Rule: enquiries ≥ 100/day",
  crmToast: { title: "Lead added to CRM", meta: "Riya Mehta · Pricing enquiry" },
  qualifiedToast: { title: "Qualified lead", meta: "Assigned to Sales Team" },
} as const;

export type AutomationStageId = (typeof automationDemo.stages)[number]["id"];
export const automationStage = (id: AutomationStageId) => automationDemo.stages.findIndex((s) => s.id === id);
