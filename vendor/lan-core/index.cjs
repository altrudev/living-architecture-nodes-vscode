'use strict';

const fs = require('fs');
const path = require('path');

const REQUEST_SCHEMA = 'lan.adapter.request.v1';
const RESULT_SCHEMA = 'lan.adapter.result.v1';

const DEFAULT_SOURCE_EXTENSIONS = Object.freeze([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.py', '.cs', '.java', '.go', '.rs', '.php', '.rb',
  '.swift', '.kt', '.kts', '.vue', '.svelte', '.html',
  '.css', '.scss', '.yml', '.yaml'
]);

const DEFAULT_EXCLUDE_DIRS = Object.freeze([
  '.git', 'node_modules', 'dist', 'build', 'out', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.vite', '.cache',
  '.living-architecture', '.lan-action', '.lan-vscode'
]);

const DEFAULT_REQUIRED_ARTIFACTS = Object.freeze([
  'ARCH.md', 'NERVE.md', 'CHANGELOG.node.md'
]);

const ROOT_NODE_ARTIFACTS = new Set([
  'ARCH.node.md', 'NERVE.node.md', 'CHANGELOG.node.node.md'
]);

function toPosix(value) {
  return String(value).split(path.sep).join('/');
}

function normalizeExtensions(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_SOURCE_EXTENSIONS];
  }
  return [...new Set(value.map((ext) => {
    const text = String(ext || '').trim().toLowerCase();
    return text.startsWith('.') ? text : '.' + text;
  }).filter((ext) => ext.length > 1))];
}

function normalizeStringList(value, fallback) {
  if (!Array.isArray(value) || value.length === 0) return [...fallback];
  return [...new Set(value.map((item) => String(item || '').trim()).filter(Boolean))];
}

function nodePathForSource(sourcePath) {
  const normalized = toPosix(sourcePath);
  const dir = path.posix.dirname(normalized);
  const ext = path.posix.extname(normalized);
  const base = path.posix.basename(normalized, ext);
  const node = base + '.node.md';
  return dir === '.' ? node : path.posix.join(dir, node);
}

function validateRequest(request) {
  if (!request || typeof request !== 'object') {
    throw new TypeError('LAN adapter request is required');
  }
  if (request.schema !== REQUEST_SCHEMA) {
    throw new Error('unsupported LAN adapter request schema');
  }
  if (request.operation !== 'scan') {
    throw new Error('unsupported LAN adapter operation');
  }
  if (!request.host || typeof request.host.kind !== 'string' || !request.host.kind.trim()) {
    throw new Error('LAN adapter host kind is required');
  }
  if (!request.workspace || typeof request.workspace.root !== 'string' || !request.workspace.root) {
    throw new Error('LAN adapter workspace root is required');
  }
  const mode = request.evidence && request.evidence.dirtyMode;
  if (!['mtime', 'changed-paths', 'none'].includes(mode)) {
    throw new Error('unsupported LAN dirty evidence mode');
  }
  if (mode === 'changed-paths' && request.evidence.changedPaths !== undefined &&
      !Array.isArray(request.evidence.changedPaths)) {
    throw new Error('changedPaths must be an array');
  }
  return request;
}

function statMtime(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch (_) {
    return null;
  }
}

function minimatchLite(relativePath, glob) {
  const rel = toPosix(relativePath);
  const normalizedGlob = toPosix(glob);
  if (normalizedGlob.startsWith('**/') && normalizedGlob.endsWith('/**')) {
    const part = normalizedGlob.slice(3, -3);
    return rel.includes('/' + part + '/') || rel.startsWith(part + '/');
  }
  if (normalizedGlob.endsWith('/**')) {
    const prefix = normalizedGlob.slice(0, -3).replace(/^\*\*\//, '');
    return rel.startsWith(prefix.replace(/\*\*/g, ''));
  }
  if (normalizedGlob.includes('*')) {
    const escaped = normalizedGlob
      .replace(/[.+^$\{\}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*');
    return new RegExp('^' + escaped + '$').test(rel);
  }
  return rel === normalizedGlob || rel.startsWith(normalizedGlob + '/');
}

function walkFiles(root, excludeDirs, excludeGlobs) {
  const files = [];
  const excluded = new Set(excludeDirs);

  function walk(current, relativeBase) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const relative = relativeBase
        ? path.posix.join(relativeBase, entry.name)
        : entry.name;
      const absolute = path.join(current, entry.name);

      if (excludeGlobs.some((glob) => minimatchLite(relative, glob))) continue;
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (excluded.has(entry.name)) continue;
        walk(absolute, relative);
        continue;
      }
      if (!entry.isFile()) continue;
      files.push({ relativePath: relative, absolutePath: absolute });
    }
  }

  walk(root, '');
  return files;
}

