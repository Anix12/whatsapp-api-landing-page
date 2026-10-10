import { cn } from "@/lib/utils";

/**
 * Device frame. Children render inside the screen; the screen is a flex
 * column so headers/composers can pin to top and bottom.
 */
export function PhoneMockup({ className, screenClassName, children }: { className?: string; screenClassName?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative w-[280px] rounded-[44px] bg-[#1b1f27] p-[9px] shadow-[0_40px_80px_-24px_rgb(16_24_40/0.45),0_0_0_1px_rgb(16_24_40/0.12),inset_0_0_0_1.5px_rgb(255_255_255/0.08)]",
        className,
      )}
    >
      <div className={cn("relative flex h-[560px] flex-col overflow-hidden rounded-[36px] bg-chat", screenClassName)}>
        {/* status bar */}
        <div className="relative flex h-8 shrink-0 items-center justify-between bg-brand-900 px-6 text-[11px] font-semibold text-white">
          <span>9:41</span>
          <span className="absolute top-1.5 left-1/2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-[#1b1f27]" />
          <span className="flex items-center gap-1">
            <span className="flex items-end gap-px">
              {[4, 6, 8, 10].map((h) => (
                <span key={h} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />
              ))}
            </span>
            <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-white/80 p-px">
              <span className="block h-full w-3/4 rounded-[1px] bg-white" />
            </span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
