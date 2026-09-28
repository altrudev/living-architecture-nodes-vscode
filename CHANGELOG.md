# Changelog

## 0.1.2 — Pre-release

Marketplace listing/release-state correction.

### Changed

- Updated the Marketplace listing to describe 0.1.1 as the first published pre-release rather than a merely prepared release.
- Set the current pre-release channel to 0.1.2 while keeping 0.1.0 as the stable channel.
- Synchronized package, release manifest, roadmap, changelog, and architecture-memory records.
- Kept paid Pro/Team capabilities disabled; Free core behavior is unchanged.

### Release purpose

This pre-release corrects listing/version state and revalidates the existing security, privacy, Workspace Trust, packaging, and entitlement boundaries before stable 0.2.0 promotion.

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
