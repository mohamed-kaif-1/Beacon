# Helm Windows — Release Workflow & Version Management Guide

This document defines the authoritative, repeatable release workflow, Semantic Versioning policy, and packaging integrity guidelines for the Helm Windows desktop application.

---

## 1. Semantic Versioning Policy (SemVer 2.0.0)

Helm Windows strictly adheres to [Semantic Versioning 2.0.0](https://semver.org/):

$$\text{MAJOR}.\text{MINOR}.\text{PATCH}$$

- **MAJOR (X.0.0)**:
  - Incompatible architectural changes.
  - Breaking database schema migrations that cannot be auto-migrated.
  - Breaking Native Messaging or IPC protocol changes requiring browser extension replacement.
- **MINOR (0.X.0)**:
  - New backward-compatible features (e.g., Ambient Screen Board, Notes & Tasks, Diagnostics, Settings enhancements).
  - New configuration capabilities or supported browser integrations.
- **PATCH (0.0.X)**:
  - Backward-compatible bug fixes, performance improvements, visual polish, dependency updates, or documentation updates.

> [!IMPORTANT]
> The single source of truth for versioning is the `"version"` field in `apps/windows/package.json`. Electron, runtime diagnostics, installer filenames, and Settings UI dynamically query this authoritative version.

---

## 2. Release Prerequisites & Security Rules

1. **Local and Self-Contained**: Helm Windows is designed as a local-first ambient productivity tool.
2. **No Cloud Publishing without Authorization**: Packaged installers and release artifacts must **never** be published to GitHub Releases, package registries, or external websites without explicit user authorization.
3. **Zero Secret Leakage**:
   - Never package `.env`, `.pem`, `.key`, or credentials.
   - Build packaging filters (`package.json` `"files"`) are strictly locked to `["out/**/*", "package.json"]`.
4. **Code-Signing Limitations Disclosure**:
   - Packaged binaries are built without an Enterprise EV (Extended Validation) code-signing certificate.
   - The installer runs per-user without administrative rights (`perMachine: false`, `allowElevation: false`) in `%LOCALAPPDATA%\Programs\Helm`.
   - Windows SmartScreen may present an informative "Windows protected your PC" dialog on fresh downloads until sufficient community reputation is established. Clicking **More info** $\rightarrow$ **Run anyway** executes the installer cleanly.

---

## 3. Repeatable Release Workflow

Follow these exact steps from PowerShell when preparing a production release:

### Step 1: Check Working Tree & Branch
Ensure you are on the `windows-port` branch and git status is clean:
```powershell
Set-Location "c:\Users\moham\OneDrive - ELCOT\Projects\Helm\helm"
git status
git branch
```

### Step 2: Validate TypeScript Compilation
Run typecheck across main process Node and renderer Web configurations:
```powershell
Set-Location "apps\windows"
npm run typecheck
```
*Requirement: Must exit with 0 errors.*

### Step 3: Run Full Regression Test Matrix
Execute all 13 automated regression test suites:
```powershell
npm test
```
*Requirement: All 13 test suites must pass:*
1. `test:smoke` (Build artifacts & runtime init)
2. `test:protocol` (Native Messaging & Named Pipe IPC)
3. `test:ambient` (Ambient settings, wallpapers & weather)
4. `test:notes-tasks` (SQLite WASM migrations, CRUD & persistence)
5. `test:onboarding` (Onboarding tour & state transitions)
6. `test:extension-status` (Multi-browser states & retry logic)
7. `test:diagnostics` (Structured logging & privacy redaction)
8. `test:settings` (Centralized schema & startup synchronization)
9. `test:branding` (Metadata, icons & registry keys)
10. `test:installer` (Packaged app verification & data preservation)
11. `test:performance` (Throttling, compound indexes & memory stability)
12. `test:a11y` (Focus trapping, skip link, ARIA & contrast)
13. `test:stability` (High-throughput bursts, zero leaks & SQLite integrity)

### Step 4: Verify Browser Extension Unit Tests
Execute the original browser extension test suite from the repository root:
```powershell
Set-Location "c:\Users\moham\OneDrive - ELCOT\Projects\Helm\helm"
node --test tests\extension\understand.test.cjs
```
*Requirement: All 12/12 tests must pass.*

### Step 5: Bump Version (When Preparing Release)
Update `package.json` version using npm:
```powershell
Set-Location "apps\windows"
# For patch release:
npm version patch --no-git-tag-version

# Or for minor release:
# npm version minor --no-git-tag-version
```

### Step 6: Build Production Application
Compile main process, preload bridge, React renderer, and the native messaging launcher:
```powershell
npm run build
```

### Step 7: Build Windows Unpacked Directory (Sanity Check)
Package the application into an unpacked Windows directory:
```powershell
npm run package:win
```
*Output: `dist\win-unpacked\Helm.exe`*

### Step 8: Build Standalone NSIS Windows Installer
Generate the standalone per-user Windows installer:
```powershell
npm run dist:win
```
*Output: `dist\Helm-Setup-0.1.0.exe` (~95.7 MB)*

### Step 9: Compute SHA-256 Checksums
Compute and record the cryptographic hash for integrity verification:
```powershell
Get-FileHash -Algorithm SHA256 dist\Helm-Setup-*.exe | Format-List
```
*Current Release Checksum (v0.1.0):*
- **File:** `Helm-Setup-0.1.0.exe`
- **SHA256:** `0070F5614E229D9E24D70B7E55BA91894DA9EBA4A241F6B25599F263EC375537`

---

## 4. Upgrade & Uninstallation Verification Checklist

Before distributing an updated installer, manually verify the following behaviors:

1. **Upgrade Over Previous Version**:
   - Run `Helm-Setup-<version>.exe` while an older version is installed.
   - Verify files in `%LOCALAPPDATA%\Programs\Helm` are updated.
   - Launch Helm and verify that `%APPDATA%\Helm\helm.db` (Notes & Tasks), `settings.json`, and `watches.json` are **100% preserved**.
2. **Browser Extension Integration After Upgrade**:
   - Open Chrome, Edge, or Brave.
   - Verify that Native Messaging host registers cleanly and reports `connected` state.
3. **Uninstallation & Cleanup**:
   - Run Windows Settings $\rightarrow$ Installed Apps $\rightarrow$ **Helm** $\rightarrow$ **Uninstall**.
   - Verify `%LOCALAPPDATA%\Programs\Helm` is removed.
   - Verify Native Messaging registry keys and Startup registry entries are unhooked.
   - Verify user database and settings in `%APPDATA%\Helm` remain preserved.

---

## 5. Development vs. Production Builds

| Characteristic | Development (`npm run dev`) | Production (`npm run dist:win`) |
| :--- | :--- | :--- |
| **Renderer Server** | Vite Dev Server (`localhost:5173`) | Precompiled static assets in `app.asar` |
| **Electron Window** | Loads `ELECTRON_RENDERER_URL` | Loads `out/renderer/index.html` via `file://` |
| **DevTools** | Auto-opened or accessible | Disabled by default |
| **Native Host** | Runs `scripts/build-launcher.cjs` | Bundled `helm-native-host.exe` |
| **Installation** | Runs in-place from workspace | Installed to `%LOCALAPPDATA%\Programs\Helm` |
