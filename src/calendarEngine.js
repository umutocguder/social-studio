/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { sanitizeInput } from './brandManager.js';

export const WEEKDAYS_TR = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
export const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const WEEKDAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Editorial Content Calendar Engine
 */
export class CalendarEngine {
  /**
   * @param {number} year e.g. 2026
   * @param {number} month 1-12
   */
  constructor(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
    this.year = Number(year);
    this.month = Number(month);
  }

  /**
   * Navigates to next month
   */
  nextMonth() {
    if (this.month === 12) {
      this.month = 1;
      this.year += 1;
    } else {
      this.month += 1;
    }
    return { year: this.year, month: this.month };
  }

  /**
   * Navigates to previous month
   */
  previousMonth() {
    if (this.month === 1) {
      this.month = 12;
      this.year -= 1;
    } else {
      this.month -= 1;
    }
    return { year: this.year, month: this.month };
  }

  /**
   * Sets specific year and month
   * @param {number} year
   * @param {number} month
   */
  setDate(year, month) {
    this.year = Number(year);
    this.month = Number(month);
    return { year: this.year, month: this.month };
  }

  /**
   * Gets total days in current month
   * @returns {number}
   */
  getDaysInMonth() {
    return new Date(this.year, this.month, 0).getDate();
  }

  /**
   * Generates calendar grid cells for month view (Monday-based)
   * @returns {Array<Object>}
   */
  getMonthGrid() {
    const totalDays = this.getDaysInMonth();
    // In JS, getDay() returns 0 for Sunday, 1 for Monday...
    const firstDayIndex = new Date(this.year, this.month - 1, 1).getDay();
    // Convert so Monday is 0, Sunday is 6
    const leadingEmptyCount = (firstDayIndex + 6) % 7;

    const prevMonthDays = new Date(this.year, this.month - 1, 0).getDate();
    const cells = [];

    // Leading days from previous month
    for (let i = leadingEmptyCount - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = this.month === 1 ? 12 : this.month - 1;
      const prevYear = this.month === 1 ? this.year - 1 : this.year;
      const isoDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({
        dayNumber: dayNum,
        isoDate,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Current month days
    const todayStr = new Date().toISOString().split('T')[0];
    for (let day = 1; day <= totalDays; day++) {
      const isoDate = `${this.year}-${String(this.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        dayNumber: day,
        isoDate,
        isCurrentMonth: true,
        isToday: isoDate === todayStr
      });
    }

    // Trailing days from next month to complete the 35 or 42 grid
    const totalCells = cells.length <= 35 ? 35 : 42;
    const trailingCount = totalCells - cells.length;
    for (let day = 1; day <= trailingCount; day++) {
      const nextMonth = this.month === 12 ? 1 : this.month + 1;
      const nextYear = this.month === 12 ? this.year + 1 : this.year;
      const isoDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        dayNumber: day,
        isoDate,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return cells;
  }

  /**
   * Groups posts into their corresponding calendar date cells
   * @param {Array<Object>} posts
   * @param {string} brandId
   * @returns {Array<Object>}
   */
  getGridWithPosts(posts = [], brandId = '') {
    const grid = this.getMonthGrid();
    const brandPosts = brandId ? posts.filter(p => p.brandId === brandId) : posts;

    return grid.map(cell => {
      const cellPosts = brandPosts.filter(p => p.scheduledDate === cell.isoDate);
      return {
        ...cell,
        posts: cellPosts,
        hasEvents: cellPosts.length > 0
      };
    });
  }

  /**
   * Returns human-readable title for header (e.g. "Eylül 2026" or "September 2026")
   * @param {'tr' | 'en'} [lang='tr']
   * @returns {string}
   */
  getMonthLabel(lang = 'tr') {
    const months = lang === 'en' ? MONTHS_EN : MONTHS_TR;
    return `${months[this.month - 1]} ${this.year}`;
  }
}

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string for export
 * @param {Array<Object>} posts
 * @param {Object} brand
 * @returns {string}
 */
export function generateIcsCalendar(posts = [], brand = {}) {
  const brandName = sanitizeInput(brand.name || 'Social Studio');
  const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const events = posts.map(post => {
    const datePart = (post.scheduledDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const timePart = (post.scheduledTime || '19:00').replace(/:/g, '') + '00';
    const dtStart = `${datePart}T${timePart}`;
    
    // Default 30 min duration
    const dtEnd = `${datePart}T${String(Number(timePart.slice(0, 2)) + 1).padStart(2, '0')}${timePart.slice(2, 4)}00`;

    const summary = sanitizeInput(`[${brandName}] ${post.title}`);
    const description = sanitizeInput(`Format: ${post.format}\nDurum: ${post.status}\nAçıklama: ${post.caption || ''}`);

    return [
      'BEGIN:VEVENT',
      `UID:${post.id || Date.now()}@socialstudio.11hopem.com`,
      `DTSTAMP:${nowUtc}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//11hopem//Social Studio Calendar Engine 1.0//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${brandName} Sosyal Medya Takvimi`,
    'X-WR-TIMEZONE:Europe/Istanbul',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');
}
