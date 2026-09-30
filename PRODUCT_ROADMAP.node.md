# Node: PRODUCT_ROADMAP.md

## Static layer

### Purpose

Tracks the public development and release direction for the Living Architecture Nodes VS Code product.

### Responsibility boundary

The roadmap describes LAN-specific product evolution only. It does not expose private implementation, payment secrets, or unrelated research systems.

### Contracts

- Free core remains useful without an account.
- Paid capabilities add verification depth rather than changing evidence truth.
- 0.1.4 is the current controlled pre-release.
- 0.2.0 stable is blocked until monetization, artifact, listing, and upgrade gates pass.

## Dynamic layer

### Current stability state

Synchronized with the 2026-09-28 0.1.4 pre-release candidate.

### Recent mutations

- Replaced the stale generic v0.2 candidate list with the actual pre-release → stable promotion path.
- Added explicit stable-release blockers.
- Aligned future capability direction with the standalone Living Architecture Nodes commercial purpose.

## Security notes

The roadmap must not contain signing keys, credentials, private repository names, or customer-specific details.

## Diagnostic layer

### Regression triggers

- Roadmap claims capabilities that are not implemented.
- Stable release blockers disappear before verification.
- Free/paid semantics diverge from the product constitution and listing.


## Marketplace live-state invariant

The public roadmap current-stable heading must match `release/listing-manifest.json.current_stable_version`, which is independently verified against the live Visual Studio Marketplace before a new pre-release is promoted.


## Live pre-release state

The 0.1.4 pre-release is live and independently verified in Visual Studio Marketplace. This does not remove the separate OIDC trusted-publishing gate for future automated publication.
