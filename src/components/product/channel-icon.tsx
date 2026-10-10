import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import type { Channel } from "@/data/conversations";

const channelStyles: Record<Channel, { bg: string; label: string }> = {
  whatsapp: { bg: "bg-[#25d366]", label: "WhatsApp" },
  instagram: { bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]", label: "Instagram" },
  facebook: { bg: "bg-[#1877f2]", label: "Facebook" },
  website: { bg: "bg-accent-500", label: "Website" },
};

export function ChannelIcon({ channel, size = "md", className }: { channel: Channel; size?: "xs" | "sm" | "md" | "lg"; className?: string }) {
  const style = channelStyles[channel];
  const Icon = channel === "whatsapp" ? WhatsAppIcon : channel === "instagram" ? InstagramIcon : channel === "facebook" ? FacebookIcon : Globe;
  return (
    <span
      title={style.label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-white",
        size === "xs" && "size-4 rounded-full [&_svg]:size-2.5",
        size === "sm" && "size-6 rounded-lg [&_svg]:size-3.5",
        size === "md" && "size-9 rounded-xl [&_svg]:size-5",
        size === "lg" && "size-12 rounded-2xl [&_svg]:size-6",
        style.bg,
        className,
      )}
    >
      <Icon className="" />
    </span>
  );
}

export const channelLabel = (c: Channel) => channelStyles[c].label;
