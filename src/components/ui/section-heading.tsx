import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./badge";

/** Green highlight for key words inside headlines. */
export function Highlight({ children, tone = "purple" }: { children: React.ReactNode; tone?: "green" | "purple" }) {
  return <span className={tone === "green" ? "text-brand-600" : "text-accent-500" /* large text: 3.4:1 passes AA */}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  eyebrowTone = "purple",
  title,
  description,
  align = "left",
  dark,
  className,
}: {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  eyebrowTone?: "green" | "purple" | "dark";
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" ? "items-center text-center" : "items-start", className)}>
      {eyebrow && (
        <Eyebrow icon={eyebrowIcon} tone={eyebrowTone}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-[2.6rem] lg:text-[2.85rem]",
          dark ? "text-white" : "text-ink",
          align === "center" && "max-w-3xl",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-xl text-[17px] leading-relaxed text-pretty",
            dark ? "text-white/65" : "text-muted",
            align === "center" && "max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
