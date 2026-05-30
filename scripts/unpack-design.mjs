// Unpacks the Claude-bundled standalone HTML (manifest + template + base64+gzip assets)
// into a deploy-ready public/index.html + public/assets/<uuid>.<ext> tree.
//
// Run: node scripts/unpack-design.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'references', 'H_T Hair Lounge _standalone_.html');
const OUT_DIR = join(ROOT, 'public');
const ASSETS_DIR = join(OUT_DIR, 'assets');

const MIME_EXT = {
  'font/woff2': 'woff2',
  'font/woff': 'woff',
  'application/font-woff2': 'woff2',
  'application/font-woff': 'woff',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
  'image/x-icon': 'ico',
  'text/css': 'css',
  'text/javascript': 'js',
  'application/javascript': 'js',
  'application/json': 'json',
  'audio/mpeg': 'mp3',
  'video/mp4': 'mp4',
};

function extOf(mime) {
  const lower = (mime || '').toLowerCase().split(';')[0].trim();
  return MIME_EXT[lower] || 'bin';
}

console.log('Reading', SRC);
const html = readFileSync(SRC, 'utf-8');

function pluckScript(type) {
  const openTag = `<script type="__bundler/${type}">`;
  const closeTag = '</script>';
  const start = html.indexOf(openTag);
  if (start === -1) throw new Error(`script ${type} not found`);
  const contentStart = start + openTag.length;
  const end = html.indexOf(closeTag, contentStart);
  if (end === -1) throw new Error(`script ${type} close not found`);
  return html.slice(contentStart, end).trim();
}

console.log('Parsing manifest...');
const manifest = JSON.parse(pluckScript('manifest'));
const uuids = Object.keys(manifest);
console.log(`Manifest: ${uuids.length} assets`);

console.log('Parsing template...');
let template = JSON.parse(pluckScript('template'));

// Clean output
if (existsSync(ASSETS_DIR)) rmSync(ASSETS_DIR, { recursive: true, force: true });
mkdirSync(ASSETS_DIR, { recursive: true });

const uuidToPath = {};
let totalBytes = 0;

for (const uuid of uuids) {
  const entry = manifest[uuid];
  const ext = extOf(entry.mime);
  const raw = Buffer.from(entry.data, 'base64');
  const bytes = entry.compressed ? gunzipSync(raw) : raw;
  const fileName = `${uuid}.${ext}`;
  writeFileSync(join(ASSETS_DIR, fileName), bytes);
  uuidToPath[uuid] = `assets/${fileName}`;
  totalBytes += bytes.length;
}

console.log(`Wrote ${uuids.length} assets (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);

// Replace every UUID occurrence in template with its local path.
// UUIDs in the template appear as bare strings (e.g. src="84386608-...").
const uuidRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g;
let replaced = 0;
template = template.replace(uuidRegex, (match) => {
  if (uuidToPath[match]) {
    replaced++;
    return uuidToPath[match];
  }
  return match;
});

console.log(`Replaced ${replaced} UUID references in template`);

writeFileSync(join(OUT_DIR, 'index.html'), template);
console.log(`Wrote ${join(OUT_DIR, 'index.html')} (${(template.length / 1024).toFixed(1)} KB)`);

// Quick stats: any UUID still left unreplaced?
const leftover = template.match(uuidRegex);
if (leftover) {
  const unique = [...new Set(leftover)].slice(0, 5);
  console.log(`WARNING: ${leftover.length} UUID strings still in HTML (sample:`, unique, ')');
} else {
  console.log('OK: all UUIDs resolved');
}
