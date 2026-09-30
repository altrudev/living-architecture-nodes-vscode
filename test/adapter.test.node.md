# test/adapter.test.js node

## Purpose

Regression test proving the VS Code host surface delegates canonical findings through `lan.adapter.v1`.

It verifies custom exclusion-glob preservation, canonical basic-local / NOT_VERIFIED semantics, exact private-core provenance, relative/client-safe output, and retained VS Code host-policy shaping.

Any failure blocks adapter promotion.
