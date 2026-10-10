import { Plug } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { IntegrationCard } from "@/components/product/integration-card";
import { ChannelSyncStatus } from "@/components/product/channel-sync-status";
import { integrations } from "@/data/integrations";

export function Integrations() {
  return (
    <Section id="integrations">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Integrations"
            eyebrowIcon={Plug}
            title={
              <>
                Fits into the tools your team <Highlight>already uses.</Highlight>
              </>
            }
            description="LeadsZone is built on the official WhatsApp Business Platform. More connections are on the way — here's exactly where each one stands."
          />
          <dl className="mt-8 grid gap-2.5 text-[13.5px]">
            {[
              ["Core channel", "Available as part of LeadsZone", "bg-brand-500"],
              ["Planned", "Scheduled for upcoming releases", "bg-sky-500"],
              ["On roadmap", "Being scoped with early customers", "bg-subtle"],
            ].map(([label, note, dot]) => (
              <div key={label} className="flex items-center gap-2.5">
                <dt className="flex items-center gap-2.5 font-semibold text-ink">
                  <span aria-hidden className={`size-2 rounded-full ${dot}`} />
                  {label}
                </dt>
                <dd className="text-muted">— {note}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((i) => (
            <IntegrationCard key={i.id} integration={i} footer={i.status === "core" ? <ChannelSyncStatus /> : undefined} />
          ))}
        </div>
      </div>
    </Section>
  );
}
