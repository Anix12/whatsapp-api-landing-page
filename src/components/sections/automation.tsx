import { ArrowRight, Bot } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { Button } from "@/components/ui/button";
import { routes } from "@/data/navigation";
// Client island: the live workflow demo (phone + canvas share one timeline).
import { AutomationVisual } from "./automation-demo";

export function Automation() {
  return (
    <Section id="automation">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
        <SectionHeading
          eyebrow="AI Automation"
          eyebrowIcon={Bot}
          eyebrowTone="purple"
          title={
            <>
              Qualify and route leads while your <Highlight>team sleeps.</Highlight>
            </>
          }
          description="Build conversation workflows visually. Ask the right questions, trigger timely follow-ups, and hand off hot leads instantly."
        />
        <div className="flex flex-col gap-8 lg:pb-1">
          <FeatureList
            tone="purple"
            items={[
              "Create automated conversation workflows",
              "Qualify leads with predefined questions",
              "Trigger follow-ups based on events",
              "Route qualified prospects to sales agents",
              "Offer AI-assisted customer support",
            ]}
          />
          <div>
            <Button href={routes.bookDemo} variant="dark">
              Explore automation <ArrowRight />
            </Button>
          </div>
        </div>
      </div>

      <AutomationVisual />
    </Section>
  );
}
