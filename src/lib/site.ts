/**
 * Site-wide SEO constants.
 *
 * The production domain is not known yet. Set NEXT_PUBLIC_SITE_URL (e.g. https://www.example.com)
 * at build time to enable the canonical URL, absolute Open Graph / Twitter image URLs and the sitemap.
 * Nothing here invents a domain, and a localhost or malformed value is ignored so it can never
 * leak into production metadata.
 */
function resolveSiteUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const u = new URL(raw.trim());
    const local = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"].includes(u.hostname);
    if (!/^https?:$/.test(u.protocol) || local) {
      console.warn(`[site] Ignoring NEXT_PUBLIC_SITE_URL="${raw}": must be an absolute, non-localhost http(s) URL.`);
      return undefined;
    }
    return u.origin;
  } catch {
    console.warn(`[site] Ignoring NEXT_PUBLIC_SITE_URL="${raw}": not a valid URL.`);
    return undefined;
  }
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** Path of the generated share image (see src/app/og-image/route.tsx). */
export const ogImagePath = "/og-image";

export const site = {
  name: "LeadsZone",
  title: "LeadsZone | WhatsApp Business API, AI Chatbot & CRM",
  description:
    "Grow your business with LeadsZone's WhatsApp Business API, AI-powered chatbots, shared team inbox, marketing automation, and CRM—all in one platform.",
  keywords: [
    "WhatsApp Business API",
    "WhatsApp CRM",
    "AI chatbot",
    "WhatsApp marketing",
    "shared team inbox",
    "WhatsApp automation",
    "lead management",
  ],
};
