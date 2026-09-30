'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const vendor = path.join(root, 'vendor', 'lan-core');
const manifest = require(path.join(vendor, 'manifest.json'));

const EXPECTED_CORE_COMMIT = '44f0b9400b4ccba2bcc63660c59d042cd6d1a400';
const EXPECTED_FILES = [
  'NOTICE.txt',
  'authority.cjs',
  'entitlement.cjs',
  'index.cjs'
];

function verifyVendoredCore() {
  const failures = [];
  if (manifest.schema !== 'lan.surface-runtime.manifest.v1') {
    failures.push('vendored core manifest schema drifted');
  }
  if (manifest.adapterContract !== 'lan.adapter.v1') {
    failures.push('vendored adapter contract drifted');
  }
  if (manifest.coreCommit !== EXPECTED_CORE_COMMIT) {
    failures.push('vendored private-core commit drifted');
  }
  if (manifest.runtimeDependencies !== 0 ||
      manifest.networkAccess !== false ||
      manifest.telemetry !== false) {
    failures.push('vendored runtime trust boundary drifted');
  }

  const declared = Object.keys(manifest.files || {}).sort();
  if (JSON.stringify(declared) !== JSON.stringify(EXPECTED_FILES.slice().sort())) {
    failures.push('vendored runtime allowlist drifted');
  }

  for (const name of EXPECTED_FILES) {
    const file = path.join(vendor, name);
    if (!fs.existsSync(file)) {
      failures.push('missing vendored runtime file: ' + name);
      continue;
    }
    const bytes = fs.readFileSync(file);
    const sha = crypto.createHash('sha256').update(bytes).digest('hex');
    const expected = manifest.files && manifest.files[name];
    if (!expected || expected.sha256 !== sha || expected.bytes !== bytes.length) {
      failures.push('vendored runtime provenance mismatch: ' + name);
    }
  }

  return { valid: failures.length === 0, failures };
}

if (require.main === module) {
  const result = verifyVendoredCore();
  if (!result.valid) {
    console.error('LAN vendored core verification: FAILED');
    for (const failure of result.failures) console.error('- ' + failure);
    process.exit(1);
  }
  console.log('LAN vendored core verification: VERIFIED');
  console.log('Core commit: ' + manifest.coreCommit);
  console.log('Adapter contract: ' + manifest.adapterContract);
}

module.exports = { verifyVendoredCore, EXPECTED_CORE_COMMIT };
