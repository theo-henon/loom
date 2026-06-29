# Loom

Outil pédagogique open-source pour rendre la programmation concurrente visible.
Assemble des blocs visuels, lance l'exécution, et observe en temps réel comment
plusieurs threads s'exécutent — avec des indicateurs colorés par thread et une
vue timeline. Pour les développeurs juniors et les étudiants qui découvrent la
concurrence pour la première fois.

---

## État courant

**Phase actuelle :** Phase 0 — Fondations techniques
**MVP visé :** fin de Phase 1.5

> Plan de démarrage complet : voir [STARTUP.md](./STARTUP.md)
> Vision stratégique : voir [VISION.md](./VISION.md)
> Stack et architecture : voir [docs/project.md](./docs/project.md)
> Idées parkées : voir [IDEAS.md](./IDEAS.md)

---

## Setup local

### Prérequis
- Node.js 20+
- npm ou pnpm

### Installation
```bash
git clone https://github.com/<ton-username>/loom.git
cd loom
npm install
```

### Lancement
```bash
npm run dev
```

App accessible sur [http://localhost:5173](http://localhost:5173).

---

## Déploiement

Ce projet est déployé statiquement sur **GitHub Pages** via GitHub Actions.

### Workflow par défaut
- Branches courtes (`feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`)
  → PR vers `main`
- Merge sur `main` → déploiement automatique via GitHub Actions
- Aucune variable d'environnement requise (app 100% statique)

**Pour les détails complets :** voir [docs/project.md](./docs/project.md).

---

## Tests

```bash
npm run test
```

---

## Structure du projet

```
loom/
├── README.md
├── VISION.md
├── STARTUP.md          ← temporaire, supprimé après MVP
├── IDEAS.md
├── AGENTS.md
├── CLAUDE.md
├── docs/
│   ├── project.md
│   ├── adr/
│   └── features/
├── design/
└── src/
```

---

## Contribuer

Ce projet utilise **agent-skills** (https://github.com/addyosmani/agent-skills)
installé globalement dans les outils de développement. Voir [AGENTS.md](./AGENTS.md)
pour les conventions spécifiques au projet et les pointeurs pour les agents.
