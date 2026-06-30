# Implementation Plan: Phase 0 — Fondations techniques

> Référence : [SPEC.md](../SPEC.md) (validée 2026-06-29)

## Tâches

- [x] T1 — Branche + scaffold Vite/React/TS (`base: '/loom/'`)
- [x] T2 — Tailwind CSS 4 via `@tailwindcss/vite`
- [x] T3 — Structure dossiers + layout trois panneaux
- [x] T4 — Vitest + smoke test
- [x] T5 — ESLint + Prettier
- [x] T6 — Favicon placeholder
- [x] T7 — GitHub Actions deploy.yml
- [x] T8 — README + validation SC1–SC10

## Vérification locale

```bash
npm run lint && npm run format:check && npm run test:run && npm run build
```

## Action manuelle post-merge

Settings → Pages → Source → **GitHub Actions** (pas `main / root`).
