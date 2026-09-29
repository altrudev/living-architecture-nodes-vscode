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
    sourceFiles: [{ sourcePath: secretName, nodePath: 'token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456.node.md' }],
    nodeFiles: [],
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

test('sanitized export removes absolute workspace metadata and redacts secret-shaped paths', () => {
  const root = path.join(os.tmpdir(), 'client-private-root');
  const safe = sanitizeReportForExport(reportFixture(root));
  const text = JSON.stringify(safe);
  assert.equal(Object.prototype.hasOwnProperty.call(safe, 'rootPath'), false);
  assert.equal(text.includes(root), false);
  assert.equal(text.includes('ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456'), false);
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
    assert.equal(output.includes(root), false);
    assert.equal(output.includes('ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456'), false);
  }

  assert.match(json, /\[REDACTED\]/);
  assert.match(markdown, /\[REDACTED\]/);
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
