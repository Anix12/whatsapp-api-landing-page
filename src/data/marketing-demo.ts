/**
 * WhatsApp Marketing live campaign demo — script and timeline (sample data, ~15s loop).
 * Funnel numbers are internally consistent: delivered/read/clicked are rates of `sent`.
 */
const SENT = 3120;

export const campaignDemo = {
  startDelay: 400,
  stages: [
    { id: "rest", duration: 1000 }, //       campaign scheduled, metrics at zero
    { id: "ready", duration: 1600 }, //      template approved + audience selected
    { id: "sending", duration: 1600 }, //    Scheduled → Sending, progress + Sent counter
    { id: "delivered", duration: 1700 }, //  promo lands in the phone, Delivered counter
    { id: "read", duration: 1800 }, //       Read counter
    { id: "engaged", duration: 1800 }, //    customer replies, Clicked counter
    { id: "captured", duration: 2200 }, //   "Interested lead captured", status Completed
    { id: "done", duration: 2800 }, //       hold the completed dashboard
    { id: "outro", duration: 600 }, //       phone conversation fades before the loop
  ],
  campaign: {
    name: "New Collection Launch",
    template: "new_collection_v1",
    audience: "Opted-in (30d)",
    schedule: "Today · 10:00 AM IST",
  },
  metrics: {
    sent: SENT,
    delivered: Math.round(SENT * 0.972), // 97.2%
    read: Math.round(SENT * 0.714), //      71.4%
    clicked: Math.round(SENT * 0.189), //   18.9%
  },
  message: {
    greeting: "Hi Aisha 👋",
    body: "Our new collection is here! Get early access before it goes live this Friday.",
    time: "10:02 AM",
    buttons: ["View Collection", "Not Now"],
  },
  reply: { text: "I'm interested! Can you share more details?", time: "10:04 AM" },
  lead: { title: "Interested lead captured", meta: "Aisha · replied to campaign" },
} as const;

export const campaignStage = (id: (typeof campaignDemo.stages)[number]["id"]) => campaignDemo.stages.findIndex((s) => s.id === id);
