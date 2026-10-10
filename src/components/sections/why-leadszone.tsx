import { TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { IconTile, type TileTone } from "@/components/product/surface";
// Client islands: each card runs its own demo controller.
import { LeadInboxDemo, PipelineDemo, RespondDemo } from "./why-leadszone-demos";

export function WhyLeadsZone() {
  return (
    <Section id="why" tone="soft">
      <SectionHeading
        align="center"
        eyebrow="Why LeadsZone"
        title={
          <>
            Turn Conversations Into <Highlight>Revenue.</Highlight>
          </>
        }
        description="Never miss an opportunity. Respond faster, automate repetitive tasks, and turn customer conversations into measurable business growth."
        className="mx-auto"
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        <FeatureCard icon={Users} tone="green" title="Never Miss a Lead" description="Capture enquiries from WhatsApp, your website, Instagram and more — organised in one inbox the moment they arrive.">
          <LeadInboxDemo />
        </FeatureCard>
        <FeatureCard icon={Zap} tone="purple" title="Respond Faster" description="AI-assisted replies, quick templates and automated workflows engage every lead instantly — even after hours.">
          <RespondDemo />
        </FeatureCard>
        <FeatureCard icon={TrendingUp} tone="green" title="Close More Deals" description="Track every opportunity through a visual pipeline with clear next steps and automated follow-ups." className="md:col-span-2 lg:col-span-1">
          <PipelineDemo />
        </FeatureCard>
      </div>
    </Section>
  );
}

function FeatureCard({
  icon,
  tone,
  title,
  description,
  className,
  children,
}: {
  icon: LucideIcon;
  tone: TileTone;
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article className={cn("group flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-2 shadow-card transition-[box-shadow,transform,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-[#d0d5dd] hover:shadow-float motion-reduce:hover:translate-y-0", className)}>
      <div className="relative h-[336px] overflow-hidden rounded-[18px] border border-line-soft bg-gradient-to-b from-soft to-white">{children}</div>
      <div className="flex gap-4 p-5 pt-6">
        <IconTile icon={icon} tone={tone} size="lg" />
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{description}</p>
        </div>
      </div>
    </article>
  );
}
