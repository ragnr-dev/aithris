// The model manifest (models.json): every model this repository releases, pinned
// to a source revision and every file to its size and SHA-256 (docs/adr/0001).

import { readFileSync } from 'node:fs';

export interface ModelFile {
  /** The file's path in the source repository. */
  path: string;
  sha256: string;
  size: number;
}

export interface Model {
  /** Lower-case words and digits joined by hyphens; part of the release tag. */
  id: string;
  name: string;
  /** An SPDX id with a text in `licenses/`. */
  license: string;
  authors: string;
  source: { repository: string; revision: string };
  files: ModelFile[];
}

export interface Manifest {
  models: Model[];
}

/** Licenses that allow redistributing the files, with their texts in `licenses/`. */
export const LICENSES: readonly string[] = ['Apache-2.0'];

export const loadManifest = (path = new URL('../models.json', import.meta.url)): Manifest =>
  JSON.parse(readFileSync(path, 'utf8')) as Manifest;

/** A model's release tag: its id and the first seven characters of its revision. */
export const tagOf = (model: Model): string => `${model.id}-${model.source.revision.slice(0, 7)}`;

/** A file's name as a release asset: its file name. */
export const assetName = (file: ModelFile): string =>
  file.path.slice(file.path.lastIndexOf('/') + 1);

/** The license text attached to every release beside the model's files. */
export const LICENSE_ASSET = 'LICENSE.txt';

/** Where a file is fetched from: its source repository on Hugging Face, at the pinned revision. */
export const sourceUrl = (model: Model, file: ModelFile): string =>
  `https://huggingface.co/${model.source.repository}/resolve/${model.source.revision}/${file.path}`;

/** What's wrong with a manifest, one line per problem; empty when nothing is. */
export function problems(manifest: Manifest): string[] {
  const found: string[] = [];
  const ids = new Set<string>();
  for (const model of manifest.models) {
    const at = model.id || '(no id)';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(model.id)) found.push(`${at}: id must be lower-case words joined by hyphens`);
    if (ids.has(model.id)) found.push(`${at}: id used twice`);
    ids.add(model.id);
    if (!LICENSES.includes(model.license)) found.push(`${at}: license ${model.license} isn't one that allows redistribution here`);
    if (!/^[0-9a-f]{40}$/.test(model.source.revision)) found.push(`${at}: revision must be a full commit hash`);
    if (!model.name || !model.authors) found.push(`${at}: name and authors are required`);
    if (model.files.length === 0) found.push(`${at}: no files`);
    const names = new Set<string>([LICENSE_ASSET]);
    for (const file of model.files) {
      if (names.has(assetName(file))) found.push(`${at}: two files would be released as ${assetName(file)}`);
      names.add(assetName(file));
      if (!/^[0-9a-f]{64}$/.test(file.sha256)) found.push(`${at}: ${file.path} needs a SHA-256`);
      if (!Number.isInteger(file.size) || file.size <= 0) found.push(`${at}: ${file.path} needs a size`);
    }
  }
  return found;
}
