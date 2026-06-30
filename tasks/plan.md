# Implementation Plan: Layout éditeur

# Implementation Plan: Contrôle de vitesse d'exécution

> Référence : [SPEC.md](../SPEC.md)

## Tâches

- [x] Types + localStorage (`editorLayout.ts`, `editorLayoutStorage.ts`)
- [x] `EditorLayoutProvider` + redimensionnement panneaux
- [x] Lanes : drag reorder + resize largeur
- [x] Blocs : drag move/reorder entre lanes
- [x] Boutons sauvegarder / restaurer layout
- [x] Tests reducer, storage
- [x] Types et presets (`executionSpeed.ts`)
- [x] État `speed` + intervalle dynamique dans `useExecution`
- [x] Sélecteur UI dans `ExecutionControls`
- [x] Tests types, hook (fake timers), composant

## Vérification locale

```bash
npm run format:check && npm run lint && npm run test:run && npm run build
```

## Essai manuel

Redimensionner panneaux et lanes → Sauvegarder layout → recharger la page → layout restauré. Layout par défaut remet les tailles d'origine.
Charger Deadlock → vitesse Lente → Play → observer ticks et timeline plus lentement.
