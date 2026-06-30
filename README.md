# Loom

Outil pédagogique open-source pour rendre la programmation concurrente visible.
Assemble des blocs visuels, lance l'exécution, et observe en temps réel comment
plusieurs threads s'exécutent — avec des indicateurs colorés par thread et une
vue timeline. Pour les développeurs juniors et les étudiants qui découvrent la
concurrence pour la première fois.

---

## État courant

**Statut :** MVP livré (Phases 0 → 1.5)
**Prochaines évolutions :** via `/spec` sur des features individuelles (voir [IDEAS.md](./IDEAS.md))

> Vision stratégique : voir [VISION.md](./VISION.md)
> Stack et architecture : voir [docs/project.md](./docs/project.md)
> Spec en cours : voir [SPEC.md](./SPEC.md)

---

## Setup local

### Prérequis

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/theo-henon/loom.git
cd loom
npm install
```

### Lancement

```bash
npm run dev
```

App accessible sur [http://localhost:5173](http://localhost:5173).

### Build et preview

```bash
npm run build
npm run preview   # simule GitHub Pages avec base /loom/
```

---

## Qualité de code

```bash
npm run lint           # ESLint
npm run lint:fix       # ESLint — correction auto
npm run format         # Prettier — formatage
npm run format:check   # Prettier — vérification (CI)
npm run test           # Vitest — mode watch
npm run test:run       # Vitest — exécution unique (CI)
```

Avant chaque push, lancer : `npm run format:check && npm run lint && npm run test:run`

---

## Déploiement

Ce projet est déployé statiquement sur **GitHub Pages** via GitHub Actions.

**URL production :** [https://theo-henon.github.io/loom/](https://theo-henon.github.io/loom/)

### Workflow par défaut

- Branches courtes (`feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`)
  → PR vers `main`
- Merge sur `main` → déploiement automatique via GitHub Actions
- Aucune variable d'environnement requise (app 100% statique)

### Configuration GitHub Pages requise

Dans Settings → Pages → Source, choisir **GitHub Actions** (pas « Deploy from branch »).

**Pour les détails complets :** voir [docs/project.md](./docs/project.md).

---

## Structure du projet

```
loom/
├── .github/workflows/   CI/CD (deploy.yml)
├── docs/
│   ├── project.md
│   ├── adr/
│   └── features/
├── public/              favicon et assets statiques
├── src/
│   ├── components/      blocks, lanes, palette, visualization, ui
│   ├── engine/          moteur d'exécution tick-based
│   ├── scenarios/       scénarios pré-construits
│   ├── hooks/
│   └── types/
└── tests/               Vitest + React Testing Library
```

---

## Contribuer

Ce projet utilise **agent-skills** (https://github.com/addyosmani/agent-skills)
installé globalement dans les outils de développement. Voir [AGENTS.md](./AGENTS.md)
pour les conventions spécifiques au projet et les pointeurs pour les agents.

Nouvelles features : `/spec` → `/plan` → `/build` → `/ship` (plus de plan bootstrap).
