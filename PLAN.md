# PLAN PRODUKCJI – Math Invasion (SI-TD Hybrid, PWA / Phaser 3)
*(Based on user requirements and inspired by TD-PLAN-g2.5adv.md architecture)*

**1. Wprowadzenie**

*   **Koncepcja:** Gra łączy zręcznościową mechanikę strzelania i unikania fal wrogów w stylu Space Invaders (formacja, ruch poziomo-pionowy) z taktycznym systemem wyboru, ulepszania broni i zarządzania zasobami znanym z gier Tower Defense. Gracz kontroluje statek poruszający się wyłącznie w osi X u dołu ekranu.
*   **Cel:** Przetrwać jak najdłużej przeciwko nieskończonym falom geometrycznych przeciwników o rosnącej trudności, maksymalizując wynik.
*   **Sterowanie:**
    *   **Klawiatura:** Ruch lewo/prawo, klawisze (np. 1, 2, 3) do szybkiego wyboru aktywnej broni.
    *   **Dotyk:** Wirtualne przyciski lewo/prawo, dotykowe przyciski wyboru broni.
*   **Broń:** Gracz ma dostęp do 3 typów broni (Pocisk, Laser, Spowolnienie), które może dowolnie przełączać i ulepszać w trakcie gry. Ulepszenia są nielimitowane poziomowo.
*   **Ekonomia:** Jedna waluta (np. "$") zdobywana za pokonywanie wrogów. Służy do ulepszania broni i aktywowania/kupowania jednorazowych power-upów.
*   **Power-upy:** Losowo pojawiające się wzmocnienia (np. Tarcza, Mnożnik Kasy, Szybszy Reload, Chwilowe Zwiększenie Obrażeń), definiowane w YAML, z określonym czasem trwania i szansą na pojawienie się.
*   **Rozgrywka:** Nieskończone fale wrogów. Trudność (HP, prędkość, liczba wrogów) rośnie z każdą falą wg współczynników z YAML. Co N fal pojawia się Boss o znacznie większej wytrzymałości i nagrodzie.
*   **Estetyka:** Minimalistyczna, geometryczna (bryły: trójkąty, kwadraty, okręgi itp. reprezentujące gracza i wrogów).
*   **Technologia:** Phaser 3 (Canvas/WebGL + Arcade Physics), TypeScript, Vite. Gra jako Progresywna Aplikacja Webowa (PWA) działająca offline.
*   **Logowanie:** Zapis kluczowych zdarzeń rozgrywki (ulepszenia, śmierci, power-upy, fala) i wysyłanie ich do zewnętrznego API (stub) w formacie JSON w celu późniejszej analizy balansu.

**2. Fundamenty Clean-Code i Architektura**

*   **Zasady:** Ścisłe przestrzeganie zasad z "Clean Code Guidelines" (stałe zamiast magic numbers, znaczące nazwy, SRP, DRY, enkapsulacja).
*   **Separacja Domeny:**
    *   `src/core/`: Logika gry niezależna od Phaser (typy, zdarzenia, menedżery stanu, utils).
    *   `src/phaser/`: Integracja z Phaser (Sceny, Fabryki Obiektów, obsługa fizyki Arcade, renderowanie).
*   **Struktura Plików:** Każdy plik ≤ 300 linii kodu. Moduły z jasno zdefiniowanym API.
*   **Stałe:** W dedykowanych plikach `src/constants/*.ts` (np. `physics.ts`, `ui.ts`, `events.ts`).
*   **Komentarze:** Wyłącznie wyjaśniające *dlaczego* coś jest zrobione, nie *co* robi kod.
*   **Testy:** Testy jednostkowe dla logiki `core` w `tests/**` (np. `WeaponManager.spec.ts`). Cel: ≥ 80% pokrycia.

**3. Struktura Projektu**

