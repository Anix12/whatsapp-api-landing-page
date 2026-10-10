/**
 * Every off-page destination lives here, read from environment variables at build time.
 * `null` = the destination does not exist yet: the UI renders it as non-interactive
 * "coming soon" text (never a dead `#` link, never silently redirected elsewhere).
 *
 * Set these before launch (see the deployment notes in the Phase 3.3 report):
 *   NEXT_PUBLIC_LOGIN_URL, NEXT_PUBLIC_SIGNUP_URL, NEXT_PUBLIC_DEMO_URL,
 *   NEXT_PUBLIC_PRICING_URL, NEXT_PUBLIC_BLOG_URL, NEXT_PUBLIC_HELP_URL,
 *   NEXT_PUBLIC_DOCS_URL, NEXT_PUBLIC_CONTACT_URL,
 *   NEXT_PUBLIC_PRIVACY_URL, NEXT_PUBLIC_TERMS_URL, NEXT_PUBLIC_COOKIES_URL
 *
 * NEXT_PUBLIC_* values must be referenced literally so Next can inline them.
 */
const url = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const externalLinks = {
  login: url(process.env.NEXT_PUBLIC_LOGIN_URL),
  signup: url(process.env.NEXT_PUBLIC_SIGNUP_URL),
  demo: url(process.env.NEXT_PUBLIC_DEMO_URL),
  pricing: url(process.env.NEXT_PUBLIC_PRICING_URL),
  blog: url(process.env.NEXT_PUBLIC_BLOG_URL),
  help: url(process.env.NEXT_PUBLIC_HELP_URL),
  docs: url(process.env.NEXT_PUBLIC_DOCS_URL),
  contact: url(process.env.NEXT_PUBLIC_CONTACT_URL),
  privacy: url(process.env.NEXT_PUBLIC_PRIVACY_URL),
  terms: url(process.env.NEXT_PUBLIC_TERMS_URL),
  cookies: url(process.env.NEXT_PUBLIC_COOKIES_URL),
};

export type Href = string | null;
