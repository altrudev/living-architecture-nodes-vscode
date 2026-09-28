# Node: src/product/entitlement.js

## Static layer

### Purpose

Provides the public VS Code-side LAN entitlement adapter: local verification of signed entitlement tokens, secure token retrieval through VS Code SecretStorage, free-tier fallback, and explicit capability availability semantics.

### Responsibility boundary

This module does not perform billing, call Stripe, issue entitlements, contain private signing keys, or expose proprietary LAN engine logic. It consumes only the stable signed entitlement contract produced by the private Living Architecture Nodes Product service.

### Dependencies

- Node.js `crypto`
- VS Code `ExtensionContext.secrets` via the caller-provided context
- Living Architecture Nodes entitlement token contract

### Dependents

- extension activation/product status
- future Pro/Team capability gates

### Contracts

Inputs:
- signed LAN entitlement token from SecretStorage;
- LAN public verification key;
- current time.

Outputs:
- locally verified entitlement payload, or
- deterministic Free fallback with a reason.

Side effects:
- reads only the LAN entitlement secret through the supplied VS Code secret store.

## Dynamic layer

### Current stability state

Pre-release adapter for v0.2.0.

### Recent mutations

- 2026-09-28: Added first LAN commercial-product entitlement boundary.

### Known fragile points

- Production public verification key is intentionally not enabled until the entitlement service is deployed.
- Token schema/version compatibility must remain synchronized with the private LAN Product contract.

### Interaction warnings

Paid capability absence must be represented as `NOT_VERIFIED`, never as a failed or unsafe result.

### Security notes

- Never embed Stripe secrets or entitlement signing private keys.
- Never send repository contents for entitlement validation.
- Invalid/expired entitlements fall back to Free without altering user artifacts.

## Diagnostic layer

### Regression triggers

- accepting unsigned tokens;
- accepting wrong product identifiers;
- interpreting expiration failure as architecture failure;
- storing entitlement data outside SecretStorage;
- introducing repository-content transfer into licensing.
