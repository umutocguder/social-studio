/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { sanitizeInput } from './brandManager.js';

export const VIRAL_HOOKS = [
  {
    id: "h-curiosity-1",
    category: "curiosity",
    categoryTitle: "Merak Uyandıran",
    pattern: "Kimsenin size söylemediği {TOPIC} gerçeği...",
    example: "Kimsenin size söylemediği ada mutfak tasarımı gerçeği..."
  },
  {
    id: "h-curiosity-2",
    category: "curiosity",
    categoryTitle: "Merak Uyandıran",
    pattern: "Bunu öğrendikten sonra {TOPIC} hakkındaki fikriniz tamamen değişecek:",
    example: "Bunu öğrendikten sonra kasko primleri hakkındaki fikriniz tamamen değişecek:"
  },
  {
    id: "h-shock-1",
    category: "shock",
    categoryTitle: "Zıt Görüş / Şok Etkisi",
    pattern: "Neden 2026'da artık {TOPIC} yapmayı bırakmalısınız?",
    example: "Neden 2026'da artık rastgele kombin yapmayı bırakmalısınız?"
  },
  {
    id: "h-shock-2",
    category: "shock",
    categoryTitle: "Zıt Görüş / Şok Etkisi",
    pattern: "{TOPIC} konusunda bildiğiniz her şey yanlış olabilir.",
    example: "KPSS Coğrafya ezberleme konusunda bildiğiniz her şey yanlış olabilir."
  },
  {
    id: "h-mistake-1",
    category: "mistake",
    categoryTitle: "Büyük Hatalar",
    pattern: "{TOPIC} yaparken insanların %90'ının düştüğü 3 kritik hata ❌",
    example: "Ev yenilerken insanların %90'ının düştüğü 3 kritik hata ❌"
  },
  {
    id: "h-mistake-2",
    category: "mistake",
    categoryTitle: "Büyük Hatalar",
    pattern: "Bu hatayı yapıyorsanız her ay paranızı çöpe atıyorsunuz:",
    example: "Poliçenizi yenilerken bu hatayı yapıyorsanız paranızı çöpe atıyorsunuz:"
  },
  {
    id: "h-howto-1",
    category: "how_to",
    categoryTitle: "Adım Adım Rehber",
    pattern: "Sıfırdan {TOPIC} ustası olmanın en pratik 4 adımı 📌",
    example: "Sıfırdan harita okuma ustası olmanın en pratik 4 adımı 📌"
  },
  {
    id: "h-secret-1",
    category: "secret",
    categoryTitle: "İçeriden Sırlar",
    pattern: "Sektörün içinden biri olarak açıklıyorum: {TOPIC} sırrı 🤫",
    example: "Sektörün içinden biri olarak açıklıyorum: Lüks villa aydınlatma sırrı 🤫"
  }
];

export const CALL_TO_ACTIONS = [
  { id: "save", label: "Kaydet", text: "Bu içeriği daha sonra tekrar incelemek için mutlaka KAYDET 📌" },
  { id: "comment", label: "Yorum Yap", text: "Sen bu konuda ne düşünüyorsun? Yorumlarda buluşalım 👇" },
  { id: "dm", label: "DM Gönder", text: "Detaylı rehber veya randevu için bize 'BİLGİ' yazarak DM at ✉️" },
  { id: "share", label: "Paylaş", text: "Bu bilgiye ihtiyacı olan bir arkadaşına hemen GÖNDER 🚀" }
];

export const CONTENT_PILLARS = [
  { id: "value", name: "Eğitim & Değer", targetPercentage: 40, icon: "💡", color: "#3b82f6" },
  { id: "social_proof", name: "Sosyal Kanıt & Referans", targetPercentage: 30, icon: "⭐", color: "#10b981" },
  { id: "behind_scenes", name: "Perde Arkası & Kültür", targetPercentage: 20, icon: "🎬", color: "#8b5cf6" },
  { id: "conversion", name: "Doğrudan Satış & Kampanya", targetPercentage: 10, icon: "🎯", color: "#f59e0b" }
];

/**
 * Generates a high-retention Reels or TikTok script
 */
