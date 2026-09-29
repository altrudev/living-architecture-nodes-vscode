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
if (manifest.channel !== 'pre-release') failures.push('listing manifest channel must be pre-release');
if (manifest.pre_release_publish_flag !== '--pre-release') failures.push('pre-release publishing flag is missing');
if (cmpVersion(manifest.stable_target_version, pkg.version) <= 0) failures.push('stable target version must be greater than pre-release version');
if (pkg.pricing !== manifest.pricing_label || pkg.pricing !== 'Free') failures.push('Marketplace pricing label must remain Free');
if (manifest.paid_entitlements_enabled !== false) failures.push('paid entitlements must remain disabled until production service is verified');
if (manifest.pre_release_publish_allowed !== false) failures.push('pre-release publishing must remain blocked while Marketplace authentication is unavailable');
if (!Array.isArray(manifest.pre_release_blockers) || manifest.pre_release_blockers.length === 0) failures.push('pre-release publication blocker must be recorded');
if (manifest.stable_publish_allowed !== false) failures.push('stable publishing must remain blocked at this stage');

if (manifest.publishing_auth_strategy !== 'github-oidc') failures.push('Marketplace publishing auth strategy must be github-oidc');
if (manifest.trusted_publishing?.provider !== 'github-actions') failures.push('trusted publishing provider must be github-actions');
if (manifest.trusted_publishing?.repository !== 'altrudev/living-architecture-nodes-vscode') failures.push('trusted publishing repository identity drifted');
if (manifest.trusted_publishing?.workflow !== '.github/workflows/publish-marketplace.yml') failures.push('trusted publishing workflow identity drifted');
if (manifest.trusted_publishing?.audience !== 'marketplace.visualstudio.com') failures.push('trusted publishing OIDC audience drifted');
if (typeof manifest.trusted_publishing?.policy_configured !== 'boolean') failures.push('trusted publishing policy_configured must be explicit');

for (const rel of ['README.md','CHANGELOG.md','SUPPORT.md','PRIVACY.md','SECURITY.md','LICENSE','media/lan-marketplace.png','.vscodeignore','package-lock.json','.github/workflows/publish-marketplace.yml','.github/workflows/publish-marketplace.node.md']) requireFile(rel);

const vscodeIgnore = text('.vscodeignore');
if (!vscodeIgnore.split(/\r?\n/).includes('.github/**')) failures.push('.github/** must be excluded from the published VSIX');
if (pkg.icon !== 'media/lan-marketplace.png') failures.push('Marketplace icon must use the PNG release icon');
if (!pkg.homepage || !pkg.repository?.url || !pkg.bugs?.url) failures.push('Marketplace Resources links are incomplete');
if (pkg.capabilities?.untrustedWorkspaces?.supported !== 'limited') failures.push('Workspace Trust listing must declare limited support');

if (Object.keys(pkg.dependencies || {}).length !== 0) failures.push('runtime dependencies must remain empty unless explicitly reviewed');
if (pkg.devDependencies?.['@vscode/vsce'] !== '4.0.0') failures.push('@vscode/vsce release tool must be pinned to 4.0.0');
if (pkg.scripts?.package !== 'vsce package') failures.push('package script must invoke the pinned local vsce binary');
const lock = JSON.parse(text('package-lock.json') || '{}');
if (lock.lockfileVersion !== 3) failures.push('package-lock.json must use lockfileVersion 3');
if (lock.packages?.['']?.devDependencies?.['@vscode/vsce'] !== '4.0.0') failures.push('package-lock root must pin @vscode/vsce 4.0.0');

const titleMenus = pkg.contributes?.menus?.['view/title'] || [];
const exportMenu = titleMenus.find((x) => x.command === 'livingArchitectureNodes.exportHandoffBundle');
if (!exportMenu?.when?.includes('isWorkspaceTrusted')) failures.push('export command is not hidden in Restricted Mode');
const itemMenus = pkg.contributes?.menus?.['view/item/context'] || [];
const generateMenu = itemMenus.find((x) => x.command === 'livingArchitectureNodes.generateMissingNodes');
if (!generateMenu?.when?.includes('isWorkspaceTrusted')) failures.push('node generation command is not hidden in Restricted Mode');

const workflow = text('.github/workflows/publish-marketplace.yml');
for (const phrase of [
  'workflow_dispatch:',
  'id-token: write',
  'persist-credentials: false',
  'publish --oidc --packagePath',
  'actions/checkout@11d5960a326750d5838078e36cf38b85af677262',
  'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020',
  'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02',
  'actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093',
  'npm ci --ignore-scripts',
  './node_modules/.bin/vsce'
]) {
  if (!workflow.includes(phrase)) failures.push(`trusted publishing workflow missing required control: ${phrase}`);
}

if (/^\s*push:/m.test(workflow) || /^\s*pull_request:/m.test(workflow) || /^\s*release:/m.test(workflow)) {
  failures.push('Marketplace publishing workflow must remain manual-only');
}

if ((workflow.match(/id-token:\s*write/g) || []).length !== 1) {
  failures.push('id-token: write must exist only in the publish job');
}

if (/secrets\.VSCE_PAT|VSCE_PAT\s*:/.test(workflow)) {
  failures.push('Marketplace publishing workflow must not use a VSCE PAT secret');
}

if (/npx\s+--yes\s+@vscode\/vsce/.test(workflow)) {
  failures.push('Marketplace publishing workflow must not fetch vsce ad hoc with npx');
}

const readme = text('README.md');
for (const phrase of [
  'Marketplace extension remains **Free**',
  'Generated drafts are **not verified architecture truth**',
  'NOT VERIFIED',
  'no telemetry',
  'Workspace Trust',
  'stable channel',
  'optional pre-release channel',
  'See [CHANGELOG.md](CHANGELOG.md) for current versions and release details.'
]) {
  if (!readme.includes(phrase)) failures.push(`README listing is missing required statement: ${phrase}`);
}

for (const pattern of [
  /Current stable Marketplace release:/,
  /Prepared pre-release:/,
  /Target stable product release after all release gates pass:/,
  /Paid capabilities are not enabled in the \d+\.\d+\.\d+ pre-release\./
]) {
  if (pattern.test(readme)) failures.push(`README contains stale version-specific Marketplace copy: ${pattern}`);
}

const changelog = text('CHANGELOG.md');
if (!changelog.includes(`## ${pkg.version} — Pre-release`)) failures.push(`CHANGELOG.md is not synchronized to ${pkg.version}`);

const icon = fs.existsSync(path.join(root,pkg.icon)) ? fs.readFileSync(path.join(root,pkg.icon)) : Buffer.alloc(0);
if (icon.length < 8 || icon.toString('hex',0,8) !== '89504e470d0a1a0a') failures.push('Marketplace icon is not a valid PNG');

const forbidden = [
  /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/,
  /sk_live_[A-Za-z0-9]+/,
  /Frequency-Dev/,
  /Living-Architecture-Nodes-Product/
];
for (const rel of ['README.md','CHANGELOG.md','SUPPORT.md','PRIVACY.md','SECURITY.md','package.json']) {
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
console.log('Publishing auth: GitHub Actions trusted OIDC');
console.log(`Trusted publishing policy: ${manifest.trusted_publishing.policy_configured ? 'CONFIGURED' : 'PENDING'}`);
console.log('Workspace Trust: limited; mutations require trust');
console.log('Runtime dependencies: none');
console.log('Release toolchain: locked @vscode/vsce 4.0.0 via npm ci --ignore-scripts');
