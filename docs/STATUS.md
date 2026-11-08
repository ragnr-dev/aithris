# Status

## Completed

- **The manifest, the release script and the workflows** (ADR-0001), with one
  model: `paraphrase-multilingual-MiniLM-L12-v2` (int8 ONNX, Apache-2.0). A local
  dry run downloaded and checked all three files (2026-11-08).

## In progress

- **The first release:** published by the release workflow when this merges.

## Outstanding

### Needs a human decision

1. **Turn on immutable releases** for this repository (Settings, General,
   Releases), so no tag or asset can be replaced (ADR-0001).
2. **A license for this repository's own scripts.** The model files keep their
   own licenses.

### Agent-actionable

- None.
