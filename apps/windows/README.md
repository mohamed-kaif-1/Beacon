# Helm — Windows Desktop Application

A calm, ambient productivity and live awareness desktop application for Windows 10 & 11, companion to the Helm Chromium browser extension.

---

## 1. Executive Overview

**Helm** keeps you aware of what matters without pulling you away from deep work. While the original application was built for macOS using Swift and AppKit, this directory (`apps/windows/`) contains the native Windows desktop port, architected from the ground up to coexist cleanly alongside the macOS repository.

Helm Windows is local-first, memory-conscious, privacy-preserving, and fully accessible.

### Core Capabilities

- **Ambient Screen Board (Phase 3):**
  - Fullscreen immersive ambient display with zero desktop distractions.
  - Hardware-accelerated Ken Burns pan-and-zoom motion with smooth cross-fades.
  - 6 curated high-definition atmospheric themes (Nordic Mist, Alpine Dusk, Cosmic Abyss, Emerald Aurora, Obsidian Solitude, Pacific Twilight) plus custom local photo folder scanning.
  - Safe local protocol (`helm-wallpaper://`) with strict path and extension guards.
  - Typography clock (12h/24h), localized date, live weather (wttr.in keyless with 15-minute cache), and daily mindfulness quotes.
  - Frosted glass cards displaying high-priority alerts, watches, and upcoming tasks.
  - Full keyboard shortcuts (`Esc`, `F11`, `Space`, `Left`/`Right`) with automatic input isolation.

- **Notes & Tasks with Pure-WASM SQLite (Phase 4):**
  - High-performance, zero-native-compilation SQLite database (`sql.js` WASM) persisted atomically at `%APPDATA%\Helm\helm.db`.
  - Automatic versioned schema migrations with compound indexing for instant searches.
  - Notes with debounced autosave (350ms), pin-to-top, search, and delete protection.
  - Tasks with status transitions (`pending`, `in_progress`, `completed`), priority badges (`low`, `medium`, `high`), due date countdowns, and quick filters.
  - Real-time productivity metrics across the Home Dashboard, Ambient Board, and System Tray.

- **Chromium Extension Live Integration (Phases 1 & 5.2):**
  - Windowless native messaging host (`com.jonathanvineet.helm`) for Chrome, Edge, and Brave.
  - Ultra-low-latency local IPC via Windows Named Pipe (`\\.\pipe\helm-windows-ipc`).
  - Automatic disk fallback (`%APPDATA%\Helm\watches.json`) matching macOS behavior.
  - Native Windows Toast notifications with click-to-open handlers.
  - Real-time diagnostic state machine (`connected`, `connecting`, `disconnected`, `error`) with retry cooldowns and error sanitization.

- **First-Run Onboarding & Preferences (Phases 5.1 & 5.4):**
  - Lightweight, keyboard-accessible 3-step introductory walkthrough with slide-out details.
  - Centralized, strongly typed settings schema persisted at `%APPDATA%\Helm\settings.json`.
  - Deep-merge atomic persistence with Windows OS startup synchronization (`openAtLogin`, `startMinimized`).

- **Diagnostics, Privacy & Security (Phases 5.3 & 5.8):**
  - Structured local logging with automatic 1 MB size-based log rotation (up to 3 backups).
  - In-memory ring buffer (last 100 entries) and single-click sanitized JSON bundle export.
  - Complete redaction filter scrubbing usernames, Bearer tokens, API keys, passwords, and query tokens.
  - Strict IPC sender verification ensuring only authorized renderer frames can invoke backend capabilities.
  - Full sandbox isolation (`contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`).

- **Accessibility & Windows High Contrast (Phase 5.7):**
  - Full keyboard navigation across all views with visible `:focus-visible` focus rings.
  - Reusable modal focus trap (`useFocusTrap`) with initial focus, boundary cycling, and focus restoration.
  - Skip-to-content navigation (`.skip-link`) jumping directly to `<main id="main-content">`.
  - Semantic HTML landmarks, ARIA labels on all icon buttons, and `role="status" aria-live="polite"` dynamic announcements.
  - Windows High Contrast / Forced Colors mode support (`@media (forced-colors: active)`).

