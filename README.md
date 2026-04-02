# REWOLF Starter

Stack **design + dataviz + architecture** prête à l’emploi : **Vite · React 19 · TypeScript · Tailwind v4 · shadcn/ui**.  
Aucun backend ni intégration externe dans le dépôt — uniquement l’UI, des **statistiques de démo** et une structure de dossiers claire.

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

---

## Démarrage

```bash
git clone https://github.com/NicolasRewolf/rewolf-starter.git mon-projet
cd mon-projet
npm install
# optionnel : composants shadcn
bash scripts/setup.sh
npm run dev
```

---

## Structure

```
src/
  features/
    dashboard/
      StatsDashboard.tsx   ← page d’exemple (cartes, graphique, tableau)
  components/
    ui/                      ← shadcn
    charts/                  ← wrappers Recharts & Nivo
  data/
    mocks/
      stats-demo.ts          ← séries & agrégats fictifs
  lib/
    format.ts, nivo-theme.ts, utils.ts
  styles/
    globals.css
  hooks/
```

Branche ta propre source de données en remplaçant ou en alimentant `src/data/mocks/` (ou en ajoutant des hooks / un client API dans ton app).

---

## Design system

Tokens dans `src/styles/globals.css`. Dark mode : classe `.dark` sur le document.

---

## Cursor

Voir `.cursorrules` pour les conventions UI et l’organisation des fichiers.

---

*REWOLF Studio — Bordeaux*
