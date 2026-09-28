'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {capabilityResult,resolveEntitlement}=require('../src/product/entitlement');

test('no entitlement is a usable free tier',async()=>{
  const context={secrets:{get:async()=>undefined}};
  const r=await resolveEntitlement(context);
  assert.equal(r.tier,'free');
  assert.equal(r.source,'free-default');
});

test('missing paid capability is NOT_VERIFIED, never failed',()=>{
  const r=capabilityResult({capabilities:new Set()},'lan.drift.semantic');
  assert.equal(r.available,false);
  assert.equal(r.status,'NOT_VERIFIED');
});
