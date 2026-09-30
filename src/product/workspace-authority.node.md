# src/product/workspace-authority.js node

## Purpose

Compatibility entrypoint for canonical LAN workspace authority.

All path-confinement and atomic-write semantics are provided by the vendored LAN Core `authority.cjs`. This wrapper must not fork those semantics.
