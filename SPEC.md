# Spec : Phase 0 — Fondations techniques

> **Statut :** Validée (2026-06-29)  
> **Phase :** Bootstrap (STARTUP.md)  
> **Prochaine étape :** `/plan`

---

## Hypothèses (à corriger maintenant si besoin)

1. **Dépôt GitHub :** `theo-henon/loom` — URL de prod `https://theo-henon.github.io/loom/` (base Vite : `/loom/`).
2. **Gestionnaire de paquets :** npm (README mentionne aussi pnpm ; npm par défaut).
3. **Scaffolding :** `npm create vite@latest` avec template React + TypeScript, puis ajout Tailwind 4 via `@tailwindcss/vite`.
4. **Versions :** celles validées dans [docs/project.md](./docs/project.md) — React 19.2.7, Vite 8.0.10, Tailwind 4.x, TypeScript 5.x.
5. **Langue UI :** français pour tous les libellés visibles (titres des panneaux, placeholder).
6. **Design :** pas de maquette dans `design/` — layout minimal avec Tailwind, structure claire, pas de charte graphique finale.
7. **Tests en Phase 0 :** configuration Vitest + un smoke test sur le layout (pas de tests métier — le moteur n'existe pas encore).
8. **Lint / format :** ESLint + Prettier configurés dès Phase 0, intégrés aux scripts npm et à la CI.
9. **Favicon :** placeholder simple (SVG ou PNG minimal) dans `public/favicon.svg`.
10. **Branche de travail :** `feature/phase-0-foundations` — PR vers `main` avant merge (workflow immutable).
11. **GitHub Pages :** source = **GitHub Actions** (pas « Deploy from branch main / »).

---

## Objectif

Poser l'environnement technique complet de Loom **avant tout développement fonctionnel visible**.

**Pourquoi :** Un développeur ou un agent doit pouvoir cloner le repo, installer, lancer l'app en local, et voir immédiatement la structure visuelle à trois panneaux — la même structure déployée sur GitHub Pages après merge sur `main`.

**Utilisateur visé :** Développeur junior / étudiant qui découvrira Loom plus tard ; en Phase 0, l'utilisateur immédiat est le contributeur (Théo + agents).

**User stories (Phase 0) :**

| ID    | Story                                                                                                                               | Priorité |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UC0.1 | En tant que développeur, je clone le repo, installe les dépendances et lance l'app — le layout à trois panneaux s'affiche en local. | Must     |
| UC0.2 | En tant que mainteneur, je merge sur `main` et GitHub Actions déploie automatiquement sur GitHub Pages.                             | Must     |

**Hors scope Phase 0 :**

- Blocs, lanes, drag-and-drop, moteur d'exécution, visualisation animée
- Scénarios pré-construits
- État global applicatif (useReducer, Zustand)
- Accessibilité WCAG formelle (pas exigée par VISION.md)

---

## Tech Stack

Voir [docs/project.md — Tech Stack](./docs/project.md#tech-stack).

Résumé Phase 0 :

| Couche        | Choix                                  |
| ------------- | -------------------------------------- |
| UI            | React 19.2.7 + TypeScript 5.x          |
| Build         | Vite 8.0.10 + `@vitejs/plugin-react`   |
| Styles        | Tailwind CSS 4.x + `@tailwindcss/vite` |
| Tests         | Vitest + React Testing Library         |
| Lint / format | ESLint (flat config) + Prettier        |
| Hébergement   | GitHub Pages (statique)                |
| CI/CD         | GitHub Actions (`deploy.yml`)          |

---

## Commands

```bash
# Installation (première fois)
git clone https://github.com/theo-henon/loom.git
cd loom
npm install

# Développement local
npm run dev          # → http://localhost:5173

# Build production (identique à CI)
npm run build        # → dist/

# Prévisualisation du build local
npm run preview      # → http://localhost:4173

# Tests
npm run test         # Vitest — mode watch par défaut en dev
npm run test:run     # Vitest — exécution unique (CI)

# Lint & format
npm run lint         # ESLint — vérification
npm run lint:fix     # ESLint — correction auto
npm run format       # Prettier — formatage
npm run format:check # Prettier — vérification (CI)
```

**Scripts `package.json` attendus :**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

---

## Project Structure

Structure cible après Phase 0 (alignée sur [docs/project.md](./docs/project.md)) :

```
loom/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI : build + deploy GitHub Pages
├── docs/
│   ├── project.md
│   ├── adr/                    # vide — prêt pour ADRs futurs
│   └── features/               # vide
├── design/                     # vide — pas de maquettes Phase 0
├── public/
│   └── favicon.svg             # placeholder favicon Loom
├── src/
│   ├── components/
│   │   ├── blocks/             # .gitkeep — Phase 1.1
│   │   ├── lanes/              # .gitkeep — Phase 1.1
│   │   ├── palette/
│   │   │   └── BlockPalettePanel.tsx   # squelette panneau gauche
│   │   ├── visualization/
│   │   │   └── VisualizationPanel.tsx # squelette panneau droit
│   │   └── ui/
│   │       └── Panel.tsx       # primitive réutilisable (titre + contenu)
│   ├── engine/                 # .gitkeep — Phase 1.2
│   ├── scenarios/              # .gitkeep — Phase 1.5
│   ├── hooks/                  # .gitkeep — Phase 1.x
│   ├── types/                  # .gitkeep — Phase 1.x
│   ├── App.tsx                 # layout trois colonnes
│   ├── main.tsx                # point d'entrée React
│   └── index.css               # @import "tailwindcss"
├── tests/
│   └── components/
│       └── App.test.tsx        # smoke test layout
├── index.html
├── vite.config.ts              # base: '/loom/', plugins react + tailwind
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vitest.config.ts
├── eslint.config.js            # flat config ESLint
├── .prettierrc
├── .prettierignore
└── package.json
```

**Layout applicatif (Phase 0) :**

```
┌─────────────────────────────────────────────────────────────┐
│  Loom                                    [header minimal]   │
├──────────┬────────────────────────────┬─────────────────────┤
│ Palette  │  Éditeur de lanes          │  Visualisation      │
│ (240px)  │  (flex-grow)               │  (320px)            │
│          │                            │                     │
│ placeholder│ placeholder              │ placeholder         │
└──────────┴────────────────────────────┴─────────────────────┘
```

- Panneau gauche : titre « Palette de blocs », texte placeholder.
- Panneau centre : titre « Éditeur de lanes », zone vide extensible.
- Panneau droit : titre « Visualisation », texte placeholder.
- Responsive : en Phase 0, layout desktop uniquement (≥ 1024px) — pas de mobile-first requis.

---

## Code Style

**Conventions :**

- Composants React : `PascalCase`, un composant par fichier, export nommé.
- Fichiers utilitaires / hooks : `camelCase`.
- Types TypeScript : `PascalCase`, suffixe descriptif si besoin (`LaneState`, pas `ILaneState`).
- Imports : chemins relatifs courts ; pas d'alias `@/` en Phase 0 (ajoutable plus tard).
- Langue : commentaires code en anglais ; UI en français.
- Formatage : Prettier par défaut ; ESLint pour la qualité (hooks React, TypeScript).

**Exemple — composant panneau réutilisable :**

```tsx
// src/components/ui/Panel.tsx
type PanelProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <section
      className={`flex flex-col border border-gray-200 bg-white ${className}`}
      aria-label={title}
    >
      <header className="border-b border-gray-200 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </header>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </section>
  );
}
```

**Exemple — layout App :**

```tsx
// src/App.tsx
import { BlockPalettePanel } from './components/palette/BlockPalettePanel';
import { VisualizationPanel } from './components/visualization/VisualizationPanel';
import { Panel } from './components/ui/Panel';

export function App() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">Loom</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <BlockPalettePanel className="w-60 shrink-0" />
        <Panel title="Éditeur de lanes" className="flex-1">
          <p className="text-sm text-gray-400">Les lanes apparaîtront ici.</p>
        </Panel>
        <VisualizationPanel className="w-80 shrink-0" />
      </main>
    </div>
  );
}
```

---

## Testing Strategy

| Niveau            | Outil        | Emplacement         | Phase 0            |
| ----------------- | ------------ | ------------------- | ------------------ |
| Smoke / composant | Vitest + RTL | `tests/components/` | Oui — layout rendu |
| Moteur            | Vitest       | `tests/engine/`     | Non — Phase 1.2    |
| E2E               | —            | —                   | Non — post-MVP     |

**Test smoke attendu (`tests/components/App.test.tsx`) :**

- Rend `App` sans erreur.
- Présence des trois titres de panneau : « Palette de blocs », « Éditeur de lanes », « Visualisation ».
- Présence du titre « Loom » dans le header.

**Couverture Phase 0 :** pas de seuil formel ; un test smoke suffit. Seuil 80 % moteur s'applique à partir de Phase 1.2 (voir docs/project.md).

**Configuration Vitest :**

- `vitest.config.ts` avec environnement `jsdom`.
- Setup RTL : `@testing-library/jest-dom` (matchers étendus).

---

## Déploiement (Phase 0)

### Vite — base URL GitHub Pages

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/loom/',
  plugins: [react(), tailwindcss()],
});
```

### GitHub Actions — `.github/workflows/deploy.yml`

Déclencheur : `push` sur `main`.

Étapes :

1. Checkout
2. Setup Node.js 20
3. `npm ci`
4. `npm run build`
5. Deploy `dist/` vers GitHub Pages (action officielle `actions/deploy-pages` ou `peaceiris/actions-gh-pages`)

Permissions requises : `contents: read`, `pages: write`, `id-token: write`.

**Configuration GitHub Pages (Settings → Pages) :**

| Paramètre | Valeur correcte    | Incorrect                                |
| --------- | ------------------ | ---------------------------------------- |
| Source    | **GitHub Actions** | Deploy from a branch → `main` / `(root)` |

> ⚠️ « Deploy from branch `main` / (root) » sert les fichiers sources du repo, pas le build Vite. Avec notre workflow, la source doit être **GitHub Actions** : le workflow build `dist/` et le publie.

**Action requise si mal configuré :** Settings → Pages → Source → **GitHub Actions**.

---

## Boundaries

### Always do

- Suivre la structure de dossiers définie dans [docs/project.md](./docs/project.md).
- UI en français pour tout texte visible.
- Configurer `base: '/loom/'` dans Vite avant tout déploiement.
- Travailler sur une branche `feature/*`, PR vers `main`.
- Vérifier `npm run lint`, `npm run format:check`, `npm run build` et `npm run test:run` avant de shipper.

### Ask first

- Ajout de dépendances hors liste approuvée (docs/project.md).
- Changement de l'URL de déploiement ou du nom du repo.
- Modification du workflow de déploiement immutable.
- Upgrade de versions majeures (React, Vite, Tailwind).

### Never do

- Committer de secrets ou fichiers `.env`.
- Push direct sur `main` (sauf demande explicite).
- Implémenter de la logique métier (blocs, moteur) en Phase 0.
- Dupliquer la stack ou la structure dans d'autres fichiers — référencer `docs/project.md`.
- Utiliser Web Workers ou async réel pour la simulation (interdit pour tout le projet).

---

## Success Criteria

Phase 0 est **terminée** quand toutes ces conditions sont vraies :

| #    | Critère                                                          | Vérification                         |
| ---- | ---------------------------------------------------------------- | ------------------------------------ |
| SC1  | `npm install && npm run dev` démarre sans erreur                 | Terminal + navigateur localhost:5173 |
| SC2  | Layout trois panneaux visible avec titres français               | Inspection visuelle                  |
| SC3  | `npm run build` produit `dist/` sans erreur TypeScript           | Terminal                             |
| SC4  | `npm run test:run` passe (smoke test layout)                     | Terminal                             |
| SC5  | `npm run lint` et `npm run format:check` passent sans erreur     | Terminal                             |
| SC6  | Favicon placeholder visible dans l'onglet navigateur             | Inspection visuelle                  |
| SC7  | Structure de dossiers conforme à la spec ci-dessus               | `ls` / inspection repo               |
| SC8  | Workflow GitHub Actions présent et fonctionnel                   | Merge PR → URL prod                  |
| SC9  | `https://theo-henon.github.io/loom/` affiche le même layout      | Navigateur prod                      |
| SC10 | README reflète l'état post-Phase 0 (setup testé, phase suivante) | Lecture README                       |

---

## Risques et mitigations

| Risque                                       | Mitigation                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| Assets 404 sur GitHub Pages (mauvais `base`) | `base: '/loom/'` + test preview local `npm run preview`                              |
| Tailwind 4 API différente de v3              | Suivre doc officielle `@tailwindcss/vite`, pas de config `tailwind.config.js` legacy |
| GitHub Pages pas activé côté repo            | Documenter l'étape manuelle dans README si nécessaire                                |
| Versions npm divergentes de docs/project.md  | Pinner versions exactes dans `package.json`                                          |

---

## Décisions (questions résolues)

| #   | Question                      | Décision                                                                                  |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| OQ1 | npm ou pnpm ?                 | **npm**                                                                                   |
| OQ2 | Favicon / logo Phase 0 ?      | **Oui — favicon placeholder** (`public/favicon.svg`)                                      |
| OQ3 | ESLint/Prettier dès Phase 0 ? | **Oui** — scripts npm + vérification CI                                                   |
| OQ4 | GitHub Pages activé ?         | Activé, mais source à corriger si réglé sur `main / (root)` → passer à **GitHub Actions** |

---

## Références

- [STARTUP.md — Phase 0](./STARTUP.md#phase-0--fondations-techniques)
- [VISION.md](./VISION.md)
- [docs/project.md](./docs/project.md)
- [AGENTS.md](./AGENTS.md)
