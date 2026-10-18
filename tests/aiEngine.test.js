/**
 * Created by 11Hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateViralScore,
  adaptTone,
  generateSmartHashtags,
  AI_TONES
} from '../src/aiEngine.js';

test('calculateViralScore rewards curiosity gaps, numbers, bullet formatting and CTAs', () => {
  const weakResult = calculateViralScore({
    hook: 'Merhaba arkadaşlar',
    body: 'Bugün hava çok güzel.',
    cta: 'Teşekkürler.'
  });

  assert.ok(weakResult.score < 60);
  assert.equal(weakResult.rating, 'low');
  assert.ok(weakResult.suggestions.length > 0);

  const strongViralResult = calculateViralScore({
    hook: 'Villanızda Sakın Yapmamanız Gereken 3 Kritik Hata',
    body: `Mutfak adası tasarlarken en sık yapılan 3 hata şunlardır:
• 1. Adım: Mesafe 110 cm altında olmamalı.
• 2. Çözüm: Blum tandembox frenli ray kullanılmalı.
• 3. Örnek: Meram villa projemizde uyguladığımız gibi aydınlatma ada üstüne odaklanmalı.`,
    cta: 'Bu rehberi hemen kaydet 📌 ve arkadaşınla paylaş.',
    format: 'reels'
  });

  assert.ok(strongViralResult.score >= 80);
  assert.ok(strongViralResult.rating === 'high' || strongViralResult.rating === 'viral_masterpiece');
  assert.equal(strongViralResult.breakdown.hook > 20, true);
  assert.equal(strongViralResult.breakdown.retention > 20, true);
});

test('adaptTone prepends content with designated voice in TR and EN', () => {
  const text = 'Ada mutfak detayları';
  const luxuryTr = adaptTone(text, 'luxury_architecture', 'tr');
  assert.ok(luxuryTr.includes('Konfor, zarafet ve zamansız'));
  assert.ok(luxuryTr.includes(text));

  const techEn = adaptTone(text, 'tech_founder', 'en');
  assert.ok(techEn.includes('Scaling systems from zero'));
  assert.ok(techEn.includes(text));
});

test('generateSmartHashtags produces deduplicated niche tags and custom topic tags', () => {
  const tags = generateSmartHashtags('architecture', 'Meram Villa Mutfak');
  assert.ok(tags.length >= 5);
  assert.ok(tags.includes('#meram') || tags.includes('#villa'));
  assert.ok(tags.includes('#icmimarlik'));
  assert.ok(tags.length <= 10);
});

test('AI_TONES includes 5 distinct strategic perspectives', () => {
  const tones = Object.keys(AI_TONES);
  assert.equal(tones.length, 5);
  assert.ok(AI_TONES.luxury_architecture);
  assert.ok(AI_TONES.tech_founder);
  assert.ok(AI_TONES.friendly_casual);
  assert.ok(AI_TONES.authoritative_expert);
  assert.ok(AI_TONES.direct_response);
});
