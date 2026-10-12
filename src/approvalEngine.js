/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { normalizePhone } from './brandManager.js';
import { POST_FORMATS } from './gridSimulator.js';

/**
 * Builds a structured, high-converting client approval WhatsApp message
 */
export function buildClientApprovalWhatsAppUrl({ brand, post }) {
  if (!brand || !post) {
    throw new Error("Marka ve içerik bilgisi zorunludur.");
  }

  const phone = normalizePhone(brand.clientPhone || '');
  const formatObj = POST_FORMATS.find(f => f.id === post.format) || POST_FORMATS[0];

  const lines = [
    `📱 *SOSYAL MEDYA İÇERİK ONAYI*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🏢 *Marka:* ${brand.name} (${brand.handle || ''})`,
    `📌 *İçerik Konusu:* ${post.title}`,
    `🎞️ *Format:* ${formatObj.icon} ${formatObj.label}`,
    `🗓️ *Planlanan Tarih / Saat:* ${post.scheduledDate} - ${post.scheduledTime || '19:00'}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📝 *Kanca / Başlık:*`,
    `"${post.coverText || post.title}"`,
    ``,
    `📄 *Açıklama Metni (Caption):*`,
    post.caption ? post.caption.slice(0, 300) + (post.caption.length > 300 ? '...' : '') : 'Hazırlanan görsel/video eşliğinde paylaşılacaktır.',
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `Sayın müşterimiz, bu paylaşımı onaylıyorsanız lütfen *'ONAY'* veya değişiklik istiyorsanız revize notunuzu iletiniz.`
  ];

  const encodedText = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Exports full workspace state to a JSON string for Local Data Custody
 */
export function exportWorkspaceToJson(brands, posts) {
  const data = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    creator: "Social Studio by 11hopem",
    brands: brands || [],
    posts: posts || []
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Imports and validates workspace JSON
 */
export function importWorkspaceFromJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.brands) || !Array.isArray(parsed.posts)) {
      throw new Error("Geçersiz dosya formatı. 'brands' ve 'posts' dizileri bulunamadı.");
    }
    return {
      success: true,
      brands: parsed.brands,
      posts: parsed.posts
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