```
root/
├─ memory-bank/         # Dokumentacja projektu (Markdown)
│  ├─ projectbrief.md
│  ├─ productContext.md
│  ├─ activeContext.md
│  ├─ systemPatterns.md
│  ├─ techContext.md
│  └─ progress.md
├─ public/                # Statyczne pliki PWA (index.html, manifest.json, icons/)
├─ src/
│  ├─ core/               # Logika gry niezależna od frameworka
│  │  ├─ config/          # Loader YAML + typy/schematy walidacji (Zod/Yup)
│  │  ├─ constants/       # Stałe gry (fizyka, UI, zdarzenia)
│  │  ├─ entities/        # Definicje bytów (Player, Enemy, Projectile, PowerUp)
│  │  ├─ managers/        # Menedżery stanu i logiki (Weapon, Enemy, Spawn, etc.)
│  │  ├─ events/          # Definicje typów zdarzeń + EventBus
│  │  └─ utils/           # Funkcje pomocnicze (matematyka, timery)
│  ├─ phaser/             # Integracja z Phaser
│  │  ├─ scenes/          # Sceny gry (GameScene, UIScene)
│  │  ├─ factories/       # Fabryki obiektów Phaser (Player, Enemy, Projectile)
│  │  ├─ plugins/         # Niestandardowe pluginy Phaser (jeśli potrzebne)
│  │  └─ utils/           # Funkcje pomocnicze specyficzne dla Phaser
│  ├─ pwa/                # Logika PWA (service-worker.ts, offline cache)
│  └─ main.ts             # Punkt wejścia aplikacji, inicjalizacja Phaser
├─ assets/                # Zasoby gry (definicje SVG brył, fonty, SFX placeholder)
├─ config/                # Pliki konfiguracyjne YAML
│  ├─ weapons.yml
│  ├─ enemies.yml
│  ├─ powerups.yml
│  └─ difficulty.yml
├─ tests/                 # Testy jednostkowe i E2E
│  ├─ core/
│  └─ e2e/
├─ .github/               # Konfiguracja GitHub Actions (CI/CD)
├─ .husky/                # Git hooks (pre-commit)
├─ vite.config.ts         # Konfiguracja Vite
├─ tsconfig.json
├─ package.json
└─ .eslintrc.js           # Konfiguracja ESLint
```

**4. Kluczowe Moduły (SRP + ≤ 300 LOC)**