function isSourceFile(relativePath, extensions) {
  const lower = relativePath.toLowerCase();
  if (lower.endsWith('.node.md')) return false;
  return extensions.some((ext) => lower.endsWith(ext));
}

function computeDirty(pair, evidence, root) {
  if (!pair.nodeExists) return false;
  if (evidence.dirtyMode === 'none') return false;

  if (evidence.dirtyMode === 'changed-paths') {
    const changed = new Set((evidence.changedPaths || []).map(toPosix));
    return changed.has(pair.sourcePath) && !changed.has(pair.nodePath);
  }

  const tolerance = Number.isInteger(evidence.mtimeToleranceMs)
    ? evidence.mtimeToleranceMs
    : 1000;
  const sourceMtime = statMtime(path.join(root, pair.sourcePath));
  const nodeMtime = statMtime(path.join(root, pair.nodePath));
  return sourceMtime !== null && nodeMtime !== null &&
    sourceMtime > nodeMtime + tolerance;
}

function createPair(sourcePath, nodeSet) {
  const nodePath = nodePathForSource(sourcePath);
  return {
    sourcePath,
    nodePath,
    nodeExists: nodeSet.has(nodePath)
  };
}

function freezePair(pair, reason = null) {
  return Object.freeze({
    sourcePath: pair.sourcePath,
    nodePath: pair.nodePath,
    reason
  });
}

function executeAdapterRequest(requestInput) {
  const request = validateRequest(requestInput);
  const root = fs.realpathSync(path.resolve(request.workspace.root));
  if (!fs.statSync(root).isDirectory()) {
    throw new Error('LAN adapter workspace root must be a directory');
  }

  const sourceExtensions = normalizeExtensions(request.workspace.sourceExtensions);
  const excludeDirs = normalizeStringList(
    request.workspace.excludeDirs,
    DEFAULT_EXCLUDE_DIRS
  );
  const requiredArtifacts = normalizeStringList(
    request.workspace.requiredArtifacts,
    DEFAULT_REQUIRED_ARTIFACTS
  );

  const excludeGlobs = normalizeStringList(request.workspace.excludeGlobs, []);
  const files = walkFiles(root, excludeDirs, excludeGlobs);
  const sourceFiles = files
    .map((item) => toPosix(item.relativePath))
    .filter((relative) => isSourceFile(relative, sourceExtensions));
  const nodeFiles = files
    .map((item) => toPosix(item.relativePath))
    .filter((relative) => relative.endsWith('.node.md'))
    .filter((relative) => relative !== 'CHANGELOG.node.md');

  const nodeSet = new Set(nodeFiles);
  const pairs = sourceFiles.map((sourcePath) => createPair(sourcePath, nodeSet));

  const missingRequired = requiredArtifacts.filter(
    (artifact) => !fs.existsSync(path.join(root, artifact))
  );
  const missingNodes = pairs
    .filter((pair) => !pair.nodeExists)
    .map((pair) => freezePair(pair));

  const dirtyNodes = pairs
    .filter((pair) => computeDirty(pair, request.evidence, root))
    .map((pair) => freezePair(
      pair,
      request.evidence.dirtyMode === 'changed-paths'
        ? 'Source changed without companion node change.'
        : 'Source file is newer than companion node file.'
    ));

  const expectedNodes = new Set(pairs.map((pair) => pair.nodePath));
  const orphanNodes = nodeFiles
    .filter((nodePath) => !ROOT_NODE_ARTIFACTS.has(nodePath))
    .filter((nodePath) => !expectedNodes.has(nodePath));

  return Object.freeze({
    schema: RESULT_SCHEMA,
    hostKind: request.host.kind,
    verificationScope: 'basic-local',
    evidenceMode: request.evidence.dirtyMode,
    sourceFileCount: sourceFiles.length,
    nodeFileCount: nodeFiles.length,
    findings: Object.freeze({
      missingRequired: Object.freeze([...missingRequired]),
      missingNodes: Object.freeze(missingNodes),
      dirtyNodes: Object.freeze(dirtyNodes),
      orphanNodes: Object.freeze([...orphanNodes])
    }),

    semanticArchitecture: Object.freeze({
      status: 'NOT_VERIFIED',
      executed: false,
      reason: 'Semantic architecture verification is not performed by the LAN basic-local adapter contract.'
    })
  });
}

module.exports = {
  REQUEST_SCHEMA,
  RESULT_SCHEMA,
  DEFAULT_SOURCE_EXTENSIONS,
  DEFAULT_EXCLUDE_DIRS,
  DEFAULT_REQUIRED_ARTIFACTS,
  nodePathForSource,
  minimatchLite,
  executeAdapterRequest
};
