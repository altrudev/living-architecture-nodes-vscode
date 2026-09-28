# Node: .github/workflows/publish-marketplace.yml

## Static layer

### Purpose

Publishes an already verified Living Architecture Nodes VSIX to the Visual Studio Marketplace using GitHub Actions OIDC trusted publishing instead of a stored PAT.

### Authority boundary

The workflow is manual-only through `workflow_dispatch`.

Normal pushes, pull requests, tags, and merges cannot publish the extension.

The verification job has only `contents: read`. The publish job receives the additional `id-token: write` permission required to request a short-lived GitHub OIDC token.

### Trusted publishing identity

- GitHub owner: `altrudev`
- Repository: `living-architecture-nodes-vscode`
- Workflow: `.github/workflows/publish-marketplace.yml`
- OIDC audience used by vsce: `marketplace.visualstudio.com`
- Publisher credential type: short-lived trusted OIDC credential
- Stored Marketplace PAT: none

### Release behavior

1. Require dispatch from `main`.
2. Require requested version to equal `package.json`.
3. Require an explicit channel.
4. If publication is requested, require the literal confirmation `PUBLISH`.
5. Enforce release-manifest publication gates.
6. Run LAN tests and release checks.
7. Package the exact VSIX.
8. Inspect the packaged manifest and scan for forbidden material.
9. Hash and upload the verified candidate.
10. In a separate OIDC-enabled job, download and verify the same artifact.
11. Publish that exact VSIX using `vsce publish --oidc --packagePath`.

## Dynamic layer

### Current stability state

Repository side implemented; Marketplace trusted-publisher policy must still be registered for this exact repository/workflow before OIDC publication can succeed.

### Supply-chain controls

GitHub Actions are pinned to exact commit SHAs.

`@vscode/vsce` is pinned to version `4.0.0`.

The workflow does not read or reference `VSCE_PAT`.

### Regression triggers

- Adding push/tag automatic publication.
- Granting `id-token: write` to the verification job.
- Adding a Marketplace PAT secret.
- Publishing a VSIX different from the one tested and hashed.
- Allowing publication from a non-main ref.
- Bypassing `release/listing-manifest.json` gates.
