# REWOLF Starter

Stack minimaliste, production-ready : **Vite · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Express (API OAuth GSC)**.

---

## Stack

| Couche | Lib / outil |
|--------|----------------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styles | Tailwind CSS v4 |
| Composants | shadcn/ui (Radix) |
| Graphiques | Recharts, Nivo, Tremor, Visx, Plotly.js, Observable Plot |
| Animations | Framer Motion, react-spring |
| Icônes | Lucide React |
| Typo | Geist Variable |
| API locale | Express (`server/`) — Google Search Console OAuth |

---

## Démarrage

```bash
git clone https://github.com/NicolasRewolf/rewolf-starter.git mon-projet
cd mon-projet
bash scripts/setup.sh
npm run dev
```

**Dashboard SEO + Google** : placer le JSON OAuth Google à la racine (voir `.env.example`), puis `npm run dev:full` (API + Vite). Détail : [`docs/google-search-console.md`](docs/google-search-console.md).

---

## Scripts npm

| Commande | Rôle |
|----------|------|
| `npm run dev` | Vite seul |
| `npm run dev:api` | API Express (Search Console) |
| `npm run dev:full` | API + Vite |
| `npm run build` | Build production |
| `npm run typecheck:server` | Typecheck serveur |

---

## Structure du dépôt

```
rewolf-starter/
  scripts/
    setup.sh              ← bootstrap deps + shadcn
  server/
    index.ts              ← OAuth + routes /api/gsc/*
  docs/
    google-search-console.md
  src/
    App.tsx, main.tsx     ← entrée Vite
    features/
      seo/
        SeoDashboard.tsx  ← écran dashboard SEO
    components/
      ui/                 ← shadcn
      charts/             ← wrappers Recharts & Nivo
    data/
      mocks/
        seo-dashboard.ts  ← données de démo / types GSC
    lib/
      gsc/                ← client API (`fetch` vers /api)
      format.ts
      nivo-theme.ts
      utils.ts
    styles/
      globals.css
```

---

## Design system

Les tokens sont dans `src/styles/globals.css` (palette, radius, ombres). Dark mode : classe `.dark` sur le root.

---

## Cursor

Le fichier `.cursorrules` décrit la stack, les tokens et les conventions de fichiers.

---

*REWOLF Studio — Bordeaux*
