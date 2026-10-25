/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeInput,
  normalizePhone,
  DEFAULT_BRANDS,
  BrandManager
} from '../src/brandManager.js';

test('sanitizeInput strips tags and script injections', () => {
  const input = '<script>alert(1)</script>Maison Butik <b>2026</b>';
  assert.equal(sanitizeInput(input), 'Maison Butik 2026');
});

test('normalizePhone formats Turkish phone numbers correctly', () => {
  assert.equal(normalizePhone('0535 403 13 63'), '905354031363');
  assert.equal(normalizePhone('+90 535 403 13 63'), '905354031363');
  assert.equal(normalizePhone('5354031363'), '905354031363');
});

test('DEFAULT_BRANDS includes built-in brand ecosystem', () => {
  assert.ok(DEFAULT_BRANDS.length >= 5);
  const nolte = DEFAULT_BRANDS.find(b => b.id === 'nolte-mimarlik');
  assert.ok(nolte);
  assert.equal(nolte.handle, '@noltemimarlik');
  assert.ok(nolte.defaultHashtags.length > 0);

  const nmg = DEFAULT_BRANDS.find(b => b.id === 'nmg-sondaj');
  assert.ok(nmg, 'NMG Sondaj brand must exist in DEFAULT_BRANDS');
  assert.equal(nmg.handle, '@nmgsondajj');
  assert.equal(nmg.website, 'https://nmg-sondaj.vercel.app');
});

test('BrandManager adds, validates and retrieves new brands', () => {
  const manager = new BrandManager();
  const newBrand = manager.addBrand({
    name: 'Atelier Coffee',
    sector: 'Kafe & Gurme Kahve',
    handle: '@ateliercoffee',
    clientPhone: '0535 403 13 63'
  });

  assert.equal(newBrand.id, 'atelier-coffee');
  assert.equal(newBrand.name, 'Atelier Coffee');
  assert.equal(manager.getBrandById('atelier-coffee').sector, 'Kafe & Gurme Kahve');
  assert.throws(() => manager.addBrand({ name: 'Atelier Coffee' }), /zaten mevcut/);
});

test('BrandManager updates existing brand parameters', () => {
  const manager = new BrandManager();
  const updated = manager.updateBrand('butik-platform', {
    name: 'Maison Luxe Butik',
    handle: '@maisonluxebutik'
  });
  assert.equal(updated.name, 'Maison Luxe Butik');
  assert.equal(updated.handle, '@maisonluxebutik');
});
