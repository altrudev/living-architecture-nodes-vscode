# Node: PRODUCT-TIERS.md

## Purpose

Defines the public Living Architecture Nodes commercial tier contract without exposing private commercial implementation or unapproved pricing.

## Contracts

- canonical tiers are Free / Pro / Team;
- Free is active and account-optional;
- Pro is the individual paid tier;
- Team is the organization paid tier;
- paid production capabilities and paid prices remain disabled/unpublished until monetization gates pass;
- unavailable paid checks resolve to NOT VERIFIED;
- Enterprise/offline/self-hosted licensing remains future-only and is not currently issuable.

## Boundary

This public document may describe tier purpose and current activation state. It must not expose private commercial source, internal Stripe configuration, signing material, private entitlement-service endpoints, or unapproved prices.

## Regression triggers

Tier names diverge from the product contract, paid activation is claimed prematurely, Enterprise is presented as live, or private commercial details appear.
