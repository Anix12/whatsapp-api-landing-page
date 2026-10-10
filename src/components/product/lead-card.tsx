import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import type { Lead } from "@/data/leads";

/** Kanban deal card. `data-lead` hooks are for Phase 2 drag/move animation. */
export function LeadCard({ lead, className }: { lead: Lead; className?: string }) {
  return (
    <article
      data-lead={lead.id}
      className={cn(
        "rounded-xl border bg-white p-3 transition-shadow hover:shadow-card",
        lead.highlighted ? "border-accent-400 shadow-[0_0_0_3px_rgb(108_77_255/0.12)]" : "border-line",
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <Avatar name={lead.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[12.5px] font-semibold text-ink">{lead.name}</p>
            {lead.whatsapp && <WhatsAppIcon className="size-3.5 shrink-0 text-[#25d366]" />}
          </div>
          <p className="truncate text-[11px] text-muted">{lead.detail}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold tracking-tight text-ink">{lead.value}</span>
        <div className="flex items-center gap-1.5">
          {lead.tag && <StatusBadge tone={lead.tag.tone}>{lead.tag.label}</StatusBadge>}
          <Avatar name={lead.agent} size="xs" />
        </div>
      </div>
      {lead.reminder && (
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1.5 text-[10.5px] font-medium text-amber-700">
          <Bell className="size-3" />
          {lead.reminder}
        </div>
      )}
    </article>
  );
}
