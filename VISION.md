# Loom • Vision

> Langue : français
> Dernière mise à jour : 2026-06-29
>
> Ce document évolue avec le projet. Il peut démarrer léger et s'étoffer
> au fil du temps. Les sections marquées "à compléter plus tard" sont des
> invitations, pas des obligations.

---

## 1. Raison d'être

Loom est un outil pédagogique open-source qui rend la programmation concurrente
visible. En assemblant des blocs visuels et en observant l'exécution en temps réel,
les développeurs juniors et les étudiants comprennent intuitivement ce qui se passe
entre les threads — avant même de lire une ligne de code.

---

## 2. Principes directeurs

### Principe 1 • Voir avant de comprendre
La visualisation prime sur la documentation. Un étudiant doit pouvoir observer
un deadlock se produire sous ses yeux avant qu'on lui explique pourquoi.

### Principe 2 • Complexité progressive
Des scénarios simples aux cas critiques. On commence par deux threads en
parallèle, on monte vers les race conditions, puis vers les deadlocks et les
problèmes de synchronisation.

### Principe 3 • Zéro friction
Pas d'installation, ça tourne dans le navigateur, immédiatement. L'outil
s'efface pour laisser la place à l'apprentissage.

---

## 3. Vision long terme — la montée en puissance

*Cette section n'est pas encore définie. Elle sera remplie quand une vision
d'évolution par stades émergera clairement. Exemple de structure à suivre :*

*Stade 1 • Observer — l'utilisateur comprend la concurrence via des scénarios pré-construits*
*Stade 2 • Créer — l'utilisateur compose ses propres programmes multi-threads*
*Stade 3 • Partager — bibliothèque communautaire de scénarios*

---

## 4. Ce que Loom n'est pas

- Pas un éditeur de code général — pas de Loom vs VS Code
- Pas un outil de production — c'est un terrain d'apprentissage
- Pas un remplaçant à la documentation officielle des langages
- Pas un débogueur pour du vrai code en production

---

## 5. Architecture conceptuelle

*À définir quand les primitives conceptuelles du système seront suffisamment
stables pour être articulées. Une primitive est un concept immuable qui
compose le système — distinct d'un choix technique.*

---

## Note sur l'évolution de ce document

VISION.md est un document vivant. Les sections vides ne sont pas un manque —
elles sont des invitations à penser stratégiquement quand le besoin émergera.

Le détail opérationnel ne vit PAS ici. Voir :
- **STARTUP.md** pour le plan de démarrage jusqu'au MVP (document temporaire)
- **docs/project.md** pour la stack et l'architecture technique
- **IDEAS.md** pour les idées futures non planifiées
