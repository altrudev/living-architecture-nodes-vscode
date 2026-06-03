'use strict';

const SECRET_PATTERNS = [
  /ghp_[A-Za-z0-9_]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /sk-[A-Za-z0-9]{20,}/g,
  /(api[_-]?key\s*[:=]\s*)['\"]?[^'\"\s]+/gi,
  /(token\s*[:=]\s*)['\"]?[^'\"\s]+/gi,
  /(password\s*[:=]\s*)['\"]?[^'\"\s]+/gi,
  /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g
];

function redactString(value) {
  let output = value;
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, (match, prefix) => prefix ? `${prefix}[REDACTED]` : '[REDACTED]');
  }
  return output;
}

function redactObject(value) {
  if (typeof value === 'string') return redactString(value);
  if (Array.isArray(value)) return value.map(redactObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, redactObject(val)]));
  }
  return value;
}

module.exports = { redactString, redactObject };
