# Changelog

## 0.1.3 — Pre-release

Local-first economics and commercial-boundary synchronization.

### Changed

- Made Free / Pro / Team execution economics explicit: subscriptions unlock capabilities, not scan credits.
- Declared ordinary local scans unmetered by LAN.
- Declared entitlement refresh out-of-band rather than per-check.
- Declared remote compute production-disabled and prohibited silent remote fallback.
- Preserved the existing client-data/security hardening and Free/Pro/Team activation gates.

### Verification

- Paid production remains disabled.
- Paid prices remain unpublished.
- Free remains account-optional and local-first.
- Remote compute remains disabled.

## 0.1.2 — Pre-release

Listing durability and release-channel cleanup.

### Changed

- Replaced stale version-specific Marketplace release copy with durable stable/pre-release channel wording.
- Removed the hard-coded pre-release version from the Free/Pro/Team Marketplace section.
- Moved exact version tracking to the changelog and release manifest.
- Added a release gate that rejects stale version-specific Marketplace wording.

### Security and client-data hardening

- Removed absolute workspace paths from diagnostic handoff exports.
- Unified JSON and Markdown export sanitization.
- Added defensive redaction for secret-shaped path metadata.
- Escaped hostile Markdown/control characters in exported path values.
- Replaced diagnostic files atomically instead of truncating an existing destination inode.
- Changed node-draft creation to exclusive create so existing files cannot be overwritten.
- Added restrictive file/directory permissions where POSIX modes are supported.
- Added adversarial export, hard-link, symlink, traversal, and overwrite regression tests.
- Added a public SECURITY.md with private vulnerability-reporting guidance.
- Locked @vscode/vsce 4.0.0 in package-lock.json and removed ad-hoc npx fetching from the release workflow.

### Verification

- Runtime dependencies remain empty.
- npm audit for the locked release toolchain reports 0 vulnerabilities.
- No runtime feature or entitlement behavior changed in this release.
- Free core operation remains account-optional and local-first.
- Paid Pro/Team capabilities remain disabled.
- Stable promotion remains blocked until the existing production entitlement, billing, upgrade, and artifact gates pass.

## 0.1.1 — Pre-release

This is the controlled pre-release path toward the Living Architecture Nodes 0.2.0 commercial product update.

### Added

- Product Status command and Free-tier entitlement boundary.
- Local signed-entitlement adapter architecture using VS Code SecretStorage.
- Marketplace listing metadata, Resources links, support/privacy documents, and release manifest.
- Explicit Workspace Trust support.
- Workspace path confinement for file writes and diagnostic exports.
- Release-listing consistency checks.
- Marketplace PNG icon.
- Manual-only GitHub Actions trusted OIDC publishing workflow with no stored Marketplace PAT.

### Changed

- Generated `.node.md` files are explicitly described as **generated drafts**, not verified architecture truth.
- Extension/runtime version strings are derived from `package.json` to avoid stale version claims.
- Diagnostic exports require a trusted workspace.
- Marketplace wording now distinguishes Free functionality from future optional Pro/Team verification depth.

### Security

- Workspace traversal outside the active root is rejected.
- Symbolic-link path escape is rejected for protected read/write targets.
- Mutation commands are blocked in Restricted Mode.
- Production entitlement signing keys and Stripe secrets are not present in the extension.
- Marketplace publishing uses a short-lived GitHub OIDC identity; the workflow is excluded from the VSIX and does not use a VSCE PAT secret.

### Commercial status

Paid Pro/Team capabilities are **not enabled** in this pre-release. Free core operation remains available without an account. A check that is not executed is reported as **NOT VERIFIED**, not as a failure or safety verdict.

## 0.1.0 — Initial release

- Workspace architecture-memory scan.
- Sidebar status view.
- Missing `.node.md` generation.
- Dirty/stale node detection.
- Orphan node detection.
- Local JSON and Markdown handoff export.
- Local-first operation with no telemetry.
