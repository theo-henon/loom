# Implementation Plan: Phase 1.5 — Scénarios pré-construits

> Référence : [SPEC.md](../SPEC.md)

## Tâches

- [x] Définitions des 3 scénarios (`src/scenarios/`)
- [x] Action `LOAD_SCENARIO` dans le reducer
- [x] Écran d'accueil `ScenarioWelcome`
- [x] Modal « Charger un scénario » depuis le header
- [x] Badge scénario actif dans le header
- [x] Tests scénarios + reducer + App

## Vérification locale

```bash
npm run lint && npm run test:run && npm run build
```

## Essai manuel

Charger « Deadlock », lancer Play — les deux threads se bloquent, ronds ambre + timeline visible.

## MVP

Phase 1.5 complète le MVP bootstrap. **Supprimer STARTUP.md** après merge si confirmé.
