/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
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
  },
  {
    id: "h-nolte-arch-1",
    category: "architecture",
    categoryTitle: "Mimari & Nolte",
    pattern: "Konya'da bir villa yaptırırken yapılan 3 büyük {TOPIC} hatası ❌",
    example: "Konya'da bir villa yaptırırken yapılan 3 büyük ada mutfak hatası ❌"
  },
  {
    id: "h-nolte-arch-2",
    category: "architecture",
    categoryTitle: "Mimari & Nolte",
    pattern: "Neden lüks villalarda artık sıradan mobilya yerine {TOPIC} tercih ediliyor?",
    example: "Neden lüks villalarda artık sıradan mobilya yerine Alman Nolte Küchen tercih ediliyor?"
  },
  {
    id: "h-nolte-arch-3",
    category: "architecture",
    categoryTitle: "Mimari & Nolte",
    pattern: "Meram'da tamamladığımız bu projenin öncesi ve sonrasına inanamayacaksınız ✨ ({TOPIC})",
    example: "Meram'da tamamladığımız bu projenin öncesi ve sonrasına inanamayacaksınız ✨ (Garden Villaları)"
  },
  {
    id: "h-tech-1",
    category: "tech_developer",
    categoryTitle: "💻 Yazılım & Tech",
    pattern: "Neden 2026'da artık {TOPIC} yazmayı bırakıp AI-native mimariye geçtim?",
    example: "Neden 2026'da artık manuel CRUD yazmayı bırakıp AI-native mimariye geçtim?"
  },
  {
    id: "h-tech-2",
    category: "tech_developer",
    categoryTitle: "💻 Yazılım & Tech",
    pattern: "Senior bir mühendis olarak {TOPIC} yaparken gördüğüm en kritik 3 hata ❌",
    example: "Senior bir mühendis olarak iOS mimarisi kurarken gördüğüm en kritik 3 hata ❌"
  },
  {
    id: "h-tech-3",
    category: "tech_developer",
    categoryTitle: "💻 Yazılım & Tech",
    pattern: "10 yıllık yazılım kariyerimde bana en çok kazandıran {TOPIC} prensibi 📌",
    example: "10 yıllık yazılım kariyerimde bana en çok kazandıran Clean Architecture prensibi 📌"
  },
  {
    id: "h-tech-4",
    category: "tech_developer",
    categoryTitle: "💻 Yazılım & Tech",
    pattern: "Sıfırdan production-ready bir {TOPIC} kurmanın 4 adımlı sistem tasarımı:",
    example: "Sıfırdan production-ready bir SaaS platformu kurmanın 4 adımlı sistem tasarımı:"
  }
];

export const UMUT_TECH_PRESETS = [
  {
    title: "11Hopem: Sıfırdan SaaS Mimarisi Kurmak (Build-in-Public)",
    format: "carousel",
    pillar: "behind_scenes",
    coverText: "Sıfırdan SaaS Şirketi Kurma Günlüğü 🚀",
    caption: "11Hopem çatısı altında geliştirdiğimiz multi-tenant SaaS mimarisinde Next.js 15, Turbopack ve Supabase stack'ini tercih ettik. Sıfırdan mimari kararlar ve dersler kaydırmalı postta!"
  },
  {
    title: "SwiftUI & Clean Architecture ile Zero-Crash iOS Standartları",
    format: "reels",
    pillar: "value",
    coverText: "Zero-Crash iOS Uygulama Mimarisi 📱",
    caption: "iOS uygulamalarında production çökmelerini sıfıra indirmek şans değil, mimari disiplindir. MVVM + Clean Architecture ile decoupling nasıl yapılır?"
  },
  {
    title: "Antigravity ve Agentic AI ile Kodlama Hızımı 5 Katına Nasıl Çıkardım?",
    format: "reels",
    pillar: "value",
    coverText: "AI Agent'lar ile 5x Geliştirici Verimliliği ⚡",
    caption: "Sadece kod tamamlayıcı (autocomplete) değil; otonom AI ajanlarıyla pair-programming yaparak sprint sürelerini yarıya düşürdük. İşte kullandığımız framework."
  },
  {
    title: "Yazılımcılar Neden Sadece Kod Yazarak Yükselemez? (Sistem Tasarımı & İş Analizi)",
    format: "carousel",
    pillar: "social_proof",
    coverText: "Senior Seviyeye Geçişin Görünmeyen Sırrı 💡",
    caption: "Kod yazmak işin %20'si. Şirketlere ve müşterilere değer katan asıl güç; iş analizi, veri modelleme ve ölçeklenebilir sistem tasarımıdır."
  }
];

export const NOLTE_PROJECT_PRESETS = [
  {
    title: "Yakapark Konutları Ada Mutfak & Salon Entegrasyonu",
    format: "reels",
    pillar: "social_proof",
    coverText: "Yakapark Konutları Lüks Mutfak Turu 🏡",
    caption: "Konya Yakapark Konutları için tasarladığımız Nolte Küchen mutfak projesinde Alman ergonomisi ve zarafetini buluşturduk. Milimetrik detaylar ve gizli kiler çözümleriyle hayalinizdeki yaşam alanı."
  },
  {
    title: "Meram Villa Öncesi / Sonrası Büyük Dönüşüm",
    format: "carousel",
    pillar: "social_proof",
    coverText: "Öncesi / Sonrası: Meram Villa Yenileme 👉",
    caption: "Mimar Aysun Özçelik imzasıyla Konya Meram'da hayat bulan bu villada eski doku yerini modern İskandinav lüksüne bıraktı. Adım adım kaydırarak dönüşüme tanık olun!"
  },
  {
    title: "25 Yıl Bozulmayan Blum Çekmece & Sessiz Kapanış Sırrı",
    format: "reels",
    pillar: "behind_scenes",
    coverText: "25 Yıl Boyunca Asla Sarkmayan Çekmeceler 🇩🇪",
    caption: "Nolte Küchen mobilyalarında kullanılan Blum frenli mekanizmalar 200.000 açma-kapama döngüsüyle test ediliyor. Alman mühendisliğinin kalitesi burada gizli."
  },
  {
    title: "Lüks Villalarda Ada Mutfak Ölçüleri: Kaç cm Olmalı?",
    format: "carousel",
    pillar: "value",
    coverText: "Ada Mutfakta Altın Ölçü Kuralı 📐",
    caption: "Ada ile tezgah arası en az 110-120 cm olmalı. Yanlış hesaplanan mutfaklarda hareket alanı kısıtlanır. Mimari keşif için bize ulaşın!"
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
