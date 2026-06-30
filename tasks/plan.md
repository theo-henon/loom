# Implementation Plan: Phase 1.3 — Visualisation inline

> Référence : [SPEC.md](../SPEC.md)

## Tâches

- [x] Couleurs thread (`threadColors.ts` + champ `lane.color`)
- [x] Composant `ThreadDot`
- [x] Intégration dans blocs, lanes et panneau visualisation
- [x] Animation CSS `thread-dot-pop`
- [x] Tests

## Vérification locale

```bash
npm run lint && npm run test:run && npm run build
```

## Essai manuel

Lancer Play sur un programme multi-threads — les ronds colorés se déplacent bloc par bloc.
