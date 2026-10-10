import { ArrowRight, Inbox } from "lucide-react";
import { Section, SplitLayout } from "@/components/ui/section";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { Button } from "@/components/ui/button";
import { routes } from "@/data/navigation";
// Client island: the live inbox demo.
import { InboxDashboard } from "./shared-inbox-demo";

export function SharedInbox() {
  return (
    <Section id="inbox">
      <SplitLayout
        splitAt="xl"
        copy={
          <>
            <SectionHeading
              eyebrow="WhatsApp Business Shared Inbox"
              eyebrowIcon={Inbox}
              title={
                <>
                  One shared inbox for every <Highlight>customer conversation.</Highlight>
                </>
              }
              description="Give your whole team a single, organised view of WhatsApp conversations — with full context on every customer."
            />
            <FeatureList
              className="mt-8"
              items={[
                "Manage customer conversations in one shared inbox",
                "Assign chats to the right team members",
                "Track complete conversation history",
                "Organise with tags and internal notes",
                "Switch between AI-assisted and human support",
              ]}
            />
            <div className="mt-9">
              <Button href={routes.bookDemo}>
                See the inbox in a demo <ArrowRight />
              </Button>
            </div>
          </>
        }
        visual={<InboxDashboard />}
      />
    </Section>
  );
}
