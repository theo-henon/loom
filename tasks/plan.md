# Implementation Plan: Phase 1.2 — Moteur d'exécution simulé

> Référence : [SPEC.md](../SPEC.md)

## Tâches

- [x] Types execution + blockSemantics + engine
- [x] useExecution + ExecutionProvider
- [x] ExecutionControls + SharedVariablesPanel + surbrillance blocs
- [x] Tests moteur

## Vérification locale

```bash
npm run lint && npm run test:run && npm run build
```

## Essai manuel

1. Thread 1 : Variable `x = 0`
2. Thread 2 : Opération `x + 1`
3. Step × 2 → variable partagée `x = 1`
