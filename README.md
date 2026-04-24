<div align="center">
  <img src="src-tauri/icons/128x128.png" width="96" height="96" alt="ZPermissions" />
  <h1>ZPermissions</h1>
  <p><strong>Cross-platform file permission manager — built for power users who refuse to guess chmod values.</strong></p>

  <p>
    <a href="https://zsync.eu/zpermissions/"><img src="https://img.shields.io/badge/website-zsync.eu%2Fzpermissions-4a9eff?style=flat-square" alt="Website" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-blue?style=flat-square" alt="License" /></a>
    <a href="https://github.com/TheHolyOneZ/ZPermission/releases"><img src="https://img.shields.io/github/v/release/TheHolyOneZ/ZPermission?style=flat-square&color=4ade80" alt="Release" /></a>
    <img src="https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey?style=flat-square" alt="Platforms" />
    <a href="https://tauri.app"><img src="https://img.shields.io/badge/built%20with-Tauri%20v2-24c8db?style=flat-square" alt="Tauri" /></a>
    <img src="https://img.shields.io/badge/telemetry-none-4ade80?style=flat-square" alt="No telemetry" />
  </p>

  <p>
    <a href="https://zsync.eu/zpermissions/">🌐 Website</a> ·
    <a href="https://github.com/TheHolyOneZ/ZPermission/releases">📦 Releases</a> ·
    <a href="https://github.com/TheHolyOneZ/ZPermission/issues">🐛 Issues</a>
  </p>
</div>

---

## What Is ZPermissions?

ZPermissions is a **desktop GUI** for reading and modifying file system permissions across Linux, macOS, and Windows — without touching the terminal. It wraps POSIX `chmod`/`chown`, Unix ACLs, and Windows file attributes in a **spatial dossier interface** designed around a staged-changes workflow: you build up a set of changes, review them, and apply atomically — or discard everything and start over.

No cloud. No accounts. No telemetry. Runs entirely on your machine.

---

## Features

<table>
<tr>
<th>Feature</th><th>Linux</th><th>macOS</th><th>Windows</th>
</tr>
<tr><td>POSIX mode bits (chmod)</td><td>✅</td><td>✅</td><td>—</td></tr>
<tr><td>Octal + symbolic notation</td><td>✅</td><td>✅</td><td>—</td></tr>
<tr><td>setUID / setGID / sticky bit</td><td>✅</td><td>✅</td><td>—</td></tr>
<tr><td>Owner &amp; group display</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>Windows file attributes</td><td>—</td><td>—</td><td>✅</td></tr>
<tr><td>Full ACL editor</td><td>🔜</td><td>🔜</td><td>🔜</td></tr>
<tr><td>Staged change workflow</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>Protected path guard</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>Pinned quick-access locations</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>Custom right-click context menu</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>Native link opening</td><td>✅</td><td>✅</td><td>✅</td></tr>
</table>

---

## Installation

### Linux

<details>
<summary><strong>AppImage</strong> — universal, no install required</summary>

```bash
chmod +x ZPermissions_*.AppImage
./ZPermissions_*.AppImage
```

Works on any x86_64 Linux distribution.
</details>

<details>
<summary><strong>Debian / Ubuntu / Mint / Pop!_OS</strong></summary>

```bash
sudo dpkg -i ZPermissions_*.deb
```
</details>

<details>
<summary><strong>Fedora / RHEL / CentOS / openSUSE</strong></summary>

```bash
sudo rpm -i ZPermissions_*.rpm
```
</details>

### macOS

Download the `.dmg` for your chip, open it, drag ZPermissions to `/Applications`.

| Chip | File |
|---|---|
| Apple Silicon (M1 / M2 / M3 / M4) | `ZPermissions_*_aarch64.dmg` |
| Intel | `ZPermissions_*_x64.dmg` |

> [!NOTE]
> macOS may show a Gatekeeper warning on first launch. Right-click the app → **Open** to bypass it.

### Windows

<details>
<summary><strong>NSIS Installer</strong> — recommended</summary>

Run `ZPermissions_*_x64-setup.exe`. Installs to the current user — no admin elevation required.
</details>

<details>
<summary><strong>MSI Package</strong> — enterprise / silent install</summary>

```powershell
msiexec /i ZPermissions_*_x64_en-US.msi /quiet
```
</details>

> [!NOTE]
> Windows 10 (1903+) and Windows 11 are supported. WebView2 is installed silently on first run if not already present.

---

## Building from Source

### Prerequisites

| Tool | Version |
|---|---|
| [Rust](https://rustup.rs) | stable toolchain |
| [pnpm](https://pnpm.io) | 9+ |
| [Tauri prerequisites](https://tauri.app/start/prerequisites/) | platform build tools |

> [!IMPORTANT]
> Linux requires additional system packages before building:
> ```bash
> sudo apt-get install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
> ```

### Steps

```bash
git clone https://github.com/TheHolyOneZ/ZPermission.git
cd ZPermission

pnpm install

# Development — hot reload
pnpm tauri dev

# Production build
pnpm tauri build
```

Bundles land in `src-tauri/target/release/bundle/`.

### Verify

```bash
# TypeScript
pnpm tsc --noEmit

# Rust
cd src-tauri && cargo check
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Rust (stable) |
| Desktop bridge | Tauri v2 |
| Frontend | React 18 + TypeScript |
| State management | Zustand v5 |
| Animations | Framer Motion v11 |
| Styling | Tailwind CSS v4 |
| Font | JetBrains Mono |

---

## Architecture

```
ZPermission/
├── .github/workflows/
│   └── release.yml               # CI/CD — builds all platforms on tag push
├── src/                          # React frontend
│   ├── components/
│   │   ├── layout/               # AppShell, TopBar, DossierPanel
│   │   ├── library/              # File navigator + pinned locations
│   │   ├── dossier/              # Permission matrix, view toggle
│   │   ├── identity/             # Identity cards, ACL rows
│   │   ├── about/                # About modal
│   │   └── ui/                   # Custom context menu
│   ├── store/                    # Zustand stores
│   ├── hooks/                    # usePermissions, useClock
│   └── types/                    # Shared TypeScript types
└── src-tauri/
    ├── src/
    │   ├── commands.rs           # Tauri commands
    │   ├── lib.rs                # App builder + plugin registration
    │   └── permissions/
    │       ├── types.rs          # Shared data structs
    │       ├── unix.rs           # Linux + macOS (POSIX)
    │       └── windows.rs        # Windows (file attributes)
    ├── capabilities/
    │   └── default.json          # Tauri v2 permission grants
    └── tauri.conf.json           # Bundle config (icons, targets, signing)
```

---

## Protected Paths

> [!CAUTION]
> ZPermissions hard-blocks writes to these paths on every platform. This cannot be overridden from the UI.

**Linux:** `/proc` · `/sys` · `/dev` · `/run` · `/boot`

**macOS:** `/System` · `/System/Library` · `/usr/bin` · `/usr/sbin` · `/sbin` · `/bin` · `/private/etc` · `/private/var`

**Windows:** `C:\Windows\System32` · `C:\Windows\SysWOW64` · `C:\Windows\WinSxS`

---

## License

ZPermissions is free software released under the **GNU General Public License v3.0**.

```
Copyright (C) 2026 TheHolyOneZ

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

See [LICENSE](LICENSE) for the full text.
