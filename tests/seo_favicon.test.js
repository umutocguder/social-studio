/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

test('Favicon and SEO assets existence in social-studio', () => {
  assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'favicon.ico')), true, 'favicon.ico must exist');
  assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'favicon.svg')), true, 'favicon.svg must exist');
  assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'og-image.png')), true, 'og-image.png must exist');
  assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'robots.txt')), true, 'robots.txt must exist');
  assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'sitemap.xml')), true, 'sitemap.xml must exist');
});

test('index.html SEO metadata and favicon tags verification', () => {
  const indexPath = path.join(ROOT_DIR, 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  assert.strictEqual(html.includes('rel="icon" type="image/svg+xml" href="/favicon.svg"'), true, 'SVG favicon link must exist');
  assert.strictEqual(html.includes('rel="icon" type="image/x-icon" href="/favicon.ico"'), true, 'ICO favicon link must exist');
  assert.strictEqual(html.includes('rel="apple-touch-icon" href="/favicon.svg"'), true, 'apple-touch-icon link must exist');
  assert.strictEqual(html.includes('property="og:title"'), true, 'og:title must exist');
  assert.strictEqual(html.includes('property="og:image"'), true, 'og:image must exist');
  assert.strictEqual(html.includes('name="twitter:card"'), true, 'twitter:card must exist');
  assert.strictEqual(html.includes('application/ld+json'), true, 'Schema.org JSON-LD must exist');
  assert.strictEqual(html.includes('rel="canonical"'), true, 'canonical link must exist');
});
