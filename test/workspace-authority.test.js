'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  resolveAuthorizedWorkspacePath,
  writeAuthorizedWorkspaceFile
} = require('../src/product/workspace-authority');

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
    t.skip('symlink unavailable: ' + error.message);
    return;
  }
  await assert.rejects(() => resolveAuthorizedWorkspacePath(root, 'linked/export.json'));
});

test('exclusive draft creation never overwrites an existing file', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-exclusive-'));
  const first = await writeAuthorizedWorkspaceFile(root, 'draft.node.md', 'first', { failIfExists: true });
  const second = await writeAuthorizedWorkspaceFile(root, 'draft.node.md', 'second', { failIfExists: true });
  assert.equal(first, true);
  assert.equal(second, false);
  assert.equal(fs.readFileSync(path.join(root, 'draft.node.md'), 'utf8'), 'first');

  if (process.platform !== 'win32') {
    assert.equal(fs.statSync(path.join(root, 'draft.node.md')).mode & 0o077, 0);
  }
});

test('atomic replacement does not modify another hard link to the old inode', async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-hardlink-root-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-hardlink-out-'));
  const outsideFile = path.join(outside, 'client.txt');
  const targetDir = path.join(root, '.lan-vscode');
  const targetFile = path.join(targetDir, 'living-architecture-diagnostic.json');
  fs.mkdirSync(targetDir);
  fs.writeFileSync(outsideFile, 'client-original');

  try {
    fs.linkSync(outsideFile, targetFile);
  } catch (error) {
    t.skip('hard links unavailable: ' + error.message);
    return;
  }

  await writeAuthorizedWorkspaceFile(
    root,
    '.lan-vscode/living-architecture-diagnostic.json',
    'new-diagnostic',
    { mode: 0o600 }
  );

  assert.equal(fs.readFileSync(outsideFile, 'utf8'), 'client-original');
  assert.equal(fs.readFileSync(targetFile, 'utf8'), 'new-diagnostic');
});
