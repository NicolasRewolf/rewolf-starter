#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# REWOLF Starter — Upgrade Script
# Ajoute : Nivo, numeral, chart wrappers, nivo-theme, format helpers
# Usage   : bash rewolf-upgrade.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo ""
echo "▸ REWOLF Starter — Upgrade dataviz stack"
echo ""

# ─── 1. Dossiers ─────────────────────────────────────────────────────────────
echo "→ Création des dossiers..."
mkdir -p src/lib
mkdir -p src/components/charts

# ─── 2. Install npm ──────────────────────────────────────────────────────────
echo "→ Installation des dépendances npm..."
npm install \
  @nivo/core \
  @nivo/bar \
  @nivo/line \
  @nivo/pie \
  @nivo/heatmap \
  @nivo/treemap \
  @nivo/network \
  @nivo/scatterplot \
  numeral

npm install -D @types/numeral

# ─── 3. src/lib/nivo-theme.ts ────────────────────────────────────────────────
echo "→ Création de src/lib/nivo-theme.ts..."
cat > src/lib/nivo-theme.ts << 'ENDOFFILE'
/**
 * nivo-theme.ts
 * Theme Nivo synchronisé avec les design tokens REWOLF.
 * Usage : import { nivoTheme } from '@/lib/nivo-theme'
 */

import type { Theme } from '@nivo/core'

function cssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

export const nivoTheme: Theme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: cssVar('--color-text-secondary', '#6B6860'),
    fontFamily: 'Geist Variable, sans-serif',
  },
  axis: {
    domain: { line: { stroke: cssVar('--color-border', '#E2DED7'), strokeWidth: 1 } },
    legend: { text: { fontSize: 11, fill: cssVar('--color-text-secondary', '#6B6860'), fontFamily: 'Geist Variable, sans-serif' } },
    ticks: {
      line: { stroke: cssVar('--color-border', '#E2DED7'), strokeWidth: 1 },
      text: { fontSize: 11, fill: cssVar('--color-text-secondary', '#6B6860'), fontFamily: 'Geist Variable, sans-serif' },
    },
  },
  grid: { line: { stroke: cssVar('--color-border', '#E2DED7'), strokeWidth: 1, strokeOpacity: 0.5 } },
  legends: {
    text: { fontSize: 11, fill: cssVar('--color-text-secondary', '#6B6860'), fontFamily: 'Geist Variable, sans-serif' },
    ticks: { text: { fontSize: 11, fill: cssVar('--color-text-secondary', '#6B6860') } },
  },
  tooltip: {
    container: {
      background: cssVar('--color-surface', '#FFFFFF'),
      border: `1px solid ${cssVar('--color-border', '#E2DED7')}`,
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      color: cssVar('--color-text-primary', '#111110'),
      fontSize: 12,
      fontFamily: 'Geist Variable, sans-serif',
      padding: '8px 12px',
    },
  },
  crosshair: {
    line: { stroke: cssVar('--color-accent', '#1A1916'), strokeWidth: 1, strokeOpacity: 0.3, strokeDasharray: '4 4' },
  },
  annotations: {
    text: { fontSize: 11, fill: cssVar('--color-text-primary', '#111110'), outlineWidth: 2, outlineColor: cssVar('--color-surface', '#FFFFFF') },
    link: { stroke: cssVar('--color-accent', '#1A1916'), strokeWidth: 1 },
    outline: { fill: 'none', stroke: cssVar('--color-accent', '#1A1916'), strokeWidth: 2 },
    symbol: { fill: cssVar('--color-accent', '#1A1916'), outlineWidth: 2, outlineColor: cssVar('--color-surface', '#FFFFFF') },
  },
}

export const nivoColors = [
  '#1A1916',
  '#6B6860',
  '#B5B0A8',
  '#D4CFC7',
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
]
ENDOFFILE

# ─── 4. src/lib/format.ts ────────────────────────────────────────────────────
echo "→ Création de src/lib/format.ts..."
cat > src/lib/format.ts << 'ENDOFFILE'
/**
 * format.ts
 * Helpers de formatage — toujours utiliser ces fonctions, jamais de formatage inline.
 * Usage : import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
 */

import numeral from 'numeral'

export function formatCurrency(value: number, symbol = '€'): string {
  return `${numeral(value).format('0,0')} ${symbol}`
}

