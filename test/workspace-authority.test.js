'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { resolveAuthorizedWorkspacePath } = require('../src/product/workspace-authority');

test('workspace authority allows an internal relative target', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-auth-'));
  const target = await resolveAuthorizedWorkspacePath(root, '.lan-vscode/export.json');
  assert.equal(target, path.join(fs.realpathSync(root), '.lan-vscode', 'export.json'));
});

test('workspace authority rejects traversal and absolute paths', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-auth-'));
  await assert.rejects(() => resolveAuthorizedWorkspacePath(root, '../outside.json'));
  await assert.rejects(() => resolveAuthorizedWorkspacePath(root, path.resolve(root, 'absolute.json')));
});

test('workspace authority rejects symbolic-link path escape', async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-root-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-out-'));
  const link = path.join(root, 'linked');
  try {
    fs.symlinkSync(outside, link, 'dir');
  } catch (error) {
    t.skip(`symlink unavailable: ${error.message}`);
    return;
  }
  await assert.rejects(() => resolveAuthorizedWorkspacePath(root, 'linked/export.json'));
});
