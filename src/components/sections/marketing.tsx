import { ArrowRight, Megaphone } from "lucide-react";
import { Section, SplitLayout } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { Button } from "@/components/ui/button";
import { routes } from "@/data/navigation";
// Client island: the live campaign demo.
import { CampaignVisual } from "./marketing-demo";

export function Marketing() {
  return (
    <Section id="marketing" tone="mint">
      <SplitLayout
        reverse
        splitAt="xl"
        copy={
          <>
            <SectionHeading
              eyebrow="WhatsApp Marketing"
              eyebrowIcon={Megaphone}
              title={
                <>
                  Campaigns That Start Real <Highlight>Conversations.</Highlight>
                </>
              }
              description="Reach opted-in customers with approved templates, targeted segments, and campaigns you can measure end to end."
            />
            <FeatureList
              className="mt-8"
              items={[
                "Create and manage approved message templates",
                "Segment audiences by behaviour and attributes",
                "Schedule or launch broadcast campaigns",
                "Track delivery and engagement analytics",
                "Capture leads with Click-to-WhatsApp ads",
              ]}
            />
            <div className="mt-9">
              <Button href={routes.startFree}>
                Plan Your First Campaign <ArrowRight />
              </Button>
            </div>
          </>
        }
        visual={<CampaignVisual />}
      />
    </Section>
  );
}
