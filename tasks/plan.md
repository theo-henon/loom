# Implementation Plan: Contrôle de vitesse d'exécution

> Référence : [SPEC.md](../SPEC.md)

## Tâches

- [x] Types et presets (`executionSpeed.ts`)
- [x] État `speed` + intervalle dynamique dans `useExecution`
- [x] Sélecteur UI dans `ExecutionControls`
- [x] Tests types, hook (fake timers), composant

## Vérification locale

```bash
npm run format:check && npm run lint && npm run test:run && npm run build
```

## Essai manuel

Charger Deadlock → vitesse Lente → Play → observer ticks et timeline plus lentement.
