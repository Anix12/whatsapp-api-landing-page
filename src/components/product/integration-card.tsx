import { Blocks, Webhook, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { MetaIcon, SheetsIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import type { Integration, IntegrationStatus } from "@/data/integrations";

const statusMeta: Record<IntegrationStatus, { label: string; tone: "green" | "blue" | "gray" }> = {
  core: { label: "Core channel", tone: "green" },
  planned: { label: "Planned", tone: "blue" },
  roadmap: { label: "On roadmap", tone: "gray" },
};

const logos: Record<Integration["logo"], { icon: React.ComponentType<{ className?: string }>; className: string }> = {
  whatsapp: { icon: WhatsAppIcon, className: "bg-[#25d366] text-white" },
  meta: { icon: MetaIcon, className: "bg-[#0866ff] text-white" },
  sheets: { icon: SheetsIcon, className: "bg-[#e8f5ec] text-[#0f9d58]" },
  webhooks: { icon: Webhook, className: "bg-ink text-white" },
  crm: { icon: Blocks, className: "bg-accent-50 text-accent-500" },
  automation: { icon: Workflow, className: "bg-amber-50 text-amber-600" },
};

export function IntegrationCard({ integration, footer, className }: { integration: Integration; footer?: React.ReactNode; className?: string }) {
  const { icon: Icon, className: logoClass } = logos[integration.logo];
  const status = statusMeta[integration.status];
  return (
    <article
      data-integration={integration.id}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-5 transition-[border-color,box-shadow] hover:shadow-card",
        integration.status === "core" ? "border-brand-200" : "border-line hover:border-[#d0d5dd]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("inline-flex size-11 items-center justify-center rounded-xl [&_svg]:size-6", logoClass)}>
          <Icon className="" />
        </span>
        <StatusBadge tone={status.tone} dot={integration.status === "core"}>
          {status.label}
        </StatusBadge>
      </div>
      <h3 className="mt-5 text-[15.5px] font-semibold text-ink">{integration.name}</h3>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{integration.description}</p>
      {footer}
    </article>
  );
}
