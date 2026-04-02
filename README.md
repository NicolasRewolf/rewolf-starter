# REWOLF Starter

> Stack minimaliste, organique, production-ready.  
> Vite · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Recharts · Framer Motion · Geist

---

## Stack

| Couche | Lib |
|--------|-----|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styles | Tailwind CSS v4 |
| Composants | shadcn/ui (Radix UI) |
| Graphiques | Recharts |
| Animations | Framer Motion |
| Icônes | Lucide React |
| Typo | Geist Variable + Geist Mono |

---

## Démarrage

```bash
# 1. Cloner
git clone https://github.com/ton-user/rewolf-starter mon-projet
cd mon-projet

# 2. Bootstrap (installe tout + composants shadcn)
bash setup.sh

# 3. Dev
npm run dev
```

---

## Design System

Les design tokens sont dans `src/styles/globals.css`.

### Palette

| Token | Valeur (light) |
|-------|----------------|
| `--color-canvas` | `#F7F6F3` |
| `--color-surface` | `#FFFFFF` |
| `--color-accent` | `#1A1916` |
| `--color-text-primary` | `#111110` |
| `--color-text-secondary` | `#6B6860` |
| `--color-border` | `#E2DED7` |

Dark mode natif via la classe `.dark` sur le root.

### Typographie

- **Sans** : `Geist Variable` — titres, UI, corps
- **Mono** : `Geist Mono` — code, labels, metadata

### Radius

- `--radius-sm` : 4px
- `--radius-md` : 8px  
- `--radius-lg` : 12px

---

## Structure

```
src/
  components/
    ui/          ← shadcn/ui (auto-généré)
    layout/      ← Sidebar, Header, Shell
    charts/      ← wrappers Recharts
    shared/      ← composants métier
  lib/
    utils.ts     ← cn() helper
  styles/
    globals.css  ← design tokens + base
  hooks/
  pages/
```

---

## Cursor Rules

Le fichier `.cursorrules` est pré-configuré avec :
- Stack UI obligatoire (shadcn, Recharts, Framer, Lucide)
- Conventions de design tokens
- Architecture fichiers
- Règles animations
- Conventions Recharts

---

*REWOLF Studio — Bordeaux*
