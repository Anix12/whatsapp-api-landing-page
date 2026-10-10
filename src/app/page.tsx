import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { WhyLeadsZone } from "@/components/sections/why-leadszone";
import { SharedInbox } from "@/components/sections/shared-inbox";
import { Marketing } from "@/components/sections/marketing";
import { Automation } from "@/components/sections/automation";
import { Analytics } from "@/components/sections/analytics";
import { Teams } from "@/components/sections/teams";
import { Journey } from "@/components/sections/journey";
import { Integrations } from "@/components/sections/integrations";
import { FinalCta } from "@/components/sections/final-cta";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <WhyLeadsZone />
        <SharedInbox />
        <Marketing />
        <Automation />
        <Analytics />
        <Teams />
        <Journey />
        <Integrations />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
