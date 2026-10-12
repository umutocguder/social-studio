/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildClientApprovalWhatsAppUrl,
  exportWorkspaceToJson,
  importWorkspaceFromJson
} from '../src/approvalEngine.js';
import { DEFAULT_BRANDS } from '../src/brandManager.js';

test('buildClientApprovalWhatsAppUrl formats link with post data and target phone', () => {
  const brand = DEFAULT_BRANDS[0];
  const post = {
    title: 'Bodrum Villa Mutfak Çözümleri',
    format: 'reels',
    scheduledDate: '2026-09-15',
    scheduledTime: '19:30',
    coverText: 'Müstakil Villalarda En Çok Tercih Edilen 3 Mutfak Düzeni',
    caption: 'Alman Nolte kalitesiyle hazırlanan yeni projemiz.'
  };

  const url = buildClientApprovalWhatsAppUrl({ brand, post });
  assert.ok(url.startsWith('https://wa.me/905354031363?text='));

  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes('SOSYAL MEDYA İÇERİK ONAYI'));
  assert.ok(decoded.includes('Nolte Mimarlık'));
  assert.ok(decoded.includes('Bodrum Villa Mutfak Çözümleri'));
  assert.ok(decoded.includes('2026-09-15 - 19:30'));
  assert.ok(decoded.includes('ONAY'));
});

test('exportWorkspaceToJson and importWorkspaceFromJson preserve state', () => {
  const brands = [DEFAULT_BRANDS[0]];
  const posts = [{ id: 'p1', brandId: 'nolte-mimarlik', title: 'Test' }];

  const jsonStr = exportWorkspaceToJson(brands, posts);
  assert.ok(typeof jsonStr === 'string');

  const imported = importWorkspaceFromJson(jsonStr);
  assert.equal(imported.success, true);
  assert.equal(imported.brands.length, 1);
  assert.equal(imported.posts.length, 1);
  assert.equal(imported.posts[0].id, 'p1');
});

test('importWorkspaceFromJson handles invalid JSON gracefully', () => {
  const invalid = importWorkspaceFromJson('{ invalid json ');
  assert.equal(invalid.success, false);
  assert.ok(invalid.error);
});
