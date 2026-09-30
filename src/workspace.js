'use strict';

const vscode = require('vscode');
const path = require('path');
const {
  resolveAuthorizedWorkspacePath,
  writeAuthorizedWorkspaceFile
} = require('./product/workspace-authority');

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
    const absPath = await resolveAuthorizedWorkspacePath(
      folder.uri.fsPath,
      relativePath,
      { mustExist: true }
    );
    const doc = await vscode.workspace.openTextDocument(absPath);
    await vscode.window.showTextDocument(doc, { preview: false });
  } catch (error) {
    vscode.window.showWarningMessage(
      'Could not open ' + relativePath + ': ' + error.message
    );
  }
}

async function writeWorkspaceFile(relativePath, content, options = {}) {
  const folder = ensureWorkspaceFolder();
  if (!folder) throw new Error('No workspace folder open.');
  if (!vscode.workspace.isTrusted) {
    throw new Error('Workspace Trust is required for file mutation.');
  }

  return writeAuthorizedWorkspaceFile(folder.uri.fsPath, relativePath, content, {
    failIfExists: Boolean(options.failIfExists),
    mode: 0o600
  });
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function normalizeRelativePath(value) {
  const folder = vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders[0];
  if (!folder) return toPosix(value);
  return toPosix(path.relative(folder.uri.fsPath, value));
}

module.exports = {
  ensureWorkspaceFolder,
  openWorkspaceFile,
  writeWorkspaceFile,
  toPosix,
  normalizeRelativePath
};
