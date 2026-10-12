/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { sanitizeInput } from './brandManager.js';

export const OPTIMAL_SLOTS_BY_SECTOR = {
  // Nolte Mimarlık & Luxury Architecture
  luxury_architecture: [
    { dayOfWeek: 3, dayName: 'Çarşamba', time: '19:30', weight: 95, reason: 'Akşam oturma odası dinlenme saati, villa araştırması' },
    { dayOfWeek: 5, dayName: 'Cuma', time: '20:15', weight: 98, reason: 'Hafta sonu dekorasyon ve keşif planlama saati' },
    { dayOfWeek: 6, dayName: 'Cumartesi', time: '11:30', weight: 92, reason: 'Hafta sonu kahve eşliğinde ilham arayışı' },
    { dayOfWeek: 0, dayName: 'Pazar', time: '19:00', weight: 96, reason: 'Haftalık ev/yaşam ilhamı ve yüksek Reels izlenmesi' }
  ],
  // Fashion & Boutique
  fashion: [
    { dayOfWeek: 2, dayName: 'Salı', time: '12:30', weight: 88, reason: 'Öğle arası kombin inceleme' },
    { dayOfWeek: 4, dayName: 'Perşembe', time: '19:00', weight: 92, reason: 'Hafta sonu alışveriş hazırlığı' },
    { dayOfWeek: 6, dayName: 'Cumartesi', time: '13:00', weight: 94, reason: 'Hafta sonu butik sipariş zirvesi' }
  ],
  // Default / Business
  default: [
    { dayOfWeek: 1, dayName: 'Pazartesi', time: '18:30', weight: 85, reason: 'İş çıkışı akış kontrolü' },
    { dayOfWeek: 3, dayName: 'Çarşamba', time: '19:30', weight: 90, reason: 'Hafta ortası zirve etkileşimi' },
    { dayOfWeek: 5, dayName: 'Cuma', time: '19:00', weight: 89, reason: 'Hafta sonuna giriş akışı' }
  ]
};

/**
 * Intelligent Post Scheduler & Queue Optimizer
 */
export class SchedulerEngine {
  /**
   * @param {string} sector
   */
  constructor(sector = 'luxury_architecture') {
    this.sector = sector;
  }

  /**
   * Returns optimal slot recommendations for current sector
   * @returns {Array<Object>}
   */
  getOptimalSlots() {
    return OPTIMAL_SLOTS_BY_SECTOR[this.sector] || OPTIMAL_SLOTS_BY_SECTOR.luxury_architecture;
  }

  /**
   * Finds the next available optimal slot without colliding with an already scheduled post
   * @param {Array<Object>} existingPosts
   * @param {string} [startDateStr] YYYY-MM-DD
   * @returns {{scheduledDate: string, scheduledTime: string, dayName: string, reason: string}}
   */
  findNextOptimalSlot(existingPosts = [], startDateStr = '') {
    const start = startDateStr ? new Date(startDateStr) : new Date();
    const optimalSlots = this.getOptimalSlots();

    // Look ahead up to 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const candidateDate = new Date(start);
      candidateDate.setDate(start.getDate() + dayOffset);

      const dayOfWeek = candidateDate.getDay(); // 0 is Sunday
      const matchingSlot = optimalSlots.find(s => s.dayOfWeek === dayOfWeek);

      if (matchingSlot) {
        const isoDate = candidateDate.toISOString().split('T')[0];
        // Check collision on same date & time
        const hasCollision = existingPosts.some(
          p => p.scheduledDate === isoDate && p.scheduledTime === matchingSlot.time
        );

        if (!hasCollision) {
          return {
            scheduledDate: isoDate,
            scheduledTime: matchingSlot.time,
            dayName: matchingSlot.dayName,
            reason: matchingSlot.reason
          };
        }
      }
    }

    // Fallback: tomorrow 19:30
    const fallback = new Date(start);
    fallback.setDate(start.getDate() + 1);
    return {
      scheduledDate: fallback.toISOString().split('T')[0],
      scheduledTime: '19:30',
      dayName: 'Yarın',
      reason: 'Standart akşam paylaşım saati'
    };
  }

  /**
   * Scans posts and identifies which scheduled items are due for publishing
   * @param {Array<Object>} posts
   * @param {Date} [currentTime]
   * @returns {Array<Object>}
   */
  getDuePosts(posts = [], currentTime = new Date()) {
    const currentIso = currentTime.toISOString().split('T')[0];
    const currentHours = String(currentTime.getHours()).padStart(2, '0');
    const currentMins = String(currentTime.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMins}`;

    return posts.filter(p => {
      if (p.status !== 'scheduled') return false;
      if (!p.scheduledDate) return false;

      if (p.scheduledDate < currentIso) return true;
      if (p.scheduledDate === currentIso && (p.scheduledTime || '00:00') <= currentTimeStr) {
        return true;
      }
      return false;
    });
  }
}
