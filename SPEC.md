# Spec — Mutex

> **Statut :** En cours  
> **Feature :** post-MVP ([IDEAS.md](./IDEAS.md))

## Objective

Un bloc composite **Mutex** : un seul thread à la fois exécute les blocs placés en dessous dans la lane. Verrouillage et déverrouillage automatiques — pas de bloc « unlock » séparé.

## Success Criteria

- [x] Bloc « Mutex » dans la palette (nom de verrou éditable)
- [x] Moteur : acquire au début, release à la fin, état `blocked` si occupé
- [x] Visualisation : statut Bloqué sur la lane ; pastille propriétaire sur le bloc
- [x] Scénario « Race condition corrigée » (résultat stable x = 6)
- [x] Tests moteur + scénario

## Tech Stack

Voir [docs/project.md](./docs/project.md).

## Boundaries

- Pas de sémaphore en v1
- Pas de panneau mutex séparé
- Corps = blocs sous le mutex jusqu'à la fin de la lane (même modèle que la boucle)
