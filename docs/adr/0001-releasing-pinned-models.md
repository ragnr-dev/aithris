# 0001: Releasing pinned models

Status: accepted (project owner direction, 2026-11-08)

## Context

Apps download a model's files from here and check each against a size and
SHA-256 they pinned. A file that changes after an app pinned it must make that
app refuse it, and must never happen by accident.

## Decision

- **`models.json` pins everything:** each model's source repository and full
  commit revision, its license, and every file's path, size and SHA-256.
- **A release per model,** tagged `<id>-<first seven characters of the
  revision>`. Its assets are the files under their file names, unchanged, and
  `LICENSE.txt`, the license text from `licenses/`. File names must be distinct
  within a model.
- **The release workflow** runs on pushes to `main` that touch the manifest,
  the licenses, the scripts or the workflow, and on demand. For each model with
  no release, it downloads every file from the source at the pinned revision,
  refuses the run if any size or hash differs, and publishes the release. For
  each model already released, it only checks that the release's assets still
  have the manifest's sizes and the license.
- **On a pull request,** the same workflow downloads and checks as a dry run,
  with a read-only token.
- **Never changed once published:** a released model's entry isn't edited, and
  its tag isn't moved or replaced. A new revision or file is a new entry with a
  new tag.
- **Only licenses that allow redistribution,** each with its text in
  `licenses/` (Apache-2.0 for now). The release notes name the authors, the
  source and every file's hash.

## Consequences

- Turning on GitHub's immutable releases for this repository would make "never
  replaced" a platform rule, not just a convention.
- Adding a model is a pull request with no code.

## Alternatives Considered

- **Git LFS in the repository:** versioned, but LFS bandwidth is metered and an
  app would download through LFS URLs, which aren't stable addresses.
- **Re-uploading a release's files on every run:** simpler, but it could replace
  a file an app pinned.
