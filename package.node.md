# Node: package.json

## Purpose

Defines Marketplace identity, commands, trust declarations, release scripts, and the development-only packaging toolchain.

## Contracts

- runtime dependency set remains empty;
- Free core remains account-optional and local-first;
- write-capable commands require Workspace Trust;
- Marketplace packaging uses the repository-pinned @vscode/vsce 4.0.0 development dependency;
- package-lock.json is the release dependency lock;
- package generation invokes the local vsce binary rather than fetching a tool ad hoc.

## Current state

Pre-release 0.1.2 with locked release tooling.

## Regression triggers

Runtime dependencies are introduced without review, package tooling becomes unpinned, package-lock disappears, or Marketplace metadata/trust semantics drift.
