/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { sanitizeInput } from './brandManager.js';

export const SUPPORTED_CHANNELS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#e1306c',
    charLimit: 2200,
    bestFormats: ['reels', 'carousel', 'single_photo'],
    apiName: 'Meta Graph API v20.0'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#ff0050',
    charLimit: 2200,
    bestFormats: ['short_video', 'spoken_hook'],
    apiName: 'TikTok Content Posting API v2'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0a66c2',
    charLimit: 3000,
    bestFormats: ['article', 'document_carousel', 'thought_leadership'],
    apiName: 'LinkedIn Restli Posts API'
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: '𝕏',
    color: '#000000',
    charLimit: 280,
    bestFormats: ['thread', 'hot_take', 'code_snippet'],
    apiName: 'X API v2 Tweets Endpoint'
  }
];

/**
 * Formats a topic and script/body for a specific target social network
 * @param {Object} options
 * @param {string} options.topic
 * @param {string} options.baseText
 * @param {'instagram' | 'tiktok' | 'linkedin' | 'x'} options.channel
 * @param {Object} [options.brand]
 * @returns {Object}
 */
export function formatContentForChannel({ topic = '', baseText = '', channel = 'instagram', brand = {} }) {
  const cleanTopic = sanitizeInput(topic || 'Yazılım & Teknoloji');
  const handle = brand?.handle || '@umutocguder';
  const hashtags = Array.isArray(brand?.defaultHashtags) ? brand.defaultHashtags.join(' ') : '#software #tech';

  switch (channel) {
    case 'x': {
      // Formats as a 3-part Thread
      const tweet1 = `1/3 🧵 ${cleanTopic}\n\nÇoğu geliştiricinin atladığı kritik nokta: Kod yazmak işin sadece %20'si. Asıl farkı yaratan şey sistem tasarımı ve ölçeklenebilirlik.\n\nDetaylar aşağıda 👇`;
      const tweet2 = `2/3 ⚙️ Nasıl uyguluyoruz?\n• Mimariyi baştan modüler kurgulayın\n• Test coverage ve CI/CD'den ödün vermeyin\n• Premature optimization yerine net iş gereksinimlerine odaklanın.\n\n11Hopem standartlarımızda sıfır hata toleransı ile ilerliyoruz.`;
      const tweet3 = `3/3 📌 Özetle;\nTeknoloji hızla değişiyor ama sağlam mühendislik prensipleri kalıcıdır.\n\nSiz projenizde bu yapıyı nasıl yönetiyorsunuz? Yanıtlayın, tartışalım 💬\n\n${hashtags.split(' ').slice(0, 3).join(' ')}`;
      return {
        channel: 'x',
        format: 'thread',
        tweets: [tweet1, tweet2, tweet3],
        totalTweets: 3,
        previewText: tweet1
      };
    }

    case 'linkedin': {
      const text = [
        `🚀 ${cleanTopic} | Mühendislik ve Girişimcilik Perspektifi`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `Yazılım geliştirme süreçlerinde ve 11Hopem bünyesinde hayata geçirdiğimiz projelerde edindiğimiz temel bir tecrübe var:`,
        ``,
        `Kaliteli bir yazılım ürünü, yalnızca çalışan koddan ibaret değildir. Kodun sürdürülebilirliği, zero-crash garantisi ve gerçek bir iş problemine çözüm üretmesi esastır.`,
        ``,
        `💡 Bugün odaklandığımız 3 temel prensip:`,
        `1. Modüler ve Test Edilebilir Mimari (Clean Architecture)`,
        `2. Kullanıcı Deneyimi & Yüksek Performanslı Dağıtım`,
        `3. Üretken AI Araçlarının Geliştirici Verimliliğine Entegrasyonu`,
        ``,
        `Yazılım ekibinizde veya kendi projelerinizde benzer süreçleri nasıl ölçekliyorsunuz? Deneyimlerinizi yorumlarda duymak isterim.`,
        ``,
        `#yazilim #softwareengineering #techleadership #buildinpublic #systemdesign`
      ].join('\n');

      return {
        channel: 'linkedin',
        format: 'professional_post',
        text,
        previewText: text.substring(0, 200) + '...'
      };
    }

    case 'tiktok': {
      const script = [
        `🎵 TIKTOK DİKEY VİDEO SENARYOSU (9:16)`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `📌 Konu: ${cleanTopic} | Hedef: 0-3s Görsel Kanca`,
        ``,
        `[00:00 - 00:03] 🪝 VİRAL KANCA:`,
        `🗣️ "Eğer yazılıma yeni başladıysan veya kod yazıyorsan, bu hatayı kesinlikle yapıyorsun!"`,
        `👁️ Görsel: Çift ekranda kod kaydırma, hızlı yakınlaşan kamera açısı.`,
        ``,
        `[00:03 - 00:15] ⏱️ TUTUNDURMA:`,
        `🗣️ "Saatlerce kod yazıp production'da patlamasının sebebi syntax değil, mimariyi yanlış kurman."`,
        `👁️ Görsel: Terminalde tek tıkla testlerin geçtiği ekran kaydı.`,
        ``,
        `[00:15 - 00:35] 💡 ÇÖZÜM:`,
        `🗣️ "Clean code yazarken şu 2 kuralı uygula: 1- Tek sorumluluk prensibi, 2- Kodunu AI agent'lara refactor ettirerek çift kontrol sağla."`,
        ``,
        `[00:35 - 00:45] 🎯 CTA:`,
        `🗣️ "Daha fazla yazılım ve teknoloji tüyosu için takip etmeyi ve kaydetmeyi unutma!"`,
        ``,
        `📝 AÇIKLAMA: ${cleanTopic} ipuçları! 💻 Devamı profildeki linkte. ${hashtags}`
      ].join('\n');

      return {
        channel: 'tiktok',
        format: 'short_video_script',
        text: script,
        previewText: script.substring(0, 200) + '...'
      };
    }

    case 'instagram':
    default: {
      const text = [
        `⚡ ${cleanTopic}`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        baseText || `Modern yazılım geliştirme ekosisteminde doğru mimari ve yüksek performanslı araçlar kullanmak projenin kaderini belirler.`,
        ``,
        `Detaylar ve kaynak kod yaklaşımları için profilimizdeki bağlantıyı ziyaret edebilirsiniz.`,
        ``,
        `📌 Bu gönderiyi daha sonra incelemek için KAYDETmeyi unutmayın!`,
        ``,
        `${hashtags}`
      ].join('\n');

      return {
        channel: 'instagram',
        format: 'reels_caption',
        text,
        previewText: text.substring(0, 200) + '...'
      };
    }
  }
}

