"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, type Transition } from "motion/react";
import { DEMO_SPEED } from "@/lib/use-sequence";
import { Bot, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared motion tokens for product demos. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const enterTransition: Transition = { duration: 0.35, ease: EASE };
export const floatTransition: Transition = { duration: 0.45, ease: EASE };
export const swapTransition: Transition = { duration: 0.3, ease: EASE };

/** AI "typing…" bubble on the outgoing side of a chat. */
export function TypingIndicator({ label = "AI assistant", human, className }: { label?: string; human?: boolean; className?: string }) {
  const Icon = human ? UserRound : Bot;
  return (
    <div className={cn("flex flex-col items-end gap-1.5", className)} aria-label={`${label} is typing`}>
      <span className={cn("inline-flex items-center gap-1 pr-1 text-[10px] font-medium", human ? "text-brand-700" : "text-accent-500")}>
        <Icon className="size-3" /> {label}
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tr-md bg-bubble-out px-3.5 py-3 shadow-[0_1px_1px_rgb(16_24_40/0.06)]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-brand-700/60"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.16 }}
          />
        ))}
      </div>
    </div>
  );
}

/** Number that rolls up when `animateChange` is set and swaps silently otherwise (e.g. loop resets). */
export function RollingNumber({ value, animateChange }: { value: number; animateChange: boolean }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={animateChange ? { y: "70%", opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={animateChange ? { y: "-70%", opacity: 0 } : { opacity: 0, transition: { duration: 0 } }}
          transition={swapTransition}
          className="tabular-nums"
        >
          {value.toLocaleString("en-US")}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const formatCount = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * Counter that counts up to `value` by writing straight to the DOM (no React
 * re-render per frame). Decreases (loop resets) and `instant` jump directly.
 */
export function CountUp({ value, duration = 1.4, instant }: { value: number; duration?: number; instant?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  // Text is only rendered once; afterwards the effect owns it, so React never overwrites a frame.
  const [initialText] = useState(() => formatCount(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = prev.current;
    prev.current = value;
    if (instant || value <= from) {
      el.textContent = formatCount(value);
      return;
    }
    const controls = animate(from, value, { duration: duration * DEMO_SPEED, ease: EASE, onUpdate: (v) => (el.textContent = formatCount(v)) });
    return () => controls.stop();
  }, [value, duration, instant]);

  return (
    <span ref={ref} className="tabular-nums">
      {initialText}
    </span>
  );
}
