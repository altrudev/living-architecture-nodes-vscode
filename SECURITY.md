# Security Policy

Living Architecture Nodes for VS Code is designed as a local-first extension with a deliberately narrow runtime authority boundary.

## Runtime security boundary

The current Free extension:

- has no runtime npm dependencies;
- does not execute shell commands or arbitrary repository code;
- does not use eval, child_process, remote code execution, HTTP clients, WebSockets, or telemetry;
- does not read source-file contents during architecture-memory scanning;
- requires VS Code Workspace Trust before creating node drafts or diagnostic exports;
- confines write/export targets to the active workspace;
- rejects absolute external targets, parent traversal, and symbolic-link path escape;
- creates node drafts exclusively so existing files are not overwritten;
- writes diagnostics through atomic same-directory replacement with private file permissions where supported.

## Client-data boundary

Diagnostic handoff exports may contain relative repository paths and architecture-maintenance findings because those are necessary to make the handoff useful.

They do not intentionally contain:

- source-file contents;
- absolute local workspace paths;
- account credentials or entitlement secrets;
- repository contents beyond the structural findings shown in the report.

Secret-shaped path values are defensively redacted before both JSON and Markdown export. Users should still review any diagnostic bundle before sharing it with another person or service.

## Reporting a vulnerability

Do not put exploitable details, credentials, private repository content, or customer information in a public issue.

Prefer GitHub private vulnerability reporting:

https://github.com/altrudev/living-architecture-nodes-vscode/security/advisories/new

If that route is unavailable, use the private contact path published at:

https://altru.dev

Include the affected version, reproduction steps, expected/actual behavior, and the minimum information necessary to demonstrate the issue.

## Supported release line

Security fixes are applied to the current Marketplace release/pre-release line. Older builds may not receive backports.
