# Node: src/workspace.js

## Purpose

Handles VS Code workspace access while delegating all protected file writes to the workspace authority module.

## Contracts

- mutation requires VS Code Workspace Trust;
- open-file targets are canonical workspace-relative paths;
- generated node drafts use the authority module exclusive-create path;
- this module does not directly call fs.writeFile for protected outputs;
- workspace walking does not follow symbolic-link directories.

## Current state

Client-data/security hardening baseline for pre-release 0.1.3.

## Regression triggers

Direct unguarded file writes, mutation in Restricted Mode, path escape, or symlink traversal.
