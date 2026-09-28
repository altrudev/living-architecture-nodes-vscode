# CHANGELOG.node.md

## 2026-09-28 — 0.1.1 controlled pre-release foundation

### Changed

- Corrected Marketplace release channel strategy: 0.1.1 pre-release precedes 0.2.0 stable.
- Added complete Marketplace metadata, Resources, privacy, support, and public product licensing.
- Added machine-readable listing manifest and deterministic release gate.
- Added Workspace Trust limited-mode behavior and hid mutation commands in Restricted Mode.
- Added canonical workspace path authority for protected reads/writes/exports.
- Added workspace traversal/absolute-path/symbolic-link escape tests.
- Removed stale hard-coded runtime version strings.
- Clarified generated node files are drafts, not verified architecture truth.

### Commercial state

- Free core remains usable without an account.
- Paid Pro/Team capability architecture exists, but production paid entitlements are not active in 0.1.1.
- Unexecuted paid-depth checks are NOT VERIFIED, not failed.
- Stable 0.2.0 publication is blocked until the production entitlement/payment and full release artifact gates pass.

### Affected nodes

- `package.node.md`
- `src/extension.node.md`
- `src/workspace.node.md`
- `src/exporter.node.md`
- `src/product/entitlement.node.md`
- `src/product/workspace-authority.node.md`
- `scripts/release-check.node.md`
- `release/listing-manifest.node.md`
- `PRIVACY.node.md`
- `SUPPORT.node.md`

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
