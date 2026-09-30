# Node: release/listing-manifest.json

## Purpose

Machine-readable source of truth for Marketplace channel/version, pricing, trusted publishing identity, release blockers, and the security/client-data baseline that must remain true for publication.

## Trusted publishing contract

- authentication strategy: github-oidc;
- repository: altrudev/living-architecture-nodes-vscode;
- workflow: .github/workflows/publish-marketplace.yml;
- OIDC audience: marketplace.visualstudio.com;
- stored Marketplace PAT: none.

## Client-data/security baseline

The manifest requires:

- zero runtime dependencies;
- no source-content reads during architecture-memory scanning;
- no runtime network or shell execution;
- GitHub private vulnerability reporting enabled;
- explicit-allowlist diagnostic exports;
- no absolute workspace path in exports;
- no full source/node repository inventory in exports;
- secret-shaped metadata redaction;
- Markdown path escaping;
- Workspace Trust for export;
- atomic diagnostic replacement;
- exclusive node-draft creation;
- restrictive POSIX output modes where supported;
- package-lock-controlled @vscode/vsce 4.0.0 release tooling installed with npm ci --ignore-scripts;
- no ad-hoc npx release-tool fetch.

## Current blockers

The repository-side OIDC workflow is implemented, but Visual Studio Marketplace trusted-publisher policy registration and the first OIDC exchange remain external publication gates. Stable 0.2.0 retains the separate billing, entitlement, upgrade, and final artifact gates.

## Regression triggers

Any security-baseline field changes without matching implementation/tests, trusted-publishing identity drift, long-lived Marketplace credentials, or publication gates becoming true without evidence.


## Marketplace live pre-release evidence

The manifest records whether the 0.1.3 pre-release is live, the exact source commit, approved artifact SHA-256, file count, publication method, public Marketplace timestamp, and byte-match verification. Automated OIDC publishing remains separately gated.
