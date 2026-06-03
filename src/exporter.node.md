# Node: src/exporter.js

## Static layer

### Purpose

Writes local JSON and Markdown AI/dev handoff bundles from scan reports.

### Responsibility boundary

This node documents the architectural role of `src/exporter.js` inside the Living Architecture Nodes VS Code extension.

This file is responsible for its direct implementation concern only. It should not silently absorb unrelated product behavior, licensing policy, publishing workflow, or remote service behavior without updating the affected nodes and `ARCH.md`.

### Dependencies

Depends on adjacent extension modules, VS Code extension packaging behavior, and the Living Architecture Nodes project conventions where relevant.

### Dependents

The extension runtime, local diagnostic workflow, package self-check, and future Marketplace/publishing steps may depend on this file remaining aligned with its node memory.

### Contracts

Expected inputs:

- Workspace state, configuration, project files, or package metadata as applicable.

Expected outputs:

- Deterministic local behavior aligned with the Living Architecture Nodes protocol.

Side effects:

- None beyond the explicit role of `src/exporter.js`. File-writing behavior must remain user-confirmed where applicable.

## Dynamic layer

### Current stability state

Stable for v0.1.0 initial package.

### Recent mutations

- 2026-06-03T14:56:24.595492Z: Created initial implementation and companion node.

### Known fragile points

- Behavior should stay compatible with the GitHub Action and public specification where file naming and health concepts overlap.
- Any change to scan or generation behavior may affect user trust because node files are architecture memory.

### Interaction warnings

Update related nodes, `ARCH.md`, `NERVE.md`, and `CHANGELOG.node.md` when changing this file in a way that affects commands, file writes, scan output, export format, or user-visible behavior.

### Performance observations

No known degradation conditions yet. Large workspaces may require exclusion tuning.

### Security notes

Maintain local-first behavior. Do not introduce telemetry, remote code execution, hidden analytics, or unconfirmed file modifications.

## Diagnostic layer

### Past bug patterns

None recorded yet.

### Near misses

None recorded yet.

### Regression triggers

- Changing companion path conventions
- Changing output formats without updating documentation
- Adding hidden network behavior
- Adding write behavior without explicit confirmation

### Suspected hidden coupling

This file may be coupled to extension command registration, scan report shape, and expected public Living Architecture Nodes terminology.