export function formatCurrencyFull(value: number, symbol = '€'): string {
  return `${numeral(value).format('0,0.00')} ${symbol}`
}

export function formatNumber(value: number): string {
  return numeral(value).format('0,0')
}

export function formatCompact(value: number): string {
  return numeral(value).format('0.[0]a').toUpperCase()
}

export function formatPercent(value: number, decimals = 1): string {
  return numeral(value).format(`0.[${'0'.repeat(decimals)}]`) + '%'
}

export function formatPercentSigned(value: number, decimals = 1): string {
  const formatted = numeral(Math.abs(value)).format(`0.${'0'.repeat(decimals)}`)
  return `${value >= 0 ? '+' : '-'}${formatted}%`
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export type Trend = 'up' | 'down' | 'neutral'

export function getTrend(value: number, positiveIsGood = true): Trend {
  if (value === 0) return 'neutral'
  if (value > 0) return positiveIsGood ? 'up' : 'down'
  return positiveIsGood ? 'down' : 'up'
}
ENDOFFILE

# ─── 5. src/components/charts/AreaChartCard.tsx ──────────────────────────────
echo "→ Création de src/components/charts/AreaChartCard.tsx..."
cat > src/components/charts/AreaChartCard.tsx << 'ENDOFFILE'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { cn } from '@/lib/utils'

interface LineConfig {
  key: string
  label?: string
  color?: string
  strokeWidth?: number
  dashed?: boolean
}

interface AreaChartCardProps {
  data: Record<string, unknown>[]
  xKey: string
  lines: LineConfig[]
  height?: number
  className?: string
  showGrid?: boolean
  showLegend?: boolean
  formatter?: (value: number) => string
}

function CustomTooltip({ active, payload, label, formatter }: {
  active?: boolean
  payload?: { color: string; name: string; value: number }[]
  label?: string
  formatter?: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--radius-md)] border px-3 py-2 text-xs shadow-md"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'Geist Variable, sans-serif' }}>
      <p className="mb-1 font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name} : {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

const DEFAULT_COLORS = ['var(--color-accent)', '#6B6860', '#B5B0A8', '#8B5CF6']

export function AreaChartCard({ data, xKey, lines, height = 240, className, showGrid = true, showLegend = false, formatter }: AreaChartCardProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {lines.map((line, i) => {
              const color = line.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
              return (
                <linearGradient key={line.key} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              )
            })}
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="0" stroke="var(--color-border)" strokeOpacity={0.5} vertical={false} />}
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)', fontFamily: 'Geist Variable, sans-serif' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)', fontFamily: 'Geist Variable, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={formatter} />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: 'var(--color-text-secondary)' }} />}
          {lines.map((line, i) => {
            const color = line.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
            return (
              <Area key={line.key} type="monotone" dataKey={line.key} name={line.label ?? line.key}
                stroke={color} strokeWidth={line.strokeWidth ?? 2} strokeDasharray={line.dashed ? '4 4' : undefined}
                fill={`url(#gradient-${line.key})`} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: color }} />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
ENDOFFILE

# ─── 6. src/components/charts/BarChartCard.tsx ───────────────────────────────
echo "→ Création de src/components/charts/BarChartCard.tsx..."
cat > src/components/charts/BarChartCard.tsx << 'ENDOFFILE'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { cn } from '@/lib/utils'

interface BarConfig { key: string; label?: string; color?: string; radius?: number }

interface BarChartCardProps {
  data: Record<string, unknown>[]
  xKey: string
  bars: BarConfig[]
  height?: number
  className?: string
  showGrid?: boolean
  showLegend?: boolean
  layout?: 'vertical' | 'horizontal'
  formatter?: (value: number) => string
  highlightLast?: boolean
}

function CustomTooltip({ active, payload, label, formatter }: {
  active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string; formatter?: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--radius-md)] border px-3 py-2 text-xs shadow-md"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'Geist Variable, sans-serif' }}>
      <p className="mb-1 font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map((e) => <p key={e.name} style={{ color: e.color }}>{e.name} : {formatter ? formatter(e.value) : e.value}</p>)}
    </div>
  )
}

const DEFAULT_COLORS = ['var(--color-accent)', '#6B6860', '#B5B0A8', '#8B5CF6']

