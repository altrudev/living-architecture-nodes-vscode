# Node: release/listing-manifest.json

## Static layer

### Purpose

Machine-readable source of truth for Marketplace channel, version, pricing, resource links, publication readiness, and stable-release blockers.

### Contracts

- 0.1.1 is a pre-release artifact and must use `--pre-release`.
- Free core remains account-optional.
- Paid entitlements remain disabled until production service verification.
- Publication readiness is distinct from artifact verification.
- Stable 0.2.0 promotion remains blocked until every listed external/product gate is verified.

## Dynamic layer

### Current stability state

Artifact/listing candidate is verified, but Marketplace publication is externally blocked.

### Current blocker

- 2026-09-28: `vsce verify-pat altrudev` returned `TF400813`; the current publisher credential is not authorized.

### Recent mutations

- Added an explicit pre-release publication gate.
- Added Marketplace authentication restoration as a stable blocker.
- Added migration planning away from global PAT authentication before the December 1, 2026 retirement date.

## Security notes

Never bypass publisher authentication, embed Marketplace credentials in the repository, or treat an artifact-level pass as proof that publication occurred.

## Diagnostic layer

### Regression triggers

- Publishing state reported as ready while external authentication is blocked.
- Credentials added to source control.
- Stable blockers removed without evidence.
