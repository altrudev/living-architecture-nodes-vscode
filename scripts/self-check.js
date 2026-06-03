'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = ['package.json', 'README.md', 'LICENSE', 'ARCH.md', 'NERVE.md', 'CHANGELOG.node.md'];
const sourceFiles = [];
const nodeFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(root, abs).replace(/\\/g, '/');
    if (rel.startsWith('.git/') || rel.startsWith('node_modules/') || rel.startsWith('.lan-vscode/')) continue;
    if (entry.isDirectory()) walk(abs);
    else if (entry.isFile()) {
      if (/\.(js|json|yml|yaml|svg|md)$/.test(rel) && !rel.endsWith('.node.md')) sourceFiles.push(rel);
      if (rel.endsWith('.node.md')) nodeFiles.push(rel);
    }
  }
}

walk(root);
const missingRequired = required.filter((file) => !fs.existsSync(path.join(root, file)));
const nodeSet = new Set(nodeFiles);
const missingNodes = sourceFiles
  .filter((file) => !['README.md', 'LICENSE', 'ARCH.md', 'NERVE.md', 'CHANGELOG.node.md'].includes(file))
  .map((file) => ({ file, node: companion(file) }))
  .filter((entry) => !nodeSet.has(entry.node));

const score = Math.max(0, 100 - missingRequired.length * 20 - missingNodes.length * 3);
console.log(`Living Architecture Nodes VS Code self-check: ${score}/100`);
console.log(`Source-like files: ${sourceFiles.length}`);
console.log(`Node files: ${nodeFiles.length}`);
console.log(`Missing required artifacts: ${missingRequired.length}`);
console.log(`Missing node files: ${missingNodes.length}`);
if (missingRequired.length || missingNodes.length) {
  console.log(JSON.stringify({ missingRequired, missingNodes }, null, 2));
  process.exit(1);
}

function companion(file) {
  const dir = path.posix.dirname(file);
  const ext = path.posix.extname(file);
  const base = path.posix.basename(file, ext);
  const name = `${base}.node.md`;
  return dir === '.' ? name : path.posix.join(dir, name);
}
