# Contributing to CLI Logging

Thanks for your interest in contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies

```bash
npm install
```

3. Run in development mode

```bash
npm run dev
```

## Branch Naming

Use clear branch names, for example:

- `feat/<feature-name>`
- `fix/<bug-name>`
- `docs/<doc-update>`
- `chore/<maintenance-task>`

## Commit Style

Use descriptive commits:

- `feat: add category filter persistence`
- `fix: handle empty history file safely`
- `docs: improve README architecture section`

## Pull Request Checklist

- Keep changes focused and small
- Explain why the change is needed
- Include screenshots for UI changes
- Ensure app starts with `npm run dev`
- Update docs if behavior changes

## Code Guidelines

- Keep IPC surface minimal and explicit
- Prefer local-first behavior and privacy-safe defaults
- Keep renderer and main-process responsibilities cleanly separated
- Add comments only where logic is non-obvious

## Reporting Issues

When opening an issue, include:

- Windows version
- PowerShell version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshot/logs if available

Thank you for helping improve CLI Logging.
