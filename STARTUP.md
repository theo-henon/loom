# Plan de démarrage — Loom

> ⚠️ **Document temporaire.** Ce fichier porte le plan de démarrage du projet
> jusqu'au MVP. Une fois le MVP atteint, **SUPPRIMER ce fichier** — le git log
> préserve l'historique. Le projet continue ensuite via `/spec` sur des
> features individuelles avec agent-skills.
>
> Ne PAS étendre ce fichier avec des phases post-MVP. Les idées futures
> vont dans [IDEAS.md](./IDEAS.md). Les décisions architecturales majeures
> vont dans `docs/adr/` via la skill `documentation-and-adrs`.

---

## Phase 0 — Fondations techniques

**Objectif :** Poser l'environnement technique complet avant tout développement
fonctionnel visible.

**Contenu :**

- Setup Vite + React 19 + TypeScript + Tailwind CSS 4.x
- Structure de fichiers : `src/components/`, `src/engine/`, `src/scenarios/`, `src/hooks/`, `src/types/`
- Layout skeleton : panneau gauche (palette de blocs) + centre (éditeur de lanes) + droite (panneau de visualisation)
- Déploiement initial sur GitHub Pages via GitHub Actions
- Configuration Vite pour GitHub Pages (base URL)

**Critère de fin :** L'app tourne en local ET sur GitHub Pages via `main`,
le layout vide est visible avec les trois panneaux.

---

## Phase 1.1 — Éditeur de blocs + système de lanes

**Objectif :** Construire l'éditeur visuel — la palette de blocs et le système
de lanes parallèles.

**Ce qu'un utilisateur peut faire à la fin :** Créer plusieurs lanes (threads),
ajouter des blocs depuis la palette dans chaque lane, éditer les propriétés
de chaque bloc (nom de variable, valeur, opérateur, condition...).

**Contenu technique :**

- Composants de blocs : `VariableBlock`, `OperationBlock`, `ConditionBlock`, `LoopBlock`
- Composant `Lane` : une lane = un thread futur, plusieurs lanes côte à côte
- Composant `BlockPalette` : panneau gauche avec les types de blocs disponibles
- Ajout de blocs par clic ou drag-and-drop dans une lane
- Propriétés éditables inline sur chaque bloc
- Ajout et suppression de lanes dynamiquement

**Critère de fin :** On peut créer 2 lanes, y ajouter des blocs de types
différents, éditer leurs propriétés, et voir la structure affichée.

---

## Phase 1.2 — Moteur d'exécution simulé

**Objectif :** Implémenter le moteur qui simule l'exécution concurrente des lanes.

**Ce qu'un utilisateur peut faire à la fin :** Lancer l'exécution d'un programme
à 2 threads et voir les blocs s'activer séquentiellement, avec variables partagées.

**Contenu technique :**

- Moteur tick-by-tick : à chaque tick, chaque thread avance d'un bloc
- Sémantique des blocs : `set variable`, opération arithmétique, condition (if/else), boucle (loop n fois)
- Variables partagées entre lanes (état global mutable)
- Contrôles : Play / Pause / Step (avance d'un tick) / Reset
- État d'exécution par lane : `idle`, `running`, `blocked`, `done`

**Critère de fin :** Un programme simple à 2 threads s'exécute, produit
le bon résultat dans les variables partagées, et les contrôles fonctionnent.

---

## Phase 1.3 — Visualisation inline (ronds de couleur)

**Objectif :** Ajouter la visualisation en temps réel par ronds de couleur
sur les blocs actifs.

**Ce qu'un utilisateur peut faire à la fin :** Observer visuellement quel(s)
thread(s) exécute(nt) quel bloc à chaque instant.

**Contenu technique :**

- Une couleur distincte par lane/thread (assignée à la création)
- Rond coloré affiché sur le bloc en cours d'exécution pour chaque thread
- Animation fluide entre les ticks
- Indicateur visuel de l'état du thread (en cours, bloqué, terminé)

**Critère de fin :** Les ronds colorés se déplacent sur les blocs actifs
en temps réel pendant l'exécution. On voit immédiatement quel thread est
à quelle instruction.

---

## Phase 1.4 — Visualisation timeline

**Objectif :** Ajouter la vue timeline pour visualiser l'exécution dans le temps.

**Ce qu'un utilisateur peut faire à la fin :** Voir l'historique d'exécution
de tous les threads sur un axe temporel.

**Contenu technique :**

- Panneau timeline dans la zone de visualisation droite
- Une ligne par thread (couleur correspondante)
- Axe X = ticks d'exécution écoulés
- Segments colorés pour chaque bloc exécuté (nom du bloc visible au survol)
- Défilement automatique vers la droite pendant l'exécution

**Critère de fin :** La timeline se remplit progressivement pendant l'exécution,
les segments sont lisibles, et on peut voir l'historique complet après arrêt.

---

## Phase 1.5 — Scénarios pré-construits

**Objectif :** Livrer une bibliothèque de scénarios intégrés pour guider
l'apprentissage des concepts de concurrence.

**Ce qu'un utilisateur peut faire à la fin :** Sélectionner un scénario
(ex: "Deadlock"), le charger, l'exécuter, et observer la visualisation
du concept correspondant.

**Contenu technique :**

- 3 scénarios built-in :
  - `parallel-simple` : deux threads qui incrémentent chacun leur variable (introduction)
  - `race-condition` : deux threads qui modifient la même variable sans synchronisation
  - `deadlock` : deux threads qui s'attendent mutuellement (blocage infini)
- Sélecteur de scénarios au démarrage de l'app (écran d'accueil ou modal)
- Bouton "Charger un scénario" accessible depuis l'éditeur

