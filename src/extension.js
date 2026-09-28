'use strict';

const vscode = require('vscode');
const path = require('path');
const { version: extensionVersion } = require('../package.json');
const { scanWorkspace } = require('./scanner');
const { createNodeTemplate } = require('./templates');
const { exportDiagnostics } = require('./exporter');
const { openWorkspaceFile, writeWorkspaceFile, ensureWorkspaceFolder, normalizeRelativePath } = require('./workspace');
const { ArchitectureTreeProvider, TreeItemKind } = require('./tree-provider');
const { resolveEntitlement } = require('./product/entitlement');

let treeProvider;
let lastReport = null;
let extensionContext = null;
let currentEntitlement = Object.freeze({ tier: 'free', capabilities: new Set(), source: 'free-default', reason: null });

function activate(context) {
  extensionContext = context;
  treeProvider = new ArchitectureTreeProvider();
  context.subscriptions.push(vscode.window.registerTreeDataProvider('livingArchitectureNodes.statusView', treeProvider));

  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.scanWorkspace', async () => {
    await runScan({ showInfo: true });
  }));
  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.generateMissingNodes', async (item) => {
    await generateMissingNodes(item);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.exportHandoffBundle', async () => {
    await exportBundle();
  }));
  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.showProductStatus', async () => {
    await refreshEntitlement();
    const suffix = currentEntitlement.reason ? ` — paid entitlement unavailable: ${currentEntitlement.reason}` : '';
    vscode.window.showInformationMessage(`Living Architecture Nodes ${extensionVersion}: ${currentEntitlement.tier.toUpperCase()} tier${suffix}`);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openARCH', async () => openWorkspaceFile('ARCH.md')));
  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openNERVE', async () => openWorkspaceFile('NERVE.md')));
  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openChangelog', async () => openWorkspaceFile('CHANGELOG.node.md')));
  context.subscriptions.push(vscode.commands.registerCommand('livingArchitectureNodes.openFile', async (relativePath) => openWorkspaceFile(relativePath)));

  refreshEntitlement().catch(() => {});
  runScan({ showInfo: false }).catch(() => {});
}

function deactivate() {}

async function refreshEntitlement() {
  if (!extensionContext) return currentEntitlement;
  currentEntitlement = await resolveEntitlement(extensionContext, { publicKeyPem: null });
  return currentEntitlement;
}

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
    const msg = `Living Architecture Nodes: ${report.status.toUpperCase()} ${report.healthScore}/100 — ${report.missingNodes.length} missing, ${report.dirtyNodes.length} dirty. Tier: ${currentEntitlement.tier.toUpperCase()}.`;
    if (report.status === 'failed') vscode.window.showErrorMessage(msg);
    else if (report.status === 'warning') vscode.window.showWarningMessage(msg);
    else vscode.window.showInformationMessage(msg);
  }
  return report;
}

async function requireTrustedMutation(action) {
  if (vscode.workspace.isTrusted) return true;
  await vscode.window.showWarningMessage(
    `Living Architecture Nodes: ${action} requires Workspace Trust. Read-only scanning remains available in Restricted Mode.`
  );
  return false;
}

async function generateMissingNodes(item) {
  if (!await requireTrustedMutation('creating node drafts')) return;
  const workspaceFolder = ensureWorkspaceFolder();
  if (!workspaceFolder) return;
  const report = lastReport || await runScan({ showInfo: false });
  const missing = item && item.kind === TreeItemKind.MissingNode ? [item.payload] : report.missingNodes;

  if (!missing.length) {
    vscode.window.showInformationMessage('No missing Living Architecture Node files found.');
    return;
  }

  const confirmation = await vscode.window.showWarningMessage(
    `Create ${missing.length} missing .node.md companion file(s) as GENERATED DRAFTS?`,
    { modal: true },
    'Create Drafts'
  );
  if (confirmation !== 'Create Drafts') return;

  let created = 0;
  for (const entry of missing) {
    const content = createNodeTemplate({
      sourcePath: entry.sourcePath,
      nodePath: entry.nodePath,
      generatedBy: `Living Architecture Nodes VS Code Extension v${extensionVersion}`
    });
    const wrote = await writeWorkspaceFile(entry.nodePath, content, { failIfExists: true });
    if (wrote) created += 1;
  }

  vscode.window.showInformationMessage(
    `Created ${created} Living Architecture Node draft file(s). Generated drafts are not verified architecture truth.`
  );
  await runScan({ showInfo: false });
}

async function exportBundle() {
  if (!await requireTrustedMutation('exporting diagnostics')) return;
  const workspaceFolder = ensureWorkspaceFolder();
  if (!workspaceFolder) return;
  const report = lastReport || await runScan({ showInfo: false });
  const config = vscode.workspace.getConfiguration('livingArchitectureNodes');
  const exportPath = config.get('exportPath') || '.lan-vscode';
  const result = await exportDiagnostics(workspaceFolder.uri.fsPath, report, {
    exportPath,
    workspaceTrusted: vscode.workspace.isTrusted
  });
  const open = await vscode.window.showInformationMessage(
    `Living Architecture Nodes export created: ${normalizeRelativePath(result.markdownPath)}`,
    'Open Summary',
    'Open Folder'
  );
  if (open === 'Open Summary') await openWorkspaceFile(normalizeRelativePath(result.markdownPath));
  if (open === 'Open Folder') await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(path.dirname(result.markdownPath)));
}

module.exports = { activate, deactivate };
