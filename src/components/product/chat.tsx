import { ArrowLeft, Bot, CheckCheck, Download, EllipsisVertical, FileText, Mic, Paperclip, Phone, SendHorizontal, FaceSlightlySmiling, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import type { ChatMessage } from "@/data/conversations";

/**
 * A single WhatsApp-style message. Each bubble is its own element so
 * Phase 2 can stagger them in one at a time.
 */
export function ChatBubble({ message, compact, className }: { message: ChatMessage; compact?: boolean; className?: string }) {
  const outgoing = message.from !== "customer";
  return (
    <div data-chat-bubble={message.id} className={cn("flex w-full flex-col gap-1.5", outgoing ? "items-end" : "items-start", className)}>
      {message.from === "bot" && (
        <span className="inline-flex items-center gap-1 pr-1 text-[10px] font-medium text-accent-500">
          <Bot className="size-3" /> AI reply
        </span>
      )}
      {message.attachment ? (
        <FileAttachment {...message.attachment} time={message.time} />
      ) : (
        <div
          className={cn(
            "relative max-w-[min(85%,360px)] rounded-2xl px-3 py-2 text-ink shadow-[0_1px_1px_rgb(16_24_40/0.06)]",
            compact ? "text-[12px] leading-[1.45]" : "text-[13px] leading-[1.5]",
            outgoing ? "rounded-tr-md bg-bubble-out" : "rounded-tl-md bg-white",
          )}
        >
          {message.text}
          <span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] whitespace-nowrap text-muted">
            {message.time}
            {outgoing && <CheckCheck className="size-3 text-sky-500" />}
          </span>
        </div>
      )}
      {message.quickReplies && <QuickReplies options={message.quickReplies} compact={compact} />}
    </div>
  );
}

export function QuickReplies({ options, compact, className }: { options: string[]; compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex w-[85%] max-w-[280px] flex-col gap-1", className)}>
      {options.map((o) => (
        <span
          key={o}
          className={cn(
            "rounded-xl bg-white text-center font-medium text-sky-700 shadow-[0_1px_1px_rgb(16_24_40/0.06)]",
            compact ? "py-1.5 text-[11.5px]" : "py-2 text-[12.5px]",
          )}
        >
          {o}
        </span>
      ))}
    </div>
  );
}

export function FileAttachment({ name, size, time }: { name: string; size: string; time: string }) {
  return (
    <div className="flex w-[78%] max-w-[300px] items-center gap-3 rounded-2xl rounded-tr-md bg-bubble-out p-2.5 shadow-[0_1px_1px_rgb(16_24_40/0.06)]">
      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-rose-500 text-white">
        <FileText className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-ink">{name}</p>
        <p className="text-[10.5px] text-muted">
          {size} · PDF · {time}
        </p>
      </div>
      <Download className="size-4 text-muted" />
    </div>
  );
}

/** WhatsApp-style top bar used inside phone mockups. */
export function ChatHeader({ name, status = "Online", verified, className }: { name: string; status?: string; verified?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 bg-brand-900 px-3 py-2.5 text-white", className)}>
      <ArrowLeft className="size-4 opacity-80" />
      <Avatar name={name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate text-[13px] font-semibold">
          {name}
          {verified && <BadgeCheck className="size-3.5 fill-brand-400 text-brand-900" />}
        </p>
        <p className="text-[10.5px] text-white/70">{status}</p>
      </div>
      <Phone className="size-4 opacity-80" />
      <EllipsisVertical className="size-4 opacity-80" />
    </div>
  );
}

export function ChatComposer({ voice, className }: { voice?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 px-2 pb-2.5", className)}>
      <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-white px-3 text-[12px] text-subtle shadow-[0_1px_1px_rgb(16_24_40/0.06)]">
        <FaceSlightlySmiling className="size-4" />
        <span className="flex-1">Type a message…</span>
        <Paperclip className="size-3.5" />
      </div>
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-500 text-white">
        {voice ? <Mic className="size-4" /> : <SendHorizontal className="size-4" />}
      </span>
    </div>
  );
}

/** Beige WhatsApp wallpaper surface for message lists. */
export function ChatSurface({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn("bg-chat", className)}
      style={{
        backgroundImage:
          "radial-gradient(rgb(16 24 40 / 0.035) 1px, transparent 1px), radial-gradient(rgb(16 24 40 / 0.03) 1px, transparent 1px)",
        backgroundSize: "22px 22px, 22px 22px",
        backgroundPosition: "0 0, 11px 11px",
      }}
    >
      {children}
    </div>
  );
}
