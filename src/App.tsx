import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Moon, Sun, Zap, BarChart2, Layout, Type } from "lucide-react"
import "./styles/globals.css"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function App() {
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? "dark" : ""}>
      <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>

        {/* Nav */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          background: "var(--background)",
          backdropFilter: "blur(12px)",
          zIndex: 50,
        }}>
          <span style={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: "1rem" }}>
            REWOLF<span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}>/starter</span>
          </span>
          <button
            onClick={() => setDark(!dark)}
            style={{
              width: 36, height: 36,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>

        {/* Hero */}
        <section style={{ padding: "80px 40px 64px", maxWidth: 960, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          >
            <motion.p
              custom={0} variants={fadeUp}
              style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}
            >
              Design System — v0.1.0
            </motion.p>

            <motion.h1
              custom={1} variants={fadeUp}
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 24, maxWidth: 700 }}
            >
              Réduire jusqu'à l'essentiel.
            </motion.h1>

            <motion.p
              custom={2} variants={fadeUp}
              style={{ fontSize: "1.0625rem", color: "var(--color-text-secondary)", maxWidth: 480, lineHeight: 1.65, marginBottom: 40 }}
            >
              Un starter minimaliste, organique, conçu pour construire vite et bien.
              shadcn/ui · Recharts · Framer Motion · Geist.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} style={{ display: "flex", gap: 12 }}>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                background: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                borderRadius: "var(--radius-md)",
                border: "none", cursor: "pointer",
                fontSize: "0.875rem", fontWeight: 500,
                fontFamily: "var(--font-sans)",
                transition: "opacity 0.15s ease",
              }}>
                Démarrer <ArrowUpRight size={14} />
              </button>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                background: "transparent",
                color: "var(--foreground)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)", cursor: "pointer",
                fontSize: "0.875rem", fontWeight: 400,
                fontFamily: "var(--font-sans)",
                transition: "all 0.15s ease",
              }}>
                Documentation
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", margin: "0 40px" }} />

        {/* Features grid */}
        <section style={{ padding: "64px 40px", maxWidth: 960, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}
          >
            {[
              { icon: Layout, label: "shadcn/ui", desc: "Composants accessibles, Radix-based, entièrement customisables." },
              { icon: BarChart2, label: "Recharts", desc: "Graphiques React composables. AreaChart, BarChart, ScatterPlot." },
              { icon: Zap, label: "Framer Motion", desc: "Animations physiques, gestures, layout transitions." },
              { icon: Type, label: "Geist + Mono", desc: "Typographie Vercel. Propre, lisible, moderne." },
            ].map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                custom={i} variants={fadeUp}
                style={{
                  padding: "32px 28px",
                  background: "var(--card)",
                  borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  transition: "background 0.2s ease",
                }}
              >
                <div style={{
                  width: 36, height: 36,
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                  color: "var(--color-text-secondary)",
                }}>
                  <Icon size={16} />
                </div>
                <p style={{ fontWeight: 500, marginBottom: 8, fontSize: "0.9375rem" }}>{label}</p>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Token showcase */}
        <section style={{ padding: "0 40px 80px", maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
            Design Tokens
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { name: "Canvas", value: "var(--color-canvas)" },
              { name: "Surface", value: "var(--color-surface)" },
              { name: "Border", value: "var(--color-border)" },
              { name: "Accent", value: "var(--color-accent)" },
              { name: "Muted", value: "var(--color-text-tertiary)" },
              { name: "Success", value: "var(--color-success)" },
              { name: "Warning", value: "var(--color-warning)" },
              { name: "Danger", value: "var(--color-danger)" },
            ].map(({ name, value }) => (
              <div key={name} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 14px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                background: "var(--card)",
              }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: value, border: "1px solid var(--border)" }} />
                <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
            REWOLF Studio — Bordeaux
          </span>
          <span style={{ fontSize: "0.8125rem", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
            rewolf.studio
          </span>
        </footer>

      </div>
    </div>
  )
}
