import {
  Bot,
  ChartColumn,
  GraduationCap,
  Headphones,
  House,
  Inbox,
  LifeBuoy,
  Megaphone,
  Newspaper,
  BookOpen,
  ShoppingBag,
  Target,
  CodeXml,
  type LucideIcon,
} from "lucide-react";
import { externalLinks, type Href } from "@/config/links";

/**
 * Primary CTAs. Until real signup / demo URLs are configured (src/config/links.ts) they scroll
 * to the closing CTA section on this page; "Log in" has no fallback and stays hidden.
 */
export const routes = {
  login: externalLinks.login,
  startFree: externalLinks.signup ?? "#get-started",
  bookDemo: externalLinks.demo ?? "#book-demo",
};

/** `href: null` = destination not built yet → rendered as non-interactive "coming soon" text. */
export type NavLink = { label: string; href: Href; description?: string; icon?: LucideIcon };
export type NavItem = { label: string; href?: Href; children?: NavLink[] };

export const mainNav: NavItem[] = [
  {
    label: "Platform",
    children: [
      { label: "Shared Inbox", href: "#inbox", description: "Every WhatsApp chat, one team view", icon: Inbox },
      { label: "WhatsApp Campaigns", href: "#marketing", description: "Broadcasts to opted-in audiences", icon: Megaphone },
      { label: "AI Automation", href: "#automation", description: "Qualify and route leads 24/7", icon: Bot },
      { label: "Analytics", href: "#analytics", description: "See what drives revenue", icon: ChartColumn },
    ],
  },
  {
    label: "Solutions",
    children: [
      { label: "Sales Teams", href: "#teams", description: "Faster follow-ups, cleaner pipeline", icon: Target },
      { label: "Customer Support", href: "#teams", description: "Shared inbox with AI assistance", icon: Headphones },
      { label: "Education", href: null, description: "Course enquiries and admissions", icon: GraduationCap },
      { label: "Real Estate", href: null, description: "Site visits and property leads", icon: House },
      { label: "E-commerce", href: null, description: "Campaigns and order updates", icon: ShoppingBag },
    ],
  },
  { label: "Integrations", href: "#integrations" },
  {
    label: "Resources",
    children: [
      { label: "Help Center", href: externalLinks.help, description: "Guides to get set up", icon: LifeBuoy },
      { label: "Blog", href: externalLinks.blog, description: "WhatsApp growth playbooks", icon: Newspaper },
      { label: "API Docs", href: externalLinks.docs, description: "Webhooks and developer reference", icon: CodeXml },
      { label: "Templates", href: null, description: "Ready-made message templates", icon: BookOpen },
    ],
  },
  { label: "Pricing", href: externalLinks.pricing },
];

export const footerNav: { title: string; links: { label: string; href: Href }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Shared Inbox", href: "#inbox" },
      { label: "WhatsApp Campaigns", href: "#marketing" },
      { label: "AI Automation", href: "#automation" },
      { label: "Analytics", href: "#analytics" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Sales", href: "#teams" },
      { label: "Marketing", href: "#teams" },
      { label: "Customer Support", href: "#teams" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: externalLinks.help },
      { label: "Blog", href: externalLinks.blog },
      { label: "API Docs", href: externalLinks.docs },
      { label: "Pricing", href: externalLinks.pricing },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: null },
      { label: "Contact", href: externalLinks.contact },
      { label: "Book a Demo", href: routes.bookDemo },
    ],
  },
];

export const legalLinks: { label: string; href: Href }[] = [
  { label: "Privacy Policy", href: externalLinks.privacy },
  { label: "Terms of Service", href: externalLinks.terms },
  { label: "Cookie Policy", href: externalLinks.cookies },
];
