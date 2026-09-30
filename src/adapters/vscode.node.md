# src/adapters/vscode.js node

## Purpose

Thin VS Code host adapter around the canonical vendored LAN Free engine.

It translates VS Code source-extension and exclude-glob settings into `lan.adapter.request.v1`, requests mtime evidence, and maps canonical findings into the existing VS Code health/UI shape.

Health scoring and UI status remain host presentation policy; canonical findings and semantic verification state come from the shared core.

## Regression triggers

Reimplementation of scanning/finding semantics in this file, hidden network behavior, loss of custom exclusions, or adapter/core provenance disappearing.
