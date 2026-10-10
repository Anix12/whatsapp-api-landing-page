import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import type { FlowNode } from "@/data/automation";
import { IconTile } from "./surface";

export type NodeState = "idle" | "active" | "done" | "dimmed";

/**
 * Automation-builder node card. `data-node` used for Phase 2 sequencing.
 * `state` only changes colours/opacity (never size), so a running workflow never shifts layout.
 */
export function WorkflowNode({
  node,
  state = "idle",
  className,
  children,
}: {
  node: FlowNode;
  state?: NodeState;
  className?: string;
  children?: React.ReactNode;
}) {
  const ai = node.tone === "purple";
  return (
    <div
      data-node={node.id}
      data-state={state}
      className={cn(
        "relative rounded-2xl border bg-white p-3.5 shadow-card transition-[border-color,box-shadow,opacity] duration-500",
        state === "active" && (ai ? "border-accent-400 shadow-[0_0_0_4px_rgb(108_77_255/0.10)]" : "border-brand-400 shadow-[0_0_0_4px_rgb(0_184_107/0.10)]"),
        state === "done" && "border-brand-200",
        // Inactive branch: dashed + greyed, but text keeps AA contrast (no whole-card opacity).
        state === "dimmed" && "border-dashed border-[#d0d5dd] bg-soft shadow-none",
        state === "idle" && "border-line",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <IconTile icon={node.icon} tone={state === "dimmed" ? "gray" : node.tone} size="md" className="transition-colors duration-500" />
        <div className="min-w-0 flex-1">
          <p className={cn("text-[13.5px] leading-5 font-semibold transition-colors duration-500", state === "dimmed" ? "text-muted" : "text-ink")}>
            {node.step && <span className="mr-1 text-subtle">{node.step}.</span>}
            {node.title}
          </p>
          <p className="text-[12px] text-muted">{node.description}</p>
        </div>
        {node.status && <StatusBadge tone={state === "dimmed" ? "gray" : node.status.tone}>{node.status.label}</StatusBadge>}
      </div>
      {children}
      <span
        aria-hidden={state !== "done"}
        className={cn(
          "absolute -top-2 -right-2 inline-flex size-5 items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-white transition-[opacity,transform] duration-300",
          state === "done" ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    </div>
  );
}

/** Vertical connector between nodes, with optional arrowhead. `active` turns it solid green. */
export function Connector({ className, dashed, dark, active }: { className?: string; dashed?: boolean; dark?: boolean; active?: boolean }) {
  return (
    <div data-connector data-active={active || undefined} className={cn("relative mx-auto flex h-6 w-px flex-col items-center", className)} aria-hidden>
      <span
        className={cn(
          "h-full w-px transition-colors duration-500",
          active ? "bg-brand-400" : dashed ? "border-l border-dashed" : "",
          !active && (dark ? "border-white/25 bg-white/20" : dashed ? "border-accent-400/70" : "bg-[#d0d5dd]"),
        )}
      />
      <svg
        viewBox="0 0 8 6"
        className={cn("-mt-px size-2 transition-colors duration-500", active ? "text-brand-400" : dark ? "text-white/40" : dashed ? "text-accent-400" : "text-[#98a2b3]")}
      >
        <path d="M0 0h8L4 6z" fill="currentColor" />
      </svg>
    </div>
  );
}
