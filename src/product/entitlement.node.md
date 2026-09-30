# src/product/entitlement.js node

## Purpose

VS Code secret-storage adapter for canonical LAN entitlement consumption.

The host wrapper reads the signed token from VS Code SecretStorage and delegates signature/product/tier/expiry semantics to the vendored LAN Core entitlement consumer.

No issuer, billing state, private signing key, or Stripe logic belongs here.
