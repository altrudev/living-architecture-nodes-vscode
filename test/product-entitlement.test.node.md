# Node: test/product-entitlement.test.js

## Static layer

### Purpose

Regression coverage for the public VS Code entitlement adapter.

### Responsibility boundary

Tests product-tier fallback and verification semantics only. It does not test Stripe billing or private entitlement issuance.

### Dependencies

- Node.js test runner
- `src/product/entitlement.js`

### Dependents

The v0.2 product-adapter release gate depends on these tests to prevent monetization logic from corrupting verification semantics.

### Contracts

The suite must demonstrate:
- no entitlement still produces a usable Free tier;
- unavailable paid capabilities are `NOT_VERIFIED`, not failed.

## Dynamic layer

### Current stability state

Pre-release test coverage for v0.2.0.

### Recent mutations

- 2026-09-28: Added with the first LAN commercial-product adapter.

### Known fragile points

Future signed-token tests must not require production keys or network access.

### Security notes

Use generated/test-only material if cryptographic fixtures are added. Never commit production entitlement tokens or keys.

## Diagnostic layer

### Regression triggers

- Free tier becoming account-dependent;
- missing capability reported as `FAILED`;
- network dependency entering local entitlement tests.
