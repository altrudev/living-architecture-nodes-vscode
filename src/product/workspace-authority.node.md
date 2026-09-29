# Node: src/product/workspace-authority.js

## Purpose

Provides the canonical workspace authority and secure write primitive for protected reads, node drafts, and diagnostic exports.

## Contracts

- all protected paths remain inside the active workspace;
- absolute external paths, parent traversal, and symbolic-link components are rejected;
- generated node drafts use exclusive creation and never overwrite an existing file;
- replaceable outputs are written to a private same-directory temporary file and atomically renamed;
- atomic replacement avoids modifying an attacker-precreated hard link to an old destination inode;
- newly created private files use mode 0600 where POSIX modes are supported;
- newly created output directories use mode 0700 where supported.

## Current state

Client-data/security hardening baseline for pre-release 0.1.2.

## Regression triggers

Path escape, direct truncate-overwrite, non-exclusive draft creation, following symlinks, weakening file permissions, or bypassing Workspace Trust.
