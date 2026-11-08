# Testing

| Check | Command | Runs in |
|---|---|---|
| The manifest has no problems; the scripts' rules (licenses, revisions, ids, asset names, hashes) | `npm test` | CI (`ci.yml`), unless only Markdown or `docs/` changed |
| Every unreleased model's files download and match their pins | `npm run release:dry-run` | `release.yml`, as a dry run on pull requests that touch the release, for real on `main` |
| Every released model's assets still match the manifest | `node scripts/release.ts` | `release.yml`, on `main` and on demand |

Not automated: whether a model's license allows redistribution is read by a
person before it's added; the check only accepts licenses with a text in
`licenses/`.
