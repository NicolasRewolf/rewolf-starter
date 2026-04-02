/**
 * Données de démonstration pour le tableau de bord stats (aucune API).
 * Remplace ce module par tes propres fetch / state management en prod.
 */

export type DemoSite = {
  siteUrl: string
  label: string
}

export type DailyMetricRow = {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type QueryMetricRow = {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type PerformanceSummary = {
  totalClicks: number
  totalImpressions: number
  averageCtr: number
  averagePosition: number
  periodDays: number
  periodLabel: string
}

export const demoSites: DemoSite[] = [
  { siteUrl: "https://demo.example.com/", label: "Site démo" },
]

export const demoPerformanceSummary: PerformanceSummary = {
  totalClicks: 13635,
  totalImpressions: 553_942,
  averageCtr: 0.0246,
  averagePosition: 7.2,
  periodDays: 28,
  periodLabel: "28 derniers jours",
}

export const demoDailySeries: DailyMetricRow[] = [
  { date: "2026-03-05", clicks: 472, impressions: 20786, ctr: 0.0227, position: 7.3 },
  { date: "2026-03-06", clicks: 340, impressions: 18495, ctr: 0.0184, position: 7.6 },
  { date: "2026-03-07", clicks: 291, impressions: 13854, ctr: 0.021, position: 7.7 },
  { date: "2026-03-08", clicks: 281, impressions: 15044, ctr: 0.0187, position: 8.2 },
  { date: "2026-03-09", clicks: 520, impressions: 22510, ctr: 0.0231, position: 7.2 },
  { date: "2026-03-10", clicks: 587, impressions: 22498, ctr: 0.0261, position: 7.2 },
  { date: "2026-03-11", clicks: 552, impressions: 21460, ctr: 0.0257, position: 7.2 },
  { date: "2026-03-12", clicks: 497, impressions: 21953, ctr: 0.0226, position: 7.3 },
  { date: "2026-03-13", clicks: 463, impressions: 20503, ctr: 0.0226, position: 7.2 },
  { date: "2026-03-14", clicks: 435, impressions: 16105, ctr: 0.027, position: 7.3 },
  { date: "2026-03-15", clicks: 316, impressions: 13630, ctr: 0.0232, position: 7.7 },
  { date: "2026-03-16", clicks: 494, impressions: 20373, ctr: 0.0242, position: 7.7 },
  { date: "2026-03-17", clicks: 500, impressions: 21915, ctr: 0.0228, position: 7.3 },
  { date: "2026-03-18", clicks: 561, impressions: 21445, ctr: 0.0262, position: 7.4 },
  { date: "2026-03-19", clicks: 474, impressions: 21185, ctr: 0.0224, position: 7.5 },
  { date: "2026-03-20", clicks: 441, impressions: 18628, ctr: 0.0237, position: 7.7 },
  { date: "2026-03-21", clicks: 911, impressions: 18639, ctr: 0.0489, position: 6.8 },
  { date: "2026-03-22", clicks: 436, impressions: 16520, ctr: 0.0264, position: 7.3 },
  { date: "2026-03-23", clicks: 511, impressions: 22971, ctr: 0.0222, position: 7.1 },
  { date: "2026-03-24", clicks: 558, impressions: 22947, ctr: 0.0243, position: 6.9 },
  { date: "2026-03-25", clicks: 562, impressions: 24316, ctr: 0.0231, position: 6.8 },
  { date: "2026-03-26", clicks: 573, impressions: 22949, ctr: 0.025, position: 6.8 },
  { date: "2026-03-27", clicks: 486, impressions: 20705, ctr: 0.0235, position: 6.9 },
  { date: "2026-03-28", clicks: 270, impressions: 14135, ctr: 0.0191, position: 7.1 },
  { date: "2026-03-29", clicks: 350, impressions: 14258, ctr: 0.0245, position: 7.1 },
  { date: "2026-03-30", clicks: 579, impressions: 21406, ctr: 0.027, position: 7.0 },
  { date: "2026-03-31", clicks: 536, impressions: 20405, ctr: 0.0263, position: 6.9 },
  { date: "2026-04-01", clicks: 513, impressions: 19411, ctr: 0.0264, position: 6.9 },
]

export const demoTopQueries: QueryMetricRow[] = [
  { query: "starter react typescript", clicks: 436, impressions: 1300, ctr: 0.3354, position: 1.2 },
  { query: "design system dashboard", clicks: 56, impressions: 571, ctr: 0.0981, position: 3.0 },
  { query: "composants ui accessibles", clicks: 47, impressions: 384, ctr: 0.1224, position: 3.2 },
  { query: "rewolf studio", clicks: 45, impressions: 213, ctr: 0.2113, position: 1.0 },
  { query: "vite tailwind shadcn", clicks: 43, impressions: 338, ctr: 0.1272, position: 1.2 },
  { query: "graphiques recharts nivo", clicks: 37, impressions: 171, ctr: 0.2164, position: 1.1 },
  { query: "performance web vitals", clicks: 35, impressions: 9506, ctr: 0.0037, position: 8.8 },
  { query: "tableau de bord analytics", clicks: 33, impressions: 133, ctr: 0.2481, position: 1.0 },
  { query: "animations framer motion", clicks: 32, impressions: 147, ctr: 0.2177, position: 1.1 },
  { query: "tokens css variables", clicks: 31, impressions: 64, ctr: 0.4844, position: 1.2 },
  { query: "typescript strict mode", clicks: 30, impressions: 4206, ctr: 0.0071, position: 6.4 },
  { query: "architecture feature folders", clicks: 29, impressions: 2355, ctr: 0.0123, position: 2.9 },
  { query: "dark mode tailwind", clicks: 29, impressions: 551, ctr: 0.0526, position: 3.1 },
  { query: "responsive data table", clicks: 29, impressions: 683, ctr: 0.0425, position: 3.9 },
  { query: "export csv graphiques", clicks: 28, impressions: 398, ctr: 0.0704, position: 4.4 },
]
