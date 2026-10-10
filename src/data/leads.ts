import type { Tone } from "@/components/ui/badge";

export type StageId = "new" | "contacted" | "qualified" | "won";

export type Lead = {
  id: string;
  name: string;
  detail: string;
  value: string;
  agent: string;
  whatsapp?: boolean;
  reminder?: string;
  tag?: { label: string; tone: Tone };
  highlighted?: boolean;
};

export type Stage = {
  id: StageId;
  label: string;
  count: number;
  dot: string;
  leads: Lead[];
};

/** Full pipeline used in the CRM section. Sample data only. */
export const pipeline: Stage[] = [
  {
    id: "new",
    label: "New",
    count: 12,
    dot: "bg-sky-500",
    leads: [
      { id: "l1", name: "Daniel Okafor", detail: "2-bed rental · Bandra", value: "₹42K/mo", agent: "Arjun Mehra", whatsapp: true, tag: { label: "Rental", tone: "blue" } },
      { id: "l2", name: "Aisha Khan", detail: "Townhouse · Powai", value: "₹1.2 Cr", agent: "Sofia Alvarez", whatsapp: true },
      { id: "l3", name: "Rohit Jain", detail: "Site visit request", value: "₹85 L", agent: "Lucas Romero", whatsapp: true },
    ],
  },
  {
    id: "contacted",
    label: "Contacted",
    count: 8,
    dot: "bg-amber-500",
    leads: [
      { id: "l4", name: "Maya Chen", detail: "Studio · Harbour View", value: "₹68 L", agent: "Arjun Mehra", whatsapp: true, reminder: "Follow up today · 4:00 PM" },
      { id: "l5", name: "Lucas Romero", detail: "Investment property", value: "₹2.4 Cr", agent: "Sofia Alvarez" },
    ],
  },
  {
    id: "qualified",
    label: "Qualified",
    count: 5,
    dot: "bg-accent-500",
    leads: [
      { id: "l6", name: "Priya Sharma", detail: "3-bed · Riverside", value: "₹1.6 Cr", agent: "Arjun Mehra", whatsapp: true, highlighted: true, tag: { label: "Hot", tone: "rose" } },
      { id: "l7", name: "Karan Mehta", detail: "Penthouse · Worli", value: "₹4.1 Cr", agent: "Lucas Romero", whatsapp: true },
    ],
  },
  {
    id: "won",
    label: "Won",
    count: 3,
    dot: "bg-brand-500",
    leads: [
      { id: "l8", name: "Tom Becker", detail: "Penthouse · Juhu", value: "₹3.8 Cr", agent: "Sofia Alvarez", tag: { label: "Closed", tone: "green" } },
      { id: "l9", name: "Neha Singh", detail: "Villa · Palm Grove", value: "₹5.2 Cr", agent: "Arjun Mehra", tag: { label: "Closed", tone: "green" } },
    ],
  },
];