| Plik (w `src/core/` lub `src/phaser/`) | Odpowiedzialność / Główny Eksport                                                                                                | Inspiracja z TD-PLAN |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| `core/events/EventBus.ts`               | Prosty system publikowania/subskrybowania zdarzeń (emit/on/off). Centralny punkt komunikacji między modułami.                   | Tak (EventEmitter)   |
| `core/config/ConfigLoader.ts`           | Ładuje, waliduje (np. Zod/Yup) i udostępnia konfiguracje z plików YAML (`weapons`, `enemies`, `powerups`, `difficulty`).          | Tak (pośrednio)      |
| `core/managers/PlayerManager.ts`        | Zarządza stanem gracza (pozycja X, aktualnie wybrana broń, stan tarczy). Przetwarza input ruchu.                                | Nowy                 |
| `core/managers/WeaponManager.ts`        | Zarządza stanem wszystkich broni (poziomy ulepszeń, cooldowny). Obsługuje przełączanie broni i logikę ulepszeń. Generuje zdarzenia strzału. | Nowy (łączy idee)    |
| `core/managers/EnemyManager.ts`         | Zarządza aktywnymi wrogami (tworzenie, aktualizacja stanu, ruch, usuwanie). Udostępnia funkcje wyszukiwania wrogów.             | Tak                  |
| `core/managers/ProjectileManager.ts`    | Zarządza aktywnymi pociskami (tworzenie na podstawie zdarzeń, aktualizacja, detekcja kolizji, usuwanie).                         | Tak (Munitions)      |
| `core/managers/PowerUpManager.ts`       | Zarządza logiką pojawiania się, zbierania i efektów power-upów (spawnowanie, timery efektów, aplikowanie modyfikatorów).         | Nowy                 |
| `core/managers/SpawnManager.ts`         | Zarządza harmonogramem fal wrogów (czas do następnej fali, generowanie składu fali na podstawie `difficulty.yml`, emitowanie zdarzeń spawnu). | Tak (Wave Manager)   |
| `core/managers/EconomyManager.ts`       | Zarządza stanem waluty gracza (dodawanie za wrogów, odejmowanie za ulepszenia/power-upy).                                       | Tak (Cash Manager)   |
| `core/managers/GameManager.ts`          | Zarządza głównym stanem gry (aktywna, pauza, koniec gry), koordynuje start/stop systemów.                                       | Tak (Core Engine)    |
| `core/utils/Logger.ts`                  | Buforuje kluczowe zdarzenia gry i wysyła je w partiach jako JSON do skonfigurowanego zewnętrznego API (stub).                   | Nowy                 |
| `phaser/scenes/GameScene.ts`            | Główna scena Phaser. Zawiera pętlę `update` i `create`. Inicjalizuje fabryki, obsługuje fizykę Arcade (kolizje, overlap).        | Tak (pośrednio)      |
| `phaser/scenes/UIScene.ts`              | Oddzielna scena Phaser dla HUD. Renderuje elementy UI (waluta, fala, przyciski broni, cooldowny, power-upy). Reaguje na zdarzenia. | Tak (UI Manager)     |
| `phaser/factories/PlayerFactory.ts`     | Tworzy obiekt gracza w Phaser (Sprite + fizyka Arcade).                                                                          | Nowy                 |
| `phaser/factories/EnemyFactory.ts`      | Tworzy obiekty wrogów w Phaser na podstawie danych z `EnemyManager`.                                                              | Nowy                 |
| `phaser/factories/ProjectileFactory.ts` | Tworzy obiekty pocisków w Phaser na podstawie danych z `ProjectileManager`.                                                      | Nowy                 |
| `phaser/factories/PowerUpFactory.ts`    | Tworzy obiekty power-upów w Phaser.                                                                                              | Nowy                 |
| `core/managers/InputManager.ts`         | Przetwarza surowe zdarzenia wejścia (klawiatura, dotyk) na semantyczne akcje gry (ruch, zmiana broni, strzał - jeśli dotyczy).    | Tak (Input System)   |
| `pwa/service-worker.ts`                 | Implementacja Service Workera (np. z Workbox) do cachowania zasobów (HTML, JS, CSS, assets, YAML) dla działania offline.         | Nowy                 |

**5. Schematy Konfiguracji YAML (`config/`)**

*   **Walidacja:** Wszystkie pliki YAML będą walidowane przy starcie gry za pomocą schematów (np. Zod/Yup) zdefiniowanych w `src/core/config/schemas/`.

*   **`weapons.yml`**
    ```yaml
    - id: bullet          # Unikalny identyfikator
      name: Basic Bullet  # Nazwa wyświetlana w UI
      baseCost: 50        # Początkowy koszt ulepszenia (poziom 1)
      baseCooldownMs: 300 # Bazowy czas odnowienia w ms
      baseDamage: 10      # Bazowe obrażenia
      baseRange: 300      # Bazowy zasięg w jednostkach świata gry
      projectileType: basic_bullet # Typ pocisku do stworzenia
      upgrade:
        costMultiplier: 1.4      # Mnożnik kosztu dla kolejnego poziomu (cena_LvlN = cena_Lvl(N-1) * costMultiplier)
        damageMultiplier: 1.15   # Mnożnik obrażeń na poziom (+15%)
        cooldownMultiplier: 0.95 # Mnożnik cooldownu na poziom (-5%)
        rangeAdd: 10             # Dodatkowy zasięg na poziom
    - id: laser
      name: Continuous Laser
      baseCost: 150
      baseCooldownMs: 0        # Laser nie ma cooldownu, ale może mieć czas ładowania/nagrzewania
      baseDamagePerSec: 15   # Bazowe obrażenia na sekundę
      baseRange: 400
      projectileType: laser_beam
      upgrade:
        costMultiplier: 1.5
        damageMultiplier: 1.20
        rangeAdd: 15
    - id: slow_field
      name: Slow Field
      baseCost: 100
      baseCooldownMs: 1000    # Cooldown na ponowne aktywowanie pola/impulsu
      baseRange: 200         # Zasięg działania pola
      baseSlowFactor: 0.6    # Mnożnik prędkości wrogów (60% normalnej prędkości)
      baseDurationMs: 2000   # Czas trwania efektu spowolnienia na wrogu
      projectileType: none     # Nie tworzy pocisku, działa obszarowo
      upgrade:
        costMultiplier: 1.3
        slowFactorMultiplier: 0.95 # Zmniejsza mnożnik prędkości (-5% do spowolnienia)
        durationAddMs: 500       # Zwiększa czas trwania efektu
        rangeAdd: 10
    ```

