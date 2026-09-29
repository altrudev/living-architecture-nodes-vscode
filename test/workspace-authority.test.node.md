# Node: test/workspace-authority.test.js

## Purpose

Adversarial regression tests for workspace authority and secure write behavior.

## Coverage

- allowed internal relative paths;
- rejection of traversal and absolute external targets;
- symbolic-link path escape rejection;
- exclusive node-draft creation without overwrite;
- private file mode where supported;
- atomic replacement that leaves an external hard link to the old inode unchanged.

## Regression trigger

Any failure blocks release promotion.
