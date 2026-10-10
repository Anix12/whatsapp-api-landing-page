import { Crown, ShoppingCart, UserCheck, Repeat, type LucideIcon } from "lucide-react";
import type { Tone } from "@/components/ui/badge";

export type Metric = { label: string; value: string; icon: LucideIcon; tone: Tone; delta?: string };

/** Audience segments — sample data. */
export const audienceSegments: Metric[] = [
  { label: "Repeat buyers", value: "2.4K", icon: Repeat, tone: "green" },
  { label: "Cart abandoners", value: "1.2K", icon: ShoppingCart, tone: "purple" },
  { label: "VIP customers", value: "890", icon: Crown, tone: "amber" },
  { label: "Opted-in (30d)", value: "3.1K", icon: UserCheck, tone: "blue" },
];
