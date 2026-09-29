# Node: src/exporter.js

## Purpose

Creates client-safe local diagnostic handoff bundles inside an authorized trusted workspace.

## Contracts

- Workspace Trust is mandatory;
- the export path remains inside the active workspace;
- JSON and Markdown are generated from the same sanitized report;
- absolute workspace metadata is removed before export;
- secret-shaped path metadata is redacted before either format is produced;
- hostile Markdown/control characters in path values are escaped;
- source-file contents are never added by the exporter;
- diagnostic files are written through the workspace authority atomic replacement primitive.

## Current state

Client-data hardening baseline for pre-release 0.1.2.

## Regression triggers

JSON/Markdown sanitization diverges, absolute local paths reappear, raw secret-shaped metadata appears, or direct unsafe file writes return.
