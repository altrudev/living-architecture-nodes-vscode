'use strict';

const vscode = require('vscode');
const path = require('path');
const { scanWorkspace } = require('./scanner');
const { createNodeTemplate } = require('./templates');
const { exportDiagnostics } = require('./exporter');
const { openWorkspaceFile, writeWorkspaceFile, ensureWorkspaceFolder, normalizeRelativePath } = require('./workspace');
const { ArchitectureTreeProvider, TreeItemKind } = require('./tree-provider');

let treeProvider;
let lastReport = null;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  treeProvider = new ArchitectureTreeProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('livingArchitectureNodes.statusView', treeProvider)
  );

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.scanWorkspace', async () => {
    await runScan({ showInfo: true });
  }));

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.generateMissingNodes', async (item) => {
    await generateMissingNodes(item);
  }));

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.exportHandoffBundle', async () => {
    await exportBundle();
  }));

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openARCH', async () => {
    await openWorkspaceFile('ARCH.md');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openNERVE', async () => {
    await openWorkspaceFile('NERVE.md');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openChangelog', async () => {
    await openWorkspaceFile('CHANGELOG.node.md');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openFile', async (relativePath) => {
    await openWorkspaceFile(relativePath);
  }));

  runScan({ showInfo: false }).catch(() => {
    // Startup scan failures are intentionally quiet. Manual scan reports errors.
  });
}

function deactivate() {}

async function runScan(options = {}) {
  const workspaceFolder = ensureWorkspaceFolder();
  if (!workspaceFolder) return;

  const config = vscode.workspace.getConfiguration('livingArchitectureNodes');
  const report = await scanWorkspace(workspaceFolder.uri.fsPath, {
    sourceExtensions: config.get('sourceExtensions'),
    excludeGlobs: config.get('excludeGlobs')
  });

  lastReport = report;
  treeProvider.setReport(report);

  if (options.showInfo) {
    const msg = `Living Architecture Nodes: ${report.status.toUpperCase()} ${report.healthScore}/100 — ${report.missingNodes.length} missing, ${report.dirtyNodes.length} dirty.`;
    if (report.status === 'failed') vscode.window.showErrorMessage(msg);
    else if (report.status === 'warning') vscode.window.showWarningMessage(msg);
    else vscode.window.showInformationMessage(msg);
  }

  return report;
}

async function generateMissingNodes(item) {
  const workspaceFolder = ensureWorkspaceFolder();
  if (!workspaceFolder) return;

  const report = lastReport || await runScan({ showInfo: false });
  const missing = item && item.kind === TreeItemKind.MissingNode
    ? [item.payload]
    : report.missingNodes;

  if (!missing.length) {
    vscode.window.showInformationMessage('No missing Living Architecture Node files found.');
    return;
  }

  const confirmation = await vscode.window.showWarningMessage(
    `Create ${missing.length} missing .node.md companion file(s)?`,
    { modal: true },
    'Create'
  );

  if (confirmation !== 'Create') return;

  let created = 0;
  for (const entry of missing) {
    const content = createNodeTemplate({
      sourcePath: entry.sourcePath,
      nodePath: entry.nodePath,
      generatedBy: 'Living Architecture Nodes VS Code Extension v0.1.0'
    });
    await writeWorkspaceFile(entry.nodePath, content, { failIfExists: true });
    created += 1;
  }

  vscode.window.showInformationMessage(`Created ${created} Living Architecture Node file(s).`);
  await runScan({ showInfo: false });
}

async function exportBundle() {
  const workspaceFolder = ensureWorkspaceFolder();
  if (!workspaceFolder) return;

  const report = lastReport || await runScan({ showInfo: false });
  const config = vscode.workspace.getConfiguration('livingArchitectureNodes');
  const exportPath = config.get('exportPath') || '.lan-vscode';
  const result = await exportDiagnostics(workspaceFolder.uri.fsPath, report, { exportPath });

  const open = await vscode.window.showInformationMessage(
    `Living Architecture Nodes export created: ${normalizeRelativePath(result.markdownPath)}`,
    'Open Summary',
    'Open Folder'
  );

  if (open === 'Open Summary') {
    await openWorkspaceFile(normalizeRelativePath(result.markdownPath));
  }

  if (open === 'Open Folder') {
    await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(path.dirname(result.markdownPath)));
  }
}

module.exports = { activate, deactivate };
