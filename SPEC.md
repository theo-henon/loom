# Spec — Layout éditeur (redimensionner / déplacer / sauvegarder)

> **Statut :** Implémentée  
> **Feature :** post-MVP (IDEAS.md)

## Objective

Permettre à l'utilisateur de ralentir ou accélérer l'exécution automatique (Play) pour mieux observer les scénarios rapides ou avancer plus vite sur les longs.

## Success Criteria

- [x] Sélecteur vitesse dans le header à côté des contrôles d'exécution
- [x] 3 vitesses : Lente (1200 ms), Normale (600 ms), Rapide (200 ms)
- [x] Play respecte la vitesse ; Step/Reset inchangés
- [x] Persistance session (state React, pas de localStorage)
- [x] Tests passent

## Références

- [IDEAS.md — Speed control](./IDEAS.md)
