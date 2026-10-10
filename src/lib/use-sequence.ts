"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Global playback speed for every product demo on the page.
 * Stage durations in the data files are multiplied by this (0.35 ≈ 3× faster than the original pacing).
 * Lower = quicker; 1 = the original pacing.
 */
export const DEMO_SPEED = 0.35;

/**
 * Deterministic, pausable stage sequencer.
 *
 * Holds a single timer at a time: each stage schedules the next one after its
 * duration. Pausing stores the time left in the current stage so playback
 * resumes exactly where it stopped. After the last stage it wraps to 0 and
 * bumps `iteration`, which callers can use as a key for per-loop content.
 *
 * `initialDelay` replaces stage 0's duration on the very first pass only —
 * used to stagger several demos that become visible together.
 */
export function useSequence(
  durations: readonly number[],
  { playing, initialDelay }: { playing: boolean; initialDelay?: number },
) {
  const [{ stage, iteration }, setState] = useState({ stage: 0, iteration: 0 });
  // Time left in a paused stage, keyed so it only applies to that same stage run.
  const pausedRef = useRef<{ key: string; ms: number } | null>(null);

  useEffect(() => {
    if (!playing) return;
    const key = `${iteration}:${stage}`;
    const raw = stage === 0 && iteration === 0 && initialDelay !== undefined ? initialDelay : durations[stage];
    // Speed everything up, but never squeeze a stage below 450ms so short fades/outros still finish cleanly.
    const base = Math.max(raw * DEMO_SPEED, Math.min(raw, 450));
    const duration = pausedRef.current?.key === key ? pausedRef.current.ms : base;
    pausedRef.current = null;
    const startedAt = performance.now();
    const id = window.setTimeout(() => {
      setState(stage + 1 < durations.length ? { stage: stage + 1, iteration } : { stage: 0, iteration: iteration + 1 });
    }, duration);
    return () => {
      window.clearTimeout(id);
      pausedRef.current = { key, ms: Math.max(0, duration - (performance.now() - startedAt)) };
    };
  }, [stage, iteration, playing, durations, initialDelay]);

  const restart = useCallback(() => setState((st) => ({ stage: 0, iteration: st.iteration + 1 })), []);

  return { stage, iteration, restart };
}

/** True while the browser tab is visible. */
export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

/** Reads prefers-reduced-motion after mount, so SSR and hydration always agree. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * A self-contained demo loop: plays only while `ref` is on screen and the tab
 * is visible, and never plays for reduced-motion users (callers render their
 * final frame instead).
 */
export function useDemoPlayback(
  ref: React.RefObject<Element | null>,
  durations: readonly number[],
  { initialDelay, amount = 0.35 }: { initialDelay?: number; amount?: number } = {},
) {
  const inView = useInView(ref, { amount });
  const pageVisible = usePageVisible();
  const reduced = usePrefersReducedMotion();
  const sequence = useSequence(durations, { playing: inView && pageVisible && !reduced, initialDelay });
  return { ...sequence, reduced };
}
