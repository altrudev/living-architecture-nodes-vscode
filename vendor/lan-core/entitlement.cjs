'use strict';

const crypto = require('crypto');

const TOKEN_TYPE = 'LAN-ENT';
const PRODUCT_ID = 'living-architecture-nodes';
const KNOWN_TIERS = new Set(['free', 'pro', 'team']);

function decodeJson(part) {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

function verifyEntitlementToken(token, publicKeyPem, now = new Date()) {
  if (!publicKeyPem) {
    throw new Error('LAN entitlement verification key is not configured');
  }

  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('invalid entitlement token');
  const [headerPart, payloadPart, signaturePart] = parts;
  const header = decodeJson(headerPart);
  const payload = decodeJson(payloadPart);

  if (header.alg !== 'EdDSA' || header.typ !== TOKEN_TYPE) {
    throw new Error('unsupported entitlement token');
  }
  if (payload.product !== PRODUCT_ID) {
    throw new Error('wrong entitlement product');
  }
  if (!KNOWN_TIERS.has(payload.tier)) {
    throw new Error('unknown entitlement tier');
  }
  if (!Array.isArray(payload.capabilities)) {
    throw new Error('entitlement capabilities must be an array');
  }

  const signed = Buffer.from(headerPart + '.' + payloadPart);
  const signature = Buffer.from(signaturePart, 'base64url');
  if (!crypto.verify(null, signed, publicKeyPem, signature)) {
    throw new Error('invalid entitlement signature');
  }

  const expiresAt = Date.parse(payload.expires_at);
  if (!Number.isFinite(expiresAt) || expiresAt <= now.getTime()) {
    throw new Error('entitlement expired');
  }

  return Object.freeze({
    tier: payload.tier,
    capabilities: Object.freeze([...new Set(payload.capabilities)]),
    expiresAt: payload.expires_at,
    organization: payload.organization || null,
    subject: payload.subject || null
  });
}

function resolveEntitlement(token, publicKeyPem, now = new Date()) {
  if (!token) {
    return Object.freeze({
      tier: 'free',
      capabilities: Object.freeze([]),
      source: 'free-default',
      reason: null
    });
  }
  try {
    const verified = verifyEntitlementToken(token, publicKeyPem, now);
    return Object.freeze({
      ...verified,
      source: 'signed-entitlement',
      reason: null
    });
  } catch (error) {
    return Object.freeze({
      tier: 'free',
      capabilities: Object.freeze([]),
      source: 'free-fallback',
      reason: error.message
    });
  }
}

function capabilityResult(entitlement, capability) {
  const available = entitlement.capabilities.includes(capability);
  return Object.freeze({
    capability,
    available,
    status: available ? 'AVAILABLE' : 'NOT_VERIFIED',
    reason: available
      ? null
      : 'Capability ' + capability + ' is not verified in the current tier.'
  });
}

module.exports = {
  TOKEN_TYPE,
  PRODUCT_ID,
  verifyEntitlementToken,
  resolveEntitlement,
  capabilityResult
};
