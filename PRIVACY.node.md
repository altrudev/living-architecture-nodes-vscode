# Node: PRIVACY.md

## Purpose

Defines the public local-first privacy contract for the Free runtime, diagnostic handoff exports, and future paid entitlement operation.

## Contracts

- normal architecture-memory scan does not read source-file contents;
- Free core requires no account and sends no repository data remotely;
- exports require Workspace Trust;
- exports use an explicit allowlist;
- exports omit absolute workspace paths and full source/node inventories;
- exports may contain relative paths associated with findings;
- secret-shaped metadata is redacted before JSON and Markdown generation;
- local private output permissions are applied where supported;
- future entitlement exchange must not require repository contents.

## Current state

0.1.2 client-data hardening baseline.

## Regression triggers

Source contents entering scan/export, absolute paths or full inventory reappearing, hidden telemetry/network upload, or entitlement checks requiring repository contents.
