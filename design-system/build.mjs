#!/usr/bin/env node
/**
 * Inlines tokens.css into every preview between the tokens markers, so each
 * card renders standalone in the Claude Design pane with no external CSS
 * dependency — while tokens.css stays the single source of truth.
 *
 * Usage: node design-system/build.mjs [--check]
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const START = '/* tokens:start */';
const END = '/* tokens:end */';
const checkOnly = process.argv.includes('--check');

const tokens = (await readFile(join(DIR, 'tokens.css'), 'utf8')).trim();
const files = (await readdir(DIR)).filter((f) => f.endsWith('.html')).sort();

let changed = 0;
let stale = 0;

for (const file of files) {
  const path = join(DIR, file);
  const src = await readFile(path, 'utf8');

  const a = src.indexOf(START);
  const b = src.indexOf(END);
  if (a === -1 || b === -1) {
    console.error(`  !! ${file} — missing tokens markers`);
    process.exitCode = 1;
    continue;
  }

  const next = `${src.slice(0, a + START.length)}\n${tokens}\n${src.slice(b)}`;
  if (next === src) continue;

  stale++;
  if (checkOnly) {
    console.error(`  !! ${file} — tokens out of date`);
    process.exitCode = 1;
  } else {
    await writeFile(path, next);
    changed++;
    console.log(`  updated ${file}`);
  }
}

// Every preview must carry a first-line @dsCard marker or the pane won't index it.
for (const file of files) {
  const first = (await readFile(join(DIR, file), 'utf8')).split('\n')[0];
  if (!/^<!--\s*@dsCard\s+group="/.test(first)) {
    console.error(`  !! ${file} — first line is not a @dsCard marker`);
    process.exitCode = 1;
  }
}

console.log(
  checkOnly
    ? `checked ${files.length} previews — ${stale} stale`
    : `built ${files.length} previews — ${changed} updated`
);
