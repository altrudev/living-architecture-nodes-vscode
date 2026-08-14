'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { scanWorkspace } = require('../src/scanner');

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lan-vscode-scanner-regression-'));
  try {
    for (const file of ['ARCH.md', 'NERVE.md', 'CHANGELOG.node.md']) {
      fs.writeFileSync(path.join(root, file), `# ${file}\n`, 'utf8');
    }

    const result = await scanWorkspace(root);
    if (result.missingRequired.length !== 0) {
      throw new Error(`required root artifacts were not recognized: ${JSON.stringify(result.missingRequired)}`);
    }
    if (result.orphanNodes.some((entry) => entry.nodePath === 'CHANGELOG.node.md')) {
      throw new Error('CHANGELOG.node.md was incorrectly classified as an orphan node');
    }
    if (result.status !== 'healthy') {
      throw new Error(`minimal root-artifact workspace should be healthy, received ${result.status}`);
    }

    process.stdout.write('Living Architecture Nodes VS Code scanner regression check passed.\n');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`Scanner regression check failed: ${error.message}\n`);
  process.exit(1);
});
