# Status

## Completed

- **The manifest, the release script and the workflows** (ADR-0001), with one
  model: `paraphrase-multilingual-MiniLM-L12-v2` (int8 ONNX, Apache-2.0). A local
  dry run downloaded and checked all three files (2026-11-08).
- **The first release,** `paraphrase-multilingual-minilm-l12-v2-int8-2c4055b`,
  published by the release workflow on merge (2026-11-08): the three files at
  their pinned sizes, and `LICENSE.txt`.
- **Immutable releases** turned on, so no tag or asset can be replaced
  (ADR-0001), and **MPL-2.0** for this repository's own files; the model files
  keep their own licenses (2026-11-08).

## In progress

- **`Qwen2.5-1.5B-Instruct` (MLC q4f16_1)** for WebGPU in the browser: the
  weights, config and tokenizer at revision `9bd564b`, 34 files, about 876 MB.
  Released on merge.

## Outstanding

### Needs a human decision

- None.

### Agent-actionable

- None.
