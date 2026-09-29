# Living Architecture Nodes — Product Tiers

Living Architecture Nodes uses a **Free / Pro / Team** commercial model.

The Marketplace extension itself remains Free to install. Paid capabilities are activated only through a valid signed entitlement after production monetization is enabled.

## Free

Free is useful on its own and does not require an account for the core local workflow.

Current Free direction includes:

- basic workspace scan;
- required-artifact checks;
- missing/orphan node detection;
- basic source/node drift;
- node draft generation;
- local architecture-memory views;
- local handoff export;
- explicit verification states and limitations.

## Pro

Pro is the individual paid tier.

Current Pro direction includes Free plus deeper capabilities such as:

- semantic architectural drift;
- change-impact / blast-radius analysis;
- regression-memory correlation;
- historical architecture comparison;
- signed verification receipts;
- richer local evidence and remediation guidance.

## Team

Team is the organization paid tier.

Current Team direction includes Pro plus:

- shared architecture-memory policy;
- organization policy controls;
- cross-repository architecture relationships;
- organization-level CI policy;
- centralized entitlement administration;
- administrative reporting.

## Current activation state

```text
Free  ACTIVE
Pro   DEFINED / NOT YET PRODUCTION-ACTIVE
Team  DEFINED / NOT YET PRODUCTION-ACTIVE
```

Exact paid prices are not published or active yet.

Paid production activation requires approved pricing, Stripe billing configuration, entitlement verification, customer terms, cancellation/downgrade behavior, privacy/security alignment, and final release verification.

## Verification semantics

Tier availability controls whether a check can execute. It does not control truth.

If a deeper paid check does not execute because its capability is unavailable, the result is:

```text
NOT VERIFIED
```

It is not automatically FAILED or UNSAFE.

## Future Enterprise

Enterprise/offline/self-hosted licensing is a future direction only and is not currently an issuable tier.
