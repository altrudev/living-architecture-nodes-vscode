'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');
const manifest = require('../release/listing-manifest.json');
const failures = [];

function requireFile(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) failures.push(`missing release/listing file: ${rel}`);
  return abs;
}

function text(rel) {
  const abs = requireFile(rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
}

function cmpVersion(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) failures.push('Marketplace package version must be major.minor.patch with no prerelease suffix');
if (pkg.version !== manifest.pre_release_version) failures.push('package version does not match listing pre-release version');
if (manifest.channel !== 'pre-release') failures.push('listing manifest channel must be pre-release for 0.1.1');
if (manifest.pre_release_publish_flag !== '--pre-release') failures.push('pre-release publishing flag is missing');
if (cmpVersion(manifest.stable_target_version, pkg.version) <= 0) failures.push('stable target version must be greater than pre-release version');
if (pkg.pricing !== manifest.pricing_label || pkg.pricing !== 'Free') failures.push('Marketplace pricing label must remain Free');
if (manifest.paid_entitlements_enabled !== false) failures.push('paid entitlements must remain disabled until production service is verified');
if (manifest.pre_release_publish_allowed !== false) failures.push('pre-release publishing must remain blocked while Marketplace authentication is unavailable');
if (!Array.isArray(manifest.pre_release_blockers) || manifest.pre_release_blockers.length === 0) failures.push('pre-release publication blocker must be recorded');
if (manifest.stable_publish_allowed !== false) failures.push('stable publishing must remain blocked at this stage');

for (const rel of ['README.md','CHANGELOG.md','SUPPORT.md','PRIVACY.md','LICENSE','media/lan-marketplace.png']) requireFile(rel);

if (pkg.icon !== 'media/lan-marketplace.png') failures.push('Marketplace icon must use the PNG release icon');
if (!pkg.homepage || !pkg.repository?.url || !pkg.bugs?.url) failures.push('Marketplace Resources links are incomplete');
if (pkg.capabilities?.untrustedWorkspaces?.supported !== 'limited') failures.push('Workspace Trust listing must declare limited support');

const titleMenus = pkg.contributes?.menus?.['view/title'] || [];
const exportMenu = titleMenus.find((x) => x.command === 'livingArchitectureNodes.exportHandoffBundle');
if (!exportMenu?.when?.includes('isWorkspaceTrusted')) failures.push('export command is not hidden in Restricted Mode');
const itemMenus = pkg.contributes?.menus?.['view/item/context'] || [];
const generateMenu = itemMenus.find((x) => x.command === 'livingArchitectureNodes.generateMissingNodes');
if (!generateMenu?.when?.includes('isWorkspaceTrusted')) failures.push('node generation command is not hidden in Restricted Mode');

const readme = text('README.md');
for (const phrase of ['Marketplace extension remains **Free**','Generated drafts are **not verified architecture truth**','NOT VERIFIED','no telemetry','Workspace Trust']) {
  if (!readme.includes(phrase)) failures.push(`README listing is missing required statement: ${phrase}`);
}

const changelog = text('CHANGELOG.md');
if (!changelog.includes('## 0.1.1 — Pre-release')) failures.push('CHANGELOG.md is not synchronized to 0.1.1');

const icon = fs.existsSync(path.join(root,pkg.icon)) ? fs.readFileSync(path.join(root,pkg.icon)) : Buffer.alloc(0);
if (icon.length < 8 || icon.toString('hex',0,8) !== '89504e470d0a1a0a') failures.push('Marketplace icon is not a valid PNG');

const forbidden = [
  /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/,
  /sk_live_[A-Za-z0-9]+/,
  /Frequency-Dev/,
  /Living-Architecture-Nodes-Product/
];
for (const rel of ['README.md','CHANGELOG.md','SUPPORT.md','PRIVACY.md','package.json']) {
  const value = text(rel);
  for (const pattern of forbidden) if (pattern.test(value)) failures.push(`public listing/release material contains forbidden private material: ${rel}`);
}

if (failures.length) {
  console.error('LAN Marketplace release check: FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('LAN Marketplace release check: VERIFIED');
console.log(`Extension ID: ${manifest.extension_id}`);
console.log(`Pre-release artifact: ${pkg.version} ${manifest.pre_release_publish_flag}`);
console.log(`Marketplace publish gate: ${manifest.pre_release_publish_allowed ? 'READY' : 'BLOCKED'}`);
if (!manifest.pre_release_publish_allowed) console.log(`Publish blocker: ${manifest.pre_release_blockers.join('; ')}`);
console.log(`Stable target: ${manifest.stable_target_version} (blocked until production gates pass)`);
console.log('Pricing label: Free');
console.log('Marketplace listing/docs/privacy/license: synchronized');
console.log('Workspace Trust: limited; mutations require trust');
