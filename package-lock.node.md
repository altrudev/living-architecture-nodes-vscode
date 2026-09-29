# Node: package-lock.json

## Purpose

Locks the development-only Marketplace packaging toolchain for reproducible dependency resolution.

## Contracts

- runtime dependencies remain empty;
- @vscode/vsce is pinned to 4.0.0 through package.json and package-lock.json;
- Marketplace automation installs the lockfile with npm ci --ignore-scripts;
- package-lock.json is repository/release evidence and is excluded from the runtime VSIX;
- lockfile changes require the same release-toolchain security review as package.json.

## Current state

Lockfile version 3 for the 0.1.3 client-data and supply-chain hardening pass.

## Regression triggers

Removing the lockfile, floating the vsce version, adding unreviewed install scripts, or introducing runtime dependencies through the release toolchain.
