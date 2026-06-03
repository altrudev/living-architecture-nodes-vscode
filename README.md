# Living Architecture Nodes for VS Code

Official VS Code extension for **Living Architecture Nodes** architecture-memory checks, node generation, and AI/dev handoff exports.

Living Architecture Nodes is a repository nervous-system protocol for AI-assisted software maintenance. This extension brings the protocol into the editor so maintainers can see missing node files, dirty architecture memory, required artifacts, and exportable diagnostic context before changes reach CI.

## Features

- Scan the current workspace for Living Architecture Nodes artifacts
- Show architecture-memory health score in the VS Code sidebar
- Detect missing `.node.md` companion files
- Detect dirty/stale node files when source files are newer than their companions
- Detect orphan node files
- Generate missing `.node.md` files from a structured template
- Open `ARCH.md`, `NERVE.md`, and `CHANGELOG.node.md` quickly
- Export AI/dev handoff bundles as JSON and Markdown
- Local-first operation with no telemetry

## Commands

- `Living Architecture Nodes: Scan Workspace`
- `Living Architecture Nodes: Generate Missing Node Files`
- `Living Architecture Nodes: Export AI/Dev Handoff Bundle`
- `Living Architecture Nodes: Open ARCH.md`
- `Living Architecture Nodes: Open NERVE.md`
- `Living Architecture Nodes: Open CHANGELOG.node.md`

## Required repository artifacts

A project using Living Architecture Nodes should include:

```text
.node.md companion files per significant module/component
ARCH.md
NERVE.md
CHANGELOG.node.md
diagnostic export interface
```

## Extension workflow

1. Open a workspace folder.
2. Open the Living Architecture Nodes sidebar.
3. Run **Scan Workspace**.
4. Generate missing node files if needed.
5. Review dirty/stale node warnings before editing code.
6. Export the AI/dev handoff bundle when you need diagnostic context.

## Output

Diagnostic exports are written to `.lan-vscode/` by default:

```text
.lan-vscode/living-architecture-diagnostic.json
.lan-vscode/living-architecture-diagnostic.md
```

## Privacy

This extension is local-first. It reads your workspace files and writes local diagnostic exports. It does not send code, diagnostics, telemetry, secrets, or repository content to a remote service.

## Related links

- Spec page: https://altru.dev/living-architecture-nodes
- Specification repo: https://github.com/altrudev/living-architecture-nodes
- GitHub Action: https://github.com/altrudev/living-architecture-nodes-action

Developed by Altru.dev — Code For Humanity.

Copyright 2026 Valentyn Rukhaylo / Altru.dev.
