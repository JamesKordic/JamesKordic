#!/usr/bin/env node
/**
 * localize-assets — pull every Framer-CDN asset into public/media/ and
 * repoint the source at the local copies.
 *
 * WHY THIS EXISTS
 * The site currently hotlinks ~130 images and several videos from
 * framerusercontent.com, left over from the Framer build. That CDN serves
 * assets belonging to a Framer project. If that project is deleted, moved,
 * or its plan lapses, the portfolio goes blank — every case study at once,
 * with no warning and no way to fix it quickly. Self-hosting removes that
 * dependency and puts the assets in git next to everything else.
 *
 * USAGE
 *   node scripts/localize-assets.mjs --dry    # list what would be fetched
 *   node scripts/localize-assets.mjs          # download, then rewrite source
 *
 * The download step is idempotent: files already in public/media/ are
 * skipped, so a failed run can just be re-run. Source rewriting only
 * happens once every referenced asset is present on disk.
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'media');
const SOURCES = ['lib/projects.ts', 'lib/portfolio.ts'];
const DRY = process.argv.includes('--dry');

const HELPERS = { img: 'png', jpg: 'jpg', gif: 'gif' };

/** Every asset referenced anywhere in SOURCES, keyed by output filename. */
async function collect() {
  const assets = new Map();
  const add = (id, ext, kind, width) => {
    const name = `${id}.${ext}`;
    const prev = assets.get(name);
    // Ask the CDN for the largest width any call site wants, so one local
    // file can serve every reference to it.
    if (!prev || (width ?? 0) > (prev.width ?? 0)) {
      assets.set(name, { id, ext, kind, width: width ?? prev?.width });
    }
  };

  for (const rel of SOURCES) {
    const src = await readFile(join(ROOT, rel), 'utf8');

    for (const [fn, ext] of Object.entries(HELPERS)) {
      const re = new RegExp(`\\b${fn}\\('([A-Za-z0-9_-]+)'(?:\\s*,\\s*(\\d+))?\\)`, 'g');
      for (const m of src.matchAll(re)) add(m[1], ext, 'image', m[2] ? Number(m[2]) : undefined);
    }
    for (const m of src.matchAll(/\bvid\('([A-Za-z0-9_-]+)'\)/g)) add(m[1], 'mp4', 'asset');

    // Literal URLs written out in full rather than via a helper.
    for (const m of src.matchAll(
      /https:\/\/framerusercontent\.com\/(images|assets)\/([A-Za-z0-9_-]+)\.(png|jpg|jpeg|gif|mp4)(?:\?width=(\d+))?/g
    )) {
      add(m[2], m[3], m[1] === 'assets' ? 'asset' : 'image', m[4] ? Number(m[4]) : undefined);
    }
  }
  return assets;
}

const exists = (p) => stat(p).then(() => true, () => false);

async function download(name, { id, ext, kind, width }) {
  const dest = join(OUT_DIR, name);
  if (await exists(dest)) return 'skip';

  const base = kind === 'asset'
    ? `https://framerusercontent.com/assets/${id}.${ext}`
    : `https://framerusercontent.com/images/${id}.${ext}`;
  const url = width && kind === 'image' ? `${base}?width=${width}` : base;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return 'ok';
}

/** Point the helpers and any literal URLs at public/media/. */
async function rewriteSources() {
  for (const rel of SOURCES) {
    const path = join(ROOT, rel);
    let src = await readFile(path, 'utf8');
    const before = src;

    src = src.replace(
      /const FRAMER = 'https:\/\/framerusercontent\.com';/,
      "const MEDIA = '/media';"
    );
    src = src
      .replace(/const img = \(id: string, w = \d+\) => `\$\{FRAMER\}\/images\/\$\{id\}\.png\?width=\$\{w\}`;/,
        'const img = (id: string, _w = 1200) => `${MEDIA}/${id}.png`;')
      .replace(/const jpg = \(id: string, w = \d+\) => `\$\{FRAMER\}\/images\/\$\{id\}\.jpg\?width=\$\{w\}`;/,
        'const jpg = (id: string, _w = 1200) => `${MEDIA}/${id}.jpg`;')
      .replace(/const gif = \(id: string, w = \d+\) => `\$\{FRAMER\}\/images\/\$\{id\}\.gif\?width=\$\{w\}`;/,
        'const gif = (id: string, _w = 540) => `${MEDIA}/${id}.gif`;')
      .replace(/const vid = \(id: string\) => `\$\{FRAMER\}\/assets\/\$\{id\}\.mp4`;/,
        'const vid = (id: string) => `${MEDIA}/${id}.mp4`;');

    src = src.replace(
      /https:\/\/framerusercontent\.com\/(?:images|assets)\/([A-Za-z0-9_-]+)\.(png|jpg|jpeg|gif|mp4)(?:\?width=\d+)?/g,
      '/media/$1.$2'
    );
    src = src.replace(
      /^\/\/ Assets are served from Framer's CDN; swap to local paths if you self-host\.$/m,
      "// Assets are self-hosted from public/media/ (see scripts/localize-assets.mjs)."
    );

    if (src !== before) {
      await writeFile(path, src);
      console.log(`rewrote ${rel}`);
    }
  }
}

const assets = await collect();
console.log(`${assets.size} unique Framer assets referenced`);

if (DRY) {
  for (const [name, a] of assets) console.log(`  ${name}${a.width ? `  @${a.width}w` : ''}`);
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });

let ok = 0, skipped = 0;
const failed = [];
for (const [name, a] of assets) {
  try {
    const r = await download(name, a);
    r === 'ok' ? ok++ : skipped++;
    process.stdout.write(r === 'ok' ? '.' : '-');
  } catch (err) {
    failed.push(`${name}: ${err.message}`);
    process.stdout.write('x');
  }
}
console.log(`\ndownloaded ${ok}, already present ${skipped}, failed ${failed.length}`);

if (failed.length) {
  console.error('\nNot rewriting source — these assets are still missing:');
  for (const f of failed) console.error('  ' + f);
  console.error('\nRe-run to retry. The CDN rate-limits, so a second pass usually clears it.');
  process.exit(1);
}

await rewriteSources();
console.log('\nDone. Run `npm run build` and check a case study before committing.');
