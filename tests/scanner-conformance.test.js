'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scanWorkspace } = require('../src/scanner');

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/scanner-v0.1-cases.json'), 'utf8'));

for (const candidate of fixture.cases) {
  test(`scanner conformance: ${candidate.id}`, async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-conformance-'));
    try {
      for (const relative of candidate.files) {
        const file = path.join(root, ...relative.split('/'));
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, `${relative}\n`);
      }

      const result = await scanWorkspace(root, {
        sourceExtensions: candidate.source_extensions,
        excludeGlobs: []
      });

      const actual = {
        missing_required: [...result.missingRequired].sort(),
        source_files: result.sourceFiles.map((item) => item.sourcePath).sort(),
        node_files: [...result.nodeFiles].sort(),
        missing_nodes: result.missingNodes.map((item) => ({ source_path: item.sourcePath, node_path: item.nodePath })).sort(bySource),
        orphan_nodes: result.orphanNodes.map((item) => item.nodePath).sort()
      };

      assert.deepEqual(actual, normalizeExpected(candidate.expected));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}

test('conformance fixture is pinned to an exact public protocol revision', () => {
  assert.equal(fixture.upstream.repository, 'altrudev/living-architecture-nodes');
  assert.match(fixture.upstream.commit, /^[a-f0-9]{40}$/);
  assert.equal(fixture.upstream.schema, 'living-architecture-nodes/scanner-conformance/0.1');
});

function normalizeExpected(expected) {
  return {
    missing_required: [...expected.missing_required].sort(),
    source_files: [...expected.source_files].sort(),
    node_files: [...expected.node_files].sort(),
    missing_nodes: expected.missing_nodes.map((item) => ({ ...item })).sort(bySource),
    orphan_nodes: [...expected.orphan_nodes].sort()
  };
}

function bySource(left, right) {
  return left.source_path.localeCompare(right.source_path) || left.node_path.localeCompare(right.node_path);
}
