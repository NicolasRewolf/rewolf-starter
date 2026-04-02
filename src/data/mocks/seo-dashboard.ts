/**
 * Snapshot Search Console — propriété et fenêtre alignées sur l’export GSC.
 * TODO: remplacer par API (OAuth + Search Console API) ou backend proxy sécurisé.
 */

export type GscProperty = {
  siteUrl: string
  permissionLevel: string
}

export type GscDailyRow = {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type GscQueryRow = {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type GscPerformanceSummary = {
  totalClicks: number
  totalImpressions: number
  averageCtr: number
  averagePosition: number
  periodDays: number
  periodLabel: string
}

export const gscProperties: GscProperty[] = [
  {
    siteUrl: "https://www.jplouton-avocat.fr/",
    permissionLevel: "siteFullUser",
  },
]

export const gscPerformanceSummary: GscPerformanceSummary = {
  totalClicks: 13635,
  totalImpressions: 553_942,
  averageCtr: 0.0246,
  averagePosition: 7.2,
  periodDays: 28,
  periodLabel: "28 derniers jours",
}

export const gscDailySeries: GscDailyRow[] = [
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

export const gscTopQueries: GscQueryRow[] = [
  { query: "claudine baquey", clicks: 436, impressions: 1300, ctr: 0.3354, position: 1.2 },
  { query: "durée garde à vue", clicks: 56, impressions: 571, ctr: 0.0981, position: 3.0 },
  {
    query: "exemple de condamnation pour travail dissimulé",
    clicks: 47,
    impressions: 384,
    ctr: 0.1224,
    position: 3.2,
  },
  { query: "julien plouton", clicks: 45, impressions: 213, ctr: 0.2113, position: 1.0 },
  { query: "affaire guy lecomte", clicks: 43, impressions: 338, ctr: 0.1272, position: 1.2 },
  { query: "plouton avocat", clicks: 37, impressions: 171, ctr: 0.2164, position: 1.1 },
  { query: "abandon de poste", clicks: 35, impressions: 9506, ctr: 0.0037, position: 8.8 },
  { query: "cabinet plouton", clicks: 33, impressions: 133, ctr: 0.2481, position: 1.0 },
  {
    query: "claudine baquey condamnation",
    clicks: 32,
    impressions: 147,
    ctr: 0.2177,
    position: 1.1,
  },
  {
    query: "eco environnement condamnation",
    clicks: 31,
    impressions: 64,
    ctr: 0.4844,
    position: 1.2,
  },
  { query: "civi", clicks: 30, impressions: 4206, ctr: 0.0071, position: 6.4 },
  { query: "avocat bordeaux", clicks: 29, impressions: 2355, ctr: 0.0123, position: 2.9 },
  { query: "garde a vue temps", clicks: 29, impressions: 551, ctr: 0.0526, position: 3.1 },
  { query: "guy lecomte", clicks: 29, impressions: 683, ctr: 0.0425, position: 3.9 },
  {
    query: "exemple d'indemnisation par la civi",
    clicks: 28,
    impressions: 398,
    ctr: 0.0704,
    position: 4.4,
  },
]
