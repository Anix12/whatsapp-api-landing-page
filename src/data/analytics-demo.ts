import { conversionByMonth, leadsSeries, teamResponse } from "@/data/analytics";

/**
 * Analytics live dashboard — one timeline drives every KPI and chart (sample data, ~17.6s loop).
 * Numbers are derived from the chart data so they always agree:
 *   New leads (30d)   = sum of the daily series; the line's last point is "today".
 *   Won deals         = the latest (highlighted) month in the conversion chart.
 *   Avg. first reply  = mean of the team response times.
 */
const total = leadsSeries.reduce((a, b) => a + b, 0);
const today = leadsSeries[leadsSeries.length - 1];
const latestMonth = conversionByMonth[conversionByMonth.length - 1];
const prevMonth = conversionByMonth[conversionByMonth.length - 2];
const avgReplySec = Math.round(teamResponse.reduce((a, t) => a + t.seconds, 0) / teamResponse.length);
const fmt = (sec: number) => `${Math.floor(sec / 60)}m ${String(sec % 60).padStart(2, "0")}s`;

export const analyticsDemo = {
  startDelay: 300,
  stages: [
    { id: "rest", duration: 800 },
    { id: "load", duration: 2200 }, //    cards settle, KPIs count to opening values
    { id: "line", duration: 3000 }, //    leads line draws; tooltip on today; New leads +today
    { id: "bars", duration: 3000 }, //    conversion bars grow; latest month highlighted; Won deals
    { id: "donut", duration: 3000 }, //   lead-source segments sweep in; top source highlighted
    { id: "team", duration: 2400 }, //    response bars fill; Avg. first reply settles; growth chip
    { id: "hold", duration: 2600 }, //    completed dashboard
    { id: "outro", duration: 600 }, //    charts fade before resetting
  ],
  kpis: {
    newLeads: { opening: total - today, final: total },
    wonDeals: { opening: prevMonth.value, final: latestMonth.value },
    reply: { opening: fmt(avgReplySec + 10), final: fmt(avgReplySec) },
  },
  today,
  total,
  latestMonth: latestMonth.month,
  growth: `+${(((latestMonth.value - prevMonth.value) / prevMonth.value) * 100).toFixed(1)}%`,
  highlightSource: "WhatsApp ads",
} as const;

export type AnalyticsStageId = (typeof analyticsDemo.stages)[number]["id"];
export const analyticsStage = (id: AnalyticsStageId) => analyticsDemo.stages.findIndex((s) => s.id === id);
