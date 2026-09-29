'use strict';

const path = require('path');
const { version } = require('../package.json');
const { redactObject } = require('./redactor');
const {
  resolveAuthorizedWorkspacePath,
  writeAuthorizedWorkspaceFile
} = require('./product/workspace-authority');

function pickPathPair(entry) {
  return {
    sourcePath: entry && entry.sourcePath,
    nodePath: entry && entry.nodePath
  };
}

function sanitizeReportForExport(report = {}) {
  const allowed = {
    generatedAt: report.generatedAt,
    status: report.status,
    healthScore: report.healthScore,
    missingRequired: Array.isArray(report.missingRequired) ? report.missingRequired.slice() : [],
    missingNodes: Array.isArray(report.missingNodes) ? report.missingNodes.map(pickPathPair) : [],
    dirtyNodes: Array.isArray(report.dirtyNodes) ? report.dirtyNodes.map((entry) => ({
      sourcePath: entry && entry.sourcePath,
      nodePath: entry && entry.nodePath,
      reason: entry && entry.reason
    })) : [],
    orphanNodes: Array.isArray(report.orphanNodes) ? report.orphanNodes.map((entry) => ({
      nodePath: entry && entry.nodePath
    })) : [],
    summary: {
      sourceFileCount: report.summary && report.summary.sourceFileCount,
      nodeFileCount: report.summary && report.summary.nodeFileCount,
      missingRequiredCount: report.summary && report.summary.missingRequiredCount,
      missingNodeCount: report.summary && report.summary.missingNodeCount,
      dirtyNodeCount: report.summary && report.summary.dirtyNodeCount,
      orphanNodeCount: report.summary && report.summary.orphanNodeCount
    }
  };
  return redactObject(allowed);
}

async function exportDiagnostics(rootPath, report, options = {}) {
  if (options.workspaceTrusted !== true) {
    throw new Error('Workspace Trust is required for diagnostic export.');
  }

  const exportPath = options.exportPath || '.lan-vscode';
  await resolveAuthorizedWorkspacePath(rootPath, exportPath);

  const safeReport = sanitizeReportForExport(report);
  const sanitized = {
    tool: 'Living Architecture Nodes VS Code Extension',
    version,
    report: safeReport
  };

  const jsonRelative = path.join(exportPath, 'living-architecture-diagnostic.json');
  const markdownRelative = path.join(exportPath, 'living-architecture-diagnostic.md');

  await writeAuthorizedWorkspaceFile(rootPath, jsonRelative, JSON.stringify(sanitized, null, 2), { mode: 0o600 });
  await writeAuthorizedWorkspaceFile(rootPath, markdownRelative, createMarkdownSummary(safeReport), { mode: 0o600 });

  const jsonPath = await resolveAuthorizedWorkspacePath(rootPath, jsonRelative, { mustExist: true });
  const markdownPath = await resolveAuthorizedWorkspacePath(rootPath, markdownRelative, { mustExist: true });
  return { jsonPath, markdownPath };
}

function escapeMarkdownText(value) {
  const placeholder = 'LANREDACTEDPLACEHOLDER7D9A';
  return String(value)
    .replace(/\[REDACTED\]/g, placeholder)
    .replace(/[\r\n\t\0]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/([\`*_{}\[\]()#+.!<>|~-])/g, '\\$1')
    .replace(new RegExp(placeholder, 'g'), '[REDACTED]');
}

function createMarkdownSummary(report) {
  const lines = [];
  lines.push('# Living Architecture Nodes Diagnostic Summary');
  lines.push('');
  lines.push('Generated: ' + escapeMarkdownText(report.generatedAt));
  lines.push('');
  lines.push('## Status');
  lines.push('');
  lines.push('- Status: **' + escapeMarkdownText(report.status.toUpperCase()) + '**');
  lines.push('- Health score: **' + report.healthScore + '/100**');
  lines.push('- Source files scanned: ' + report.summary.sourceFileCount);
  lines.push('- Node files found: ' + report.summary.nodeFileCount);
  lines.push('- Missing required artifacts: ' + report.summary.missingRequiredCount);
  lines.push('- Missing nodes: ' + report.summary.missingNodeCount);
  lines.push('- Dirty nodes: ' + report.summary.dirtyNodeCount);
  lines.push('- Orphan nodes: ' + report.summary.orphanNodeCount);
  lines.push('');
  addSection(lines, 'Missing required artifacts', report.missingRequired.map((x) => '- ' + escapeMarkdownText(x)));
  addSection(lines, 'Missing node files', report.missingNodes.map((x) => '- ' + escapeMarkdownText(x.sourcePath) + ' needs ' + escapeMarkdownText(x.nodePath)));
  addSection(lines, 'Dirty node risks', report.dirtyNodes.map((x) => '- ' + escapeMarkdownText(x.nodePath) + ': ' + escapeMarkdownText(x.reason)));
  addSection(lines, 'Orphan node files', report.orphanNodes.map((x) => '- ' + escapeMarkdownText(x.nodePath)));
  lines.push('## Suggested investigation order');
  lines.push('');
  if (report.missingRequired.length || report.missingNodes.length || report.dirtyNodes.length) {
    lines.push('- Resolve missing required artifacts and missing node files.');
    lines.push('- Review dirty node risks before editing affected source files.');
  } else {
    lines.push('- No immediate architecture-memory blockers detected.');
  }
  lines.push('- Review ARCH.md for intent vs reality gaps.');
  lines.push('- Review NERVE.md for cascade risks and recurring bug patterns.');
  lines.push('- Update CHANGELOG.node.md after cross-cutting changes.');
  lines.push('');
  lines.push('Privacy: source contents, full repository inventories, and absolute workspace paths are not included in this handoff.');
  lines.push('');
  lines.push('Generated by Living Architecture Nodes VS Code Extension.');
  lines.push('');
  lines.push('Developed by Altru.dev — Code For Humanity.');
  return lines.join('\n');
}

function addSection(lines, title, items) {
  lines.push('## ' + title);
  lines.push('');
  if (items.length) lines.push(...items);
  else lines.push('None');
  lines.push('');
}

module.exports = {
  sanitizeReportForExport,
  exportDiagnostics,
  createMarkdownSummary,
  escapeMarkdownText
};
