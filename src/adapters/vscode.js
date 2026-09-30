'use strict';

const core = require('../../vendor/lan-core/index.cjs');
const provenance = require('../../vendor/lan-core/manifest.json');

function calculateHealth(counts) {
  let score = 100;
  score -= counts.missingRequiredCount * 20;
  score -= counts.missingNodeCount * 3;
  score -= counts.dirtyNodeCount * 4;
  score -= counts.orphanNodeCount;
  return Math.max(0, Math.min(100, score));
}

async function scanWorkspace(rootPath, options = {}) {
  const canonical = core.executeAdapterRequest({
    schema: 'lan.adapter.request.v1',
    operation: 'scan',
    host: { kind: 'vscode', version: '0.1.4' },
    workspace: {
      root: rootPath,
      sourceExtensions: options.sourceExtensions,
      excludeGlobs: options.excludeGlobs
    },
    evidence: { dirtyMode: 'mtime', mtimeToleranceMs: 1000 }
  });

  const findings = canonical.findings;
  const counts = {
    sourceFileCount: canonical.sourceFileCount,
    nodeFileCount: canonical.nodeFileCount,
    missingRequiredCount: findings.missingRequired.length,
    missingNodeCount: findings.missingNodes.length,
    dirtyNodeCount: findings.dirtyNodes.length,
    orphanNodeCount: findings.orphanNodes.length
  };
  const healthScore = calculateHealth(counts);
  const status = findings.missingRequired.length > 0
    ? 'failed'
    : (findings.missingNodes.length || findings.dirtyNodes.length || findings.orphanNodes.length
      ? 'warning'
      : 'healthy');

  return {
    generatedAt: new Date().toISOString(),
    status,
    healthScore,
    missingRequired: [...findings.missingRequired],
    missingNodes: findings.missingNodes.map(({ sourcePath, nodePath }) => ({ sourcePath, nodePath })),
    dirtyNodes: findings.dirtyNodes.map(({ sourcePath, nodePath, reason }) => ({ sourcePath, nodePath, reason })),
    orphanNodes: findings.orphanNodes.map((nodePath) => ({ nodePath })),
    summary: counts,
    verification: {
      scope: canonical.verificationScope,
      semanticArchitecture: canonical.semanticArchitecture
    },
    adapter: {
      contract: provenance.adapterContract,
      coreVersion: provenance.coreVersion,
      coreCommit: provenance.coreCommit
    }
  };
}

module.exports = {
  scanWorkspace,
  calculateHealth
};
