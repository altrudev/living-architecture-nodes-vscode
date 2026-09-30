## 2026-09-29 — 0.1.3 Marketplace publication verified live

- Marketplace API reports 0.1.3 validated / Free / pre-release.
- Marketplace-served VSIX matched the approved artifact byte-for-byte after transport decoding.
- SHA-256 verified: f487f7ed07be9f814a34c744401dbd766f5ee26d5dc459cf93ada3c4a44aa4b9.
- Source commit: f009864aec104577d721e3be478a31d50cf4c1fa.
- Manual VSIX publication completed; OIDC trusted publishing remains pending.

# CHANGELOG.node.md

## 2026-09-29 — 0.1.2 client-data and self-security hardening

### Changed

- Removed absolute workspace path metadata from diagnostic exports.
- Replaced arbitrary report serialization with an explicit export allowlist.
- Removed full source-file/node-file inventories from handoff JSON.
- Unified JSON and Markdown redaction from the same sanitized report.
- Expanded secret-shaped metadata redaction.
- Escaped hostile Markdown/control characters in path values.
- Converted node-draft creation to exclusive create.
- Converted diagnostic writes to private atomic replacement.
- Added hard-link, overwrite, export-leak, secret-shaped filename, hostile-Markdown, symlink, traversal, and untrusted-workspace regression coverage.
- Added SECURITY.md and verified GitHub private vulnerability reporting.
- Locked the Marketplace release toolchain to @vscode/vsce 4.0.0 through package-lock.json and npm ci --ignore-scripts.
- Runtime npm dependencies remain zero.

### Frequency evidence

- Architecture-memory self-check: 100/100.
- Product/security tests: 10/10 passed.
- npm audit: 0 vulnerabilities.
- Real scanner/export client fixture: verified.
- Runtime shell/network/dynamic-execution scan: clear.
- VSIX package boundary: verified.

## 2026-09-28 — 0.1.1 controlled pre-release foundation

### Changed

- Corrected Marketplace release channel strategy: 0.1.1 pre-release precedes 0.2.0 stable.
- Added complete Marketplace metadata, Resources, privacy, support, and public product licensing.
- Added machine-readable listing manifest and deterministic release gate.
- Added manual-only trusted OIDC Marketplace publishing with exact workflow/repository identity and no stored Marketplace PAT.
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
- `.github/workflows/publish-marketplace.node.md`

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
