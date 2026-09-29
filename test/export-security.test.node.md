# Node: test/export-security.test.js

## Purpose

Adversarial regression coverage for client-safe diagnostic exports.

## Contracts

- absolute workspace paths never appear in exported JSON or Markdown;
- secret-shaped path values are redacted in both formats;
- hostile filename Markdown/control characters cannot inject active-looking Markdown;
- export files are private to the current user where POSIX modes are supported;
- export requires Workspace Trust.

## Regression trigger

Any failure blocks release promotion.
