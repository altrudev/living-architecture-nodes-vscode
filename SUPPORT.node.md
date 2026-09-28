# Node: SUPPORT.md

## Static layer

### Purpose

Defines the public support and security-reporting boundary shown with the Marketplace product.

### Responsibility boundary

This node is part of the official Living Architecture Nodes VS Code product surface. It must remain aligned with the public product purpose and must not absorb unrelated runtime, payment-provider, or private research implementation.

### Contracts

- Local-first behavior.
- Free core operation does not require an account.
- Write-capable behavior requires explicit user action and Workspace Trust.
- Unexecuted deeper checks are NOT VERIFIED, not failed.

## Dynamic layer

### Current stability state

Pre-release candidate for 0.1.2 on the path to stable 0.2.0.

### Recent mutations

- 2026-09-28: Added explicit support routes and prohibited posting sensitive repository or credential material into public issues.

### Security notes

Do not introduce hidden telemetry, repository-content upload, private signing keys, payment secrets, or workspace escape.

## Diagnostic layer

### Regression triggers

- Marketplace copy drifting from implemented behavior.
- Version or tier semantics becoming stale.
- Trust/path controls weakening.
- Generated drafts being represented as verified architecture truth.
