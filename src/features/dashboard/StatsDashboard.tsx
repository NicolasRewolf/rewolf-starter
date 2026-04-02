import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  BarChart2,
  MousePointerClick,
  Moon,
  Search,
  Sun,
  TrendingUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  demoDailySeries,
  demoPerformanceSummary,
  demoSites,
  demoTopQueries,
} from "@/data/mocks/stats-demo"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

function formatInt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n)
}

function formatPct(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function formatPos(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n)
}

type ChartRow = {
  label: string
  clicks: number
  impressions: number
}

export function StatsDashboard() {
  const [dark, setDark] = useState(false)
  const [selectedSite, setSelectedSite] = useState(demoSites[0]?.siteUrl ?? "")

  const summary = demoPerformanceSummary
  const daily = demoDailySeries
  const queries = demoTopQueries

  const sortedDaily = useMemo(
    () => [...daily].sort((a, b) => a.date.localeCompare(b.date)),
    [daily]
  )

  const chartData: ChartRow[] = useMemo(
    () =>
      sortedDaily.map((row) => ({
        label: format(parseISO(row.date), "d MMM", { locale: fr }),
        clicks: row.clicks,
        impressions: row.impressions,
      })),
    [sortedDaily]
  )

  return (
    <div className={cn(dark && "dark", "min-h-screen bg-background text-foreground")}>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8">
          <div className="min-w-0">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
              REWOLF Starter
            </p>
            <h1 className="truncate text-lg font-medium tracking-tight md:text-xl">
              Tableau de bord — stats (démo)
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="h-9 w-[min(100vw-8rem,280px)] border-border bg-card text-left md:w-[280px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {demoSites.map((p) => (
                  <SelectItem key={p.siteUrl} value={p.siteUrl}>
                    {p.label} · {p.siteUrl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? "Mode clair" : "Mode sombre"}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10 md:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="space-y-4"
        >
          <motion.div custom={0} variants={fadeUp} className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[0.6875rem] font-normal">
              {summary.periodLabel}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Données fictives pour présenter cartes, graphiques et tableau.
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clics
                </CardTitle>
                <MousePointerClick className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-medium tracking-tight">
                  {formatInt(summary.totalClicks)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Impressions
                </CardTitle>
                <BarChart2 className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-medium tracking-tight">
                  {formatInt(summary.totalImpressions)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">CTR moyen</CardTitle>
                <TrendingUp className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-medium tracking-tight">
                  {formatPct(summary.averageCtr)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Position moy.
                </CardTitle>
                <Search className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-medium tracking-tight">
                  {formatPos(summary.averagePosition)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="space-y-4"
        >
          <motion.div custom={0} variants={fadeUp}>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Tendance</CardTitle>
                <CardDescription>Clics et impressions par jour</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px] w-full pl-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid
                      stroke="var(--color-border)"
                      strokeOpacity={0.5}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      yAxisId="imp"
                      tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <YAxis
                      yAxisId="clk"
                      orientation="right"
                      tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null
                        const imp = payload.find((p) => p.dataKey === "impressions")?.value as
                          | number
                          | undefined
                        const clk = payload.find((p) => p.dataKey === "clicks")?.value as
                          | number
                          | undefined
                        return (
                          <div className="rounded-md border border-border bg-card px-3 py-2 text-xs text-card-foreground shadow-md">
                            <p className="mb-1 font-medium">{label}</p>
                            <p className="text-muted-foreground">
                              Impressions:{" "}
                              <span className="text-foreground">{imp != null ? formatInt(imp) : "—"}</span>
                            </p>
                            <p className="text-muted-foreground">
                              Clics:{" "}
                              <span className="text-foreground">{clk != null ? formatInt(clk) : "—"}</span>
                            </p>
                          </div>
                        )
                      }}
                    />
                    <Area
                      yAxisId="imp"
                      type="monotone"
                      dataKey="impressions"
                      stroke="var(--color-text-tertiary)"
                      fill="var(--color-text-tertiary)"
                      fillOpacity={0.12}
                      strokeWidth={1}
                    />
                    <Area
                      yAxisId="clk"
                      type="monotone"
                      dataKey="clicks"
                      stroke="var(--color-accent)"
                      fill="var(--color-accent)"
                      fillOpacity={0.12}
                      strokeWidth={1.5}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="space-y-4"
        >
          <motion.div custom={0} variants={fadeUp}>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Requêtes (exemple)</CardTitle>
                <CardDescription>Classement par clics sur la période</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Libellé</TableHead>
                      <TableHead className="text-right text-muted-foreground">Clics</TableHead>
                      <TableHead className="text-right text-muted-foreground">Impr.</TableHead>
                      <TableHead className="text-right text-muted-foreground">CTR</TableHead>
                      <TableHead className="text-right text-muted-foreground">Pos.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queries.map((row) => (
                      <TableRow key={row.query} className="border-border">
                        <TableCell className="max-w-[240px] truncate font-medium">{row.query}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatInt(row.clicks)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {formatInt(row.impressions)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {formatPct(row.ctr)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {formatPos(row.position)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        <footer className="border-t border-border pt-8">
          <p className="font-mono text-[0.75rem] text-muted-foreground">
            REWOLF Starter · données de démonstration · branche ton API dans{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[0.7rem]">src/data/mocks/</code>
          </p>
        </footer>
      </main>
    </div>
  )
}
