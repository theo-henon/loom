# Spec : Phase 1.2 — Moteur d'exécution simulé

> **Statut :** Implémentée  
> **Phase :** Bootstrap (STARTUP.md)

## Objectif

Simuler l'exécution concurrente des lanes tick par tick, avec variables partagées et contrôles Play/Pause/Step/Reset.

## Tech Stack

Voir [docs/project.md](./docs/project.md#tech-stack).

## Success Criteria

- [x] Moteur tick-by-tick (chaque thread avance d'un bloc par tick)
- [x] Sémantique Variable, Opération, Condition (blocage), Boucle
- [x] Variables partagées affichées en temps réel
- [x] Contrôles Play / Pause / Step / Reset
- [x] États thread : idle, running, blocked, done
- [x] Surbrillance du bloc actif
- [x] Tests unitaires moteur

## Références

- [STARTUP.md — Phase 1.2](./STARTUP.md#phase-12--moteur-dexécution-simulé)
