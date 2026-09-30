'use strict';

const coreEntitlement = require('../../vendor/lan-core/entitlement.cjs');

const SECRET_KEY = 'livingArchitectureNodes.entitlement.v1';

async function resolveEntitlement(context, { publicKeyPem = null, now = new Date() } = {}) {
  const token = await context.secrets.get(SECRET_KEY);
  const resolved = coreEntitlement.resolveEntitlement(token, publicKeyPem, now);
  return Object.freeze({
    ...resolved,
    capabilities: new Set(resolved.capabilities)
  });
}

function verifyToken(token, publicKeyPem, now = new Date()) {
  const verified = coreEntitlement.verifyEntitlementToken(token, publicKeyPem, now);
  return Object.freeze({
    tier: verified.tier,
    capabilities: [...verified.capabilities],
    expires_at: verified.expiresAt,
    organization: verified.organization,
    subject: verified.subject
  });
}

function capabilityResult(entitlement, capability) {
  const normalized = {
    ...entitlement,
    capabilities: Array.from(entitlement.capabilities || [])
  };
  return coreEntitlement.capabilityResult(normalized, capability);
}

module.exports = { SECRET_KEY, verifyToken, resolveEntitlement, capabilityResult };
