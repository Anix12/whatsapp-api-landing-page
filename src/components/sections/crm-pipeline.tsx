import { SquareKanban, Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
// Client island: the live pipeline demo.
import { CrmBoard } from "./crm-pipeline-demo";

const points = [
  "Automatically organise incoming leads",
  "Assign leads to the right team members",
  "Track custom pipeline stages",
  "Record activities and follow-up reminders",
  "Monitor lead conversion over time",
];

export function CrmPipeline() {
  return (
    <Section id="crm" tone="soft">
      <SectionHeading
        align="center"
        className="mx-auto"
        eyebrow="CRM & Lead Management"
        eyebrowIcon={SquareKanban}
        title={
          <>
            A pipeline built around your <Highlight>conversations.</Highlight>
          </>
        }
        description="Every chat becomes a structured lead. Know who owns it, where it stands, and what needs to happen next."
      />

      <CrmBoard />

      <ul className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-[14.5px] text-ink-soft">
            <Check className="size-4 text-brand-500" strokeWidth={2.75} /> {p}
          </li>
        ))}
      </ul>
    </Section>
  );
}
