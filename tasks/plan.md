# Implementation Plan: Phase 1.4 — Visualisation timeline

> Référence : [SPEC.md](../SPEC.md)

## Tâches

- [x] Type `TimelineSegment` + champ `timeline` dans `EngineState`
- [x] Enregistrement des segments dans `runTick` (`engine/timeline.ts`)
- [x] Fusion des segments adjacents (même bloc, ex. condition bloquée)
- [x] Composant `TimelinePanel` (grille, axe ticks, segments colorés)
- [x] Intégration dans `VisualizationPanel`
- [x] Auto-scroll pendant Play
- [x] Tests moteur timeline

## Vérification locale

```bash
npm run lint && npm run test:run && npm run build
```

## Essai manuel

Lancer Play sur un programme multi-threads — la timeline se remplit tick par tick et défile vers la droite.
