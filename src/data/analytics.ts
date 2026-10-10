/** Analytics dashboard — all values are illustrative sample data. */

/** Daily leads created over 30 days (sum = the dashboard's 30-day "New leads"). */
export const leadsSeries = [
  22, 26, 24, 31, 28, 30, 27, 33, 35, 32, 38, 36, 34, 40, 37, 42, 39, 44, 41, 46, 43, 49, 47, 52, 50, 55, 53, 58, 61, 66,
];

/** Shares of new leads by source — sums to 100. */
export const leadSources = [
  { label: "WhatsApp ads", value: 38, color: "#00b86b" },
  { label: "Website", value: 28, color: "#6c4dff" },
  { label: "Referrals", value: 20, color: "#a99bff" },
  { label: "Other", value: 14, color: "#d0d5dd" },
];

export const teamResponse = [
  { name: "Arjun Mehra", time: "1m 10s", seconds: 70, pct: 92 },
  { name: "Sofia Alvarez", time: "1m 55s", seconds: 115, pct: 74 },
  { name: "Lucas Romero", time: "2m 40s", seconds: 160, pct: 56 },
];

/** Won deals per month; the latest month is the dashboard's "Won deals". */
export const conversionByMonth = [
  { month: "Jan", value: 48 },
  { month: "Feb", value: 56 },
  { month: "Mar", value: 63 },
  { month: "Apr", value: 71 },
  { month: "May", value: 88 },
  { month: "Jun", value: 96 },
];
