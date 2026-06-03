'use strict';

const vscode = require('vscode');

const TreeItemKind = Object.freeze({
  Status: 'lanStatus',
  Section: 'lanSection',
  MissingNode: 'lanMissingNode',
  DirtyNode: 'lanDirtyNode',
  OrphanNode: 'lanOrphanNode',
  Artifact: 'lanArtifact',
  Action: 'lanAction'
});

class ArchitectureTreeProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.report = null;
  }

  setReport(report) {
    this.report = report;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (!this.report) {
      return [new LanTreeItem('Scan workspace to view architecture memory health', TreeItemKind.Action, {
        icon: 'search',
        command: 'livingArchitectureNodes.scanWorkspace'
      })];
    }

    if (!element) return this.rootItems();
    if (element.children) return element.children;
    return [];
  }

  rootItems() {
    const r = this.report;
    const statusIcon = r.status === 'healthy' ? 'pass-filled' : r.status === 'warning' ? 'warning' : 'error';
    const status = new LanTreeItem(`Health: ${r.healthScore}/100 (${r.status})`, TreeItemKind.Status, { icon: statusIcon });

    const artifacts = new LanTreeItem('Required artifacts', TreeItemKind.Section, { icon: 'files' });
    artifacts.children = [
      artifactItem('ARCH.md', !r.missingRequired.includes('ARCH.md'), 'livingArchitectureNodes.openARCH'),
      artifactItem('NERVE.md', !r.missingRequired.includes('NERVE.md'), 'livingArchitectureNodes.openNERVE'),
      artifactItem('CHANGELOG.node.md', !r.missingRequired.includes('CHANGELOG.node.md'), 'livingArchitectureNodes.openChangelog')
    ];

    const missing = new LanTreeItem(`Missing nodes (${r.missingNodes.length})`, TreeItemKind.Section, { icon: r.missingNodes.length ? 'warning' : 'pass' });
    missing.children = r.missingNodes.length
      ? r.missingNodes.map((entry) => new LanTreeItem(`${entry.sourcePath} → ${entry.nodePath}`, TreeItemKind.MissingNode, {
          icon: 'new-file',
          payload: entry,
          command: 'livingArchitectureNodes.generateMissingNodes'
        }))
      : [new LanTreeItem('None', TreeItemKind.Status, { icon: 'pass' })];

    const dirty = new LanTreeItem(`Dirty nodes (${r.dirtyNodes.length})`, TreeItemKind.Section, { icon: r.dirtyNodes.length ? 'warning' : 'pass' });
    dirty.children = r.dirtyNodes.length
      ? r.dirtyNodes.map((entry) => new LanTreeItem(`${entry.nodePath}`, TreeItemKind.DirtyNode, {
          icon: 'warning',
          payload: entry,
          command: 'livingArchitectureNodes.openFile',
          commandArg: entry.nodePath
        }))
      : [new LanTreeItem('None', TreeItemKind.Status, { icon: 'pass' })];

    const orphan = new LanTreeItem(`Orphan nodes (${r.orphanNodes.length})`, TreeItemKind.Section, { icon: r.orphanNodes.length ? 'warning' : 'pass' });
    orphan.children = r.orphanNodes.length
      ? r.orphanNodes.map((entry) => new LanTreeItem(entry.nodePath, TreeItemKind.OrphanNode, {
          icon: 'question',
          payload: entry,
          command: 'livingArchitectureNodes.openFile',
          commandArg: entry.nodePath
        }))
      : [new LanTreeItem('None', TreeItemKind.Status, { icon: 'pass' })];

    const actions = new LanTreeItem('Actions', TreeItemKind.Section, { icon: 'tools' });
    actions.children = [
      new LanTreeItem('Scan Workspace', TreeItemKind.Action, { icon: 'search', command: 'livingArchitectureNodes.scanWorkspace' }),
      new LanTreeItem('Generate Missing Nodes', TreeItemKind.Action, { icon: 'new-file', command: 'livingArchitectureNodes.generateMissingNodes' }),
      new LanTreeItem('Export AI/Dev Handoff Bundle', TreeItemKind.Action, { icon: 'export', command: 'livingArchitectureNodes.exportHandoffBundle' })
    ];

    return [status, artifacts, missing, dirty, orphan, actions];
  }
}

class LanTreeItem extends vscode.TreeItem {
  constructor(label, kind, options = {}) {
    super(label, options.collapsibleState || (options.children ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None));
    this.kind = kind;
    this.contextValue = kind;
    this.payload = options.payload;
    this.children = options.children;
    this.iconPath = options.icon ? new vscode.ThemeIcon(options.icon) : undefined;
    if (options.command) {
      this.command = {
        command: options.command,
        title: label,
        arguments: options.commandArg !== undefined ? [options.commandArg] : [this]
      };
    }
  }
}

function artifactItem(name, exists, command) {
  return new LanTreeItem(`${exists ? '✓' : '✕'} ${name}`, TreeItemKind.Artifact, {
    icon: exists ? 'pass' : 'error',
    command: exists ? command : undefined
  });
}

module.exports = { ArchitectureTreeProvider, TreeItemKind };
