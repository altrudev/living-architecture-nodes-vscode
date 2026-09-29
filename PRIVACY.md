# Privacy

## Local-first default

Living Architecture Nodes for VS Code is designed to operate locally.

Core Free operation does not require an account and does not send source code, architecture memory, diagnostics, secrets, repository content, filenames, repository URLs, or behavioral telemetry to a remote service.

## What the scanner reads

The architecture-memory scanner enumerates workspace-relative paths, checks whether required/companion files exist, and compares filesystem metadata such as modification times.

It does **not** read source-file contents as part of the normal architecture-memory scan.

Opening ARCH.md, NERVE.md, CHANGELOG.node.md, or another workspace file through an explicit Open command displays that local file in VS Code; it does not transmit the file remotely.

## Local writes

Write-capable actions require Workspace Trust.

The extension writes only when the user explicitly invokes a write-capable action:

- generate missing node drafts;
- export a diagnostic bundle.

Generated node drafts use exclusive creation so an existing file is not overwritten. Diagnostic files use private temporary files followed by atomic same-directory replacement. New private files use restrictive permissions where the operating system supports POSIX modes.

Write and export paths are confined to the active workspace. Absolute external targets, parent traversal, and symbolic-link path escape are rejected.

## Diagnostic handoff exports

Exports may include relative repository paths associated with findings and architecture-maintenance findings because those are necessary to make the handoff useful. The full source-file and node-file inventories are not exported.

Before export:

- absolute workspace path metadata is removed;
- secret-shaped metadata is defensively redacted;
- JSON and Markdown are generated from the same sanitized report;
- Markdown control/metacharacter handling prevents hostile filenames from becoming active-looking Markdown.

Source-file contents are not added to the diagnostic report by the scanner/exporter.

Users should still review a diagnostic bundle before deliberately sharing it with another person or service.

## Entitlements

The product architecture supports optional paid entitlements. When activated, entitlement exchange is limited to the minimum account/product/capability metadata necessary to determine paid access.

Repository source and architecture-memory contents are not required for entitlement validation.

Production paid entitlements are not enabled in the current pre-release channel.

## Secret storage

Future signed entitlement tokens are stored using VS Code SecretStorage. Production payment secrets and entitlement signing private keys are never shipped in the extension.

## Telemetry

Core functionality does not require behavioral telemetry.

If optional aggregate product metrics are introduced later, they must be separately disclosed and must not contain repository contents or alter verification outcomes.

## Compute and entitlement network boundary

Current Free/Pro/Team verification capabilities are designed to execute locally. Ordinary scans do not require a LAN network request or per-scan entitlement refresh. Signed entitlements are verified locally.

Remote compute is not production-enabled. A future remote capability requires separate disclosure and explicit user authorization; a paid subscription alone is not consent to upload repository content.
