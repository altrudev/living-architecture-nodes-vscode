# CHANGELOG.node.md

## 2026-06-03 — v0.1.0 initial VS Code package

### Changed

- Created Living Architecture Nodes VS Code extension package.
- Added workspace scanner.
- Added sidebar tree provider.
- Added missing `.node.md` generator.
- Added dirty-node detection based on modification time.
- Added diagnostic JSON and Markdown export.
- Added local redaction helper.
- Added required Living Architecture Nodes project artifacts.

### Why

The GitHub Action validates repositories in CI. The VS Code extension moves the same architecture-memory workflow into the editor, where developers can detect and fix architecture-memory issues before pushing code.

### Affected nodes

- `src/extension.node.md`
- `src/scanner.node.md`
- `src/tree-provider.node.md`
- `src/workspace.node.md`
- `src/templates.node.md`
- `src/exporter.node.md`
- `src/redactor.node.md`
- `package.node.md`

### Diagnostic notes

This is the first local editor product in the Living Architecture Nodes toolchain.
