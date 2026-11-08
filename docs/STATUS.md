# Status

## Completed

- **The manifest, the release script and the workflows** (ADR-0001), with one
  model: `paraphrase-multilingual-MiniLM-L12-v2` (int8 ONNX, Apache-2.0). A local
  dry run downloaded and checked all three files (2026-11-08).
- **The first release,** `paraphrase-multilingual-minilm-l12-v2-int8-2c4055b`,
  published by the release workflow on merge (2026-11-08): the three files at
  their pinned sizes, and `LICENSE.txt`.

## In progress

- None.

## Outstanding

### Needs a human decision

1. **Turn on immutable releases** for this repository (Settings, General,
   Releases), so no tag or asset can be replaced (ADR-0001).
2. **A license for this repository's own scripts.** The model files keep their
   own licenses.

### Agent-actionable

- None.
