# NERVE.md — Central Hub File

NERVE is used here as a descriptive abbreviation for Node Evidence & Regression Visibility Engine.

## Static layer

### Purpose

Tracks cascade risk and release-sensitive coupling across the Living Architecture Nodes VS Code product.

### Cascade map

- `src/scanner.js` → health/status, missing/dirty/orphan findings.
- `src/workspace.js` → workspace file access and mutation.
- `src/product/workspace-authority.js` → canonical workspace boundary for protected paths.
- `src/exporter.js` → local diagnostic bundle creation.
- `src/product/entitlement.js` → Free fallback and signed paid-entitlement consumption.
- `package.json` → Marketplace identity, commands, Resources, pricing label, trust declaration.
- `README.md` → Marketplace listing body.
- `CHANGELOG.md` → Marketplace release history.
- `release/listing-manifest.json` + `scripts/release-check.js` → release/listing synchronization, trusted publishing identity, and stable-publish blocker.
- `.github/workflows/publish-marketplace.yml` → manual-only verified-VSIX publishing through GitHub OIDC.
- `SECURITY.md` → public runtime/client-data security contract and private reporting route.
- `package-lock.json` → locked development-only Marketplace packaging dependency graph.

## Dynamic layer

### Current health target

100/100 architecture-memory self-check before promotion.

### 2026-09-28 release hardening

- Established the controlled Marketplace pre-release → stable promotion path.
- Added complete listing metadata and Resources.
- Added Workspace Trust limited-mode declaration.
- Bound mutations to trusted workspaces.
- Added canonical workspace path authority and tests.
- Added privacy/support/public licensing documents.
- Added listing/release manifest and deterministic gate.
- Removed current/next version numbers from permanent Marketplace listing copy; exact versions now live in release metadata and changelog.
- Added trusted GitHub OIDC publishing workflow with a separate verification job and narrowly scoped `id-token: write` publish job.
- Stable 0.2.0 remains blocked until production monetization and artifact gates pass.

### 2026-09-29 client-data and self-security hardening

- Scanner source-content boundary explicitly tested: normal scan does not read source-file contents.
- Diagnostic export changed to an explicit allowlist schema.
- Absolute workspace path and full source/node inventories removed from handoff output.
- Secret-shaped path metadata redacted identically for JSON and Markdown.
- Hostile Markdown/control characters escaped before Markdown rendering.
- Generated node drafts use exclusive create.
- Diagnostic replacement uses private temporary files plus atomic same-directory rename.
- Hard-link overwrite regression test added.
- POSIX private file/directory modes enforced where supported.
- Runtime npm dependencies remain zero.
- Release toolchain locked to @vscode/vsce 4.0.0 with package-lock and npm ci --ignore-scripts.
- GitHub private vulnerability reporting verified enabled.

### 2026-09-29 Marketplace 0.1.3 pre-release verification

- Visual Studio Marketplace API reports version 0.1.3 as validated, Free, and pre-release.
- Marketplace-served package was downloaded through the public gallery endpoint.
- Microsoft transport used gzip; after decoding, the VSIX matched the approved artifact byte-for-byte.
- Verified SHA-256: `f487f7ed07be9f814a34c744401dbd766f5ee26d5dc459cf93ada3c4a44aa4b9`.
- Verified package file count: 45.
- Source commit: `f009864aec104577d721e3be478a31d50cf4c1fa`.
- Manual VSIX upload succeeded. Trusted GitHub OIDC publishing remains pending and is still a separate automation hardening gate.


### Troubleshooting order

If packaging/listing fails:
1. Run `npm test`.
2. Review `scripts/release-check.js`.
3. Compare `package.json` against `release/listing-manifest.json`.
4. Verify README/CHANGELOG/PRIVACY/SECURITY/SUPPORT/LICENSE and package-lock.json.
5. Build and inspect the actual VSIX.

If mutation/export security fails:
1. Review `src/product/workspace-authority.js`.
2. Review `src/workspace.js`.
3. Review `src/exporter.js`.
4. Confirm `isWorkspaceTrusted` gates in package menus and runtime.

## Diagnostic layer

### Regression triggers

- Publishing without the pre-release flag.
- Marketplace publishing from a non-main ref or automatic push/tag trigger.
- OIDC authority spreading outside the dedicated publish job.
- Using a SemVer prerelease suffix unsupported by Marketplace channel practice.
- Stale listing or changelog.
- Paid tier affecting evidence truth.
- Private keys, payment secrets, or private product code appearing in the VSIX.