export function BarChartCard({ data, xKey, bars, height = 240, className, showGrid = true, showLegend = false, layout = 'horizontal', formatter, highlightLast = false }: BarChartCardProps) {
  const lastIndex = data.length - 1
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={layout} margin={{ top: 8, right: 8, left: layout === 'vertical' ? 80 : -16, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="0" stroke="var(--color-border)" strokeOpacity={0.5} vertical={false} />}
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={formatter} />
            </>
          ) : (
            <>
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={formatter} />
              <YAxis dataKey={xKey} type="category" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} width={80} />
            </>
          )}
          <Tooltip content={<CustomTooltip formatter={formatter} />} cursor={{ fill: 'var(--color-border)', fillOpacity: 0.3 }} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
          {bars.map((bar, i) => {
            const color = bar.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
            return (
              <Bar key={bar.key} dataKey={bar.key} name={bar.label ?? bar.key} fill={color} radius={bar.radius ?? 4}>
                {highlightLast && data.map((_, idx) => <Cell key={`cell-${idx}`} fill={idx === lastIndex ? color : `${color}60`} />)}
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
ENDOFFILE

# ─── 7. src/components/charts/NivoBar.tsx ────────────────────────────────────
echo "→ Création de src/components/charts/NivoBar.tsx..."
cat > src/components/charts/NivoBar.tsx << 'ENDOFFILE'
import { ResponsiveBar } from '@nivo/bar'
import type { BarDatum, BarSvgProps } from '@nivo/bar'
import { nivoTheme, nivoColors } from '@/lib/nivo-theme'
import { cn } from '@/lib/utils'

interface NivoBarProps<D extends BarDatum = BarDatum>
  extends Partial<Omit<BarSvgProps<D>, 'data' | 'width' | 'height'>> {
  data: D[]
  keys: string[]
  indexBy: string
  height?: number
  className?: string
  layout?: 'horizontal' | 'vertical'
}

export function NivoBar<D extends BarDatum = BarDatum>({ data, keys, indexBy, height = 320, className, layout = 'vertical', ...props }: NivoBarProps<D>) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveBar data={data} keys={keys} indexBy={indexBy} theme={nivoTheme}
        colors={nivoColors.slice(0, keys.length)} layout={layout}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }} padding={0.3} borderRadius={4}
        axisBottom={{ tickSize: 0, tickPadding: 8 }} axisLeft={{ tickSize: 0, tickPadding: 8 }}
        enableGridX={false} enableLabel={false} animate motionConfig="gentle" {...props} />
    </div>
  )
}
ENDOFFILE

# ─── 8. src/components/charts/NivoLine.tsx ───────────────────────────────────
echo "→ Création de src/components/charts/NivoLine.tsx..."
cat > src/components/charts/NivoLine.tsx << 'ENDOFFILE'
import { ResponsiveLine } from '@nivo/line'
import type { LineSvgProps } from '@nivo/line'
import { nivoTheme, nivoColors } from '@/lib/nivo-theme'
import { cn } from '@/lib/utils'

interface NivoLineProps extends Partial<Omit<LineSvgProps, 'data' | 'width' | 'height'>> {
  data: LineSvgProps['data']
  height?: number
  className?: string
  area?: boolean
}

export function NivoLine({ data, height = 320, className, area = false, ...props }: NivoLineProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveLine data={data} theme={nivoTheme} colors={nivoColors.slice(0, data.length)}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }} yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
        curve="monotoneX" axisBottom={{ tickSize: 0, tickPadding: 8 }} axisLeft={{ tickSize: 0, tickPadding: 8 }}
        enableGridX={false} lineWidth={2} enablePoints pointSize={6} pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }} pointColor="var(--color-surface)"
        enableArea={area} areaOpacity={0.1} enableSlices="x" animate motionConfig="gentle" {...props} />
    </div>
  )
}
ENDOFFILE

# ─── 9. src/components/charts/NivoPie.tsx ────────────────────────────────────
echo "→ Création de src/components/charts/NivoPie.tsx..."
cat > src/components/charts/NivoPie.tsx << 'ENDOFFILE'
import { ResponsivePie } from '@nivo/pie'
import type { PieSvgProps } from '@nivo/pie'
import { nivoTheme, nivoColors } from '@/lib/nivo-theme'
import { cn } from '@/lib/utils'