- **Performance & Idle Efficiency (Phase 5.6):**
  - Visibility-aware timer throttling: background timers and animations pause when minimized to tray (**0.0% idle CPU**).
  - Sub-millisecond SQLite query execution and composite index optimization.
  - Memory bounds strictly enforced across long-running usage (< 250 MB total RSS).

---

## 2. Technology Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Desktop Runtime** | Electron (v34) | Window management, tray integration, native notifications, protocol handlers |
| **Frontend Framework** | React (v18) + TypeScript (v5) | Component hierarchy, calm declarative state management |
| **Build Tooling** | electron-vite (v3) + Vite (v6) | Instant HMR in development, optimized rollup bundles in production |
| **Styling & Motion** | Tailwind CSS (v3) + GPU CSS3 | Frosted glass aesthetic, accessible contrast, hardware-accelerated Ken Burns |
| **Database Engine** | SQLite (Pure WASM via `sql.js`) | Local-first, zero native compile tools, versioned migrations |
| **Interprocess IPC** | Windows Named Pipe | `\\.\pipe\helm-windows-ipc` for instant, local message transport |
| **Native Host Launcher** | C# (.NET 4.0 / CSC) + Batch | Compiled windowless executable (`helm-native-host.exe`) via built-in `csc.exe` |
| **Packaging & Installer**| electron-builder (v25) + NSIS | Per-user Windows installer (`Helm-Setup-0.1.0.exe`) without admin rights |

---

## 3. Directory Structure

