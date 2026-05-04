# CLI Logging

A lightweight desktop app for Windows that tracks your CLI command history from PowerShell and helps you explore usage patterns.

Built with Electron, React, TypeScript, Tailwind CSS, and `sql.js`.

## Why this project?

When you work in the terminal all day, your command history becomes valuable data:
- Which commands do you use most?
- What categories of work are you doing (Git, Docker, Python, etc.)?
- What does your command activity look like over time?

CLI Logging gives you a local-first way to answer these quickly.

## Features

- Live command tracking from PowerShell history files (Windows PowerShell + PowerShell 7)
- Local command database (SQLite via `sql.js`)
- Automatic command categorization (Git, npm, Docker, Python, filesystem, cloud, and more)
- Search and category filtering
- Stats dashboard:
  - Total commands
  - Commands used today
  - Unique commands
  - Category breakdown
  - Top commands by frequency
  - Hourly activity chart (last 7 days)
- System tray support with quick reopen
- Global shortcut: `Ctrl + Shift + L` to show/hide app window
- Frameless, modern desktop UI

## Tech Stack

- Electron
- React 18 + TypeScript
- Vite
- Tailwind CSS
- `sql.js`
- `chokidar`

## Requirements

- Windows 10/11
- Node.js 18+
- npm

## Getting Started

```bash
npm install
npm run dev
```

This starts:
- Vite dev server (`http://localhost:5173`)
- Electron app in development mode

## Build for Windows

```bash
npm run build
```

The installer output is generated in the `release/` folder (NSIS target).

## Project Structure

```text
electron/
  main.cjs         # Electron main process + IPC
  preload.cjs      # Secure bridge for renderer
  database.cjs     # Local DB + query logic
  watcher.cjs      # History file watcher
  categorizer.cjs  # Command category rules
  tray.cjs         # System tray integration

src/
  App.tsx          # Main UI shell
  components/      # Sidebar, search, list, stats, settings
  types/           # Shared TypeScript types
```

## Privacy

- Data is stored locally on your machine.
- No analytics or telemetry are sent by default.
- Commands are read from local PowerShell history files.

## Current Limitations

- Focused on Windows + PowerShell history sources.
- Settings toggles in UI are currently visual (not fully wired to persistent behavior yet).
- Command `source` is mostly tagged as `powershell` in current watcher flow.

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Open a pull request

## Roadmap Ideas

- Full settings persistence + runtime toggles
- Better per-shell source detection
- Export/import history
- Advanced search syntax and saved filters
- Optional redaction rules for sensitive commands

## License

Choose and add a license before public release (recommended: MIT).