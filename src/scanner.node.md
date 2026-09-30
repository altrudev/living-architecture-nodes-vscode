# src/scanner.js node

## Purpose

Compatibility entrypoint for the VS Code scanner API.

Canonical repository finding semantics now live in the vendored LAN Core and are reached through `src/adapters/vscode.js`.

This file must remain a thin re-export and must not regain independent scanning logic.
