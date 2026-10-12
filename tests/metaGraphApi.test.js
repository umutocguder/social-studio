/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MetaGraphApiClient,
  DEFAULT_META_CONFIG,
  GRAPH_API_VERSION
} from '../src/metaGraphApi.js';

test('MetaGraphApiClient initializes properly with default sandbox configuration', () => {
  const client = new MetaGraphApiClient();
  assert.equal(client.config.mode, 'sandbox');
  assert.equal(client.config.connectedUsername, '@noltemimarlik');
  assert.equal(GRAPH_API_VERSION, 'v20.0');
});

test('verifyToken handles missing token and verifies sandbox token', async () => {
  const client = new MetaGraphApiClient();
  const emptyRes = await client.verifyToken('');
  assert.equal(emptyRes.valid, false);
  assert.equal(emptyRes.error, 'Missing access token');

  const validRes = await client.verifyToken('VALID_SANDBOX_TOKEN');
  assert.equal(validRes.valid, true);
  assert.ok(validRes.scopes.includes('instagram_content_publish'));
  assert.ok(validRes.expiresAt > 0);
});

test('getAccountProfile returns Nolte Mimarlık profile in sandbox mode', async () => {
  const client = new MetaGraphApiClient();
  const profile = await client.getAccountProfile();
  assert.equal(profile.username, '@noltemimarlik');
  assert.ok(profile.followersCount > 10000);
  assert.ok(profile.biography.includes('Nolte Küchen'));
});

test('createMediaContainer and publishMedia complete 2-step publish flow', async () => {
  const client = new MetaGraphApiClient();
  
  // Step 1
  const container = await client.createMediaContainer({
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    caption: 'Meram Villa Mutfak Tasarımı #noltemimarlik'
  });
  assert.ok(container.containerId.startsWith('container_'));
  assert.equal(container.status, 'IN_PROGRESS');

  // Step 2
  const publishResult = await client.publishMedia(container.containerId);
  assert.equal(publishResult.success, true);
  assert.ok(publishResult.publishedMediaId.startsWith('ig_media_'));
  assert.ok(publishResult.permalink.includes('instagram.com'));
});

test('getMediaInsights returns structured engagement data', async () => {
  const client = new MetaGraphApiClient();
  const insights = await client.getMediaInsights('mock-post-123');
  assert.equal(insights.mediaId, 'mock-post-123');
  assert.ok(insights.impressions > 0);
  assert.ok(insights.saves > 0);
  assert.equal(typeof insights.engagementRate, 'string');
});

test('simulatePublishWorkflow executes end-to-end publish simulation for Nolte', async () => {
  const client = new MetaGraphApiClient();
  const post = {
    title: 'Yakapark Konutları Ada Mutfak',
    format: 'reels',
    caption: 'Alman kalitesiyle hazırlanan mutfak projemiz.'
  };
  const brand = {
    name: 'Nolte Mimarlık',
    handle: '@noltemimarlik'
  };

  const result = await client.simulatePublishWorkflow(post, brand);
  assert.equal(result.workflow, 'META_GRAPH_API_PUBLISH');
  assert.equal(result.status, 'PUBLISHED_SUCCESS');
  assert.equal(result.brand, 'Nolte Mimarlık');
  assert.ok(result.permalink.startsWith('https://instagram.com/p/'));
});
