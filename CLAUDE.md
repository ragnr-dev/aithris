# aithris

Pinned copies of openly licensed models, released as GitHub releases for apps
to download and hash-check. Public. It knows no app by name: each app pins the
files it uses in its own manifest. The cross-project decision is
`ragnr-dev/ai-insights` ADR-0014; this repository's own decisions are in
[`docs/adr/`](docs/adr/README.md).

## Read these, in this order

1. **[`README.md`](README.md):** what's released and how to add a model.
2. **[`docs/adr/`](docs/adr/README.md):** why. Read ADR-0001 before changing
   `models.json`, the release script or the release workflow.
3. **[`docs/STATUS.md`](docs/STATUS.md):** update it in the same commit as any
   change that completes, starts, or newly surfaces work.

## Project classification

**Consistency-focused**, per `ragnr-dev/ai-insights` ADR-0009. The reasoning is
in [ADR-0000](docs/adr/0000-guiding-principle.md).

## Writing conventions

American English, with designated exceptions that keep the British
form: `towards` (not "toward"), `grey` (not "gray"), and `cancelled` /
`cancelling` (not "canceled" / "canceling"). The source of truth is
`agent-conventions.md` in the **`ragnr-dev/ai-insights`** repo; it also
says what the rule doesn't cover. Don't rewrite existing text just to
apply it unless asked.

## Git commits

Commit incrementally and often: one small, well-scoped, tested change per
commit, and every commit passes checks. Keep messages short and
high-level, and let the code explain itself. No Claude or tool
attribution anywhere in commit history: no `Co-Authored-By` trailers, no
model, version, or session info. Don't squash history away. The source of
truth is `agent-conventions.md` in the **`ragnr-dev/ai-insights`** repo.

## Branch hygiene

After a pull request merges, sync the default branch and prune local branches whose
remote is gone and whose changes are all on it: `node <workstation-setup checkout>/src/cli.ts
prune --dir .` (`--dry-run` to preview). Don't hand-delete branches or use `git branch
--merged`, which misses rebase merges. The source of truth is `agent-conventions.md` in the
**`ragnr-dev/ai-insights`** repo.

## CI

CI runs only what a change can affect. No check here is required, so `ci.yml` skips
Markdown and `docs/` with a workflow-level `paths-ignore`, since no check reads them;
before a check becomes required, move the skip into a job-level `if:`, so a skipped
check still reports. `release.yml` runs on its own paths. Being public, this
repository can't use dev-utils' private workflows or packages (ADR-0000).
`docs/testing.md` maps every check. The source of truth is `agent-conventions.md` in
the **`ragnr-dev/ai-insights`** repo.

## Commands

No dependencies: Node 22.18+ runs the TypeScript directly.

```sh
npm test
npm run release:dry-run     # needs gh; NODE_USE_ENV_PROXY=1 behind a proxy
```

## Invariants: don't break these

- **Release tags are never moved or replaced,** and a released model's entry in
  `models.json` is never edited. A new revision or file is a new entry and tag.
- **Files are released unchanged,** byte for byte as the source revision has
  them, each checked against its pinned size and SHA-256 before it's published.
- **Only redistributable licenses,** each with its text in `licenses/`, attached
  to every release.
- **No app domain.** No app names or app-specific choices; apps pin what they
  use in their own manifests.
- **Erasable TypeScript only** (no enums or parameter properties) and `.ts`
  import specifiers, so Node runs the source directly.
