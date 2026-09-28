'use strict';
const crypto=require('crypto');

const SECRET_KEY='livingArchitectureNodes.entitlement.v1';

function decodeJson(part){
  return JSON.parse(Buffer.from(part,'base64url').toString('utf8'));
}

function verifyToken(token,publicKeyPem,now=new Date()){
  if(!publicKeyPem) throw new Error('LAN entitlement verification key is not configured');
  const parts=String(token||'').split('.');
  if(parts.length!==3) throw new Error('invalid entitlement token');
  const [h,p,s]=parts;
  const header=decodeJson(h);
  const payload=decodeJson(p);
  if(header.alg!=='EdDSA'||header.typ!=='LAN-ENT') throw new Error('unsupported entitlement token');
  if(payload.product!=='living-architecture-nodes') throw new Error('wrong entitlement product');
  const valid=crypto.verify(null,Buffer.from(`${h}.${p}`),publicKeyPem,Buffer.from(s,'base64url'));
  if(!valid) throw new Error('invalid entitlement signature');
  if(Date.parse(payload.expires_at)<=now.getTime()) throw new Error('entitlement expired');
  return payload;
}

async function resolveEntitlement(context,{publicKeyPem=null,now=new Date()}={}){
  const token=await context.secrets.get(SECRET_KEY);
  if(!token){
    return Object.freeze({tier:'free',capabilities:new Set(),source:'free-default',reason:null});
  }
  try{
    const payload=verifyToken(token,publicKeyPem,now);
    return Object.freeze({
      tier:payload.tier,
      capabilities:new Set(payload.capabilities||[]),
      source:'signed-entitlement',
      reason:null,
      expiresAt:payload.expires_at
    });
  }catch(error){
    return Object.freeze({
      tier:'free',
      capabilities:new Set(),
      source:'free-fallback',
      reason:error.message
    });
  }
}

function capabilityResult(entitlement,capability){
  const available=entitlement.capabilities.has(capability);
  return Object.freeze({
    capability,
    available,
    status:available?'AVAILABLE':'NOT_VERIFIED',
    reason:available?null:`Capability ${capability} is not verified in the current tier.`
  });
}

module.exports={SECRET_KEY,verifyToken,resolveEntitlement,capabilityResult};
