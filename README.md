# CLI Logging

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Windows%2010%2F11-0078D4?style=for-the-badge&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-33-47848F?style=for-the-badge&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=0b1020)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A local-first desktop app to track, search, and analyze your PowerShell command history.

</div>

---

## Overview

CLI Logging helps developers understand terminal usage patterns without sending data to external services.

It watches local PowerShell history files, categorizes commands automatically, stores everything locally, and gives you a modern UI for search + insights.

## Screenshot

![CLI Logging Dashboard](assets/cli-logging-dashboard.png)

## Key Features

- Live command ingestion from PowerShell history files
- Fast local storage with SQLite (`sql.js`)
- Automatic command categorization (Git, Docker, npm, Python, filesystem, cloud, and more)
- Instant search and category filters
- Stats dashboard with:
  - total commands
  - today activity
  - unique commands
  - category distribution
  - top repeated commands
  - hourly activity graph
- System tray integration + quick reopen
- Global toggle shortcut: `Ctrl + Shift + L`
- Clean frameless desktop experience

## How It Works

1. The app watches PowerShell history files under `%APPDATA%`.
2. New command lines are captured in near real time.
3. Each command is categorized using rule-based matching.
4. Commands are stored in a local DB with timestamp, source, category, and frequency.
5. React UI fetches this data via secure Electron IPC and renders command views + analytics.

## Architecture

```text
PowerShell History Files
        |
        v
electron/watcher.cjs (chokidar)
        |
        v
electron/database.cjs (sql.js)
        |
        v
electron/main.cjs (IPC handlers)
        |
        v
electron/preload.cjs (secure API bridge)
        |
        v
React UI (src/*)
```

## Tech Stack

- Electron
- React 18 + TypeScript
- Vite
- Tailwind CSS
- `sql.js`
- `chokidar`

## Getting Started

### Prerequisites

- Windows 10/11
- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

This starts Vite + Electron in development mode.

### Build Installer

```bash
npm run build
```

Installer output is generated in `release/`.

## Project Structure

```text
electron/
  main.cjs          # Electron lifecycle + IPC
  preload.cjs       # contextBridge API
  database.cjs      # local DB and stats queries
  watcher.cjs       # command history watcher
  categorizer.cjs   # rule-based command categorization
  tray.cjs          # system tray menu

src/
  App.tsx
  components/
  types/
```

## Privacy

- Local-first by design.
- No telemetry enabled by default.
- Command history data stays on your machine.

## Current Scope

- Primary focus: Windows + PowerShell history workflow.
- Some settings UI controls are currently presentational and can be wired deeper in future releases.

## Roadmap

- Persistent settings behavior (auto-start, watcher toggles)
- Better multi-shell source detection
- Export/import workflows
- Optional sensitive-command redaction
- Extended analytics and trend insights

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Commit with clear messages
4. Open a pull request

## License

MIT (recommended for open source). Add a `LICENSE` file to finalize.