*   **`enemies.yml`**
    ```yaml
    - id: triangle_scout
      shape: triangle       # Kształt geometryczny
      baseHealth: 50
      baseSpeed: 40         # Prędkość poruszania się
      baseReward: 5         # Ilość waluty za pokonanie
      movementPattern: invader_standard # Typ wzorca ruchu (np. lewo-prawo-dół)
      collisionRadius: 15   # Promień do detekcji kolizji
      canShoot: false       # Czy ten typ wroga może strzelać
    - id: square_tank
      shape: square
      baseHealth: 150
      baseSpeed: 25
      baseReward: 15
      movementPattern: invader_standard
      collisionRadius: 25
      canShoot: true
      shootConfig:
        projectileType: enemy_bullet
        cooldownMs: 1500
        damage: 5
        speed: 100
    - id: pentagon_healer
      shape: pentagon
      baseHealth: 100
      baseSpeed: 30
      baseReward: 20
      movementPattern: invader_support # Może trzymać się z tyłu formacji
      collisionRadius: 20
      canShoot: false
      abilities:
        - type: heal_aura
          range: 100
          healPerSec: 5
    - id: circle_boss
      shape: circle
      baseHealth: 2000
      baseSpeed: 20
      baseReward: 100
      movementPattern: boss_weaving # Specjalny wzorzec ruchu bossa
      collisionRadius: 50
      canShoot: true
      shootConfig:
        projectileType: enemy_laser
        cooldownMs: 800
        damagePerSec: 10
        range: 300
      abilities:
        - type: spawn_minions
          minionId: triangle_scout
          cooldownMs: 5000
          count: 3
    ```

*   **`powerups.yml`**
    ```yaml
    - id: shield
      name: Energy Shield
      effect: temporary_invulnerability # Typ efektu aplikowany na gracza
      durationMs: 5000
      dropChance: 0.03       # Szansa na pojawienie się po pokonaniu wroga
      visual: shield_icon
    - id: cash_boost
      name: Cash Boost
      effect: currency_multiplier
      multiplier: 2          # Mnożnik zdobywanej waluty
      durationMs: 10000
      dropChance: 0.05
      visual: cash_icon
    - id: rapid_fire
      name: Rapid Fire
      effect: weapon_cooldown_reduction
      multiplier: 0.5        # Mnożnik cooldownu broni (50% normalnego)
      durationMs: 8000
      dropChance: 0.04
      visual: rapid_fire_icon
    ```

*   **`difficulty.yml`**
    ```yaml
    initialWaveNumber: 1
    timeBetweenWavesSec: 7
    enemyHealthMultiplierPerWave: 1.08  # Mnożnik HP wrogów co falę
    enemySpeedMultiplierPerWave: 1.02   # Mnożnik prędkości wrogów co falę
    enemyCountMultiplierPerWave: 1.10   # Mnożnik liczby wrogów co falę
    enemyRewardMultiplierPerWave: 1.05  # Mnożnik nagrody co falę
    bossWaveFrequency: 10             # Co ile fal pojawia się boss
    bossId: circle_boss               # ID bossa do spawnowania
    initialEnemyTypes: [triangle_scout] # Typy wrogów dostępne od początku
    waveEnemyTypeUnlock:              # Kiedy odblokowują się nowe typy
      5: square_tank
      15: pentagon_healer
    spawnPattern: standard_grid       # Jak wrogowie są rozmieszczani na starcie fali
    ```

