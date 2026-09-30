# scripts/verify-vendored-core.js node

## Purpose

Deterministic provenance gate for the private LAN Core runtime vendored into the public VS Code adapter.

It requires the exact approved private-core commit, fixed adapter contract, zero runtime dependencies/network/telemetry flags, an exact runtime file allowlist, and matching byte lengths/SHA-256 hashes.

Any mismatch blocks tests, packaging, or release promotion.
