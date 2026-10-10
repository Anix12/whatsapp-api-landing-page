import { ChartColumn } from "lucide-react";
import { Section, SplitLayout } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
// Client island: the live dashboard demo.
import { AnalyticsDashboard } from "./analytics-demo";

export function Analytics() {
  return (
    <Section id="analytics">
      <SplitLayout
        splitAt="xl"
        copy={
          <>
            <SectionHeading
              eyebrow="Analytics & Reporting"
              eyebrowIcon={ChartColumn}
              eyebrowTone="purple"
              title={
                <>
                  Know exactly what drives <Highlight>revenue.</Highlight>
                </>
              }
              description="See where leads come from, how campaigns perform, and how quickly your team responds — in one live dashboard."
            />
            <FeatureList
              tone="purple"
              className="mt-8"
              items={[
                "Lead-source breakdown across channels",
                "Campaign performance reporting",
                "Sales pipeline overview",
                "Team activity and response-time metrics",
              ]}
            />
          </>
        }
        visual={<AnalyticsDashboard />}
      />
    </Section>
  );
}
