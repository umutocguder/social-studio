/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GridSimulator,
  POST_FORMATS,
  POST_STATUSES
} from '../src/gridSimulator.js';

test('Post formats and post statuses definitions', () => {
  assert.ok(POST_FORMATS.some(f => f.id === 'reels'));
  assert.ok(POST_FORMATS.some(f => f.id === 'carousel'));
  assert.ok(POST_STATUSES.some(s => s.id === 'awaiting_approval'));
});

test('GridSimulator manages posts and produces 9-grid preview', () => {
  const simulator = new GridSimulator();
  const brandId = 'nolte-mimarlik';

  for (let i = 1; i <= 12; i++) {
    simulator.addPost({
      brandId,
      title: `Lüks Mutfak Tasarım İpucu #${i}`,
      format: i % 2 === 0 ? 'reels' : 'carousel',
      pillar: i % 3 === 0 ? 'social_proof' : 'value'
    });
  }

  const allPosts = simulator.getPostsByBrand(brandId);
  assert.equal(allPosts.length, 12);

  const nineGrid = simulator.getNineGrid(brandId);
  assert.equal(nineGrid.length, 9);
});

test('GridSimulator updates post status safely', () => {
  const simulator = new GridSimulator();
  const post = simulator.addPost({
    brandId: 'butik-platform',
    title: 'Yeni Sezon Keten Elbiseler'
  });

  assert.equal(post.status, 'draft');
  const updated = simulator.updatePostStatus(post.id, 'awaiting_approval');
  assert.equal(updated.status, 'awaiting_approval');

  assert.throws(() => simulator.updatePostStatus(post.id, 'invalid_status'), /Geçersiz durum/);
});

test('GridSimulator calculates content pillar distribution', () => {
  const simulator = new GridSimulator();
  const brandId = 'ocguderler-sigorta';

  // 4 value, 3 social proof, 2 behind scenes, 1 conversion = 10 posts
  for (let i = 0; i < 4; i++) simulator.addPost({ brandId, title: `Değer ${i}`, pillar: 'value' });
  for (let i = 0; i < 3; i++) simulator.addPost({ brandId, title: `Referans ${i}`, pillar: 'social_proof' });
  for (let i = 0; i < 2; i++) simulator.addPost({ brandId, title: `Kültür ${i}`, pillar: 'behind_scenes' });
  simulator.addPost({ brandId, title: 'Kampanya', pillar: 'conversion' });

  const distribution = simulator.calculatePillarDistribution(brandId);
  assert.equal(distribution.length, 4);

  const valuePillar = distribution.find(p => p.id === 'value');
  assert.equal(valuePillar.count, 4);
  assert.equal(valuePillar.actualPercentage, 40);
  assert.equal(valuePillar.isBalanced, true);
});
