'use strict';

const fs = require('fs/promises');
const fsConstants = require('fs').constants;
const path = require('path');
const crypto = require('crypto');

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..' &&
    !relative.startsWith('..' + path.sep) &&
    !path.isAbsolute(relative)
  );
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
  if (typeof workspaceRoot !== 'string' || !workspaceRoot) {
    throw new Error('workspace root is required');
  }
  if (typeof targetPath !== 'string' || !targetPath) {
    throw new Error('target path is required');
  }
  if (path.isAbsolute(targetPath)) {
    throw new Error('workspace authority denied: target must be workspace-relative');
  }

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
  if (options.mustExist) {
    throw new Error('workspace authority denied: target does not exist');
  }
  return candidate;
}

async function ensureAuthorizedParent(workspaceRoot, relativePath) {
  const relativeParent = path.dirname(relativePath);
  const parentInput = !relativeParent || relativeParent === '.' ? '.' : relativeParent;
  const parentCandidate = await resolveAuthorizedWorkspacePath(
    workspaceRoot,
    parentInput
  );
  const existed = await pathExists(parentCandidate);
  await fs.mkdir(parentCandidate, { recursive: true, mode: 0o700 });

  const parentReal = await resolveAuthorizedWorkspacePath(
    workspaceRoot,
    parentInput,
    { mustExist: true }
  );
  if (!existed && process.platform !== 'win32') {
    await fs.chmod(parentReal, 0o700);
  }
  return parentReal;
}

function noFollowFlag() {
  return typeof fsConstants.O_NOFOLLOW === 'number'
    ? fsConstants.O_NOFOLLOW
    : 0;
}

async function writeExclusiveFile(workspaceRoot, relativePath, content, mode) {
  await ensureAuthorizedParent(workspaceRoot, relativePath);
  const target = await resolveAuthorizedWorkspacePath(workspaceRoot, relativePath);
  const flags = fsConstants.O_WRONLY | fsConstants.O_CREAT |
    fsConstants.O_EXCL | noFollowFlag();

  let handle;
  try {
    handle = await fs.open(target, flags, mode);
    await handle.writeFile(content, 'utf8');
    await handle.sync();
    if (process.platform !== 'win32') await handle.chmod(mode);
    return true;
  } catch (error) {
    if (error && error.code === 'EEXIST') return false;
    throw error;
  } finally {
    if (handle) await handle.close();
  }
}

async function writeAtomicReplacement(workspaceRoot, relativePath, content, mode) {
  const parent = await ensureAuthorizedParent(workspaceRoot, relativePath);
  const base = path.basename(relativePath);
  const tempName = '.' + base + '.lan-tmp-' + crypto.randomBytes(8).toString('hex');
  const tempRelative = path.join(path.dirname(relativePath), tempName);
  const tempPath = await resolveAuthorizedWorkspacePath(workspaceRoot, tempRelative);
  const flags = fsConstants.O_WRONLY | fsConstants.O_CREAT |
    fsConstants.O_EXCL | noFollowFlag();

  let handle;
  try {
    handle = await fs.open(tempPath, flags, mode);
    await handle.writeFile(content, 'utf8');
    await handle.sync();
    if (process.platform !== 'win32') await handle.chmod(mode);
    await handle.close();
    handle = null;

    const parentInput = path.dirname(relativePath) || '.';
    const parentAgain = await resolveAuthorizedWorkspacePath(
      workspaceRoot,
      parentInput,
      { mustExist: true }
    );
    if (parentAgain !== parent) {
      throw new Error('workspace authority denied: destination parent changed during write');
    }

    const finalPath = await resolveAuthorizedWorkspacePath(workspaceRoot, relativePath);
    await fs.rename(tempPath, finalPath);
    return true;
  } finally {
    if (handle) await handle.close();
    try {
      await fs.unlink(tempPath);
    } catch (_) {
      // Temp path was renamed or already cleaned up.
    }
  }
}

async function writeAuthorizedWorkspaceFile(workspaceRoot, relativePath, content, options = {}) {
  if (typeof content !== 'string' && !Buffer.isBuffer(content)) {
    throw new Error('workspace authority denied: content must be a string or Buffer');
  }
  if (path.isAbsolute(relativePath)) {
    throw new Error('workspace authority denied: write target must be relative');
  }

  const mode = options.mode === undefined ? 0o600 : options.mode;
  if (options.failIfExists) {
    return writeExclusiveFile(workspaceRoot, relativePath, content, mode);
  }
  return writeAtomicReplacement(workspaceRoot, relativePath, content, mode);
}

module.exports = {
  isWithin,
  resolveAuthorizedWorkspacePath,
  writeAuthorizedWorkspaceFile
};
