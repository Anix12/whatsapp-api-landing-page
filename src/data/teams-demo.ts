/**
 * Teams › Customer Support live demo — script and timeline (sample data, ~18s loop).
 * One timeline drives the queue, handoff card, internal note, CRM sync and suggested reply.
 */
export const supportDemo = {
  startDelay: 400,
  stages: [
    { id: "rest", duration: 900 },
    { id: "incoming", duration: 2600 }, //  Karan's conversation becomes active, new message
    { id: "assign", duration: 3000 }, //    auto-assigned to Sofia (AI → agent handoff)
    { id: "note", duration: 3000 }, //      Arjun leaves an internal note
    { id: "sync", duration: 2800 }, //      contact synced to LeadsZone CRM
    { id: "resolved", duration: 2600 }, //  Sofia sends the reply, conversation Resolved
    { id: "hold", duration: 2600 }, //      completed team workflow
    { id: "outro", duration: 500 },
  ],
  /** Which queue row is the live conversation (matches `supportQueue`). */
  activeName: "Karan Patel",
  agent: { name: "Sofia Alvarez", firstName: "Sofia", team: "Support" },
  teammate: { name: "Arjun Mehra", firstName: "Arjun" },
  note: "Customer is on the Pro plan — fine to resend the link.",
  reply: "“Hi Karan, sorry about that! Here’s a fresh payment link — it stays valid for 24 hours.”",
  crm: { syncing: "Syncing…", synced: "Contact synced to LeadsZone CRM" },
} as const;

export const supportStage = (id: (typeof supportDemo.stages)[number]["id"]) => supportDemo.stages.findIndex((s) => s.id === id);

/** Integrations › WhatsApp core channel — tiny "live" sync loop (sample UI only). */
export const channelSyncDemo = {
  stages: [
    { id: "synced", duration: 4800 },
    { id: "syncing", duration: 1200 },
  ],
} as const;