type PieDatum = { id: string; value: number; label?: string }

interface NivoPieProps extends Partial<Omit<PieSvgProps<PieDatum>, 'data' | 'width' | 'height'>> {
  data: PieDatum[]
  height?: number
  className?: string
  donut?: boolean
}

export function NivoPie({ data, height = 280, className, donut = true, ...props }: NivoPieProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsivePie data={data} theme={nivoTheme} colors={nivoColors.slice(0, data.length)}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={donut ? 0.6 : 0} padAngle={0.5} cornerRadius={3} activeOuterRadiusOffset={4}
        borderWidth={0} arcLinkLabelsSkipAngle={10} arcLinkLabelsTextColor="var(--color-text-secondary)"
        arcLinkLabelsThickness={1} arcLinkLabelsColor={{ from: 'color' }} arcLabelsSkipAngle={10}
        arcLabelsTextColor="var(--color-surface)" animate motionConfig="gentle" {...props} />
    </div>
  )
}
ENDOFFILE

# ─── 10. src/components/charts/NivoHeatmap.tsx ───────────────────────────────
echo "→ Création de src/components/charts/NivoHeatmap.tsx..."
cat > src/components/charts/NivoHeatmap.tsx << 'ENDOFFILE'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import type { HeatMapSvgProps, DefaultHeatMapDatum, HeatMapDatum } from '@nivo/heatmap'
import { nivoTheme } from '@/lib/nivo-theme'
import { cn } from '@/lib/utils'

interface NivoHeatmapProps<D extends HeatMapDatum = DefaultHeatMapDatum, E extends object = Record<string, never>>
  extends Partial<Omit<HeatMapSvgProps<D, E>, 'data' | 'width' | 'height'>> {
  data: HeatMapSvgProps<D, E>['data']
  height?: number
  className?: string
}

export function NivoHeatmap<D extends HeatMapDatum = DefaultHeatMapDatum, E extends object = Record<string, never>>({ data, height = 320, className, ...props }: NivoHeatmapProps<D, E>) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveHeatMap data={data} theme={nivoTheme}
        margin={{ top: 20, right: 20, bottom: 60, left: 80 }} axisTop={null}
        axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -45 }} axisLeft={{ tickSize: 0, tickPadding: 8 }}
        colors={{ type: 'sequential', scheme: 'greys', minValue: 0 }}
        emptyColor="var(--color-canvas)" borderWidth={2} borderColor="var(--color-surface)"
        animate motionConfig="gentle" {...props} />
    </div>
  )
}
ENDOFFILE

# ─── 11. src/components/charts/NivoTreemap.tsx ───────────────────────────────
echo "→ Création de src/components/charts/NivoTreemap.tsx..."
cat > src/components/charts/NivoTreemap.tsx << 'ENDOFFILE'
import { ResponsiveTreeMap } from '@nivo/treemap'
import type { TreeMapSvgProps, DefaultTreeMapDatum } from '@nivo/treemap'
import { nivoTheme, nivoColors } from '@/lib/nivo-theme'
import { cn } from '@/lib/utils'

interface NivoTreemapProps<D extends object = DefaultTreeMapDatum>
  extends Partial<Omit<TreeMapSvgProps<D>, 'data' | 'width' | 'height'>> {
  data: TreeMapSvgProps<D>['data']
  height?: number
  className?: string
}

export function NivoTreemap<D extends object = DefaultTreeMapDatum>({ data, height = 320, className, ...props }: NivoTreemapProps<D>) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveTreeMap data={data} theme={nivoTheme} colors={nivoColors}
        margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        identity="name" value="value" valueFormat=".02s" tile="squarify"
        leavesOnly={false} innerPadding={3} outerPadding={3} borderWidth={0}
        labelSkipSize={24} labelTextColor="var(--color-surface)" parentLabelTextColor="var(--color-surface)"
        animate motionConfig="gentle" {...props} />
    </div>
  )
}
ENDOFFILE

# ─── 12. .cursorrules ─────────────────────────────────────────────────────────
echo "→ Mise à jour de .cursorrules..."
cat > .cursorrules << 'ENDOFFILE'
# REWOLF Starter — Cursor Rules
# Stack: React 19 · TypeScript · Vite · Tailwind v4 · shadcn/ui · Recharts · Nivo · Framer Motion

