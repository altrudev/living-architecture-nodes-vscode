# Node: release/listing-manifest.json

## Static layer

### Purpose

Machine-readable source of truth for Marketplace channel, version, pricing, trusted publishing identity, publication readiness, and stable-release blockers.

### Trusted publishing contract

The Marketplace authentication strategy is `github-oidc`.

The trusted identity is bound to:

- repository: `altrudev/living-architecture-nodes-vscode`
- workflow: `.github/workflows/publish-marketplace.yml`
- audience: `marketplace.visualstudio.com`

No Marketplace PAT is part of the intended automated release path.

## Dynamic layer

### Current stability state

- Stable Marketplace channel: `0.1.0`
- Previously published pre-release: `0.1.1`
- Current prepared listing-correction pre-release: `0.1.2`
- Stable target: `0.2.0`
- Paid entitlements: disabled
- Trusted OIDC Marketplace policy: still pending external configuration

### Current blockers

- Publish and verify the 0.1.2 pre-release listing correction.
- Register the exact GitHub repository/workflow trust policy in Visual Studio Marketplace.
- Verify a successful first OIDC token exchange.
- Stable 0.2.0 retains all product, billing, upgrade, and artifact blockers.

## Security notes

Repository workflow readiness and Marketplace trust-policy readiness are separate states. Neither may be inferred from the other.

A failed OIDC exchange must fail closed; it must not fall back to PAT authentication.

## Diagnostic layer

### Regression triggers

- README says 0.1.1 is merely prepared after it was published.
- Package, manifest, changelog, roadmap, and listing versions diverge.
- Publishing auth strategy changes away from `github-oidc` without review.
- A long-lived Marketplace secret is introduced.
- Stable blockers disappear without verification evidence.
