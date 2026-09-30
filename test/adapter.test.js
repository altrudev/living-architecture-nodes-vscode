'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { scanWorkspace } = require('../src/adapters/vscode');

test('VS Code adapter preserves canonical findings and host policy', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-adapter-'));
  fs.writeFileSync(path.join(root, 'ARCH.md'), '# ARCH');
  fs.writeFileSync(path.join(root, 'NERVE.md'), '# NERVE');
  fs.writeFileSync(path.join(root, 'CHANGELOG.node.md'), '# CHANGELOG');
  fs.mkdirSync(path.join(root, 'src'));
  fs.writeFileSync(path.join(root, 'src', 'a.js'), 'a');
  fs.writeFileSync(path.join(root, 'src', 'a.node.md'), '# a');
  fs.writeFileSync(path.join(root, 'src', 'b.js'), 'b');
  fs.mkdirSync(path.join(root, 'generated'));
  fs.writeFileSync(path.join(root, 'generated', 'skip.js'), 'skip');

  const report = await scanWorkspace(root, {
    sourceExtensions: ['.js'],
    excludeGlobs: ['**/generated/**']
  });

  assert.equal(report.summary.sourceFileCount, 2);
  assert.equal(report.missingNodes.length, 1);
  assert.equal(report.missingNodes[0].sourcePath, 'src/b.js');
  assert.equal(report.verification.scope, 'basic-local');
  assert.equal(report.verification.semanticArchitecture.status, 'NOT_VERIFIED');
  assert.equal(report.adapter.contract, 'lan.adapter.v1');
  assert.equal(
    report.adapter.coreCommit,
    '44f0b9400b4ccba2bcc63660c59d042cd6d1a400'
  );
  assert.equal(JSON.stringify(report).includes(root), false);
  assert.equal(JSON.stringify(report).includes('generated/skip.js'), false);

  fs.rmSync(root, { recursive: true, force: true });
});
