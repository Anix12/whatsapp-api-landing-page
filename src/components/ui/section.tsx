import { cn } from "@/lib/utils";

const tones = {
  white: "bg-white",
  soft: "bg-soft",
  mint: "bg-gradient-to-b from-brand-50/70 via-white to-white",
  dark: "bg-night text-white",
};

export function Section({
  id,
  tone = "white",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: keyof typeof tones;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-16 overflow-x-clip py-20 sm:py-24 lg:py-28", tones[tone], className)}>
      <div className={cn("container-page", containerClassName)}>{children}</div>
    </section>
  );
}

/** Standard two-column "copy + product preview" layout. */
export function SplitLayout({
  copy,
  visual,
  reverse,
  splitAt = "lg",
  className,
}: {
  copy: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
  /** Breakpoint where columns go side by side; use "xl" for dense dashboards. */
  splitAt?: "lg" | "xl";
  className?: string;
}) {
  const lg = splitAt === "lg";
  return (
    <div
      className={cn(
        "grid items-center gap-14",
        lg ? "lg:gap-16" : "xl:gap-16",
        lg && (reverse ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"),
        !lg && (reverse ? "xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"),
        className,
      )}
    >
      <div className={cn("flex flex-col", reverse && (lg ? "lg:order-2" : "xl:order-2"), !lg && "max-w-2xl")}>{copy}</div>
      <div className={cn("min-w-0", reverse && (lg ? "lg:order-1" : "xl:order-1"))}>{visual}</div>
    </div>
  );
}
