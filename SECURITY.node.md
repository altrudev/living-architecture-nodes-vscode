# Node: SECURITY.md

## Purpose

Defines the public security and client-data handling boundary for the official Living Architecture Nodes VS Code product.

## Contracts

- local-first Free runtime;
- no source-content collection during scanning;
- no runtime network client or telemetry;
- trusted-workspace requirement for mutation/export;
- workspace-confined writes;
- client-safe exports omit absolute workspace paths and redact secret-shaped metadata;
- private vulnerability reports must not be placed in public issues.

## Current state

Client-data hardening baseline for the 0.1.2 pre-release.

## Regression triggers

Security documentation diverges from actual runtime behavior, private reporting becomes unavailable without replacement, or export/runtime authority expands without review.