**6. Przepływ Aktualizacji (`GameScene.update`)**

1.  **InputManager:** Przetwarza input, aktualizuje żądany ruch gracza i wybór broni.
2.  **PlayerManager:** Aktualizuje pozycję X gracza na podstawie inputu.
3.  **SpawnManager:** Sprawdza timer fali; jeśli czas na spawn, emituje zdarzenie `ENEMY_SPAWN_REQUESTED` z typem i pozycją wroga.
4.  **EnemyManager:**
    *   Obsługuje zdarzenia `ENEMY_SPAWN_REQUESTED`, tworząc nowe instancje wrogów.
    *   Aktualizuje pozycje wszystkich wrogów zgodnie z ich `movementPattern`.
    *   Obsługuje logikę specjalnych umiejętności wrogów (strzelanie, leczenie).
    *   Synchronizuje pozycje z obiektami fizyki Arcade.
5.  **WeaponManager:**
    *   Sprawdza cooldown aktywnej broni gracza.
    *   Jeśli gracz chce strzelić (input) i broń jest gotowa:
        *   Emituje zdarzenie `PROJECTILE_FIRED` (dla pocisków/lasera) lub `AREA_EFFECT_TRIGGERED` (dla spowolnienia).
        *   Resetuje cooldown.
    *   Obsługuje logikę ulepszeń na żądanie gracza (sprawdza koszt w `EconomyManager`).
6.  **ProjectileManager:**
    *   Obsługuje zdarzenia `PROJECTILE_FIRED`, tworząc nowe instancje pocisków.
    *   Aktualizuje pozycje pocisków.
    *   Sprawdza kolizje (przez `arcade.overlap`).
7.  **PowerUpManager:**
    *   Sprawdza, czy pokonany wróg powinien upuścić power-up (na podstawie `dropChance`).
    *   Spawnnuje obiekty power-upów.
    *   Obsługuje kolizje gracza z power-upami (`arcade.overlap`).
    *   Aplikuje efekty na gracza/broń i zarządza ich czasem trwania.
8.  **Phaser Arcade Physics:**
    *   `overlap(playerProjectiles, enemies)`: Callback `handlePlayerHitEnemy`.
    *   `overlap(enemyProjectiles, player)`: Callback `handleEnemyHitPlayer`.
    *   `overlap(player, powerups)`: Callback `handlePlayerCollectPowerUp`.
    *   `overlap(enemies, playerBase)`: Callback `handleEnemyReachBase` (wrogowie nie mają fizyki, sprawdzane pozycją Y).
9.  **Callbacks Kolizji:**
    *   `handlePlayerHitEnemy`: Zadaje obrażenia wrogowi (`EnemyManager`), jeśli wróg zginie, emituje `ENEMY_KILLED` (nagroda w `EconomyManager`, szansa na power-up w `PowerUpManager`), usuwa pocisk (`ProjectileManager`).
    *   `handleEnemyHitPlayer`: Zadaje obrażenia graczowi (`PlayerManager`, uwzględnia tarczę z `PowerUpManager`), usuwa pocisk wroga.
    *   `handlePlayerCollectPowerUp`: Aktywuje efekt w `PowerUpManager`, usuwa obiekt power-upu.
10. **EconomyManager:** Obsługuje zdarzenia `ENEMY_KILLED`, dodając walutę. Obsługuje żądania zakupu ulepszeń/power-upów.
11. **GameManager:** Sprawdza warunki końca gry (HP gracza <= 0).
12. **Logger:** Nasłuchuje kluczowych zdarzeń (`ENEMY_KILLED`, `WEAPON_UPGRADED`, `POWERUP_COLLECTED`, `WAVE_STARTED`, `GAME_OVER`) i wysyła dane do API.
13. **UIScene:** Aktualizuje wyświetlane wartości (waluta, fala, cooldowny, HP gracza, aktywne power-upy) na podstawie zdarzeń lub odpytywania menedżerów.

