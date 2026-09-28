# Node: test/workspace-authority.test.js

## Static layer

### Purpose

Regression tests for the public extension workspace authority boundary.

### Responsibility boundary

This node is part of the official Living Architecture Nodes VS Code product surface. It must remain aligned with the public product purpose and must not absorb unrelated runtime, payment-provider, or private research implementation.

### Contracts

- Local-first behavior.
- Free core operation does not require an account.
- Write-capable behavior requires explicit user action and Workspace Trust.
- Unexecuted deeper checks are NOT VERIFIED, not failed.

## Dynamic layer

### Current stability state

Pre-release candidate for 0.1.1 on the path to stable 0.2.0.

### Recent mutations

- 2026-09-28: Added positive internal-path coverage plus traversal, absolute-path, and symbolic-link escape rejection.

### Security notes

Do not introduce hidden telemetry, repository-content upload, private signing keys, payment secrets, or workspace escape.

## Diagnostic layer

### Regression triggers

- Marketplace copy drifting from implemented behavior.
- Version or tier semantics becoming stale.
- Trust/path controls weakening.
- Generated drafts being represented as verified architecture truth.
