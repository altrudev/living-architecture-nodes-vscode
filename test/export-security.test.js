'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exportDiagnostics, sanitizeReportForExport } = require('../src/exporter');

function reportFixture(root) {
  const secretName = 'token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456.js';
  return {
    generatedAt: '2026-09-29T12:00:00.000Z',
    rootPath: root,
    status: 'warning',
    healthScore: 97,
    sourceContents: 'CLIENT_SOURCE_SECRET_X7Y9Z_DO_NOT_EXPORT',
    unexpectedNested: { privateData: 'CLIENT_PRIVATE_METADATA_DO_NOT_EXPORT' },
    sourceFiles: [{ sourcePath: 'all-source-inventory.js', nodePath: 'all-source-inventory.node.md' }],
    nodeFiles: ['all-node-inventory.node.md'],
    missingRequired: [],
    missingNodes: [{ sourcePath: secretName, nodePath: 'token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456.node.md' }],
    dirtyNodes: [],
    orphanNodes: [{ nodePath: 'bad\n[click](command:evil).node.md' }],
    summary: {
      sourceFileCount: 1,
      nodeFileCount: 0,
      missingRequiredCount: 0,
      missingNodeCount: 1,
      dirtyNodeCount: 0,
      orphanNodeCount: 1
    }
  };
}

test('sanitized export uses an explicit allowlist and redacts secret-shaped paths', () => {
  const root = path.join(os.tmpdir(), 'client-private-root');
  const safe = sanitizeReportForExport(reportFixture(root));
  const text = JSON.stringify(safe);

  for (const forbidden of [
    root,
    'CLIENT_SOURCE_SECRET_X7Y9Z_DO_NOT_EXPORT',
    'CLIENT_PRIVATE_METADATA_DO_NOT_EXPORT',
    'all-source-inventory.js',
    'all-node-inventory.node.md',
    'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456'
  ]) {
    assert.equal(text.includes(forbidden), false);
  }

  assert.equal(Object.prototype.hasOwnProperty.call(safe, 'rootPath'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(safe, 'sourceFiles'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(safe, 'nodeFiles'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(safe, 'sourceContents'), false);
  assert.equal(text.includes('[REDACTED]'), true);
});

test('JSON and Markdown exports share the same redacted client-safe model', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-export-sec-'));
  const result = await exportDiagnostics(root, reportFixture(root), {
    exportPath: '.lan-vscode',
    workspaceTrusted: true
  });

  const json = fs.readFileSync(result.jsonPath, 'utf8');
  const markdown = fs.readFileSync(result.markdownPath, 'utf8');

  for (const output of [json, markdown]) {
    for (const forbidden of [
      root,
      'CLIENT_SOURCE_SECRET_X7Y9Z_DO_NOT_EXPORT',
      'CLIENT_PRIVATE_METADATA_DO_NOT_EXPORT',
      'all-source-inventory.js',
      'all-node-inventory.node.md',
      'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456'
    ]) {
      assert.equal(output.includes(forbidden), false);
    }
    assert.equal(output.includes('[REDACTED]'), true);
  }

  assert.equal(markdown.includes('[click](command:evil)'), false);
  assert.match(markdown, /\\\[click\\\]\\\(command:evil\\\)/);

  if (process.platform !== 'win32') {
    assert.equal(fs.statSync(result.jsonPath).mode & 0o077, 0);
    assert.equal(fs.statSync(result.markdownPath).mode & 0o077, 0);
    assert.equal(fs.statSync(path.dirname(result.jsonPath)).mode & 0o077, 0);
  }
});

test('export refuses untrusted workspaces', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-export-untrusted-'));
  await assert.rejects(
    () => exportDiagnostics(root, reportFixture(root), { exportPath: '.lan-vscode', workspaceTrusted: false }),
    /Workspace Trust is required/
  );
});
