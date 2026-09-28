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

No Marketplace PAT is part of the intended release path.

## Dynamic layer

### Current stability state

The repository-side OIDC workflow is defined, but the Marketplace trusted-publisher policy is still pending.

### Current blockers

- Register the exact GitHub repository/workflow trust policy in Visual Studio Marketplace.
- Verify a successful first OIDC token exchange.
- Stable 0.2.0 retains all product, billing, upgrade, and artifact blockers.

## Security notes

Repository workflow readiness and Marketplace trust-policy readiness are separate states. Neither may be inferred from the other.

A failed OIDC exchange must fail closed; it must not fall back to PAT authentication.

## Diagnostic layer

### Regression triggers

- Publishing auth strategy changes away from `github-oidc` without review.
- Trusted repository/workflow identity drifts.
- A long-lived Marketplace secret is introduced.
- Publication gates become true without verification evidence.
