# ZPermissions

**A cross-platform, open-source file permission manager built for power users.**

Manage POSIX chmod bits, Unix ACLs, and Windows access control lists through a unified spatial interface — no terminal required, no guessing octal values.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey)](https://github.com/TheHolyOneZ/ZPermission/releases)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%20v2-24c8db)](https://tauri.app)

---

## What It Does

ZPermissions gives you a visual, staged workflow for reading and modifying file system permissions:

- **Read** permissions from any file or directory — owner, group, mode bits, ACL entries
- **Stage** changes in a review queue before anything is written to disk
- **Apply** atomically, or discard and start over
- **Navigate** your filesystem with pinned quick-access locations (Home, Desktop, Documents, Downloads, Root)
- **Inspect** identities — owner and group displayed as visual cards with per-principal R/W/X indicators
- **Protected paths** blocked from writes on every platform — no accidental lockouts

---

## Features

| Feature | Linux | macOS | Windows |
|---|---|---|---|
| POSIX mode bits (chmod) | ✅ | ✅ | — |
| Octal + symbolic notation | ✅ | ✅ | — |
| setUID / setGID / sticky | ✅ | ✅ | — |
| Owner / group display | ✅ | ✅ | ✅ |
| Windows file attributes | — | — | ✅ |
| Full ACL (planned) | 🔜 | 🔜 | 🔜 |
| Staged change workflow | ✅ | ✅ | ✅ |
| Protected path guard | ✅ | ✅ | ✅ |
| Custom context menu | ✅ | ✅ | ✅ |
| Pinned locations | ✅ | ✅ | ✅ |
| Open links natively | ✅ | ✅ | ✅ |

---

## Installation

### Linux

**AppImage** (universal, no install required):
```bash
chmod +x ZPermissions_*.AppImage
./ZPermissions_*.AppImage
```

**Debian / Ubuntu**:
```bash
sudo dpkg -i ZPermissions_*.deb
```

**Fedora / RHEL / openSUSE**:
```bash
sudo rpm -i ZPermissions_*.rpm
```

### macOS

Download the `.dmg` for your architecture, open it, and drag ZPermissions to `/Applications`.

- **Apple Silicon (M1/M2/M3):** `ZPermissions_*_aarch64.dmg`
- **Intel:** `ZPermissions_*_x64.dmg`

macOS may require you to right-click → Open the first time due to Gatekeeper.

### Windows

Run the NSIS installer:
```
ZPermissions_*_x64-setup.exe
```

Or install silently via the MSI:
```powershell
msiexec /i ZPermissions_*_x64_en-US.msi /quiet
```

---

## Building from Source

### Prerequisites

- [Rust](https://rustup.rs) (stable toolchain)
- [Node.js](https://nodejs.org) 18+
- [Tauri CLI](https://tauri.app/start/prerequisites/) v2
- Platform build tools (see [Tauri prerequisites](https://tauri.app/start/prerequisites/))

### Steps

```bash
git clone https://github.com/TheHolyOneZ/ZPermission.git
cd ZPermission

pnpm install

# Development (hot reload)
pnpm tauri dev

# Production build
pnpm tauri build
```

Outputs land in `src-tauri/target/release/bundle/`.

### Type Check / Rust Check

```bash
pnpm tsc --noEmit
cd src-tauri && cargo check
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Rust |
| Desktop bridge | Tauri v2 |
| Frontend | React 18 + TypeScript |
| State | Zustand v5 |
| Animations | Framer Motion v11 |
| Styling | Tailwind CSS v4 |
| Font | JetBrains Mono |

---

## Architecture

```
ZPermission/
├── src/                          # React frontend
│   ├── components/
│   │   ├── layout/               # AppShell, TopBar, DossierPanel
│   │   ├── library/              # File navigator + pinned locations
│   │   ├── dossier/              # Permission matrix, view toggle
│   │   ├── identity/             # Identity cards, ACL rows
│   │   ├── about/                # About modal
│   │   └── ui/                   # Context menu
│   ├── store/                    # Zustand stores (file, permission, ui, context menu)
│   ├── hooks/                    # usePermissions, useClock
│   └── types/                    # Shared TypeScript types
└── src-tauri/
    ├── src/
    │   ├── commands.rs           # Tauri commands (get/set permissions, open URL, common dirs)
    │   ├── lib.rs                # App builder, plugin registration
    │   └── permissions/
    │       ├── types.rs          # Shared data structs
    │       ├── unix.rs           # Linux + macOS implementation
    │       └── windows.rs        # Windows implementation
    └── capabilities/
        └── default.json          # Tauri v2 permission grants
```

---

## Protected Paths

ZPermissions blocks writes to system-critical paths on each platform:

**Linux:** `/proc` `/sys` `/dev` `/run` `/boot`

**macOS:** `/System` `/System/Library` `/usr/bin` `/usr/sbin` `/sbin` `/bin` `/private/etc` `/private/var`

**Windows:** `C:\Windows\System32` `C:\Windows\SysWOW64` `C:\Windows\WinSxS`

---

## License

ZPermissions is free software released under the **GNU General Public License v3.0**.

Copyright (C) 2026 TheHolyOneZ

You are free to use, modify, and distribute this software under the terms of the GPL-3.0. See [LICENSE](LICENSE) for the full text.
