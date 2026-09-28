# ARCH.md — Living Architecture Nodes for VS Code

## Static layer

### Intent

Living Architecture Nodes for VS Code keeps architecture memory close to the code it describes. It scans a workspace, identifies missing/stale/orphan node memory, creates user-confirmed node drafts, opens protocol artifacts, and exports local diagnostic handoff bundles.

### Product boundary

The extension is the official editor surface for Living Architecture Nodes.

It is responsible for:
- local architecture-memory scanning and status;
- local draft generation after explicit confirmation;
- local diagnostic export;
- public Free-tier product status and future signed entitlement consumption.

It is not responsible for:
- payment processing;
- issuing paid entitlements;
- remote source-code analysis by default;
- arbitrary shell/remote execution;
- hidden telemetry;
- treating generated drafts as verified architecture truth.

### Trust and authority

- Read-only scanning may operate in Restricted Mode.
- Workspace mutation and diagnostic export require Workspace Trust.
- Read/write/export paths are canonicalized and confined to the active workspace.
- Path traversal, absolute external targets, and symbolic-link escape are rejected.

### Dependencies

- VS Code Extension API
- Node.js runtime provided by VS Code
- Local workspace filesystem
- Living Architecture Nodes public file conventions
- Stable signed-entitlement contract (consumer side only)

## Dynamic layer

### Current stability state

0.1.2 pre-release candidate toward stable 0.2.0.

### Current commercial state

- Marketplace label: Free.
- Free core: no account required.
- Paid entitlements: designed but not enabled in the current pre-release channel.
- Stable 0.2.0 promotion remains blocked until production billing/entitlement and release gates pass.

### Current limitations

- Dirty-node detection still uses modification-time evidence rather than semantic drift.
- Multi-root workspaces currently use the first workspace root.
- Virtual workspaces are not supported.
- Pro/Team features are not active in the pre-release.

## Diagnostic layer

### Regression triggers

- Workspace write/export escaping the active root.
- Mutation becoming available in untrusted workspaces.
- Marketplace listing claiming paid capabilities that are not active.
- Free operation becoming account-dependent.
- Hard-coded extension versions drifting from package metadata.
