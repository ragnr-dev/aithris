# aithris

*Aithris* (Irish and Scottish Gaelic: imitation, recitation; roughly
**AH-hrish**) holds pinned copies of openly licensed machine-learning models,
released for apps to download at run time.

Each model is pinned in [`models.json`](models.json) to a source revision, and
every file to its size and SHA-256. A workflow downloads the files from the
source, checks them, and publishes them unchanged, with the model's license, as
a GitHub release. A release's tag names the model and its revision, and is never
moved or replaced.

| Model | License | Release |
|---|---|---|
| `paraphrase-multilingual-MiniLM-L12-v2`, int8 ONNX: sentence embeddings, about 50 languages | Apache-2.0 | `paraphrase-multilingual-minilm-l12-v2-int8-2c4055b` |
| `Qwen2.5-1.5B-Instruct`, MLC q4f16_1 build: a small instruct model for WebGPU in the browser (WebLLM), about 876 MB | Apache-2.0 | `qwen2-5-1-5b-instruct-q4f16-1-mlc-9bd564b` (on merge) |
| The same model, MLC q4f32_1 build, for GPUs without 16-bit float shaders, about 876 MB | Apache-2.0 | `qwen2-5-1-5b-instruct-q4f32-1-mlc-a822ee4` (on merge) |

## Using a release

Download from
`https://github.com/ragnr-dev/aithris/releases/download/<tag>/<file name>`, and
check every file's size and SHA-256 against your own pinned copy of the values
before using it. Pin them in your app: don't read them from this repository at
run time, so a changed file fails closed.

## Adding a model

1. Add it to `models.json`: an id, the source repository and full commit
   revision, and each file's path, size and SHA-256. Only licenses with a text
   in `licenses/` are accepted, and each must allow redistribution.
2. Open a pull request: the release workflow downloads and checks the files as
   a dry run.
3. Merging releases it.

A released model is never edited. A new revision or a different file is a new
entry, with a new tag.

```sh
npm test                    # the manifest's checks and the scripts' tests
npm run release:dry-run     # download and check every unreleased model (needs gh)
```

## License

This repository's own files (the scripts, workflows and docs) are under the
[Mozilla Public License 2.0](LICENSE). The model files belong to their authors,
under their own licenses, which are in `licenses/` and attached to each release;
this repository redistributes them unchanged.
