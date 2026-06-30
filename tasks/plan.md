# Implementation Plan: Layout éditeur

> Référence : [SPEC.md](../SPEC.md)

## Tâches

- [x] Types + localStorage (`editorLayout.ts`, `editorLayoutStorage.ts`)
- [x] `EditorLayoutProvider` + redimensionnement panneaux
- [x] Lanes : drag reorder + resize largeur
- [x] Blocs : drag move/reorder entre lanes
- [x] Boutons sauvegarder / restaurer layout
- [x] Tests reducer, storage

## Vérification locale

```bash
npm run format:check && npm run lint && npm run test:run && npm run build
```

## Essai manuel

Redimensionner panneaux et lanes → Sauvegarder layout → recharger la page → layout restauré. Layout par défaut remet les tailles d'origine.