**7. UI & Responsywność (`UIScene`)**

*   **Układ:**
    *   Górna część ekranu: Pole gry (canvas `GameScene`).
    *   Dolna część ekranu (statyczny pasek HUD):
        *   Lewa strona: Licznik waluty ($), Numer fali.
        *   Środek: Przyciski wyboru broni (3 ikony). Aktywna broń podświetlona. Wyświetlanie cooldownu pod ikonami.
        *   Prawa strona: Wskaźnik HP gracza (pasek/liczba), Ikony aktywnych power-upów z timerami.
*   **Responsywność:** Canvas `GameScene` skaluje się, aby wypełnić dostępną przestrzeń, zachowując proporcje. `UIScene` (HTML lub Phaser) jest nakładką i dostosowuje swoje położenie/rozmiar.
*   **Sterowanie Dotykowe:** Wirtualne przyciski ruchu (lewo/prawo) pojawiają się na dole po bokach ekranu. Przyciski wyboru broni są odpowiednio duże do dotyku.

**8. Warstwa PWA (`pwa/`)**

*   **`manifest.json`:** Definiuje nazwę aplikacji, ikony (192x192, 512x512), orientację (`portrait-primary` lub `landscape`), `start_url`, `display: standalone`.
*   **`service-worker.ts`:**
    *   Użycie Workbox do uproszczenia zarządzania cache.
    *   Strategia `CacheFirst` dla: `index.html`, bundli JS/CSS, zasobów `assets/` (SVG, fonty), plików konfiguracyjnych `config/*.yml`, biblioteki Phaser.
    *   Strategia `NetworkFirst` lub `StaleWhileRevalidate` dla logów wysyłanych do API `/analytics`.
    *   Opcjonalnie: Background Sync do wysyłania logów, gdy urządzenie wróci online.
*   **Funkcjonalność:** Instalacja ("Dodaj do ekranu głównego"), ekran powitalny (splash screen), działanie offline po pierwszym załadowaniu.

**9. Inżynieria i CI/CD**

*   **Narzędzia:** Vite, TypeScript, ESLint (np. standard config + import sorter), Prettier.
*   **Dokumentacja API:** Możliwość wykorzystania narzędzia **Context7 MCP** (`github.com/upstash/context7-mcp`) do dynamicznego odpytywania aktualnej dokumentacji API Phaser 3 w trakcie implementacji.
*   **Git Hooks:** Husky + lint-staged do automatycznego formatowania i lintowania przed commitem.
*   **Testy:**
    *   Jednostkowe: Vitest/Jest dla logiki `core/`.
    *   E2E: Playwright do testowania kluczowych przepływów (start gry, kilka fal, ulepszenie, game over) w headless Chrome, symulując input klawiatury i dotyku.
*   **CI/CD (GitHub Actions):**
    1.  Workflow `on: push` (dla `main` i PR):
        *   Checkout kodu.
        *   Setup Node.js.
        *   Install dependencies (`npm ci`).
        *   Lint (`npm run lint`).
        *   Run unit tests (`npm test`).
        *   Build (`npm run build`).
    2.  Workflow `on: push` (tylko dla `main`, po sukcesie poprzedniego):
        *   Deploy zbudowanej aplikacji (np. na GitHub Pages, Firebase Hosting, Netlify).
*   **Commity:** Konwencja Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).

**10. Roadmapa Implementacji (Kamienie Milowe)**

1.  **M0: Szkielet Projektu (Setup)**
    *   Inicjalizacja projektu Vite + TS + Phaser.
    *   Konfiguracja ESLint, Prettier, Husky.
    *   Stworzenie podstawowej struktury folderów.
    *   Inicjalizacja Git, stworzenie repozytorium GitHub.
    *   Stworzenie podstawowych plików Memory Bank.
    *   Prosta scena Phaser wyświetlająca tekst "Hello World".
    *   Podstawowa konfiguracja PWA (`manifest.json`, pusty `service-worker.ts`).
