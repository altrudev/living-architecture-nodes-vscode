# Privacy

## Local-first default

Living Architecture Nodes for VS Code is designed to operate locally.

Core Free operation does not require an account and does not send source code, `.node.md` content, `ARCH.md`, `NERVE.md`, `CHANGELOG.node.md`, diagnostic exports, filenames, repository URLs, or behavioral telemetry to a remote service.

## Local reads and writes

The extension reads workspace files needed to perform the requested architecture-memory scan.

It writes only when the user explicitly invokes a write-capable action:

- generate missing node drafts;
- export a diagnostic bundle.

Write-capable actions require Workspace Trust and are confined to the active workspace.

## Entitlements

The product architecture supports optional paid entitlements. When activated, entitlement exchange is limited to the minimum account/product/capability metadata necessary to determine paid access.

Repository source and architecture-memory contents are not required for entitlement validation.

Production paid entitlements are not enabled in the current pre-release channel.

## Secret storage

Future signed entitlement tokens are stored using VS Code SecretStorage. Production payment secrets and entitlement signing private keys are never shipped in the extension.

## Telemetry

Core functionality does not require behavioral telemetry.

If optional aggregate product metrics are introduced later, they must be separately disclosed and must not contain repository contents or alter verification outcomes.