export function generateReelsScript({ brand, topic, hookPattern, ctaType = 'save' }) {
  const cleanTopic = sanitizeInput(topic || 'Önemli Bir Konu');
  const brandName = brand?.name || 'Markamız';
  const hook = hookPattern ? hookPattern.replace('{TOPIC}', cleanTopic) : `Kimsenin size söylemediği ${cleanTopic} gerçeği...`;
  const cta = CALL_TO_ACTIONS.find(c => c.id === ctaType) || CALL_TO_ACTIONS[0];

  return {
    format: "reels_script",
    topic: cleanTopic,
    estimatedDuration: "30-45 Saniye",
    hook: {
      timing: "0 - 3 Saniye",
      visual: "Kameraya hızlı adım atış, dikkat çeken metin başlığı (B-Roll veya konuşan kafa).",
      spokenWords: hook
    },
    retention: {
      timing: "3 - 12 Saniye",
      visual: "Hızlı sahne değişimi veya ekrana gelen 2-3 kelimelik anahtar başlıklar.",
      spokenWords: `Çoğu kişi ${cleanTopic} sürecinde en kritik noktayı atlıyor. Fakat doğru stratejiyle işler tamamen değişiyor.`
    },
    valueBody: {
      timing: "12 - 35 Saniye",
      visual: "Uygulama anı, örnekler veya adım adım ekran kaydı / ürün yakın çekimi.",
      points: [
        `1. Adım: Temel analizi yapın ve acele karar vermeyin.`,
        `2. Adım: ${brandName} standartlarında kaliteli malzeme/yöntem tercih edin.`,
        `3. Adım: Süreci düzenli kontrol edip profesyonel destek alın.`
      ]
    },
    callToAction: {
      timing: "35 - 45 Saniye",
      visual: "Sonuç görseli, markanın logosu ve profili işaret eden animasyon.",
      spokenWords: cta.text
    }
  };
}

/**
 * Generates a high-converting Carousel outline (5-7 slides)
 */
export function generateCarouselOutline({ brand, topic, keyPoints = [], ctaType = 'save' }) {
  const cleanTopic = sanitizeInput(topic || 'Rehber');
  const brandName = brand?.name || 'Markamız';
  const cta = CALL_TO_ACTIONS.find(c => c.id === ctaType) || CALL_TO_ACTIONS[0];

  const defaultPoints = keyPoints.length > 0 ? keyPoints : [
    "Problemin kök nedenini doğru tespit etmek",
    "Gereksiz maliyet ve zaman kaybını önleyen altın kural",
    "Uzun vadeli başarı getiren püf noktalar"
  ];

  const slides = [
    {
      slideNumber: 1,
      type: "cover_hook",
      headline: `${cleanTopic} Hakkında Bilmeniz Gereken Her Şey 📌`,
      subtext: "Kaydır ve detayları adım adım keşfet 👉",
      aestheticTip: "Büyük font, yüksek kontrast, merak uyandıran minimal tasarım."
    },
    ...defaultPoints.map((point, index) => ({
      slideNumber: index + 2,
      type: "value_slide",
      headline: `0${index + 1}. ${point}`,
      subtext: `Burada ${cleanTopic} için uygulanabilir pratik ipucu ve somut örnek yer alır. Kullanıcıya doğrudan fayda sunar.`,
      aestheticTip: "Gözü yormayan maddeleme, ikon ve açıklayıcı şema."
    })),
    {
      slideNumber: defaultPoints.length + 2,
      type: "cta_slide",
      headline: "Özet ve Eylem Adımı",
      subtext: `${cta.text}\n\nTakip et: ${brand?.handle || '@marka'} ile daha fazlasını yakala!`,
      aestheticTip: "Marka renkleri, profil yönlendirmesi ve kaydet butonu ikonu."
    }
  ];

  return {
    format: "carousel",
    topic: cleanTopic,
    totalSlides: slides.length,
    slides
  };
}

/**
 * Builds formatted caption with structured spacing, emojis, and hashtags
 */
export function generateCaption({ brand, topic, hook, bodyPoints = [], ctaType = 'comment', customHashtags = [] }) {
  const cleanTopic = sanitizeInput(topic || 'İçerik');
  const brandName = brand?.name || 'Markamız';
  const cta = CALL_TO_ACTIONS.find(c => c.id === ctaType) || CALL_TO_ACTIONS[1];

  const lines = [];

  // Hook headline
  lines.push(hook || `💡 ${cleanTopic} hakkında bilmeniz gereken kritik detaylar:`);
  lines.push('');

  // Body
  if (bodyPoints.length > 0) {
    bodyPoints.forEach((point, i) => {
      lines.push(`${i + 1}️⃣ ${point}`);
    });
  } else {
    lines.push(`Doğru bir strateji ve özenli bir yaklaşımla ${cleanTopic} sürecini çok daha verimli hale getirebilirsiniz.`);
    lines.push(`Her gün sahada karşılaştığımız tecrübeleri sizinle paylaşıyoruz.`);
  }

  lines.push('');
  lines.push(cta.text);
  lines.push('');
  lines.push('—');

  // Hashtags
  const brandTags = brand?.defaultHashtags || ['#sosyalmedya'];
  const mergedTags = Array.from(new Set([...brandTags, ...customHashtags]));
  lines.push(mergedTags.slice(0, 15).join(' '));

  return lines.join('\n');
}
