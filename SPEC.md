# Spec — Blocs Condition et Boucle imbriqués

> **Statut :** En cours  
> **Feature :** post-MVP

## Objective

Condition et Boucle acceptent des blocs **enfants** (`children[]`), visuellement indentés — structure proche du code réel.

## Success Criteria

- [ ] `condition` et `loop` ont `children: Block[]`
- [ ] Moteur : exécution des enfants, condition fausse → bloqué
- [ ] UI : zone imbriquée + drag-and-drop dans Condition/Boucle
- [ ] Scénarios migrés
- [ ] Tests passent

## Boundaries

- Mutex inchangé (corps = blocs suivants dans le même conteneur)
- Pas de `else` sur Condition en v1

* Branche `sinon` optionnelle sur Si...Alors (`hasElse` + `elseChildren`)

## Tech Stack

Voir [docs/project.md](./docs/project.md).
