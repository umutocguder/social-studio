/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CalendarEngine,
  generateIcsCalendar,
  MONTHS_TR,
  WEEKDAYS_TR
} from '../src/calendarEngine.js';

test('CalendarEngine initializes with correct year and month', () => {
  const cal = new CalendarEngine(2026, 9);
  assert.equal(cal.year, 2026);
  assert.equal(cal.month, 9);
  assert.equal(cal.getMonthLabel(), 'Eylül 2026');
  assert.equal(cal.getDaysInMonth(), 30);
});

test('CalendarEngine nextMonth and previousMonth rollover correctly', () => {
  const cal = new CalendarEngine(2026, 12);
  cal.nextMonth();
  assert.equal(cal.year, 2027);
  assert.equal(cal.month, 1);

  cal.previousMonth();
  assert.equal(cal.year, 2026);
  assert.equal(cal.month, 12);
});

test('CalendarEngine generates 35 or 42 month grid cells with correct Monday start', () => {
  const cal = new CalendarEngine(2026, 9);
  const grid = cal.getMonthGrid();
  assert.ok(grid.length === 35 || grid.length === 42);

  const currentMonthCells = grid.filter(c => c.isCurrentMonth);
  assert.equal(currentMonthCells.length, 30);
  assert.equal(currentMonthCells[0].dayNumber, 1);
  assert.equal(currentMonthCells[29].dayNumber, 30);
});

test('getGridWithPosts matches posts to their exact dates', () => {
  const cal = new CalendarEngine(2026, 9);
  const mockPosts = [
    { id: 'p-1', brandId: 'nolte-mimarlik', scheduledDate: '2026-09-15', title: 'Villa Post' },
    { id: 'p-2', brandId: 'nolte-mimarlik', scheduledDate: '2026-09-20', title: 'Kitchen Post' }
  ];

  const gridWithPosts = cal.getGridWithPosts(mockPosts, 'nolte-mimarlik');
  const cell15 = gridWithPosts.find(c => c.isoDate === '2026-09-15');
  assert.ok(cell15);
  assert.equal(cell15.posts.length, 1);
  assert.equal(cell15.posts[0].title, 'Villa Post');

  const cell20 = gridWithPosts.find(c => c.isoDate === '2026-09-20');
  assert.ok(cell20);
  assert.equal(cell20.posts.length, 1);
});

test('generateIcsCalendar exports valid iCalendar RFC 5545 format', () => {
  const posts = [
    {
      id: 'post-100',
      title: 'Lüks Villalarda Ada Mutfak',
      format: 'reels',
      status: 'scheduled',
      scheduledDate: '2026-09-18',
      scheduledTime: '19:30',
      caption: 'Alman mühendisliği detayları.'
    }
  ];
  const brand = { name: 'Nolte Mimarlık' };

  const ics = generateIcsCalendar(posts, brand);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('VERSION:2.0'));
  assert.ok(ics.includes('BEGIN:VEVENT'));
  assert.ok(ics.includes('SUMMARY:[Nolte Mimarlık] Lüks Villalarda Ada Mutfak'));
  assert.ok(ics.includes('DTSTART:20260918T193000'));
  assert.ok(ics.includes('END:VCALENDAR'));
});
