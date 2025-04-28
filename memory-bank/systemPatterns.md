# System Patterns: Math Invasion

**Version:** 0.1 (Initial)
**Date:** 2025-04-28

## 1. Core Architecture: Manager Pattern + Event Bus

*   **Manager Pattern:** Inspired by `TD-PLAN-g2.5adv.md`, the core logic is divided into specialized managers, each responsible for a specific domain (e.g., `EnemyManager`, `WeaponManager`, `SpawnManager`, `EconomyManager`). This adheres to the Single Responsibility Principle (SRP).
*   **Event Bus:** Managers communicate loosely via a central `EventBus`. Instead of direct calls, managers emit events (e.g., `ENEMY_KILLED`, `PROJECTILE_FIRED`), and other interested managers subscribe to these events. This decouples systems and improves maintainability.
*   **Separation of Concerns:**
    *   **`src/core/`:** Contains framework-agnostic game logic and state management (managers, entities, events, utils). This code should be testable without Phaser.
    *   **`src/phaser/`:** Contains Phaser-specific code (scenes, factories, physics integration, rendering). Acts as the presentation and integration layer.

## 2. Key System Interactions (Planned)

*   **Game Loop (`GameScene.update`):** Orchestrates calls to update core managers and handles Phaser-specific updates (physics).
*   **Input:** `InputManager` captures raw input and emits semantic events (e.g., `MOVE_LEFT`, `SELECT_WEAPON_1`). `PlayerManager` and `WeaponManager` react to these events.
*   **Spawning:** `SpawnManager` calculates wave composition based on `difficulty.yml` and emits `ENEMY_SPAWN_REQUESTED` events at timed intervals.
*   **Enemy Handling:** `EnemyManager` listens for spawn requests, creates enemy state, and manages movement/abilities. `EnemyFactory` creates the corresponding Phaser object.
*   **Combat:**
    *   `WeaponManager` emits `PROJECTILE_FIRED` based on player input and cooldowns.
    *   `ProjectileManager` listens, manages projectile state. `ProjectileFactory` creates Phaser objects.
    *   `GameScene` uses `arcade.overlap` for collision detection (player projectiles vs. enemies, enemy projectiles vs. player, player vs. power-ups).
    *   Collision callbacks trigger damage application (`EnemyManager`/`PlayerManager`) and event emission (`ENEMY_KILLED`, `PLAYER_HIT`).
*   **Economy:** `EconomyManager` listens for `ENEMY_KILLED` to add currency and handles `UPGRADE_WEAPON` requests from `WeaponManager` (via UI interaction).
*   **UI:** `UIScene` listens for events like `CURRENCY_UPDATED`, `WAVE_STARTED`, `PLAYER_HEALTH_CHANGED`, `WEAPON_COOLDOWN_UPDATE` and updates the HUD accordingly. It also emits events like `UPGRADE_WEAPON_REQUESTED` when UI buttons are pressed.
*   **Configuration:** `ConfigLoader` loads and validates YAML files at startup. Managers access configuration data through the loader.

## 3. Data Flow

*   **Configuration (YAML):** Defines static properties of enemies, weapons, power-ups, and difficulty scaling. Loaded once at the start.
*   **Game State:** Primarily managed within the `core` managers (player position, currency, weapon levels, active enemies/projectiles/power-ups).
*   **Phaser Objects:** Represent the visual and physical aspects in the `phaser` layer, often mirroring the state in the core managers. Factories are used to create these objects based on core state/events.
*   **Events:** Drive communication and state changes between decoupled managers.

*Refer to `PLAN.md` for a detailed list of managers and their responsibilities.*
