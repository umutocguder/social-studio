/**
 * Created by 11Hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ClientPortalEngine,
  REVIEW_STATUSES
} from '../src/clientPortalEngine.js';

test('ClientPortalEngine generates complete client review payload', () => {
  const portal = new ClientPortalEngine();
  const mockPost = {
    id: 'post-101',
    brandId: 'nolte-mimarlik',
    title: 'Meram Ada Mutfak Projesi',
    format: 'reels',
    scheduledDate: '2026-10-25',
    scheduledTime: '20:15',
    caption: 'Lüks ada mutfak projemizin mimari detayları.'
  };

  const mockBrand = {
    id: 'nolte-mimarlik',
    name: 'Nolte Mimarlık',
    handle: '@noltemimarlik',
    clientPhone: '0532 111 22 33'
  };

  const payload = portal.generateClientReviewPayload(mockPost, mockBrand);
  assert.equal(payload.postId, 'post-101');
  assert.equal(payload.brandName, 'Nolte Mimarlık');
  assert.equal(payload.status, REVIEW_STATUSES.PENDING);
  assert.ok(payload.reviewToken.startsWith('rev_post-101_'));
  assert.equal(payload.agencyName, '11Hopem Social Studio');
});

test('ClientPortalEngine respects custom white-label agency branding', () => {
  const portal = new ClientPortalEngine();
  const mockPost = { id: 'p-1', title: 'Test Post' };
  const mockBrand = { name: 'Client Brand' };

  const payload = portal.generateClientReviewPayload(mockPost, mockBrand, {
    whiteLabel: true,
    agencyName: 'Apex Digital Agency'
  });

  assert.equal(payload.agencyName, 'Apex Digital Agency');
});

test('ClientPortalEngine formats WhatsApp review message correctly', () => {
  const portal = new ClientPortalEngine();
  const payload = {
    brandName: 'Nolte Mimarlık',
    title: 'Mutfak Dönüşümü',
    format: 'reels',
    scheduledDate: '2026-10-20',
    scheduledTime: '19:30',
    caption: 'Modern İskandinav stili villa mutfağımız hazır.',
    agencyName: '11Hopem Social Studio'
  };

  const msg = portal.formatWhatsAppReviewMessage(payload);
  assert.ok(msg.includes('NOLTE MİMARLIK — İÇERİK ONAYI'));
  assert.ok(msg.includes('Mutfak Dönüşümü'));
  assert.ok(msg.includes('2026-10-20 19:30'));
  assert.ok(msg.includes('ONAYLIYORUM'));
  assert.ok(msg.includes('11Hopem Social Studio'));
});

test('ClientPortalEngine processes approval decisions and revision requests', () => {
  const portal = new ClientPortalEngine();
  
  const log1 = portal.processClientDecision('post-101', REVIEW_STATUSES.APPROVED, 'Harika olmuş!', 'Aysun Hanım');
  assert.equal(log1.postId, 'post-101');
  assert.equal(log1.decision, 'approved');
  assert.equal(log1.notes, 'Harika olmuş!');

  const log2 = portal.processClientDecision('post-101', REVIEW_STATUSES.REVISION_REQUESTED, 'İlk görseli değiştirelim.', 'Aysun Hanım');
  assert.equal(log2.decision, 'revision_requested');

  const postLogs = portal.getReviewLogsByPost('post-101');
  assert.equal(postLogs.length, 2);

  assert.throws(() => {
    portal.processClientDecision('post-101', 'unknown_status');
  }, /Invalid client decision/);
});
