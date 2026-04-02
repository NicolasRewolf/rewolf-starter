import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { google } from "googleapis"

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

const PORT = Number(process.env.PORT) || 8787
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173"
const OAUTH_REDIRECT_URI =
  process.env.OAUTH_REDIRECT_URI ?? "http://localhost:8787/auth/google/callback"

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

type WebCredentials = {
  client_id: string
  client_secret: string
  redirect_uris?: string[]
}

function findClientSecretPath(): string {
  if (process.env.GOOGLE_OAUTH_CLIENT_FILE) {
    return path.resolve(root, process.env.GOOGLE_OAUTH_CLIENT_FILE)
  }
  const files = fs.readdirSync(root).filter((f) => /^client_secret.*\.json$/u.test(f))
  if (files.length === 0) {
    throw new Error(
      "Aucun fichier client_secret*.json à la racine du projet. Définissez GOOGLE_OAUTH_CLIENT_FILE."
    )
  }
  return path.join(root, files[0])
}

function loadWebCredentials(): WebCredentials {
  const raw = JSON.parse(fs.readFileSync(findClientSecretPath(), "utf8")) as {
    web?: WebCredentials
    installed?: WebCredentials
  }
  const c = raw.web ?? raw.installed
  if (!c?.client_id || !c?.client_secret) {
    throw new Error("JSON OAuth invalide : client_id / client_secret manquants.")
  }
  return c
}

const tokenPath = path.resolve(root, process.env.GSC_TOKEN_FILE ?? "gsc-oauth-tokens.json")

type StoredTokens = {
  access_token?: string | null
  refresh_token?: string | null
  scope?: string | null
  token_type?: string | null
  expiry_date?: number | null
}

function loadTokens(): StoredTokens | null {
  try {
    if (!fs.existsSync(tokenPath)) return null
    return JSON.parse(fs.readFileSync(tokenPath, "utf8")) as StoredTokens
  } catch {
    return null
  }
}

function saveTokens(tokens: StoredTokens) {
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), "utf8")
}

function clearTokens() {
  if (fs.existsSync(tokenPath)) fs.unlinkSync(tokenPath)
}

function createOAuthClient() {
  const c = loadWebCredentials()
  return new google.auth.OAuth2(c.client_id, c.client_secret, OAUTH_REDIRECT_URI)
}

function getAuthorizedClient() {
  const oauth2 = createOAuthClient()
  const tokens = loadTokens()
  if (tokens) {
    oauth2.setCredentials({
      access_token: tokens.access_token ?? undefined,
      refresh_token: tokens.refresh_token ?? undefined,
      scope: tokens.scope ?? undefined,
      token_type: tokens.token_type ?? undefined,
      expiry_date: tokens.expiry_date ?? undefined,
    })
  }
  oauth2.on("tokens", (t) => {
    const prev = loadTokens() ?? {}
    saveTokens({
      ...prev,
      access_token: t.access_token ?? prev.access_token,
      refresh_token: t.refresh_token ?? prev.refresh_token,
      scope: t.scope ?? prev.scope,
      token_type: t.token_type ?? prev.token_type,
      expiry_date: t.expiry_date ?? prev.expiry_date,
    })
  })
  return oauth2
}

const requireAuth: express.RequestHandler = (_req, res, next) => {
  const tokens = loadTokens()
  if (!tokens?.refresh_token && !tokens?.access_token) {
    res.status(401).json({ error: "not_authenticated" })
    return
  }
  next()
}

function dateRange(days: number) {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

const app = express()
app.use(
  cors({
    origin: [FRONTEND_URL, "http://127.0.0.1:5173"],
    credentials: true,
  })
)
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

app.get("/api/auth/status", (_req, res) => {
  const tokens = loadTokens()
  const connected = Boolean(tokens?.refresh_token || tokens?.access_token)
  res.json({ connected })
})

app.post("/api/auth/logout", (_req, res) => {
  clearTokens()
  res.status(204).end()
})

app.get("/auth/google", (_req, res) => {
  const oauth2 = createOAuthClient()
  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  })
  res.redirect(url)
})

app.get("/auth/google/callback", async (req, res) => {
  const err = req.query.error as string | undefined
  if (err) {
    res.redirect(`${FRONTEND_URL}/?gsc_error=${encodeURIComponent(err)}`)
    return
  }
  const code = req.query.code as string | undefined
  if (!code) {
    res.status(400).send("Missing code")
    return
  }
  try {
    const oauth2 = createOAuthClient()
    const { tokens } = await oauth2.getToken(code)
    saveTokens(tokens as StoredTokens)
    res.redirect(`${FRONTEND_URL}/?gsc_connected=1`)
  } catch (e) {
    const message = e instanceof Error ? e.message : "oauth_error"
    res.redirect(`${FRONTEND_URL}/?gsc_error=${encodeURIComponent(message)}`)
  }
})

app.get("/api/gsc/sites", requireAuth, async (_req, res) => {
  try {
    const auth = getAuthorizedClient()
    const searchconsole = google.searchconsole("v1")
    const r = await searchconsole.sites.list({ auth })
    const entries = r.data.siteEntry ?? []
    const sites = entries.map((s) => ({
      siteUrl: s.siteUrl ?? "",
      permissionLevel: s.permissionLevel ?? "unknown",
    }))
    res.json({ sites })
  } catch (e) {
    const message = e instanceof Error ? e.message : "gsc_sites_error"
    res.status(500).json({ error: message })
  }
})

app.get("/api/gsc/performance", requireAuth, async (req, res) => {
  const siteUrl = req.query.siteUrl as string | undefined
  const days = Math.min(400, Math.max(1, Number(req.query.days) || 28))
  if (!siteUrl) {
    res.status(400).json({ error: "siteUrl_required" })
    return
  }
  try {
    const auth = getAuthorizedClient()
    const searchconsole = google.searchconsole("v1")
    const { startDate, endDate } = dateRange(days)

    const [dailyRes, queryRes] = await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        auth,
        requestBody: {
          startDate,
          endDate,
          dimensions: ["date"],
          rowLimit: 25_000,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        auth,
        requestBody: {
          startDate,
          endDate,
          dimensions: ["query"],
          rowLimit: 500,
        },
      }),
    ])

    const dailyRows = (dailyRes.data.rows ?? []).map((row) => {
      const date = row.keys?.[0] ?? ""
      const clicks = row.clicks ?? 0
      const impressions = row.impressions ?? 0
      const ctr = row.ctr ?? 0
      const position = row.position ?? 0
      return { date, clicks, impressions, ctr, position }
    })

    let totalClicks = 0
    let totalImpressions = 0
    let weightedPos = 0
    for (const row of dailyRows) {
      totalClicks += row.clicks
      totalImpressions += row.impressions
      weightedPos += row.position * row.impressions
    }
    const averageCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0
    const averagePosition =
      totalImpressions > 0 ? weightedPos / totalImpressions : 0

    const queriesRaw = (queryRes.data.rows ?? []).map((row) => ({
      query: row.keys?.[0] ?? "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }))
    const queries = [...queriesRaw].sort((a, b) => b.clicks - a.clicks).slice(0, 15)

    res.json({
      summary: {
        totalClicks,
        totalImpressions,
        averageCtr,
        averagePosition,
        periodDays: days,
        periodLabel: `${days} derniers jours`,
      },
      daily: dailyRows,
      queries,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "gsc_performance_error"
    res.status(500).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`API GSC http://localhost:${PORT}`)
  console.log(`Redirect OAuth: ${OAUTH_REDIRECT_URI}`)
})
