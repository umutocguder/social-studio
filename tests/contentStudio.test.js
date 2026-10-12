/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VIRAL_HOOKS,
  CALL_TO_ACTIONS,
  CONTENT_PILLARS,
  generateReelsScript,
  generateCarouselOutline,
  generateCaption
} from '../src/contentStudio.js';
import { DEFAULT_BRANDS } from '../src/brandManager.js';

test('Viral hooks and content pillars catalog integrity', () => {
  assert.ok(VIRAL_HOOKS.length >= 6);
  assert.ok(CALL_TO_ACTIONS.length >= 4);
  assert.equal(CONTENT_PILLARS.reduce((sum, p) => sum + p.targetPercentage, 0), 100);
});

test('generateReelsScript generates high-retention 4-part script', () => {
  const brand = DEFAULT_BRANDS[0];
  const script = generateReelsScript({
    brand,
    topic: 'Ada Mutfak Tasarımı',
    hookPattern: 'Kimsenin bilmediği {TOPIC} gerçeği...',
    ctaType: 'save'
  });

  assert.equal(script.format, 'reels_script');
  assert.ok(script.hook.spokenWords.includes('Ada Mutfak Tasarımı'));
  assert.ok(script.retention.spokenWords.includes('kritik noktayı'));
  assert.ok(script.valueBody.points.length >= 3);
  assert.ok(script.callToAction.spokenWords.includes('KAYDET'));
});

test('generateCarouselOutline structures multi-slide sequence', () => {
  const brand = DEFAULT_BRANDS[1];
  const carousel = generateCarouselOutline({
    brand,
    topic: 'Kapsül Dolap Rehberi',
    keyPoints: ['Temel parçaları belirlemek', 'Renk paletini 3 renkle sınırlamak'],
    ctaType: 'comment'
  });

  assert.equal(carousel.format, 'carousel');
  assert.equal(carousel.totalSlides, 4);
  assert.equal(carousel.slides[0].type, 'cover_hook');
  assert.ok(carousel.slides[0].headline.includes('Kapsül Dolap Rehberi'));
  assert.equal(carousel.slides[carousel.slides.length - 1].type, 'cta_slide');
});

test('generateCaption combines hook, points, CTA and hashtags', () => {
  const brand = DEFAULT_BRANDS[2]; // Osman Savas
  const caption = generateCaption({
    brand,
    topic: 'Türkiye Dağları Haritası',
    hook: '🏔️ Bu 3 dağ sırasını bilmeyen sınavda soru kaçırır:',
    bodyPoints: ['Kıvrım Dağlar', 'Kırık Dağlar (Horst-Graben)', 'Volkanik Dağlar'],
    ctaType: 'comment',
    customHashtags: ['#cografyanotlari', '#osmansavas']
  });

  assert.ok(caption.includes('🏔️ Bu 3 dağ sırasını'));
  assert.ok(caption.includes('1️⃣ Kıvrım Dağlar'));
  assert.ok(caption.includes('Yorumlarda buluşalım'));
  assert.ok(caption.includes('#kpsscografya'));
  assert.ok(caption.includes('#cografyanotlari'));
});
