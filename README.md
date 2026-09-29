# Living Architecture Nodes for VS Code

**Keep codebase architecture memory current before humans or AI change the code.**

Living Architecture Nodes is a local-first maintenance protocol for keeping module intent, dependencies, drift, regression memory, and AI/dev handoff context alongside the code that changes.

## What the extension does

- scans the current workspace for Living Architecture Nodes artifacts;
- shows architecture-memory health in the VS Code sidebar;
- detects missing `.node.md` companion files;
- detects stale/dirty node memory when source files move ahead of their companions;
- detects orphan node files;
- creates missing node files as **generated drafts** after explicit confirmation;
- opens `ARCH.md`, `NERVE.md`, and `CHANGELOG.node.md`;
- exports local JSON and Markdown handoff bundles;
- keeps core operation local with **no telemetry**.

Generated drafts are **not verified architecture truth**. They must be populated, reviewed, and verified separately.

## Free, Pro, and Team

The Marketplace extension remains **Free** and the core local workflow does not require an account.

The commercial product model supports deeper optional Pro and Team capabilities such as semantic architectural drift, impact analysis, regression correlation, signed verification receipts, historical comparison, shared policy, and cross-repository analysis.

**Paid capabilities are not enabled in the current pre-release channel.** Until production entitlement services are activated, the extension safely operates as Free.

If a deeper check is unavailable because it was not executed, the correct status is:

```text
NOT VERIFIED
```

That does not mean failed or unsafe.

## Restricted Mode / Workspace Trust

Read-only architecture-memory scanning remains available in Restricted Mode.

Operations that modify the workspace require Workspace Trust:

- generating `.node.md` drafts;
- writing diagnostic export bundles.

Write and export destinations are confined to the active workspace and reject path traversal or symbolic-link escape.

## Commands

- `Living Architecture Nodes: Scan Workspace`
- `Living Architecture Nodes: Generate Missing Node Files`
- `Living Architecture Nodes: Export AI/Dev Handoff Bundle`
- `Living Architecture Nodes: Show Product Status`
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

## Typical workflow

1. Open a workspace.
2. Open the **Living Architecture Nodes** sidebar.
3. Run **Scan Workspace**.
4. Review missing, stale, or orphan architecture memory.
5. In a trusted workspace, create missing node drafts when useful.
6. Populate and review drafts before treating them as architecture truth.
7. Export a local handoff bundle when another human or AI system needs diagnostic context.

## Output

Diagnostic exports are written locally to `.lan-vscode/` by default:

```text
.lan-vscode/living-architecture-diagnostic.json
.lan-vscode/living-architecture-diagnostic.md
```

The export path must remain inside the trusted workspace.

## Privacy

The scanner uses repository structure, relative paths, companion-node presence, and filesystem metadata; it does **not** read source-file contents for architecture-memory scanning.

Diagnostic handoff exports are local. They may contain relative repository paths and maintenance findings, but absolute workspace paths are removed and secret-shaped metadata is defensively redacted before both JSON and Markdown are written. Core Free operation does not send source code, architecture memory, diagnostics, secrets, repository content, or behavioral telemetry to a remote service.

Future paid entitlement checks are designed to exchange account/product entitlement metadata only—not repository contents.

See [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md).

## Release channel

Living Architecture Nodes has a **stable channel** and an **optional pre-release channel**.

The pre-release channel is used to validate new product, security, entitlement, and upgrade behavior before those changes are promoted to stable.

See [CHANGELOG.md](CHANGELOG.md) for current versions and release details.

## Support and licensing

- Product page: https://altru.dev/living-architecture-nodes
- Specification: https://github.com/altrudev/living-architecture-nodes
- GitHub Action: https://github.com/altrudev/living-architecture-nodes-action
- Issues/support: https://github.com/altrudev/living-architecture-nodes-vscode/issues
- Support policy: [SUPPORT.md](SUPPORT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- License: [LICENSE](LICENSE)

Living Architecture Nodes™ is a separate product from other Altru.dev research and development systems.

Developed by Altru.dev — Code For Humanity.

Copyright 2026 Valentyn Rukhaylo / Altru.dev.
