export type IntegrationStatus = "core" | "planned" | "roadmap";

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  logo: "whatsapp" | "meta" | "sheets" | "webhooks" | "crm" | "automation";
};

/**
 * Statuses are deliberately conservative — only the WhatsApp channel is
 * presented as live. Update when integrations actually ship.
 */
export const integrations: Integration[] = [
  { id: "wa", name: "WhatsApp Business Platform", description: "Official Cloud API for messaging, templates and broadcasts.", status: "core", logo: "whatsapp" },
  { id: "ctwa", name: "Meta Click-to-WhatsApp Ads", description: "Capture ad clicks as leads with campaign attribution.", status: "planned", logo: "meta" },
  { id: "sheets", name: "Google Sheets", description: "Sync leads and campaign lists to a spreadsheet.", status: "planned", logo: "sheets" },
  { id: "webhooks", name: "Webhooks & APIs", description: "Send events to your own systems in real time.", status: "planned", logo: "webhooks" },
  { id: "crm", name: "CRM & Sales Tools", description: "Two-way sync with the CRM your team already uses.", status: "roadmap", logo: "crm" },
  { id: "auto", name: "Automation Platforms", description: "Connect to no-code tools to trigger custom workflows.", status: "roadmap", logo: "automation" },
];
