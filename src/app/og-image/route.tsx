import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Social share image (Open Graph + Twitter/X), rendered at build time with Next's built-in OG renderer.
 * Served at /og-image as a plain route (not the `opengraph-image` file convention) so it is only
 * referenced from metadata once a real production domain is configured — never via localhost.
 */
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #4c2fd1 0%, #241466 55%, #0b1020 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#6c4dff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M3 12.5h3.5l2-5 3.5 10 2.5-7 1.5 2H21" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>{site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Turn WhatsApp conversations into business growth.
          </span>
          <span style={{ fontSize: 30, color: "rgba(255,255,255,0.78)" }}>WhatsApp Business API · AI Chatbot · Shared Inbox · CRM</span>
        </div>
      </div>
    ),
    size,
  );
}
