import { Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { journeyStages } from "@/data/automation";

export function Journey() {
  return (
    <Section id="journey" tone="dark" className="isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid-night absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(108_77_255/0.28),transparent)]" />
        <div className="absolute -bottom-40 left-1/2 h-[360px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_184_107/0.14),transparent)]" />
      </div>

      <SectionHeading
        dark
        align="center"
        className="mx-auto"
        eyebrow="Workflow automation"
        eyebrowIcon={Workflow}
        eyebrowTone="dark"
        title={
          <>
            Automate the busywork. <span className="text-brand-400">Focus on growth.</span>
          </>
        }
        description="From the first message to a closed deal, LeadsZone moves every enquiry forward automatically — your team steps in where it matters."
      />

      <ol className="mt-16 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {journeyStages.map((stage, i) => {
          const last = i === journeyStages.length - 1;
          return (
            <li
              key={stage.title}
              data-journey-stage={i}
              className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] md:flex-col"
            >
              {/* connector across the grid gap: horizontal on md+, vertical on mobile */}
              {!last && (
                <span
                  aria-hidden
                  data-journey-connector={i}
                  className={cn(
                    "absolute top-full left-10 h-4 border-l border-dashed border-white/25 md:top-[42px] md:left-full md:h-0 md:w-4 md:border-t md:border-l-0",
                    i === 2 && "md:hidden xl:block",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl border",
                  stage.accent === "green" ? "border-brand-400/30 bg-brand-400/10 text-brand-400" : "border-accent-400/35 bg-accent-400/10 text-accent-400",
                )}
              >
                <stage.icon className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.08em] text-white/55 uppercase">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-[15px] leading-snug font-semibold text-white">{stage.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{stage.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
