'use strict';

const fs = require('fs/promises');
const path = require('path');

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch (_) {
    return false;
  }
}

async function resolveAuthorizedWorkspacePath(workspaceRoot, targetPath, options = {}) {
  if (typeof workspaceRoot !== 'string' || !workspaceRoot) throw new Error('workspace root is required');
  if (typeof targetPath !== 'string' || !targetPath) throw new Error('target path is required');
  if (path.isAbsolute(targetPath)) throw new Error('workspace authority denied: target must be workspace-relative');

  const rootReal = await fs.realpath(path.resolve(workspaceRoot));
  const candidate = path.resolve(rootReal, targetPath);

  if (!isWithin(rootReal, candidate)) {
    throw new Error('workspace authority denied: target escapes workspace');
  }

  const relative = path.relative(rootReal, candidate);
  let current = rootReal;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    if (!await pathExists(current)) continue;
    const stat = await fs.lstat(current);
    if (stat.isSymbolicLink()) {
      throw new Error('workspace authority denied: symbolic-link path component');
    }
  }

  if (await pathExists(candidate)) {
    const targetReal = await fs.realpath(candidate);
    if (!isWithin(rootReal, targetReal)) {
      throw new Error('workspace authority denied: resolved target escapes workspace');
    }
    return targetReal;
  }

  if (options.mustExist) throw new Error('workspace authority denied: target does not exist');
  return candidate;
}

module.exports = { isWithin, resolveAuthorizedWorkspacePath };
