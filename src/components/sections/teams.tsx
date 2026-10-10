"use client";

import { useRef, useState } from "react";
import { FileText, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { Avatar } from "@/components/ui/avatar";
import { SampleTag, StatusBadge } from "@/components/ui/badge";
import { Panel, PanelHeader, RangeChip, IconTile } from "@/components/product/surface";
import { ProgressBar } from "@/components/product/charts";
import { audienceSegments } from "@/data/marketing";
import { salesLeads, teams, templatePerformance, type TeamId } from "@/data/teams";
import { SupportDemo } from "./teams-support-demo";

export function Teams() {
  // Support opens first: its preview is the live team-collaboration demo.
  const [active, setActive] = useState<TeamId>("support");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const team = teams.find((t) => t.id === active)!;

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + teams.length) % teams.length;
    setActive(teams[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="teams" tone="soft">
      <SectionHeading
        align="center"
        className="mx-auto"
        eyebrow="Built for every team"
        eyebrowIcon={Users}
        title={
          <>
            One workspace. Three teams. Zero dropped <Highlight>conversations.</Highlight>
          </>
        }
        description="Marketing, sales, and support share the same customer context — so every handoff feels effortless."
      />

      <div role="tablist" aria-label="Teams" className="mx-auto mt-10 grid w-full grid-cols-3 gap-1 rounded-2xl border border-line bg-white p-1.5 shadow-card sm:flex sm:w-fit">
        {teams.map((t, i) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-colors sm:px-5",
                selected ? "bg-ink text-white shadow-sm" : "text-muted hover:bg-soft hover:text-ink",
              )}
            >
              <t.icon className="hidden size-4 sm:block" />
              <span className="sm:hidden">{t.shortLabel}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${team.id}`}
        aria-labelledby={`tab-${team.id}`}
        data-team-panel={team.id}
        className="mt-8 grid items-center gap-10 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:p-10"
      >
        <div>
          <IconTile icon={team.icon} tone="green" size="lg" />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink">{team.title}</h3>
          <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{team.description}</p>
          <FeatureList className="mt-6" items={team.points} />
        </div>
        <div className="min-w-0">
          {active === "marketing" && <MarketingPreview />}
          {active === "sales" && <SalesPreview />}
          {active === "support" && <SupportDemo />}
        </div>
      </div>
    </Section>
  );
}

function MarketingPreview() {
  return (
    <Panel className="bg-soft p-3 sm:p-4">
      <Panel className="p-4">
        <PanelHeader icon={FileText} title="Message performance" action={<RangeChip>Last 30 days</RangeChip>} />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line text-[11px] text-muted">
                <th className="py-2 font-medium">Template</th>
                <th className="py-2 font-medium">Sent</th>
                <th className="py-2 font-medium">Read rate</th>
                <th className="py-2 text-right font-medium">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {templatePerformance.map((t) => (
                <tr key={t.name} className="border-b border-line-soft last:border-0">
                  <td className="py-2.5 font-mono text-[11.5px] text-ink">{t.name}</td>
                  <td className="py-2.5 text-ink-soft">{t.sent}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={t.read} color="bg-brand-500" className="w-16" />
                      <span className="text-ink-soft">{t.read}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-ink">{t.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {audienceSegments.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white p-3">
            <s.icon className="size-4 text-brand-700" />
            <p className="mt-2 text-[16px] font-semibold tracking-tight text-ink">{s.value}</p>
            <p className="truncate text-[11px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <SampleTag />
      </div>
    </Panel>
  );
}

function SalesPreview() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          My leads <span className="rounded-md bg-line-soft px-1.5 text-[11px] text-muted">14</span>
        </p>
        <span className="flex items-center gap-2">
          <SampleTag />
          <StatusBadge tone="purple" icon={Sparkles}>Sorted by AI score</StatusBadge>
        </span>
      </div>
      <ul>
        {salesLeads.map((l) => (
          <li key={l.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft px-4 py-3 last:border-0 sm:grid-cols-[minmax(0,1.3fr)_88px_minmax(0,1fr)_96px]">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name={l.name} size="md" whatsapp />
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-ink">{l.name}</p>
                <p className="truncate text-[11px] text-muted">{l.interest}</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="mb-1 flex justify-between text-[10.5px]">
                <span className="text-muted">Score</span>
                <span className="font-semibold text-ink">{l.score}</span>
              </div>
              <ProgressBar value={l.score} color={l.score > 75 ? "bg-brand-500" : l.score > 55 ? "bg-amber-400" : "bg-subtle"} />
            </div>
            <p className="hidden truncate text-[11.5px] text-ink-soft sm:block">{l.next}</p>
            <StatusBadge tone={l.tone} className="justify-self-end">{l.stage}</StatusBadge>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