/**
 * Multi-Channel Publishing Engine
 * Dispatches or simulates publishing across Instagram, TikTok, LinkedIn, and X
 * @param {Object} options
 * @param {Object} options.post
 * @param {Array<string>} [options.channels]
 * @param {Object} [options.brand]
 * @param {'sandbox' | 'live'} [options.mode]
 * @returns {Promise<Object>}
 */
export async function publishToChannels({
  post,
  channels = ['instagram', 'tiktok', 'linkedin', 'x'],
  brand = {},
  mode = 'sandbox'
}) {
  if (!post) {
    throw new Error('Post data is required for publishing.');
  }

  const results = [];
  const handle = brand?.handle || '@umutocguder';
  const timestamp = new Date().toISOString();

  for (const chId of channels) {
    const chConfig = SUPPORTED_CHANNELS.find(c => c.id === chId) || { id: chId, name: chId };
    const formatted = formatContentForChannel({
      topic: post.title,
      baseText: post.caption,
      channel: chId,
      brand
    });

    if (mode === 'sandbox') {
      const mockId = `${chId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      let permalink = '';

      switch (chId) {
        case 'tiktok':
          permalink = `https://tiktok.com/${handle}/video/${mockId}`;
          break;
        case 'linkedin':
          permalink = `https://linkedin.com/feed/update/urn:li:share:${mockId}`;
          break;
        case 'x':
          permalink = `https://x.com/${handle.replace('@', '')}/status/${mockId}`;
          break;
        case 'instagram':
        default:
          permalink = `https://instagram.com/p/${mockId}`;
          break;
      }

      results.push({
        channelId: chId,
        channelName: chConfig.name,
        icon: chConfig.icon || '🌐',
        status: 'SUCCESS',
        postId: mockId,
        permalink,
        mode: 'sandbox',
        publishedAt: timestamp,
        details: chId === 'x' ? `${formatted.totalTweets} tweetlik thread oluşturuldu` : 'Gönderi başarıyla iletildi'
      });
    } else {
      // Live API stub for multi-channel
      results.push({
        channelId: chId,
        channelName: chConfig.name,
        icon: chConfig.icon || '🌐',
        status: 'SUCCESS',
        postId: `live_${chId}_${Date.now()}`,
        permalink: `https://${chId}.com/${handle}`,
        mode: 'live',
        publishedAt: timestamp
      });
    }
  }

  return {
    workflow: 'MULTI_CHANNEL_CROSS_POST',
    brandName: brand?.name || 'Umut Öçgüder',
    postTitle: post.title,
    dispatchedCount: results.length,
    results,
    timestamp
  };
}
