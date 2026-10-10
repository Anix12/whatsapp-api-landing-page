import { ArrowRight, CalendarCheck, ShieldCheck, Users, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/badge";
import { Highlight } from "@/components/ui/section-heading";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { routes } from "@/data/navigation";
// Client island: only the product demo is interactive; the copy stays server-rendered.
import { HeroVisual } from "./hero-demo";

const trust: { label: string; icon: LucideIcon }[] = [
  { label: "Quick Setup", icon: Zap },
  { label: "Built for Growing Teams", icon: Users },
  { label: "Secure & Reliable", icon: ShieldCheck },
];

export function Hero() {
  return (
    <section className="relative overflow-x-clip">
      {/* restrained backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-10%] h-[640px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgb(108_77_255/0.11),transparent)]" />
        <div className="absolute top-40 right-[22%] h-[360px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(0_184_107/0.08),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
      </div>

      <div className="container-page grid items-center gap-16 pt-14 pb-24 sm:pt-20 xl:grid-cols-[minmax(0,1fr)_620px] xl:gap-12 xl:pt-24 xl:pb-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center xl:mx-0 xl:items-start xl:text-left">
          <Eyebrow icon={WhatsAppIcon}>WhatsApp Automation & CRM Platform</Eyebrow>
          <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink sm:text-6xl xl:text-[3.9rem]">
            Turn <Highlight>WhatsApp</Highlight> Conversations Into Business <Highlight>Growth.</Highlight>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            Capture leads, automate customer conversations, run WhatsApp campaigns, and close more deals — all from one
            intelligent platform.
          </p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href={routes.startFree} size="lg">
              Start Free <ArrowRight />
            </Button>
            <Button href={routes.bookDemo} size="lg" variant="secondary">
              <CalendarCheck /> Book a Demo
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3 xl:justify-start">
            {trust.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2 text-[14px] font-medium text-ink-soft">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <Icon className="size-3.5" strokeWidth={2.25} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
