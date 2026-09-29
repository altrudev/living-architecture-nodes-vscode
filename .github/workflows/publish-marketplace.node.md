# Node: .github/workflows/publish-marketplace.yml

## Purpose

Verifies, packages, and publishes the exact Living Architecture Nodes VSIX through Visual Studio Marketplace trusted OIDC publishing.

## Authority boundary

The workflow is manual-only. Verification has contents: read. Only the publish job receives id-token: write.

## Supply-chain controls

- GitHub Actions are pinned to exact commit SHAs;
- checkout persistence is disabled;
- the release toolchain is installed with npm ci --ignore-scripts from package-lock.json;
- @vscode/vsce is pinned in package.json/package-lock.json;
- packaging and publishing invoke ./node_modules/.bin/vsce;
- no VSCE PAT is used;
- the publish job downloads and verifies the exact artifact produced by the verification job.

## Current state

Repository-side OIDC workflow hardened; Marketplace trust-policy registration remains a separate external gate.

## Regression triggers

Ad-hoc npx tool downloads, a stored PAT, automatic push/tag publication, broader OIDC permission, publishing an artifact different from the verified one, or unpinned Actions.
