// Releases every model in models.json that hasn't a release yet (docs/adr/0001):
// downloads each file from its source at the pinned revision, refuses any whose
// size or SHA-256 differs, and publishes the files and the license text under the
// model's tag. A model already released is never touched again: its release's
// assets must still match the manifest, or the run fails.
//   node scripts/release.ts             check every release, publish the missing ones
//   node scripts/release.ts --dry-run   the same, downloading and checking, publishing nothing
// Needs `gh` with GH_TOKEN; publishing needs a token that can write contents.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  assetName,
  LICENSE_ASSET,
  loadManifest,
  problems,
  sourceUrl,
  tagOf,
  type Model,
} from './manifest.ts';

const dryRun = process.argv.includes('--dry-run');
const out = new URL('../out/', import.meta.url).pathname;

const repo = process.env['GITHUB_REPOSITORY'] ?? 'ragnr-dev/aithris';
const gh = (...args: string[]) =>
  execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

/** The release's assets by name and size, or undefined when the tag has no release. */
function releaseAssets(tag: string): Map<string, number> | undefined {
  let json: string;
  try {
    json = gh('api', `repos/${repo}/releases/tags/${tag}`);
  } catch (error) {
    if (/HTTP 404/.test(String((error as { stderr?: unknown }).stderr))) return undefined;
    throw error;
  }
  const { assets } = JSON.parse(json) as { assets: { name: string; size: number }[] };
  return new Map(assets.map((asset) => [asset.name, asset.size]));
}

function checkReleased(model: Model, assets: Map<string, number>): string[] {
  const found: string[] = [];
  for (const file of model.files) {
    const size = assets.get(assetName(file));
    if (size !== file.size) {
      found.push(`${tagOf(model)}: ${assetName(file)} is ${size ?? 'missing'} bytes, the manifest says ${file.size}`);
    }
  }
  if (!assets.has(LICENSE_ASSET)) found.push(`${tagOf(model)}: ${LICENSE_ASSET} is missing`);
  return found;
}

async function download(model: Model): Promise<string[]> {
  const dir = join(out, tagOf(model));
  mkdirSync(dir, { recursive: true });
  const paths: string[] = [];
  for (const file of model.files) {
    const response = await fetch(sourceUrl(model, file));
    if (!response.ok) throw new Error(`${model.id}/${file.path}: HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    if (bytes.length !== file.size || sha256 !== file.sha256) {
      throw new Error(`${model.id}/${file.path}: not the pinned file (${bytes.length} bytes, ${sha256})`);
    }
    const path = join(dir, assetName(file));
    writeFileSync(path, bytes);
    paths.push(path);
    console.log(`checked  ${model.id}/${file.path} (${bytes.length} bytes)`);
  }
  const license = join(dir, LICENSE_ASSET);
  writeFileSync(license, readLicense(model.license));
  paths.push(license);
  return paths;
}

const readLicense = (spdx: string) => readFileSync(new URL(`../licenses/${spdx}.txt`, import.meta.url));

const notes = (model: Model) =>
  [
    `${model.name}, ${model.license}, by ${model.authors}.`,
    '',
    `From [${model.source.repository}](https://huggingface.co/${model.source.repository}) at revision \`${model.source.revision}\`, unchanged.`,
    '',
    '| File | Size | SHA-256 |',
    '|---|---|---|',
    ...model.files.map((file) => `| \`${assetName(file)}\` (\`${file.path}\`) | ${file.size} | \`${file.sha256}\` |`),
    '',
    `${LICENSE_ASSET} is the model's license. Check every file's size and SHA-256 before using it.`,
  ].join('\n');

const manifest = loadManifest();
const invalid = problems(manifest);
if (invalid.length > 0) {
  console.error(invalid.join('\n'));
  process.exit(1);
}

const failures: string[] = [];
for (const model of manifest.models) {
  const tag = tagOf(model);
  const assets = releaseAssets(tag);
  if (assets) {
    const found = checkReleased(model, assets);
    failures.push(...found);
    if (found.length === 0) console.log(`released ${tag}`);
    continue;
  }
  const files = await download(model);
  if (dryRun) {
    console.log(`would release ${tag}`);
    continue;
  }
  gh('release', 'create', tag, '--repo', repo, '--title', tag, '--notes', notes(model), ...files);
  console.log(`released ${tag} now`);
}
if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
