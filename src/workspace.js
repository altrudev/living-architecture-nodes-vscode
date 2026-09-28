'use strict';

const vscode = require('vscode');
const fs = require('fs/promises');
const path = require('path');
const { resolveAuthorizedWorkspacePath } = require('./product/workspace-authority');

function ensureWorkspaceFolder() {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || !folders.length) {
    vscode.window.showErrorMessage('Open a workspace folder before using Living Architecture Nodes.');
    return null;
  }
  return folders[0];
}

async function openWorkspaceFile(relativePath) {
  const folder = ensureWorkspaceFolder();
  if (!folder) return;
  try {
    const absPath = await resolveAuthorizedWorkspacePath(folder.uri.fsPath, relativePath, { mustExist: true });
    const doc = await vscode.workspace.openTextDocument(absPath);
    await vscode.window.showTextDocument(doc, { preview: false });
  } catch (error) {
    vscode.window.showWarningMessage(`Could not open ${relativePath}: ${error.message}`);
  }
}

async function writeWorkspaceFile(relativePath, content, options = {}) {
  const folder = ensureWorkspaceFolder();
  if (!folder) throw new Error('No workspace folder open.');
  if (!vscode.workspace.isTrusted) throw new Error('Workspace Trust is required for file mutation.');

  const absPath = await resolveAuthorizedWorkspacePath(folder.uri.fsPath, relativePath);
  await fs.mkdir(path.dirname(absPath), { recursive: true });
  if (options.failIfExists && await fileExists(absPath)) return false;
  await fs.writeFile(absPath, content, 'utf8');
  return true;
}

async function walkFiles(rootPath, options = {}) {
  const excludeGlobs = options.excludeGlobs || [];
  const result = [];

  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      const rel = toPosix(path.relative(rootPath, abs));
      if (excludeGlobs.some((glob) => minimatchLite(rel, glob))) continue;
      if (entry.isDirectory()) await walk(abs);
      else if (entry.isFile()) result.push(rel);
    }
  }

  await walk(rootPath);
  return result.sort();
}

async function fileExists(absPath) {
  try {
    await fs.access(absPath);
    return true;
  } catch (_) {
    return false;
  }
}

async function statSafe(absPath) {
  try {
    return await fs.stat(absPath);
  } catch (_) {
    return null;
  }
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function normalizeRelativePath(value) {
  const folder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
  if (!folder) return toPosix(value);
  return toPosix(path.relative(folder.uri.fsPath, value));
}

function minimatchLite(relativePath, glob) {
  const rel = toPosix(relativePath);
  const normalizedGlob = toPosix(glob);
  if (normalizedGlob.endsWith('/**')) {
    const prefix = normalizedGlob.slice(0, -3).replace(/^\*\*\//, '');
    return rel.startsWith(prefix.replace(/\*\*/g, ''));
  }
  if (normalizedGlob.startsWith('**/') && normalizedGlob.endsWith('/**')) {
    const part = normalizedGlob.slice(3, -3);
    return rel.includes(`/${part}/`) || rel.startsWith(`${part}/`);
  }
  if (normalizedGlob.includes('*')) {
    const escaped = normalizedGlob.replace(/[.+^$\{\}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
    return new RegExp(`^${escaped}$`).test(rel);
  }
  return rel === normalizedGlob || rel.startsWith(`${normalizedGlob}/`);
}

module.exports = {
  ensureWorkspaceFolder,
  openWorkspaceFile,
  writeWorkspaceFile,
  walkFiles,
  fileExists,
  statSafe,
  toPosix,
  normalizeRelativePath,
  minimatchLite
};
