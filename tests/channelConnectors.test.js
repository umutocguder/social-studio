/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORTED_CHANNELS,
  formatContentForChannel,
  publishToChannels
} from '../src/channelConnectors.js';
import { BrandManager, DEFAULT_BRANDS } from '../src/brandManager.js';

test('SUPPORTED_CHANNELS contains Instagram, TikTok, LinkedIn, and X', () => {
  const ids = SUPPORTED_CHANNELS.map(c => c.id);
  assert.ok(ids.includes('instagram'));
  assert.ok(ids.includes('tiktok'));
  assert.ok(ids.includes('linkedin'));
  assert.ok(ids.includes('x'));
});

test('formatContentForChannel formats X thread with character limit compliance', () => {
  const res = formatContentForChannel({
    topic: 'Clean Architecture in SwiftUI',
    channel: 'x',
    brand: { handle: '@umutocguder' }
  });

  assert.equal(res.channel, 'x');
  assert.equal(res.format, 'thread');
  assert.equal(res.totalTweets, 3);
  res.tweets.forEach(tweet => {
    assert.ok(tweet.length <= 280, `Tweet exceeds 280 chars: ${tweet.length}`);
  });
});

test('formatContentForChannel formats LinkedIn professional article', () => {
  const res = formatContentForChannel({
    topic: 'Microservices vs Modular Monolith',
    channel: 'linkedin',
    brand: { handle: '@umutocguder' }
  });

  assert.equal(res.channel, 'linkedin');
  assert.equal(res.format, 'professional_post');
  assert.ok(res.text.includes('11hopem Software'));
  assert.ok(res.text.includes('#yazilim'));
});

test('formatContentForChannel formats TikTok vertical video script', () => {
  const res = formatContentForChannel({
    topic: 'Yapay Zeka ile Kod Yazmak',
    channel: 'tiktok',
    brand: { handle: '@umutocguder' }
  });

  assert.equal(res.channel, 'tiktok');
  assert.equal(res.format, 'short_video_script');
  assert.ok(res.text.includes('TIKTOK DİKEY VİDEO'));
  assert.ok(res.text.includes('VİRAL KANCA'));
});

test('publishToChannels cross-posts across all 4 channels in sandbox mode', async () => {
  const post = {
    title: 'Sıfırdan SaaS Mimarisi',
    caption: '11hopem Software altyapısı.'
  };
  const brand = {
    name: 'Umut Öçgüder',
    handle: '@umutocguder'
  };

  const dispatch = await publishToChannels({
    post,
    channels: ['instagram', 'tiktok', 'linkedin', 'x'],
    brand,
    mode: 'sandbox'
  });

  assert.equal(dispatch.workflow, 'MULTI_CHANNEL_CROSS_POST');
  assert.equal(dispatch.dispatchedCount, 4);
  assert.equal(dispatch.results.length, 4);

  const channelsReceived = dispatch.results.map(r => r.channelId);
  assert.ok(channelsReceived.includes('instagram'));
  assert.ok(channelsReceived.includes('tiktok'));
  assert.ok(channelsReceived.includes('linkedin'));
  assert.ok(channelsReceived.includes('x'));

  dispatch.results.forEach(r => {
    assert.equal(r.status, 'SUCCESS');
    assert.ok(r.permalink.length > 10);
  });
});

test('BrandManager includes Umut Öçgüder with all linked social accounts', () => {
  const bm = new BrandManager(DEFAULT_BRANDS);
  const umut = bm.getBrandById('umutocguder');

  assert.ok(umut, 'Umut Öçgüder brand must exist in DEFAULT_BRANDS');
  assert.equal(umut.handle, '@umutocguder');
  assert.equal(umut.sector, 'Yazılım Mühendisliği & Tech Girişimcilik');
  assert.ok(umut.socialAccounts);
  assert.equal(umut.socialAccounts.instagram, '@umutocguder');
  assert.equal(umut.socialAccounts.tiktok, '@umutocguder');
  assert.equal(umut.socialAccounts.linkedin, 'in/umutocguder');
  assert.equal(umut.socialAccounts.x, '@umutocguder');
});
