import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./brand-icons";

const palettes = [
  "bg-[#e0f2fe] text-[#0369a1]",
  "bg-[#fce7f3] text-[#be185d]",
  "bg-[#ede9fe] text-[#5b21b6]",
  "bg-[#fef3c7] text-[#b45309]",
  "bg-[#d1fae5] text-[#047857]",
  "bg-[#ffe4e6] text-[#be123c]",
  "bg-[#e0e7ff] text-[#4338ca]",
  "bg-[#ccfbf1] text-[#0f766e]",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function paletteFor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

const sizes = {
  xs: "size-5 text-[9px]",
  sm: "size-7 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-11 text-sm",
};

/** Initials avatar — deterministic colour per name, optional WhatsApp channel dot. */
export function Avatar({
  name,
  size = "md",
  whatsapp,
  ring,
  className,
}: {
  name: string;
  size?: keyof typeof sizes;
  whatsapp?: boolean;
  ring?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold",
          sizes[size],
          paletteFor(name),
          ring && "ring-2 ring-white",
        )}
        aria-hidden
      >
        {initials(name)}
      </span>
      {whatsapp && (
        <span className="absolute -right-0.5 -bottom-0.5 inline-flex size-3.5 items-center justify-center rounded-full bg-white">
          <WhatsAppIcon className="size-3 text-brand-500" />
        </span>
      )}
    </span>
  );
}

export function AvatarStack({
  names,
  extra,
  size = "sm",
}: {
  names: string[];
  extra?: number;
  size?: keyof typeof sizes;
}) {
  return (
    <span className="inline-flex items-center -space-x-1.5">
      {names.map((n) => (
        <Avatar key={n} name={n} size={size} ring />
      ))}
      {extra ? (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-line-soft font-semibold text-muted ring-2 ring-white",
            sizes[size],
          )}
        >
          +{extra}
        </span>
      ) : null}
    </span>
  );
}
