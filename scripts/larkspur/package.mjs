import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';


const root = dirname(fileURLToPath(import.meta.url));
if (!process.argv[2] || !process.argv[3]) throw new Error('Usage: node package.mjs <SQL-Study checkout> <empty upload folder>');
const source = resolve(process.argv[2]);
const { CONTENT_SECURITY_POLICY } = await import(pathToFileURL(join(source, 'src/security/csp.ts')).href);
const destination = resolve(process.argv[3]);
try { if ((await readdir(destination)).length) throw new Error('Upload folder must be empty'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(destination, { recursive: true });
await cp(join(source, 'dist'), destination, { recursive: true });
const headers = `/*
  Content-Security-Policy: ${CONTENT_SECURITY_POLICY}
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cache-Control: no-cache

/assets/*
  ! Cache-Control
  Cache-Control: public, max-age=31536000, immutable

/assets/libpg-query.wasm
  ! Cache-Control
  Cache-Control: no-cache
  Content-Type: application/wasm

/manifest.webmanifest
  Content-Type: application/manifest+json

/sw.js
  Cloudflare-CDN-Cache-Control: no-store
`;
await writeFile(join(destination, '_headers'), headers);
const binaries = {};
for (const file of await readdir(join(destination, 'assets'))) {
  if (!/\.(wasm|data)$/.test(file)) continue;
  binaries[`/assets/${file}`] = {
    type: file.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream',
    sizes: {
      identity: (await stat(join(destination, 'assets', file))).size,
      br: (await stat(join(destination, 'assets', `${file}.br`))).size,
      gzip: (await stat(join(destination, 'assets', `${file}.gz`))).size,
    },
    cache: file === 'libpg-query.wasm' ? 'no-cache' : 'public, max-age=31536000, immutable',
  };
}
const worker = (await readFile(join(root, 'binary-worker.mjs'), 'utf8'))
  .replace('__MANIFEST__', JSON.stringify(binaries))
  .replace('__CSP__', JSON.stringify(CONTENT_SECURITY_POLICY));
await writeFile(join(destination, '_worker.js'), worker);
await writeFile(join(destination, '_routes.json'), JSON.stringify({ version: 1, include: Object.keys(binaries), exclude: [] }));
let files = 0;
let largest = 0;
async function inspect(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) await inspect(path);
    else { files++; largest = Math.max(largest, (await stat(path)).size); }
  }
}
await inspect(destination);
if (files > 1000 || largest > 25 * 1024 * 1024) throw new Error('Pages dashboard upload limits exceeded');
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
await writeFile(join(dirname(destination), 'larkspur-provenance.json'), JSON.stringify({ source: 'https://github.com/edwardtorres/SQL-Study', commit: sha, hostname: 'larkspur.edwardtorres.dev', files, largest, securityPolicy: CONTENT_SECURITY_POLICY }, null, 2));
console.log(JSON.stringify({ sourceCommit: sha, files, largest, destination }));
