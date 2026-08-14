'use strict';

const fs = require('fs/promises');
const path = require('path');
const { minimatchLite, walkFiles, fileExists, statSafe, toPosix } = require('./workspace');

const REQUIRED_ARTIFACTS = ['ARCH.md', 'NERVE.md', 'CHANGELOG.node.md'];

async function scanWorkspace(rootPath, options = {}) {
  const sourceExtensions = normalizeExtensions(options.sourceExtensions);
  const excludeGlobs = options.excludeGlobs || [];
  const files = await walkFiles(rootPath, { excludeGlobs });

  const sourceFiles = files
    .filter((file) => isSourceFile(file, sourceExtensions))
    .filter((file) => !file.endsWith('.node.md'));

  const nodeFiles = files.filter((file) => file.endsWith('.node.md'));
  const nodeFileSet = new Set(nodeFiles.map(toPosix));

  const missingRequired = [];
  for (const artifact of REQUIRED_ARTIFACTS) {
    if (!(await fileExists(path.join(rootPath, artifact)))) missingRequired.push(artifact);
  }

  const missingNodes = [];
  const dirtyNodes = [];
  const expectedNodeSet = new Set();

  for (const sourcePath of sourceFiles) {
    const nodePath = companionNodePath(sourcePath);
    expectedNodeSet.add(toPosix(nodePath));

    const sourceAbs = path.join(rootPath, sourcePath);
    const nodeAbs = path.join(rootPath, nodePath);

    if (!nodeFileSet.has(toPosix(nodePath))) {
      missingNodes.push({ sourcePath, nodePath });
      continue;
    }

    const [sourceStat, nodeStat] = await Promise.all([statSafe(sourceAbs), statSafe(nodeAbs)]);
    if (sourceStat && nodeStat && sourceStat.mtimeMs > nodeStat.mtimeMs + 1000) {
      dirtyNodes.push({ sourcePath, nodePath, reason: 'Source file is newer than companion node file.' });
    }
  }

  const orphanNodes = nodeFiles
    .filter((nodePath) => !isRootNodeArtifact(nodePath))
    .filter((nodePath) => !expectedNodeSet.has(toPosix(nodePath)))
    .map((nodePath) => ({ nodePath }));

  const healthScore = calculateHealth({
    sourceCount: sourceFiles.length,
    missingRequiredCount: missingRequired.length,
    missingNodeCount: missingNodes.length,
    dirtyNodeCount: dirtyNodes.length,
    orphanNodeCount: orphanNodes.length
  });

  const status = missingRequired.length > 0 ? 'failed' :
    (missingNodes.length || dirtyNodes.length || orphanNodes.length ? 'warning' : 'healthy');

  return {
    generatedAt: new Date().toISOString(),
    rootPath,
    status,
    healthScore,
    sourceFiles: sourceFiles.map((sourcePath) => ({ sourcePath, nodePath: companionNodePath(sourcePath) })),
    nodeFiles,
    missingRequired,
    missingNodes,
    dirtyNodes,
    orphanNodes,
    summary: {
      sourceFileCount: sourceFiles.length,
      nodeFileCount: nodeFiles.length,
      missingRequiredCount: missingRequired.length,
      missingNodeCount: missingNodes.length,
      dirtyNodeCount: dirtyNodes.length,
      orphanNodeCount: orphanNodes.length
    }
  };
}

function normalizeExtensions(value) {
  const fallback = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.py', '.cs', '.java', '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.kts', '.vue', '.svelte', '.html', '.css', '.yml', '.yaml'];
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((ext) => ext.startsWith('.') ? ext : `.${ext}`);
}

function isSourceFile(relativePath, extensions) {
  const lower = relativePath.toLowerCase();
  if (lower.endsWith('.node.md')) return false;
  return extensions.some((ext) => lower.endsWith(ext.toLowerCase()));
}

function companionNodePath(sourcePath) {
  const dir = path.posix.dirname(toPosix(sourcePath));
  const ext = path.posix.extname(sourcePath);
  const base = path.posix.basename(sourcePath, ext);
  const nodeName = `${base}.node.md`;
  return dir === '.' ? nodeName : path.posix.join(dir, nodeName);
}

function isRootNodeArtifact(nodePath) {
  const normalized = toPosix(nodePath);
  return normalized === 'ARCH.node.md' || normalized === 'NERVE.node.md' || normalized === 'CHANGELOG.node.md';
}

function calculateHealth(counts) {
  let score = 100;
  score -= counts.missingRequiredCount * 20;
  score -= counts.missingNodeCount * 3;
  score -= counts.dirtyNodeCount * 4;
  score -= counts.orphanNodeCount * 1;
  return Math.max(0, Math.min(100, score));
}

module.exports = { scanWorkspace, companionNodePath, REQUIRED_ARTIFACTS };