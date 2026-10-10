"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, RefreshCw } from "lucide-react";
import { useDemoPlayback } from "@/lib/use-sequence";
import { swapTransition } from "./motion-primitives";
import { channelSyncDemo } from "@/data/teams-demo";

const DURATIONS = channelSyncDemo.stages.map((s) => s.duration);

/**
 * Small live-status line for the core WhatsApp channel card only (sample UI).
 * Cycles "Syncing…" → "Up to date"; static "Up to date" for reduced motion.
 */
export function ChannelSyncStatus() {
  const ref = useRef<HTMLDivElement>(null);
  const { stage, reduced } = useDemoPlayback(ref, DURATIONS, { initialDelay: 1500, amount: 0.5 });
  const syncing = !reduced && channelSyncDemo.stages[stage].id === "syncing";
  return (
    <div ref={ref} data-channel-sync={syncing ? "syncing" : "synced"} className="mt-4 flex h-5 items-center border-t border-line-soft pt-3 text-[11.5px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={syncing ? "syncing" : "synced"} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={swapTransition} className="inline-flex items-center gap-1.5">
          {syncing ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, ease: "easeInOut" }} className="inline-flex text-brand-700">
                <RefreshCw className="size-3.5" />
              </motion.span>
              <span className="text-brand-700">Syncing conversations…</span>
            </>
          ) : (
            <>
              <CircleCheck className="size-3.5 text-brand-700" />
              <span className="text-muted">
                Live · <span className="font-medium text-brand-700">up to date</span>
              </span>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
