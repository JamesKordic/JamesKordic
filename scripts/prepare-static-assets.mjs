import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Cloudflare Static Assets permits individual files up to 25 MiB.
// Prepare only the Next export; keep the original portfolio media in public/.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'out');
const maximumBytes = 25 * 1024 * 1024;
const unusedVideos = [
  'projects/adults/adults-on-fx-feature.mp4',
  'projects/the-syndicate/syndicate-video-fKmfNG9XvzI.mp4',
];
const showreel = 'projects/adults/fx-adults-showreel.mp4';

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(filename) : [filename];
  });
}

if (!existsSync(path.join(outputRoot, 'index.html'))) {
  throw new Error('Build the Next static export before preparing its assets.');
}

const activeSourceFiles = ['app', 'components', 'lib']
  .flatMap((directory) => filesIn(path.join(projectRoot, directory)))
  .filter((filename) => /\.(?:[cm]?[jt]sx?|json|css|mdx)$/.test(filename));

for (const asset of unusedVideos) {
  const basename = path.basename(asset);
  const references = activeSourceFiles.filter((filename) => readFileSync(filename, 'utf8').includes(basename));
  if (references.length) {
    throw new Error(`Cannot omit ${asset}; it is referenced in ${references.join(', ')}.`);
  }
  rmSync(path.join(outputRoot, asset), { force: true });
  console.log(`Omitted unused export asset: ${asset}`);
}

const exportedShowreel = path.join(outputRoot, showreel);
if (!existsSync(exportedShowreel)) {
  throw new Error('The static export is missing the Adults showreel. Rebuild before preparing assets.');
}
if (statSync(exportedShowreel).size > maximumBytes) {
  if (!existsSync('/usr/bin/swift')) {
    throw new Error('The exported Adults showreel exceeds 25 MiB. Run this preparation step on macOS with Swift and AVFoundation.');
  }
  const temporaryDirectory = mkdtempSync(path.join(tmpdir(), 'portfolio-video-'));
  const compressedVideo = path.join(temporaryDirectory, 'showreel.mp4');
  try {
    const conversion = spawnSync('/usr/bin/swift', [
      '-module-cache-path', path.join(temporaryDirectory, 'swift-cache'),
      path.join(projectRoot, 'scripts', 'transcode-video.swift'),
      path.join(projectRoot, 'public', showreel),
      compressedVideo,
    ], { stdio: 'inherit' });
    if (conversion.error || conversion.status !== 0) {
      throw new Error('Video conversion failed. macOS video encoding may require execution outside the filesystem sandbox.', { cause: conversion.error });
    }
    const compressedBytes = statSync(compressedVideo).size;
    if (compressedBytes === 0 || compressedBytes > maximumBytes) {
      throw new Error(`Compressed Adults showreel is ${compressedBytes} bytes; it must be between 1 and ${maximumBytes} bytes.`);
    }
    copyFileSync(compressedVideo, exportedShowreel);
    console.log(`Prepared Adults showreel: ${(compressedBytes / 1024 / 1024).toFixed(2)} MiB.`);
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

const oversizedFiles = filesIn(outputRoot)
  .filter((filename) => statSync(filename).size > maximumBytes)
  .map((filename) => path.relative(outputRoot, filename));
if (oversizedFiles.length) {
  throw new Error(`Export contains files above the 25 MiB hosting limit: ${oversizedFiles.join(', ')}`);
}
console.log('Static export assets meet the 25 MiB per-file hosting limit.');