**Critère de fin :** On charge "Deadlock", on exécute, et on voit les threads
se bloquer mutuellement avec les deux visualisations actives.

---

## 🎯 MVP atteint à la fin de Phase 1.5

Un utilisateur peut créer ses propres programmes multi-threads avec des blocs,
les exécuter, et observer la concurrence en temps réel via les ronds de couleur
et la timeline. Des scénarios pré-construits couvrent les concepts clés
(parallélisme, race condition, deadlock).

---

## Use cases par phase

### Phase 0

- UC0.1 : Un développeur peut cloner le repo, installer les dépendances et
  lancer l'app en local — le layout à trois panneaux s'affiche.
- UC0.2 : Un push sur `main` déclenche le déploiement GitHub Pages automatiquement.

### Phase 1.1

- UC1.1 : L'utilisateur ajoute une lane, lui donne un nom, et y glisse des blocs
  depuis la palette.
- UC1.2 : L'utilisateur crée un bloc Variable, édite son nom et sa valeur initiale.
- UC1.3 : L'utilisateur supprime un bloc ou une lane.

### Phase 1.2

- UC2.1 : L'utilisateur appuie sur Play et voit le programme s'exécuter
  automatiquement tick par tick.
- UC2.2 : L'utilisateur appuie sur Step pour avancer manuellement d'un tick.
- UC2.3 : L'utilisateur appuie sur Reset et le programme revient à l'état initial.

### Phase 1.3

- UC3.1 : Pendant l'exécution, l'utilisateur voit un rond de couleur se déplacer
  sur le bloc actif de chaque thread.

### Phase 1.4

- UC4.1 : Pendant l'exécution, la timeline se remplit et montre les threads
  s'exécuter en parallèle dans le temps.

### Phase 1.5

- UC5.1 : L'utilisateur sélectionne "Deadlock" au démarrage, charge le scénario,
  l'exécute, et observe les threads se bloquer.

---

## Hypothèses ouvertes

- ASSUMPTION: Le moteur d'exécution simule la concurrence de façon déterministe
  (round-robin par défaut) pour des raisons pédagogiques — un vrai ordonnanceur
  OS serait non-déterministe et difficile à observer.
- ASSUMPTION: Les blocs sont un pseudo-langage propriétaire (pas de génération
  de code réel dans le MVP).

---

## Comment utiliser ce plan

Pour chaque phase, dans l'IDE avec agent-skills installé :

1. `/spec [description de la phase]` — l'agent lit STARTUP.md + VISION.md
   - docs/project.md pour se contextualiser
2. `/plan` — l'agent décompose la phase en tâches vérifiables (tasks/plan.md)
3. `/build` — implémentation incrémentale, slice par slice
4. `/test` — vérification avec test-driven-development
5. `/review` — code-review-and-quality + security-and-hardening
6. `/ship` — quand la phase est livrable

Puis passer à la phase suivante.

---

## ⚠️ Rappel final

Ce fichier sera **supprimé** une fois le MVP atteint. Son rôle est de porter
le bootstrap du projet, pas d'en devenir un historique. Le git log garde
mémoire des phases. Les décisions architecturales durables vont dans
`docs/adr/`. La vision long terme vit dans VISION.md.
