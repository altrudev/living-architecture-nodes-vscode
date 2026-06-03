# NERVE.md — Central Hub File

NERVE is used here as a descriptive abbreviation for Node Evidence & Regression Visibility Engine.

## Static layer

### Purpose

This file aggregates health, cascade-risk, dirty-state, and diagnostic observations for the Living Architecture Nodes VS Code extension.

### Responsibility boundary

This hub tracks the relationship between extension modules, user-facing commands, filesystem writes, and diagnostic export behavior.

### Dependencies

- `ARCH.md`
- `CHANGELOG.node.md`
- module-level `.node.md` files
- source modules in `src/`

### Contracts

Inputs:

- Node-file states
- Source-module changes
- Diagnostic observations

Outputs:

- Prioritized investigation order
- Dirty flag notes
- Cascade risk map

## Dynamic layer

### Current health score

100/100 at package creation self-check.

### Dirty flags

None at initial package creation.

### Cascade map

- `src/scanner.js` affects status tree, exports, node generation decisions, and health scoring.
- `src/workspace.js` affects all file open/write/scan operations.
- `src/templates.js` affects generated `.node.md` quality.
- `src/exporter.js` affects AI/dev handoff bundles.
- `package.json` affects activation, commands, Marketplace metadata, and UI contribution points.

### Cross-node pattern detection

No recurring bug classes recorded yet.

### Temporal pattern log

- 2026-06-03: Initial VS Code extension built after successful GitHub Action v0.1.1 validation.

### Troubleshooting playbooks

If scanning fails:

1. Review `src/workspace.js`.
2. Review exclusion settings.
3. Review `src/scanner.js` companion path logic.

If node generation fails:

1. Review `src/templates.js`.
2. Review `src/workspace.js` write behavior.
3. Confirm user confirmation flow in `src/extension.js`.

If exports look wrong:

1. Review `src/exporter.js`.
2. Review `src/redactor.js`.
3. Review report structure from `src/scanner.js`.

## Diagnostic layer

### Past bug patterns

None recorded yet.

### Near misses

None recorded yet.

### Regression triggers

- Changing companion mapping rules
- Changing activation events
- Changing source extension defaults
- Adding automatic writes without confirmation

### Suspected hidden coupling

The extension and GitHub Action should maintain compatible health concepts and node path mapping.
