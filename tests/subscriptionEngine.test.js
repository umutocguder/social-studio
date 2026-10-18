/**
 * Created by 11Hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SubscriptionEngine,
  SUBSCRIPTION_PLANS
} from '../src/subscriptionEngine.js';

test('SUBSCRIPTION_PLANS defines free, pro, and agency tiers with valid limits', () => {
  assert.ok(SUBSCRIPTION_PLANS.free);
  assert.ok(SUBSCRIPTION_PLANS.pro);
  assert.ok(SUBSCRIPTION_PLANS.agency);

  assert.equal(SUBSCRIPTION_PLANS.free.limits.maxBrands, 1);
  assert.equal(SUBSCRIPTION_PLANS.free.limits.maxAiScriptsPerMonth, 15);
  assert.equal(SUBSCRIPTION_PLANS.free.limits.allowWhatsAppCards, false);

  assert.equal(SUBSCRIPTION_PLANS.pro.limits.maxBrands, 5);
  assert.equal(SUBSCRIPTION_PLANS.pro.limits.allowWhatsAppCards, true);
  assert.equal(SUBSCRIPTION_PLANS.pro.limits.allowMultiChannel, true);

  assert.equal(SUBSCRIPTION_PLANS.agency.limits.maxBrands, Infinity);
  assert.equal(SUBSCRIPTION_PLANS.agency.limits.allowWhiteLabel, true);
});

test('SubscriptionEngine enforces brand and AI limits accurately', () => {
  const engine = new SubscriptionEngine({
    planId: 'free',
    monthlyAiCount: 14
  });

  assert.equal(engine.getActivePlan().id, 'free');
  assert.equal(engine.canAddBrand(0), true);
  assert.equal(engine.canAddBrand(1), false);

  assert.equal(engine.canGenerateAiScript(14), true);
  assert.equal(engine.canGenerateAiScript(15), false);
  assert.equal(engine.canUseFeature('allowWhatsAppCards'), false);
});

test('SubscriptionEngine records AI usage and resets quota', () => {
  const engine = new SubscriptionEngine({
    planId: 'free',
    monthlyAiCount: 0
  });

  const count1 = engine.recordAiGeneration();
  assert.equal(count1, 1);
  const count2 = engine.recordAiGeneration();
  assert.equal(count2, 2);

  engine.resetMonthlyAiQuota();
  assert.equal(engine.getSubscription().monthlyAiCount, 0);
});

test('SubscriptionEngine upgrades plan to Pro or Agency with correct billing parameters', () => {
  const engine = new SubscriptionEngine({
    planId: 'free',
    monthlyAiCount: 15
  });

  const result = engine.upgradePlan('pro', 'yearly', 'TRY', 'stripe');
  assert.equal(result.success, true);
  assert.equal(result.subscription.planId, 'pro');
  assert.equal(result.subscription.billingCycle, 'yearly');
  assert.equal(result.subscription.monthlyAiCount, 0);
  assert.ok(result.transactionId.startsWith('TX-STRIPE-'));

  assert.equal(engine.canAddBrand(4), true);
  assert.equal(engine.canAddBrand(5), false);
  assert.equal(engine.canUseFeature('allowWhatsAppCards'), true);
  assert.equal(engine.canUseFeature('allowMultiChannel'), true);
});

test('SubscriptionEngine throws on invalid plan identifier', () => {
  const engine = new SubscriptionEngine();
  assert.throws(() => {
    engine.upgradePlan('invalid_tier_99');
  }, /Invalid plan identifier/);
});
