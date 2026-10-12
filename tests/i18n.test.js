/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectVisitorLanguage,
  translateKey,
  I18nEngine,
  TRANSLATIONS
} from '../src/i18n.js';
import {
  CalendarEngine,
  WEEKDAYS_EN,
  WEEKDAYS_TR,
  MONTHS_EN,
  MONTHS_TR
} from '../src/calendarEngine.js';

test('TRANSLATIONS dictionary structure has matching top-level keys for tr and en', () => {
  assert.ok(TRANSLATIONS.tr);
  assert.ok(TRANSLATIONS.en);
  const trSections = Object.keys(TRANSLATIONS.tr);
  const enSections = Object.keys(TRANSLATIONS.en);
  assert.deepEqual(trSections.sort(), enSections.sort());
});

test('detectVisitorLanguage respects forcedLang', () => {
  assert.equal(detectVisitorLanguage({ forcedLang: 'tr' }), 'tr');
  assert.equal(detectVisitorLanguage({ forcedLang: 'en' }), 'en');
});

test('detectVisitorLanguage detects Turkish via navigator language', () => {
  assert.equal(detectVisitorLanguage({ navLang: 'tr-TR' }), 'tr');
  assert.equal(detectVisitorLanguage({ navLang: 'tr' }), 'tr');
  assert.equal(detectVisitorLanguage({ navLang: 'TR' }), 'tr');
});

test('detectVisitorLanguage detects Turkish via Europe/Istanbul timezone', () => {
  assert.equal(detectVisitorLanguage({ navLang: 'en-US', timeZone: 'Europe/Istanbul' }), 'tr');
});

test('detectVisitorLanguage defaults to English for international visitors', () => {
  assert.equal(detectVisitorLanguage({ navLang: 'en-US', timeZone: 'America/New_York' }), 'en');
  assert.equal(detectVisitorLanguage({ navLang: 'de-DE', timeZone: 'Europe/Berlin' }), 'en');
  assert.equal(detectVisitorLanguage({ navLang: 'fr-FR', timeZone: 'Europe/Paris' }), 'en');
});

test('translateKey translates keys correctly in TR and EN', () => {
  const trApp = translateKey('app.activeBrand', {}, 'tr');
  assert.equal(trApp, 'Aktif Marka:');

  const enApp = translateKey('app.activeBrand', {}, 'en');
  assert.equal(enApp, 'Active Brand:');

  const trTab = translateKey('tabs.studio', {}, 'tr');
  assert.equal(trTab, '✨ Viral Kanca & Senaryo Stüdyosu');

  const enTab = translateKey('tabs.studio', {}, 'en');
  assert.equal(enTab, '✨ Viral Hook & Script Studio');
});

test('translateKey handles parameter interpolation and fallback', () => {
  const interpolated = translateKey('brandBanner.client', {}, 'en');
  assert.equal(interpolated, 'Client:');

  // Fallback test for nonexistent key
  const missing = translateKey('non.existent.key', {}, 'en');
  assert.equal(missing, 'non.existent.key');
});

test('I18nEngine manages language state and switching', () => {
  const engine = new I18nEngine('tr');
  assert.equal(engine.getLanguage(), 'tr');
  assert.equal(engine.t('app.activeBrand'), 'Aktif Marka:');

  engine.setLanguage('en');
  assert.equal(engine.getLanguage(), 'en');
  assert.equal(engine.t('app.activeBrand'), 'Active Brand:');

  // Invalid language is ignored
  engine.setLanguage('es');
  assert.equal(engine.getLanguage(), 'en');
});

test('CalendarEngine supports TR and EN month labels and weekday arrays', () => {
  const cal = new CalendarEngine(2026, 9);
  assert.equal(cal.getMonthLabel('tr'), 'Eylül 2026');
  assert.equal(cal.getMonthLabel('en'), 'September 2026');
  assert.equal(WEEKDAYS_TR.length, 7);
  assert.equal(WEEKDAYS_EN.length, 7);
  assert.equal(MONTHS_TR.length, 12);
  assert.equal(MONTHS_EN.length, 12);
  assert.equal(WEEKDAYS_EN[0], 'Monday');
  assert.equal(MONTHS_EN[8], 'September');
});
