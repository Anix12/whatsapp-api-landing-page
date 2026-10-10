"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { IconTile } from "@/components/product/surface";
import { mainNav, routes, type NavItem } from "@/data/navigation";

function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-lg px-3 text-[14.5px] font-medium text-ink-soft transition-colors hover:text-ink",
          open && "text-ink",
        )}
      >
        {item.label}
        <ChevronDown className={cn("size-3.5 text-subtle transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2">
          <div className="w-[520px] rounded-2xl border border-line bg-white p-2 shadow-panel">
            <div className="grid grid-cols-2 gap-1">
              {item.children!.map((link) => (
                <NavLink
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn("group flex items-start gap-3 rounded-xl p-3 transition-colors", link.href && "hover:bg-soft")}
                >
                  {link.icon && <IconTile icon={link.icon} tone="gray" size="sm" className="group-hover:bg-accent-50 group-hover:text-accent-600" />}
                  <span>
                    <span className="block text-[14px] font-medium text-ink">
                      {link.label}
                      {!link.href && <span className="ml-1.5 rounded-full bg-line-soft px-1.5 py-px align-middle text-[10px] font-medium text-muted">Soon</span>}
                    </span>
                    <span className="block text-[12.5px] leading-snug text-muted">{link.description}</span>
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      // Keep Tab focus inside the open dialog.
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div ref={panelRef} className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-panel">
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo />
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="inline-flex size-10 items-center justify-center rounded-lg text-ink-soft hover:bg-soft">
            <X className="size-5" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.label} className="border-b border-line-soft last:border-0">
                <button
                  type="button"
                  aria-expanded={expanded === item.label}
                  onClick={() => setExpanded((v) => (v === item.label ? null : item.label))}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3.5 text-[15px] font-medium text-ink"
                >
                  {item.label}
                  <ChevronDown className={cn("size-4 text-subtle transition-transform", expanded === item.label && "rotate-180")} />
                </button>
                {expanded === item.label && (
                  <div className="grid gap-0.5 pb-3">
                    {item.children.map((link) => (
                      <NavLink key={link.label} href={link.href} onClick={onClose} soonBadge className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", link.href && "hover:bg-soft")}>
                        {link.icon && <IconTile icon={link.icon} tone="gray" size="sm" />}
                        <span className="text-[14px] text-ink-soft">{link.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.label} href={item.href} onClick={onClose} soonBadge className="block border-b border-line-soft px-3 py-3.5 text-[15px] font-medium text-ink last:border-0">
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="grid gap-2.5 border-t border-line p-5">
          <Button href={routes.startFree} onClick={onClose}>Start Free</Button>
          <Button href={routes.bookDemo} variant="secondary" onClick={onClose}>Book a Demo</Button>
          {routes.login && (
            <Button href={routes.login} variant="ghost" onClick={onClose}>
              Log in
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-colors",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {mainNav.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} />
            ) : (
              <NavLink
                key={item.label}
                href={item.href}
                soonBadge
                className={cn("inline-flex h-9 items-center rounded-lg px-3 text-[14.5px] font-medium text-ink-soft transition-colors", item.href && "hover:text-ink")}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          {/* No login page yet → hidden until NEXT_PUBLIC_LOGIN_URL is configured. */}
          {routes.login && (
            <Link href={routes.login} className="hidden px-2 text-[14.5px] font-medium text-ink-soft hover:text-ink lg:inline">
              Log in
            </Link>
          )}
          <Button href={routes.bookDemo} variant="secondary" size="sm" className="hidden sm:inline-flex">
            Book a Demo
          </Button>
          <Button href={routes.startFree} size="sm" className="hidden sm:inline-flex">
            Start Free
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink hover:bg-soft lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
    {/* Rendered outside <header>: its backdrop-filter would otherwise trap position:fixed */}
    <MobileDrawer open={mobileOpen} onClose={closeMobile} />
    </>
  );
}
