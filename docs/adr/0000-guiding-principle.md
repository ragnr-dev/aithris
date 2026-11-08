# 0000: Guiding principle and project classification

Status: accepted (project owner direction, 2026-11-08)

## Context

aithris redistributes openly licensed model files so apps can download them at
run time from a host that doesn't need a token (ai-insights ADR-0014). Its value
is that what it serves never changes under an app: an app pins sizes and hashes,
and a release must keep matching them.

It's public, because apps download from it without credentials. The account's
shared tooling (dev-utils' reusable workflows and presets) is private, and
GitHub doesn't let a public repository call a private repository's reusable
workflows, so it can't use them.

## Decision

- **Consistency-focused** (`ai-insights` ADR-0009): the account's conventions
  for commits, branches, CI and writing, with no vendors beyond GitHub Releases
  and the models' sources.
- **No dependencies.** Plain Node, run directly, with `node:test`. The scripts
  are small enough that the presets wouldn't pay for a token and package access
  in a public repository.
- **Stability before features.** A release is never changed once it's published.

## Consequences

- No ESLint, Prettier or ADR index check: the repository has two scripts and
  their tests. If it grows, revisit this with a public copy of the presets.
- The workflow contract check (dev-utils' `verify-workflows`) doesn't run here.

## Alternatives Considered

- **dev-utils' workflows and presets:** not callable from a public repository.
- **Performance-focused:** there's no vendor or infrastructure choice to govern.