```text
apps/windows/
├── electron/
│   ├── main.ts                  # Application lifecycle, single-instance lock, window & protocol handlers
│   ├── preload.ts               # ContextBridge exposing strictly typed window.helm API
│   ├── ipc.ts                   # Secure IPC handlers with sender validation & payload bounds
│   ├── database.ts              # SQLite WASM engine (%APPDATA%\Helm\helm.db), migrations & health
│   ├── pipe-server.ts           # Named Pipe server, lease management, multi-browser session tracking
│   ├── native-host.ts           # Chromium stdio 4-byte prefix binary framing engine
│   ├── native-host-installer.ts # Chromium Native Messaging registry configuration (HKCU)
│   ├── settings-store.ts        # Centralized settings store (%APPDATA%\Helm\settings.json) & startup sync
│   ├── watches-store.ts         # Browser watches persistence (%APPDATA%\Helm\watches.json)
│   ├── logger.ts                # Structured logger with rotation, ring buffer & privacy redaction
│   ├── wallpaper-manager.ts     # Local folder scanner, dialog picker & built-in atmospheric themes
│   ├── weather-provider.ts      # Keyless weather provider abstraction (wttr.in) with 15-min cache
│   ├── tray.ts                  # System tray icon, status counts & quick action shortcuts
│   └── types.ts                 # Shared TypeScript contracts, settings schema & IPC constants
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx    # Semantic root layout with SkipLink, Sidebar & Main
│   │   │   └── Sidebar.tsx      # Navigation bar with brand icon, Live status & ARIA landmarks
│   │   └── ui/
│   │       ├── Button.tsx       # Accessible button with focus rings & variants
│   │       ├── Card.tsx         # Frosted glass card container
│   │       ├── StatusIndicator.tsx # Subsystem connection pill with pulsing indicator
│   │       └── Badge.tsx        # Compact status tags (success, warning, danger, neutral)
│   │
│   ├── features/
│   │   ├── home/
│   │   │   ├── HomePage.tsx     # Overview dashboard, metric summaries & active watches
│   │   │   └── WatchCard.tsx    # Live page watch cards with multi-stage progress
│   │   ├── ambient/
│   │   │   ├── AmbientBoardPage.tsx    # Fullscreen ambient experience & keyboard listeners
│   │   │   ├── KenBurnsSlideshow.tsx   # Double-buffered Ken Burns pan & zoom layer
│   │   │   ├── BuiltInWallpapers.tsx   # High-definition atmospheric themes
│   │   │   ├── AmbientClockWeather.tsx # Typography clock, live weather & daily quotes
│   │   │   ├── AmbientControls.tsx     # Accessible floating controls with tooltips
│   │   │   ├── AmbientSettingsModal.tsx# Focus-trapped preferences modal
│   │   │   └── AmbientWatchesColumn.tsx# Sidebar with active watches & upcoming tasks
│   │   ├── notes/
│   │   │   ├── NotesPage.tsx    # Split-view notes directory with search & pinning
│   │   │   ├── NoteEditor.tsx   # Autosave editor (350ms) with polite live announcements
│   │   │   └── NoteItemCard.tsx # Note preview card with keyboard selection state
│   │   ├── tasks/
│   │   │   ├── TasksPage.tsx    # Filtered task queues (All, Today, Upcoming, Completed)
│   │   │   ├── TaskItemCard.tsx # Accessible task card with checkboxes & keyboard actions
│   │   │   └── TaskModal.tsx    # Focus-trapped task modal with validation
│   │   ├── onboarding/
│   │   │   └── OnboardingModal.tsx # Accessible 3-step introductory tour
│   │   └── settings/
│   │       └── SettingsPage.tsx # Preferences, browser status, log viewer & diagnostics export
│   │
│   ├── lib/
│   │   └── useFocusTrap.ts      # Reusable modal focus trap hook with Escape and restoration
│   ├── styles/
│   │   └── globals.css          # Tailwind CSS, focus-visible rings & high-contrast rules
│   └── types/
│       └── index.ts             # Renderer type definitions matching preload contract
│
├── resources/
│   ├── icon.ico                 # Multi-resolution Windows application icon (256x256)
│   ├── icon.png                 # Source high-resolution PNG asset
│   ├── installer.nsh            # NSIS installer hooks for Chromium Native Messaging registry
│   └── launcher/
│       ├── HelmNativeHost.cs    # C# source for windowless native messaging launcher
│       └── compile.bat          # Fallback compilation batch script
│
├── scripts/
│   ├── build-launcher.cjs       # C# native host compiler via Windows csc.exe
│   ├── generate-ico.cjs         # Multi-size ICO generator from PNG
│   ├── register-native-host.ps1 # Standalone registration script for Chrome, Edge, Brave
│   ├── test-smoke.cjs           # Production build artifact & Electron smoke tests
│   ├── test-protocol.cjs        # Native messaging binary framing & Named Pipe IPC tests
│   ├── test-ambient.cjs         # Wallpaper scanning, weather fallback & themes tests
│   ├── test-notes-tasks.cjs     # SQLite migrations, CRUD, search & persistence tests
│   ├── test-onboarding.cjs      # Onboarding persistence & state machine tests
│   ├── test-extension-status.cjs# Multi-browser connection state & cooldown tests
│   ├── test-diagnostics.cjs     # Structured logging, rotation & privacy redaction tests
│   ├── test-settings.cjs        # Preferences schema, migration & startup sync tests
│   ├── test-branding-release.cjs# Product metadata, shortcuts & registry tests
│   ├── test-installer.cjs       # Packaged application & user data preservation tests
│   ├── test-performance.cjs     # Throttling, indexing & memory retention tests
│   ├── test-accessibility.cjs   # Landmarks, focus trap, ARIA & contrast tests
│   └── test-stability.cjs       # Phase 5.8 stress, defense-in-depth & SQLite integrity tests
│
├── package.json
└── tsconfig.json
```

---

## 4. Getting Started

### Prerequisites

- **Windows 10 or 11 (64-bit)**
- **Node.js:** v18.0.0 or later (LTS recommended)
- **npm:** v9.0.0 or later
- **Browsers:** Google Chrome, Microsoft Edge, or Brave Browser (for extension integration)

No Visual Studio Build Tools, C++ toolchains, Rust, or Python are required.

### Installation & Development

```powershell
# 1. Navigate to the Windows application directory
cd apps/windows

# 2. Install dependencies
npm install

# 3. Launch in development mode with Hot Module Replacement (HMR)
npm run dev
```

### Building the Production Application

```powershell
# Typecheck TypeScript definitions
npm run typecheck

# Build optimized production bundle
npm run build

# Package unpacked standalone directory (dist/win-unpacked/Helm.exe)
npm run package:win

# Build standalone Windows NSIS Installer (dist/Helm-Setup-0.1.0.exe)
npm run dist:win
```

### Running the Full Test Suite

```powershell
npm test
```

