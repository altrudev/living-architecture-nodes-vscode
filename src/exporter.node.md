# Node: src/exporter.js

## Purpose

Creates client-safe local diagnostic handoff bundles inside an authorized trusted workspace.

## Contracts

- Workspace Trust is mandatory;
- the export path remains inside the active workspace;
- export uses an explicit allowlist schema rather than serializing arbitrary scanner fields;
- full source-file and node-file inventories are not exported;
- JSON and Markdown are generated from the same sanitized report;
- absolute workspace metadata is removed before export;
- secret-shaped path metadata is redacted before either format is produced;
- hostile Markdown/control characters in path values are escaped;
- source-file contents are never added by the exporter;
- diagnostic files are written through atomic replacement with private file permissions where supported.

## Current state

Client-data hardening baseline for pre-release 0.1.3.

## Regression triggers

Allowlist expansion without review, JSON/Markdown sanitization drift, absolute local paths, raw secret-shaped metadata, full repository inventories, source contents, or direct unsafe writes.
