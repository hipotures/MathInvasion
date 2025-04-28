# Technical Context: Math Invasion

**Version:** 0.1 (Initial)
**Date:** 2025-04-28

## 1. Core Technologies

*   **Game Engine:** Phaser 3 (specifically using Arcade Physics, Canvas/WebGL rendering, Scene management, Loader, Input system).
*   **Language:** TypeScript (strict mode enabled via `tsconfig.json`).
*   **Build Tool / Dev Server:** Vite.
*   **Package Manager:** npm.

## 2. Development Environment & Tooling

*   **Linting:** ESLint with `@typescript-eslint` plugin. Configuration aims for code consistency and potential error prevention.
*   **Formatting:** Prettier. Integrated with ESLint (`eslint-config-prettier`, `eslint-plugin-prettier`). Enforces a consistent code style.
*   **Git Hooks:** Husky and lint-staged. Automatically lint and format staged files on pre-commit, ensuring code quality before it enters the repository.
*   **Version Control:** Git. Hosted on GitHub (repository needs to be created). Commits follow Conventional Commits standard.
*   **Configuration:** Game balance parameters (weapons, enemies, difficulty, power-ups) are managed via YAML files in the `/config` directory. Loaded and validated at runtime using `js-yaml` and potentially a schema validator like Zod or Yup.
*   **API Documentation (Phaser):** Will utilize Context7 MCP (`github.com/upstash/context7-mcp`) tool (`get-library-docs`) for querying Phaser 3 API documentation during development.

## 3. Target Environment & Platform

*   **Platform:** Web Browser (Desktop & Mobile).
*   **Deployment:** Progressive Web App (PWA). Requires `manifest.json` and a Service Worker (`service-worker.ts`, likely using Workbox) for offline capabilities and installability.
*   **Hosting:** Initially GitHub Pages or similar static hosting (e.g., Firebase Hosting, Netlify). To be decided later.

## 4. Key Dependencies (Initial)

*   `phaser`: The core game engine.
*   `js-yaml` & `@types/js-yaml`: For parsing YAML configuration files.
*   `typescript`: Language support.
*   `vite`: Build tool and development server.
*   `eslint`, `prettier`, `husky`, `lint-staged`, related plugins: Development tooling for code quality.

## 5. Technical Constraints / Considerations

*   **Performance:** Target 60 FPS. Requires careful management of object creation/destruction, physics calculations, and rendering within the game loop. Avoid heavy computations or memory allocations in `update`.
*   **Bundle Size:** While not the primary focus initially, keep an eye on the final bundle size for faster PWA loading times. Vite helps with code splitting and optimization.
*   **Offline First:** PWA implementation needs robust caching via the Service Worker to ensure the game runs reliably offline.
*   **Cross-Browser Compatibility:** Rely on Phaser and Vite to handle most browser differences. Test on target browsers (Chrome, Firefox, Safari - desktop and mobile) later in development.

*Refer to `PLAN.md` for project structure and `systemPatterns.md` for architecture.*