2.  **M1: Konfiguracja i Zdarzenia**
    *   Implementacja `EventBus`.
    *   Implementacja `ConfigLoader` z walidacją schematów YAML (Zod/Yup).
    *   Stworzenie plików `weapons.yml`, `enemies.yml`, `powerups.yml`, `difficulty.yml` z początkowymi danymi.
    *   Implementacja `Logger` (wysyłanie do `console.log` na razie).
3.  **M2: Podstawowa Rozgrywka (Ruch i Strzelanie)**
    *   Implementacja `PlayerManager` i `InputManager` (ruch poziomy).
    *   Implementacja `WeaponManager` (podstawowa logika przełączania, cooldown dla 'bullet').
    *   Implementacja `ProjectileManager` (podstawowy pocisk).
    *   Implementacja `EconomyManager` (śledzenie waluty).
    *   `GameScene`: Rysowanie gracza, obsługa inputu ruchu, strzelanie pociskami 'bullet'.
    *   `UIScene`: Wyświetlanie waluty, przyciski broni (bez funkcji na razie).
4.  **M3: Wrogowie i Kolizje**
    *   Implementacja `EnemyManager` (podstawowy wróg 'triangle_scout').
    *   Implementacja `SpawnManager` (proste spawnowanie jednego typu wroga w formacji).
    *   `GameScene`: Dodanie fizyki Arcade, obsługa kolizji pocisk gracza <-> wróg.
    *   `EnemyManager`: Logika otrzymywania obrażeń, śmierci, przyznawania nagrody (`EconomyManager`).
    *   `UIScene`: Wyświetlanie numeru fali.
5.  **M4: Rozbudowa Broni i UI**
    *   Implementacja logiki broni 'laser' i 'slow_field' w `WeaponManager` i `ProjectileManager`/`EnemyManager`.
    *   Implementacja fabryk Phaser dla pocisków/efektów.
    *   `UIScene`: Pełna obsługa przełączania broni (klawisze/dotyk), podświetlanie aktywnej, wyświetlanie cooldownów.
    *   Implementacja logiki ulepszeń w `WeaponManager` i `EconomyManager`.
    *   `UIScene`: Dodanie przycisków/interfejsu do ulepszania broni.
6.  **M5: Power-upy i Zaawansowani Wrogowie**
    *   Implementacja `PowerUpManager` (spawnowanie, zbieranie, efekty: tarcza, cash_boost).
    *   Implementacja fabryki Phaser dla power-upów.
    *   `GameScene`: Obsługa kolizji gracz <-> power-up.
    *   `UIScene`: Wyświetlanie aktywnych power-upów i ich timerów.
    *   Implementacja pozostałych typów wrogów (tank, healer, boss) i ich specjalnych umiejętności w `EnemyManager`.
    *   Implementacja logiki strzelania przez wrogów i kolizji pocisk wroga <-> gracz.
    *   `UIScene`: Wyświetlanie HP gracza.
7.  **M6: Pełny Cykl Gry i PWA**
    *   Pełna implementacja `SpawnManager` (dynamiczne fale, bossowie, krzywa trudności).
    *   Implementacja `GameManager` (stany gry, pauza, game over).
    *   `UIScene`: Ekran Game Over.
    *   Pełna implementacja `Logger` z wysyłaniem do API stub.
    *   Pełna implementacja `service-worker.ts` z cachowaniem offline (Workbox).
    *   Testowanie PWA (offline, instalacja).
8.  **M7: Balans, Testy, Optymalizacja i CI/CD**
    *   Intensywne testowanie grywalności, zbieranie feedbacku (nawet od 1-2 osób).
    *   Balansowanie parametrów w plikach YAML na podstawie testów i logów.
    *   Pisanie testów jednostkowych (`core/`) i E2E (Playwright).
    *   Optymalizacja wydajności (profilowanie, redukcja alokacji pamięci w pętli `update`). Cel: stabilne 60 FPS.
    *   Konfiguracja pełnego pipeline CI/CD na GitHub Actions (lint, test, build, deploy).
    *   Finalizacja dokumentacji w Memory Bank.
    *   Wdrożenie publicznego dema.
