import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureList({
  items,
  tone = "green",
  className,
}: {
  items: string[];
  tone?: "green" | "purple";
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] leading-6 text-ink-soft">
          <span
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
              tone === "green" ? "bg-brand-500 text-white" : "bg-accent-500 text-white",
            )}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
