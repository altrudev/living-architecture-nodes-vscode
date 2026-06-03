# ARCH.md — Living Architecture Nodes for VS Code

## Static layer

### Intent

Living Architecture Nodes for VS Code is designed to bring architecture-memory checks into the developer editor. It lets maintainers scan a workspace, identify missing or stale `.node.md` companion files, generate structured node templates, open core protocol artifacts, and export AI/dev diagnostic handoff bundles locally.

### Responsibility boundary

The extension is responsible for local workspace inspection, node generation, architecture-memory status display, and diagnostic export.

It is not responsible for remote telemetry, cloud synchronization, paid licensing enforcement, AI code generation, source-code modification beyond explicit user-confirmed node-file creation, or replacing tests/security review.

### Dependencies

- VS Code Extension API
- Node.js runtime provided by VS Code
- Local workspace filesystem
- Living Architecture Nodes file structure

### Contracts

Inputs:

- Open VS Code workspace folder
- Workspace files and optional existing Living Architecture Nodes artifacts
- Extension configuration values

Outputs:

- Sidebar architecture-memory status
- Generated `.node.md` files after explicit confirmation
- Local `.lan-vscode/` diagnostic export bundle

Side effects:

- Reads workspace files
- Writes `.node.md` files only after user confirmation
- Writes diagnostic exports locally

## Dynamic layer

### Current stability state

Under active change — initial product build v0.1.0.

### Recent mutations

- 2026-06-03: Created fresh VS Code extension package.
- 2026-06-03: Implemented workspace scan, missing node generation, dirty-node detection, and diagnostic export.

### Known fragile points

- Dirty detection currently uses modification timestamps, not full Git history.
- Source extension defaults include workflow files, so workflow files may need node companions.
- The UI is intentionally minimal for the first version.

### Interaction warnings

- Changing companion path rules affects compatibility with the GitHub Action and public spec examples.
- Adding new source extensions can increase missing-node reports.
- Export output must avoid leaking secrets or unrelated private content.

### Performance observations

The scanner is expected to be lightweight for small and medium repositories. Large monorepos should tune excluded folders.

### Security notes

Local-first design. No telemetry. Diagnostic export uses redaction patterns for common secrets, but users should still review exports before sharing externally.

## Diagnostic layer

### Past bug patterns

None recorded yet.

### Near misses

None recorded yet.

### Regression triggers

- VS Code API changes
- Companion path rule changes
- Workspace scanning exclusions becoming too broad or too narrow
- Auto-generation writing files without explicit user confirmation

### Suspected hidden coupling

The extension behavior is coupled to the Living Architecture Nodes GitHub Action conventions and public spec file naming.
