import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { routes } from "@/data/navigation";

export function FinalCta() {
  return (
    <section id="get-started" className="scroll-mt-16 bg-white pb-20 sm:pb-24">
      <div id="book-demo" className="container-page scroll-mt-16">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-accent-700 via-accent-900 to-night px-6 py-16 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="bg-grid-night absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
            <div className="absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(34_201_138/0.22),transparent)]" />
          </div>
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-[#25d366] text-white shadow-[0_8px_24px_-6px_rgb(37_211_102/0.55)] ring-1 ring-white/20">
            <WhatsAppIcon className="size-6" />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-white sm:text-5xl">
            Ready to turn conversations into customers?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
            Bring your WhatsApp conversations, automation, and sales pipeline together with LeadsZone.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={routes.startFree} size="lg" variant="light">
              Start Free <ArrowRight />
            </Button>
            <Button href={routes.bookDemo} size="lg" variant="outlineLight">
              <CalendarCheck /> Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