This executes all 13 automated test suites:
1. `test:smoke` — Build artifact presence & Electron runtime launch
2. `test:protocol` — Binary framing & Windows Named Pipe IPC
3. `test:ambient` — Ambient configuration, wallpapers & weather fallback
4. `test:notes-tasks` — SQLite WASM migrations, CRUD & disk persistence
5. `test:onboarding` — First-run tour persistence & state machine
6. `test:extension-status` — Real-time connection states & retry logic
7. `test:diagnostics` — Privacy redaction, log rotation & health checks
8. `test:settings` — Centralized preferences schema & OS startup synchronization
9. `test:branding` — Product metadata, icons & registry keys
10. `test:installer` — Packaged app verification & data preservation
11. `test:performance` — Background throttling & composite query indexing
12. `test:a11y` — Focus trapping, skip link, ARIA landmarks & contrast
13. `test:stability` — High-throughput bursts, zero leaks & SQLite integrity

---

## 5. Keyboard Navigation & Shortcuts

| Context | Shortcut | Action |
| :--- | :--- | :--- |
| **Global** | `Tab` / `Shift+Tab` | Navigate between focusable elements with visible rings |
| **Global** | `Enter` / `Space` | Activate focused button, link, or toggle |
| **Global** | `Alt + Shift + S` | Skip directly to main content (`.skip-link`) |
| **Modals** | `Escape` | Dismiss active modal and return focus to trigger |
| **Ambient Board** | `Space` | Pause or resume wallpaper slideshow |
| **Ambient Board** | `ArrowRight` | Advance to next atmospheric wallpaper |
| **Ambient Board** | `ArrowLeft` | Return to previous atmospheric wallpaper |
| **Ambient Board** | `F11` | Toggle fullscreen mode |
| **Ambient Board** | `Escape` | Exit fullscreen Ambient mode back to dashboard |
| **Notes Editor** | `Ctrl + S` | Force immediate disk write (autosaves every 350ms) |

---

## 6. Privacy & Security Architecture

1. **Local-First Architecture:** All notes, tasks, watch items, and preferences reside locally on your PC under `%APPDATA%\Helm`. No user content is ever transmitted to remote servers.
2. **Context Isolation & Sandbox:** The Electron renderer runs with `sandbox: true`, `contextIsolation: true`, and `nodeIntegration: false`. The renderer has no direct access to the filesystem, child processes, or SQLite directly.
3. **IPC Defense-in-Depth:** Every IPC handler verifies that the calling `event.sender` matches the authorized main window `webContents`.
4. **Automated Privacy Redaction:** The diagnostic logging engine actively redacts Windows user directory paths (`C:\Users\<redacted>\...`), Bearer tokens, authorization headers, API keys, and sensitive URL query strings before writing to disk or exporting.
5. **Keyless Weather Integration:** Weather queries to `wttr.in` require no API keys, accounts, or personal information. When offline, weather displays a truthful fallback without throwing or fabricating data.
6. **Isolated Native Messaging:** The browser extension communicates strictly via local standard I/O through a compiled, windowless launcher (`helm-native-host.exe`) into the local Named Pipe (`\\.\pipe\helm-windows-ipc`).

---

## 7. Troubleshooting & FAQ

#### The browser extension status shows "Disconnected". What should I do?
1. Ensure Helm desktop is running (check the system tray).
2. Ensure you have the Helm browser extension installed in Google Chrome, Microsoft Edge, or Brave.
3. Open Helm **Settings** $\rightarrow$ click **Retry Connection**.
4. If necessary, re-run Native Messaging registration:
   ```powershell
   npm run register
   ```

#### Does uninstalling delete my Notes, Tasks, or Settings?
**No.** The NSIS uninstaller (`resources/installer.nsh`) explicitly sets `deleteAppDataOnUninstall: false`. It unregisters the native messaging host and removes shortcuts, but leaves `%APPDATA%\Helm` intact so your data is never lost during upgrades or re-installations.

#### Windows SmartScreen shows "Windows protected your PC". Is this normal?
Yes. Open-source releases built without an Enterprise Extended Validation (EV) certificate trigger SmartScreen until community download volume builds up. Click **More info** $\rightarrow$ **Run anyway** to proceed.

---

## 8. License

MIT License. Copyright © 2026 Jonathan Vineet & Helm Contributors.
