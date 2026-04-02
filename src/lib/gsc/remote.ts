import type { GscDailyRow, GscPerformanceSummary, GscProperty, GscQueryRow } from "@/data/mocks/seo-dashboard"

export type GscPerformancePayload = {
  summary: GscPerformanceSummary
  daily: GscDailyRow[]
  queries: GscQueryRow[]
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!res.ok) {
    try {
      const j = JSON.parse(text) as { error?: string }
      throw new Error(j.error ?? text)
    } catch {
      throw new Error(text || res.statusText)
    }
  }
  return JSON.parse(text) as T
}

export async function fetchAuthStatus(): Promise<{ connected: boolean }> {
  const res = await fetch("/api/auth/status")
  return parseJson(res)
}

export async function fetchGscSites(): Promise<{ sites: GscProperty[] }> {
  const res = await fetch("/api/gsc/sites")
  return parseJson(res)
}

export async function fetchGscPerformance(
  siteUrl: string,
  days: number
): Promise<GscPerformancePayload> {
  const q = new URLSearchParams({
    siteUrl,
    days: String(days),
  })
  const res = await fetch(`/api/gsc/performance?${q}`)
  return parseJson(res)
}

export async function logoutGsc(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" })
  if (!res.ok) throw new Error("logout_failed")
}
