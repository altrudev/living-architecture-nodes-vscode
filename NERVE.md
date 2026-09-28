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

## Dynamic layer

### Current health target

100/100 architecture-memory self-check before promotion.

### 2026-09-28 release hardening

- Corrected Marketplace channel versioning to 0.1.1 pre-release → 0.2.0 stable.
- Added complete listing metadata and Resources.
- Added Workspace Trust limited-mode declaration.
- Bound mutations to trusted workspaces.
- Added canonical workspace path authority and tests.
- Added privacy/support/public licensing documents.
- Added listing/release manifest and deterministic gate.
- Added trusted GitHub OIDC publishing workflow with a separate verification job and narrowly scoped `id-token: write` publish job.
- Stable 0.2.0 remains blocked until production monetization and artifact gates pass.

### Troubleshooting order

If packaging/listing fails:
1. Run `npm test`.
2. Review `scripts/release-check.js`.
3. Compare `package.json` against `release/listing-manifest.json`.
4. Verify README/CHANGELOG/PRIVACY/SUPPORT/LICENSE.
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
