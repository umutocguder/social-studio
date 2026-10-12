/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SchedulerEngine,
  OPTIMAL_SLOTS_BY_SECTOR
} from '../src/schedulerEngine.js';

test('SchedulerEngine loads luxury_architecture optimal slots by default', () => {
  const scheduler = new SchedulerEngine('luxury_architecture');
  const slots = scheduler.getOptimalSlots();
  assert.ok(slots.length >= 3);
  assert.ok(slots.some(s => s.dayName === 'Çarşamba'));
  assert.ok(slots.some(s => s.dayName === 'Cuma'));
});

test('findNextOptimalSlot finds upcoming available date without collision', () => {
  const scheduler = new SchedulerEngine('luxury_architecture');
  const existingPosts = [
    { scheduledDate: '2026-09-18', scheduledTime: '20:15' } // Friday
  ];

  // Start checking from Friday 2026-09-18
  const nextSlot = scheduler.findNextOptimalSlot(existingPosts, '2026-09-18');
  assert.ok(nextSlot.scheduledDate);
  assert.ok(nextSlot.scheduledTime);
  // It shouldn't collide with 2026-09-18 20:15
  const isCollision = (nextSlot.scheduledDate === '2026-09-18' && nextSlot.scheduledTime === '20:15');
  assert.equal(isCollision, false);
});

test('getDuePosts accurately identifies scheduled posts ready for publish', () => {
  const scheduler = new SchedulerEngine('luxury_architecture');
  const posts = [
    { id: '1', status: 'scheduled', scheduledDate: '2026-09-10', scheduledTime: '12:00' }, // past date
    { id: '2', status: 'scheduled', scheduledDate: '2026-09-20', scheduledTime: '20:00' }, // future date
    { id: '3', status: 'draft', scheduledDate: '2026-09-10', scheduledTime: '12:00' } // not scheduled
  ];

  const now = new Date('2026-09-15T15:00:00');
  const due = scheduler.getDuePosts(posts, now);
  assert.equal(due.length, 1);
  assert.equal(due[0].id, '1');
});
