import { cn } from "@/lib/utils";
import { NavLink } from "@/components/ui/nav-link";
import { Logo } from "@/components/ui/logo";
import { footerNav, legalLinks } from "@/data/navigation";


export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-soft">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
              WhatsApp automation, shared inbox and CRM for teams that sell and support through conversations.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.title}>
                <p className="text-[13px] font-semibold text-ink">{group.title}</p>
                <ul className="mt-3 grid gap-0.5">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <NavLink href={l.href} className={cn("inline-block py-1 text-[14px] text-muted transition-colors", l.href && "hover:text-ink")}>
                        {l.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LeadsZone. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-0.5">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <NavLink href={l.href} className={cn("inline-block py-1", l.href && "hover:text-ink")}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-[12px] leading-relaxed text-subtle">
          WhatsApp and Meta are trademarks of Meta Platforms, Inc. Product screens on this page show illustrative sample data.
        </p>
      </div>
    </footer>
  );
}
