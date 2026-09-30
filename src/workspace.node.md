# src/workspace.js node

## Purpose

VS Code host-only workspace UI helpers.

This module locates the active VS Code workspace, opens documents, normalizes display paths, and delegates all mutation authority to the canonical vendored LAN Core.

Repository traversal, glob matching, finding semantics, and secure-write implementation must not be reintroduced here.
