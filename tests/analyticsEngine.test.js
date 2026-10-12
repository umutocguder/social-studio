/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AnalyticsEngine } from '../src/analyticsEngine.js';

test('AnalyticsEngine calculates brand KPIs accurately', () => {
  const posts = [
    {
      id: 'p-1',
      brandId: 'nolte-mimarlik',
      format: 'reels',
      status: 'published',
      impressions: 10000,
      reach: 8000,
      likes: 600,
      comments: 50,
      saves: 300,
      shares: 100
    }
  ];

  const engine = new AnalyticsEngine(posts);
  const kpis = engine.calculateBrandKPIs('nolte-mimarlik');
  assert.equal(kpis.totalPosts, 1);
  assert.equal(kpis.totalImpressions, 10000);
  assert.equal(kpis.totalReach, 8000);
  assert.equal(kpis.totalInteractions, 1050);
  assert.equal(kpis.engagementRate, 10.5); // (1050 / 10000) * 100
  assert.ok(kpis.healthScore > 50);
});

test('getFormatPerformance returns comparative format breakdown', () => {
  const posts = [
    { id: '1', brandId: 'nolte-mimarlik', format: 'reels' },
    { id: '2', brandId: 'nolte-mimarlik', format: 'carousel' },
    { id: '3', brandId: 'nolte-mimarlik', format: 'single_photo' }
  ];

  const engine = new AnalyticsEngine(posts);
  const breakdown = engine.getFormatPerformance('nolte-mimarlik');
  assert.equal(breakdown.length, 3);
  const reelsFmt = breakdown.find(b => b.format === 'reels');
  assert.ok(reelsFmt);
  assert.equal(reelsFmt.count, 1);
  assert.equal(reelsFmt.viralPotential, 'Çok Yüksek');
});

test('generateExecutiveReport creates detailed executive briefing for Nolte', () => {
  const engine = new AnalyticsEngine([]);
  const brand = {
    name: 'Nolte Mimarlık',
    handle: '@noltemimarlik'
  };

  const report = engine.generateExecutiveReport(brand, 'Eylül 2026');
  assert.ok(report.includes('Nolte') || report.includes('NOLTE'));
  assert.ok(report.includes('Eylül 2026'));
  assert.ok(report.includes('Konya Meram Showroom'));
  assert.ok(report.includes('TEMEL PERFORMANS GÖSTERGELERİ'));
  assert.ok(report.includes('11hopem Software'));
});
