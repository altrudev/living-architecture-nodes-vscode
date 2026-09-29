# Node: src/redactor.js

## Purpose

Defensively redacts common credential/token patterns from diagnostic metadata before it can be exported.

## Contracts

The redactor covers GitHub tokens, common API-key/token/password assignments, OpenAI/Stripe-style secret prefixes, Google API keys, AWS access-key identifiers, Slack token forms, bearer credentials, and private-key blocks.

It operates on strings recursively inside the controlled diagnostic report structure.

## Current state

Expanded for the 0.1.2 client-data hardening pass.

## Security boundary

Redaction is defense in depth, not permission to collect source contents. The scanner must continue avoiding source-file content collection.

## Regression triggers

A supported secret shape survives export, JSON and Markdown use different sanitization inputs, or redaction is used to justify broader data collection.
