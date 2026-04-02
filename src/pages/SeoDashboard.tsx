import { useCallback, useEffect, useMemo, useState } from "react"
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
  Loader2,
  LogIn,
  LogOut,
  MousePointerClick,
  Moon,
  Search,
  Sun,
  TrendingUp,
} from "lucide-react"
import { Toaster, toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  fetchAuthStatus,
  fetchGscPerformance,
  fetchGscSites,
  logoutGsc,
  type GscPerformancePayload,
} from "@/lib/gsc-remote"
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
  gscDailySeries,
  gscPerformanceSummary,
  gscProperties,
  gscTopQueries,
  type GscProperty,
} from "@/data/gsc-seo-dashboard"

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

type AuthState = "checking" | "guest" | "connected"

export function SeoDashboard() {
  const [dark, setDark] = useState(false)
  const [authState, setAuthState] = useState<AuthState>("checking")
  const [apiUnavailable, setApiUnavailable] = useState(false)
  const [serverSites, setServerSites] = useState<GscProperty[]>([])
  const [selectedSite, setSelectedSite] = useState(gscProperties[0]?.siteUrl ?? "")
  const [perf, setPerf] = useState<GscPerformancePayload | null>(null)
  const [perfLoading, setPerfLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get("gsc_error")
    const ok = params.get("gsc_connected")
    if (err) toast.error(decodeURIComponent(err))
    if (ok) toast.success("Google Search Console connecté")
    if (err || ok) {
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await fetchAuthStatus()
        if (cancelled) return
        if (s.connected) {
          setAuthState("connected")
          const { sites } = await fetchGscSites()
          if (cancelled) return
          setServerSites(sites)
          const first = sites[0]?.siteUrl ?? ""
          if (first) setSelectedSite(first)
        } else {
          setAuthState("guest")
        }
      } catch {
        if (cancelled) return
        setApiUnavailable(true)
        setAuthState("guest")
        toast.message("API locale indisponible", {
          description: "Lancez `npm run dev:api` (port 8787) ou `npm run dev:full`.",
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const loadPerf = useCallback(
    async (siteUrl: string) => {
      if (!siteUrl || authState !== "connected" || apiUnavailable) return
      setPerfLoading(true)
      try {
        const p = await fetchGscPerformance(siteUrl, 28)
        setPerf(p)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erreur performance GSC")
      } finally {
        setPerfLoading(false)
      }
    },
    [authState, apiUnavailable]
  )

  useEffect(() => {
    if (authState !== "connected" || apiUnavailable || !selectedSite) return
    void loadPerf(selectedSite)
  }, [selectedSite, authState, apiUnavailable, loadPerf])

  const sitesForSelect =
    authState === "connected" && serverSites.length > 0 ? serverSites : gscProperties

  const usingLive = authState === "connected" && !apiUnavailable && perf !== null
  const summary = usingLive ? perf.summary : gscPerformanceSummary
  const daily = usingLive ? perf.daily : gscDailySeries
  const queries = usingLive ? perf.queries : gscTopQueries

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

  async function handleLogout() {
    try {
      await logoutGsc()
      setAuthState("guest")
      setServerSites([])
      setPerf(null)
      setSelectedSite(gscProperties[0]?.siteUrl ?? "")
      toast.success("Déconnecté")
    } catch {
      toast.error("Déconnexion impossible")
    }
  }

  const badgeLabel =
    authState === "checking"
      ? "…"
      : usingLive
        ? summary.periodLabel
        : apiUnavailable
          ? "Démo (API hors ligne)"
          : "Démo — connectez Google"

  const subtitle =
    usingLive
      ? "Données Search Console (API)."
      : apiUnavailable
        ? "Données de démo — démarrez l’API pour le mode connecté."
        : "Connectez votre compte pour afficher les données réelles."

  return (
    <div className={cn(dark && "dark", "min-h-screen bg-background text-foreground")}>
      <Toaster richColors position="top-center" />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8">
          <div className="min-w-0">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
              Search Console
            </p>
            <h1 className="truncate text-lg font-medium tracking-tight md:text-xl">
              Performance SEO
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {perfLoading ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
            ) : null}
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="h-9 w-[min(100vw-8rem,280px)] border-border bg-card text-left md:w-[280px]">
                <SelectValue placeholder="Propriété" />
              </SelectTrigger>
              <SelectContent>
                {sitesForSelect.map((p) => (
                  <SelectItem key={p.siteUrl} value={p.siteUrl}>
                    {p.siteUrl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {authState === "guest" && !apiUnavailable ? (
              <Button type="button" className="h-9 gap-2" asChild>
                <a href="/auth/google">
                  <LogIn className="size-4" />
                  Google
                </a>
              </Button>
            ) : null}
            {authState === "connected" && !apiUnavailable ? (
              <Button
                type="button"
                variant="outline"
                className="h-9 gap-2 border-border"
                onClick={() => void handleLogout()}
              >
                <LogOut className="size-4" />
                Déconnexion
              </Button>
            ) : null}
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
              {badgeLabel}
            </Badge>
            <span className="text-sm text-muted-foreground">{subtitle}</span>
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
                  {authState === "checking" ? "…" : formatInt(summary.totalClicks)}
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
                  {authState === "checking" ? "…" : formatInt(summary.totalImpressions)}
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
                  {authState === "checking" ? "…" : formatPct(summary.averageCtr)}
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
                  {authState === "checking" ? "…" : formatPos(summary.averagePosition)}
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
                <CardTitle className="text-base">Requêtes les plus performantes</CardTitle>
                <CardDescription>Classement par clics sur la période</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Requête</TableHead>
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
            REWOLF · {usingLive ? "API Search Console" : "données de démo"}
          </p>
        </footer>
      </main>
    </div>
  )
}
