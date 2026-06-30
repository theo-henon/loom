# Spec — Contrôle de vitesse d'exécution

> **Statut :** Draft — en attente de validation  
> **Feature :** post-MVP (IDEAS.md)

## Objective

Permettre à l'utilisateur de ralentir ou accélérer l'exécution automatique (Play) pour mieux observer les scénarios rapides ou avancer plus vite sur les longs.

**Utilisateur cible :** étudiant ou junior découvrant la concurrence via Loom.

**Critères de succès :**

- Un sélecteur de vitesse visible près des contrôles Play/Pause/Step/Reset
- Au minimum 3 vitesses : lente, normale, rapide
- La vitesse affecte uniquement le mode Play (pas Step)
- La vitesse choisie persiste pendant la session (pas de reset à chaque Play)
- Step et Reset restent inchangés

## Tech Stack

Voir [docs/project.md](./docs/project.md#tech-stack).

## Commands

```bash
npm run dev          # essai manuel
npm run format:check && npm run lint && npm run test:run
npm run build
```

## Project Structure

| Zone                       | Fichiers probables                                             |
| -------------------------- | -------------------------------------------------------------- |
| Constante / config vitesse | `src/hooks/useExecution.ts` ou `src/types/execution.ts`        |
| UI contrôle                | `src/components/execution/ExecutionControls.tsx`               |
| Contexte exécution         | `src/hooks/executionContext.types.ts`, `ExecutionProvider`     |
| Tests                      | `tests/hooks/useExecution.test.ts` (nouveau) ou test composant |

## Code Style

Voir conventions existantes (Prettier, composants fonctionnels, UI en français).

## Testing Strategy

- Test unitaire : intervalle Play change selon la vitesse sélectionnée
- Test composant : le sélecteur est rendu et change la vitesse
- Vérification manuelle : Play sur scénario Deadlock à vitesse lente → ticks observables

## Boundaries

- **Always :** tick-based engine inchangé ; pas de Web Workers
- **Ask first :** persistance localStorage de la vitesse
- **Never :** modifier la sémantique d'un tick

## Success Criteria

- [ ] Sélecteur vitesse dans le header à côté des contrôles d'exécution
- [ ] 3 vitesses minimum avec labels français clairs
- [ ] Play respecte la vitesse ; Step/Reset inchangés
- [ ] Tests passent ; CI verte

## Open Questions

1. Vitesses proposées : 1200 ms / 600 ms / 200 ms par tick — OK ?
2. Persistance localStorage souhaitée ou session uniquement ?

## Références

- [IDEAS.md — Speed control](./IDEAS.md)
- [VISION.md](./VISION.md)
