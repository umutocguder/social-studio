/**
 * Created by 11Hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { sanitizeInput } from './brandManager.js';

export const REVIEW_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REVISION_REQUESTED: 'revision_requested'
};

export class ClientPortalEngine {
  constructor(initialLogs = []) {
    this.reviewLogs = Array.isArray(initialLogs) ? initialLogs : [];
  }

  /**
   * Generates a structured client review payload for a post
   * @param {Object} post
   * @param {Object} brand
   * @param {Object} [agencyOptions]
   * @returns {Object}
   */
  generateClientReviewPayload(post, brand, agencyOptions = {}) {
    if (!post || !post.id) {
      throw new Error('Valid post object is required to generate review payload');
    }

    const brandName = sanitizeInput(brand?.name || 'Social Studio');
    const brandHandle = sanitizeInput(brand?.handle || '');
    const clientPhone = sanitizeInput(brand?.clientPhone || '');
    const title = sanitizeInput(post.title || 'Untitled Post');
    const format = sanitizeInput(post.format || 'reels');
    const scheduledDate = post.scheduledDate || 'Belirtilmedi';
    const scheduledTime = post.scheduledTime || '19:00';
    const caption = sanitizeInput(post.caption || '');

    const token = `rev_${post.id}_${Date.now().toString(36)}`;
    const agencyName = agencyOptions.whiteLabel && agencyOptions.agencyName
      ? sanitizeInput(agencyOptions.agencyName)
      : '11Hopem Social Studio';

    return {
      reviewToken: token,
      postId: post.id,
      brandId: brand?.id || post.brandId,
      brandName,
      brandHandle,
      clientPhone,
      title,
      format,
      scheduledDate,
      scheduledTime,
      caption,
      agencyName,
      status: REVIEW_STATUSES.PENDING,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Formats review notification text for WhatsApp
   * @param {Object} payload
   * @returns {string}
   */
  formatWhatsAppReviewMessage(payload) {
    const formattedBrand = typeof payload.brandName.toLocaleUpperCase === 'function'
      ? payload.brandName.toLocaleUpperCase('tr-TR')
      : payload.brandName.toUpperCase();
    return [
      `🏛️ [${formattedBrand} — İÇERİK ONAYI]`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 Başlık: ${payload.title}`,
      `🎬 Format: ${payload.format.toUpperCase()} | 🗓️ Tarih: ${payload.scheduledDate} ${payload.scheduledTime}`,
      ``,
      `📝 Metin & Açıklama:`,
      `"${payload.caption.substring(0, 300)}${payload.caption.length > 300 ? '...' : ''}"`,
      ``,
      `✅ Onaylamak için lütfen "ONAYLIYORUM" yazarak yanıtlayınız.`,
      `✏️ Revize veya değişiklik talebinizi buradan iletebilirsiniz.`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hazırlayan: ${payload.agencyName}`
    ].join('\n');
  }

  /**
   * Records a client approval decision
   * @param {string} postId
   * @param {'approved' | 'revision_requested'} decision
   * @param {string} [notes]
   * @param {string} [clientName]
   * @returns {Object}
   */
  processClientDecision(postId, decision, notes = '', clientName = 'Client') {
    if (!postId) throw new Error('Post ID is required');
    if (decision !== REVIEW_STATUSES.APPROVED && decision !== REVIEW_STATUSES.REVISION_REQUESTED) {
      throw new Error(`Invalid client decision: ${decision}`);
    }

    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      postId,
      decision,
      notes: sanitizeInput(notes),
      clientName: sanitizeInput(clientName),
      timestamp: new Date().toISOString()
    };

    this.reviewLogs.push(logEntry);
    return logEntry;
  }

  getReviewLogsByPost(postId) {
    return this.reviewLogs.filter(log => log.postId === postId);
  }

  getAllReviewLogs() {
    return [...this.reviewLogs];
  }
}