## Identité design
Tu es un designer-développeur minimaliste, à la croisée de Apple et Dieter Rams.
Chaque interface doit être sobre, organique, intentionnelle. Rien de superflu.

## Stack obligatoire
- **Composants UI** : shadcn/ui exclusivement → importer depuis `@/components/ui/`
- **Graphiques simples** : Recharts (AreaChart, BarChart, LineChart, ScatterChart, PieChart)
- **Graphiques premium** : Nivo (@nivo/bar, @nivo/line, @nivo/pie, @nivo/heatmap, @nivo/treemap)
- **Animations** : Framer Motion (motion.div, AnimatePresence, useAnimate)
- **Icônes** : Lucide React exclusivement
- **Styles** : Tailwind CSS + CSS variables définies dans `src/styles/globals.css`
- **Typo** : Geist Variable (sans) + Geist Mono (code) — jamais Inter, Roboto, Arial
- **Formatage nombres** : numeral.js via `src/lib/format.ts`

## Quand utiliser Recharts vs Nivo
- **Recharts** : composants déclaratifs simples, intégration rapide dans des cartes
- **Nivo** : visualisations avancées (heatmap, treemap, network), quand le rendu premium compte
- Toujours passer par les wrappers dans `src/components/charts/`

## Design tokens (toujours utiliser les variables CSS)
- Couleurs : `var(--color-canvas)`, `var(--color-surface)`, `var(--color-accent)`, `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--color-border)`
- Radius : `var(--radius-sm)` (4px), `var(--radius-md)` (8px), `var(--radius-lg)` (12px)
- Shadows : `var(--shadow-xs)`, `var(--shadow-sm)`, `var(--shadow-md)`

## Règles de style strictes
- **Jamais** de couleurs hardcodées — toujours les variables CSS
- **Jamais** de composants UI créés from scratch si shadcn/ui en a un équivalent
- **Toujours** prévoir dark mode
- **Toujours** `cn()` de `@/lib/utils` pour combiner les classes Tailwind

## Animations Framer Motion
- Entrées : `opacity: 0 → 1` + `y: 16 → 0`, duration 0.45s, easing `[0.22, 1, 0.36, 1]`
- Stagger enfants : `staggerChildren: 0.07`
- Hover states : scale 1.01 max

## Nivo
- Theme depuis `src/lib/nivo-theme.ts` — ne jamais hardcoder les couleurs
- Toujours les variantes `Responsive*`
- Margin standard : `{ top: 20, right: 20, bottom: 50, left: 60 }`

## Architecture fichiers
```
src/
  components/
    ui/          ← shadcn/ui
    layout/      ← Sidebar, Header, Shell
    charts/      ← wrappers Recharts + Nivo
    shared/      ← composants métier
  lib/
    utils.ts
    nivo-theme.ts
    format.ts
  styles/
    globals.css
  hooks/
  data/          ← mocks TypeScript (// TODO: remplacer par API)
  pages/
```

## Ce que tu ne fais jamais
- Couleurs hardcodées ou `bg-white` / `text-black`
- Gradients violet/bleu génériques
- Instancier Nivo/Recharts directement dans les pages
- Oublier les types TypeScript
ENDOFFILE

# ─── 13. Git add + commit + push ─────────────────────────────────────────────
echo ""
echo "→ Git commit & push..."
git add -A
git commit -m "feat: Nivo stack + chart wrappers + format helpers + nivo-theme"
git push

echo ""
echo "✓ Upgrade terminé et pushé sur GitHub !"
echo ""
echo "  Nouvelles libs : @nivo/* · numeral"
echo "  Nouveaux fichiers :"
echo "    src/lib/nivo-theme.ts"
echo "    src/lib/format.ts"
echo "    src/components/charts/AreaChartCard.tsx"
echo "    src/components/charts/BarChartCard.tsx"
echo "    src/components/charts/NivoBar.tsx"
echo "    src/components/charts/NivoLine.tsx"
echo "    src/components/charts/NivoPie.tsx"
echo "    src/components/charts/NivoHeatmap.tsx"
echo "    src/components/charts/NivoTreemap.tsx"
echo ""
