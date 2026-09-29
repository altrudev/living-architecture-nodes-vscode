# Node: SECURITY.md

## Purpose

Defines the public self-security and client-data handling boundary for the official Living Architecture Nodes VS Code product.

## Contracts

- zero runtime npm dependencies;
- no shell/dynamic execution or runtime network client;
- no source-content collection during normal scanning;
- Workspace Trust for mutation/export;
- workspace-confined writes with traversal/symlink defenses;
- exclusive node-draft creation;
- atomic diagnostic replacement to avoid hard-link overwrite of an old destination inode;
- explicit-allowlist exports without absolute workspace paths or full inventory;
- defensive secret-shaped metadata redaction and Markdown escaping;
- GitHub private vulnerability reporting is enabled.

## Current state

Frequency-verified 0.1.2 client-data/security baseline.

## Regression triggers

Any runtime authority expansion, unsafe write primitive, export allowlist expansion without review, private reporting removal, runtime dependency introduction, or divergence between security documentation and tested behavior.
