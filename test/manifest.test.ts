import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  assetName,
  LICENSES,
  loadManifest,
  problems,
  sourceUrl,
  tagOf,
  type Manifest,
  type Model,
} from '../scripts/manifest.ts';

const valid: Model = {
  id: 'some-model-int8',
  name: 'Some model',
  license: 'Apache-2.0',
  authors: 'Someone',
  source: { repository: 'org/some-model', revision: 'a'.repeat(40) },
  files: [
    { path: 'onnx/model.onnx', sha256: 'b'.repeat(64), size: 10 },
    { path: 'tokenizer.json', sha256: 'c'.repeat(64), size: 2 },
  ],
};
const manifestOf = (...models: Model[]): Manifest => ({ models });

describe('models.json', () => {
  it('has no problems', () => {
    assert.deepEqual(problems(loadManifest()), []);
  });

  it('has a license text for every license it allows', () => {
    for (const license of LICENSES) {
      assert.ok(readFileSync(new URL(`../licenses/${license}.txt`, import.meta.url), 'utf8').length > 0);
    }
  });
});

describe('problems', () => {
  it('finds nothing wrong with a valid model', () => {
    assert.deepEqual(problems(manifestOf(valid)), []);
  });

  it('refuses a license that may not allow redistribution', () => {
    assert.match(problems(manifestOf({ ...valid, license: 'CC-BY-NC-4.0' })).join(), /redistribution/);
  });

  it('refuses a branch name or short hash as the revision', () => {
    const model = { ...valid, source: { ...valid.source, revision: 'main' } };
    assert.match(problems(manifestOf(model)).join(), /full commit hash/);
  });

  it('refuses an id used twice, and an id that would make an odd tag', () => {
    assert.match(problems(manifestOf(valid, valid)).join(), /used twice/);
    assert.match(problems(manifestOf({ ...valid, id: 'Some_Model' })).join(), /lower-case/);
  });

  it('refuses two files that would share a release asset name, the license included', () => {
    const files = [...valid.files, { path: 'other/model.onnx', sha256: 'd'.repeat(64), size: 1 }];
    assert.match(problems(manifestOf({ ...valid, files })).join(), /released as model\.onnx/);
    const license = [{ path: 'LICENSE.txt', sha256: 'd'.repeat(64), size: 1 }];
    assert.match(problems(manifestOf({ ...valid, files: license })).join(), /released as LICENSE\.txt/);
  });

  it('refuses a file without a SHA-256 or a size', () => {
    const files = [{ path: 'model.onnx', sha256: 'abc', size: 0 }];
    const found = problems(manifestOf({ ...valid, files })).join('\n');
    assert.match(found, /needs a SHA-256/);
    assert.match(found, /needs a size/);
  });
});

describe('names and addresses', () => {
  it('tags a release by the model id and the short revision', () => {
    assert.equal(tagOf(valid), 'some-model-int8-aaaaaaa');
  });

  it('releases a file under its file name, fetched from its pinned revision', () => {
    assert.equal(assetName(valid.files[0]!), 'model.onnx');
    assert.equal(
      sourceUrl(valid, valid.files[0]!),
      `https://huggingface.co/org/some-model/resolve/${'a'.repeat(40)}/onnx/model.onnx`,
    );
  });
});
