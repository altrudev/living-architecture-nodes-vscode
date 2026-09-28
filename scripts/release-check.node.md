# Node: scripts/release-check.js

## Static layer

### Purpose

Validates Marketplace metadata, listing copy, privacy/license synchronization, Workspace Trust declarations, version ordering, trusted OIDC publishing identity, workflow authority, PNG icon, and stable-release blocking.

### OIDC publishing checks

The release check verifies that:

- Marketplace auth strategy is `github-oidc`;
- trusted repository is `altrudev/living-architecture-nodes-vscode`;
- trusted workflow is `.github/workflows/publish-marketplace.yml`;
- OIDC audience is `marketplace.visualstudio.com`;
- publishing remains manual-only;
- only the publish job receives `id-token: write`;
- checkout/setup/upload/download actions are pinned to exact commits;
- no `secrets.VSCE_PAT` path exists;
- the workflow publishes the exact verified VSIX with `--oidc --packagePath`.

## Dynamic layer

### Current stability state

OIDC repository controls added for the 0.1.1/0.2.0 release path. Marketplace trust-policy registration remains externally pending.

### Security notes

The check distinguishes repository configuration from external Marketplace trust-policy state. It must not report OIDC fully configured merely because the YAML exists.

### Regression triggers

- Automatic push/tag publishing appears.
- OIDC authority expands beyond the publish job.
- Trusted repository/workflow/audience changes.
- PAT secrets reappear.
- Marketplace copy drifts from implemented behavior.
- Version or tier semantics become stale.
- Stable release blockers disappear without evidence.
