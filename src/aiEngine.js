/**
 * Created by 11Hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

export const AI_TONES = {
  luxury_architecture: {
    id: 'luxury_architecture',
    labelTr: '🏛️ Lüks & Prestijli Mimari',
    labelEn: '🏛️ Luxury & Prestigious Architecture',
    prefixTr: 'Konfor, zarafet ve zamansız tasarımın buluştuğu noktada;',
    prefixEn: 'Where comfort, elegance, and timeless design converge;'
  },
  tech_founder: {
    id: 'tech_founder',
    labelTr: '💻 Tech Girişimci & Build-in-Public',
    labelEn: '💻 Tech Founder & Build-in-Public',
    prefixTr: 'Sıfırdan ölçeklenen sistemlerde gerçek verilerle konuşuyoruz:',
    prefixEn: 'Scaling systems from zero with concrete production metrics:'
  },
  friendly_casual: {
    id: 'friendly_casual',
    labelTr: '✨ Samimi & Genç İletişim',
    labelEn: '✨ Friendly & Relatable',
    prefixTr: 'Hepimizin aklındaki o soruyu bugün dürüstçe masaya yatırıyoruz:',
    prefixEn: 'Putting the burning question on the table with zero fluff:'
  },
  authoritative_expert: {
    id: 'authoritative_expert',
    labelTr: '🎯 Otoriter & Eğitici Uzman',
    labelEn: '🎯 Authoritative & Expert Insight',
    prefixTr: 'Sektörün en sık tekrarlanan hatasını ve kanıtlanmış çözümünü inceliyoruz:',
    prefixEn: 'Analyzing the most common industry failure and its proven fix:'
  },
  direct_response: {
    id: 'direct_response',
    labelTr: '🔥 Doğrudan Satış & Teklif (Dönüşüm)',
    labelEn: '🔥 Direct Response & Conversion',
    prefixTr: 'Ertelemeyi bırakıp sonuç almak isteyenler için sınırlı fırsat:',
    prefixEn: 'A high-impact opportunity for those ready to stop procrastinating:'
  }
};

export const NICHE_HASHTAGS = {
  architecture: [
    '#icmimarlik', '#villatasarimi', '#mutfaktasarimi', '#luxuryinterior',
    '#konutprojeleri', '#modernmimari', '#mimariyasam', '#luxuryliving'
  ],
  tech: [
    '#yazilim', '#cleancode', '#softwareengineering', '#buildinpublic',
    '#techstartup', '#swiftui', '#saasdevelopment', '#developerlife'
  ],
  general_business: [
    '#girisimcilik', '#sosyalmedyastratejisi', '#icerikuretici',
    '#dijitalpazarlama', '#growthhacking', '#brandbuilding'
  ]
};

/**
 * Calculates a viral potential score (0-100) based on algorithmic engagement drivers
 * @param {Object} params
 * @param {string} [params.hook]
 * @param {string} [params.body]
 * @param {string} [params.cta]
 * @param {string} [params.format]
 * @returns {Object}
 */
export function calculateViralScore({ hook = '', body = '', cta = '', format = 'reels' } = {}) {
  let hookScore = 10;
  let retentionScore = 10;
  let valueScore = 10;
  let ctaScore = 5;
  const suggestions = [];

  const hookLower = hook.toLowerCase();

  // Hook Evaluation (Max 30 pts)
  if (hookLower.includes('nasıl') || hookLower.includes('how') || hookLower.includes('neden') || hookLower.includes('why')) {
    hookScore += 8;
  }
  if (hookLower.includes('hata') || hookLower.includes('mistake') || hookLower.includes('sakın') || hookLower.includes('never')) {
    hookScore += 10;
  }
  if (/\d+/.test(hook)) {
    hookScore += 6; // Numerical specificity increases CTR
  }
  if (hookScore < 20) {
    suggestions.push('Kancaya şaşırtıcı bir rakam veya merak uyandıran olumsuz bir uyarı ekleyin.');
  }

  // Retention Evaluation (Max 30 pts)
  const bodyLen = body.length;
  if (bodyLen > 150) retentionScore += 10;
  if (body.includes('\n') || body.includes('•') || body.includes('-')) {
    retentionScore += 8; // Bullet formatting increases readability
  }
  if (format === 'reels' && bodyLen < 800) {
    retentionScore += 8; // Optimal Reels duration
  } else if (format === 'carousel' && bodyLen > 300) {
    retentionScore += 8;
  }

  // Value Evaluation (Max 25 pts)
  if (bodyLowerOrIncludes(body, ['çözüm', 'taktik', 'kural', 'adım', 'solution', 'step', 'tip'])) {
    valueScore += 10;
  }
  if (bodyLowerOrIncludes(body, ['örnek', 'referans', 'proje', 'example', 'case study'])) {
    valueScore += 5;
  }

  // CTA Evaluation (Max 15 pts)
  const ctaLower = cta.toLowerCase();
  if (ctaLower.includes('kaydet') || ctaLower.includes('save') || ctaLower.includes('📌')) {
    ctaScore += 8;
  } else if (ctaLower.includes('yorum') || ctaLower.includes('comment') || ctaLower.includes('dm')) {
    ctaScore += 6;
  }

  const totalScore = Math.min(100, hookScore + retentionScore + valueScore + ctaScore);

  let rating = 'moderate';
  let ratingLabelTr = 'İyi Potansiyel (Ortalama Üstü)';
  let ratingLabelEn = 'Good Potential';

  if (totalScore >= 85) {
    rating = 'viral_masterpiece';
    ratingLabelTr = '🚀 Viral Şaheser (%95+ Tutundurma)';
    ratingLabelEn = '🚀 Viral Masterpiece (Top 5%)';
  } else if (totalScore >= 70) {
    rating = 'high';
    ratingLabelTr = '⭐ Yüksek Etkileşim Potansiyeli';
    ratingLabelEn = '⭐ High Engagement Potential';
  } else if (totalScore < 50) {
    rating = 'low';
    ratingLabelTr = '💡 Geliştirilmeli (Zayıf Kanca)';
    ratingLabelEn = '💡 Needs Work (Weak Hook)';
  }

  return {
    score: totalScore,
    breakdown: {
      hook: Math.min(30, hookScore),
      retention: Math.min(30, retentionScore),
      value: Math.min(25, valueScore),
      cta: Math.min(15, ctaScore)
    },
    rating,
    ratingLabelTr,
    ratingLabelEn,
    suggestions
  };
}

function bodyLowerOrIncludes(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

/**
 * Adapts given content to a designated strategic communication tone
 * @param {string} contentText
 * @param {string} toneKey
 * @param {'tr' | 'en'} [lang='tr']
 * @returns {string}
 */
export function adaptTone(contentText, toneKey = 'luxury_architecture', lang = 'tr') {
  const tone = AI_TONES[toneKey] || AI_TONES.luxury_architecture;
  const prefix = lang === 'en' ? tone.prefixEn : tone.prefixTr;
  return `${prefix}\n\n${contentText}`;
}

/**
 * Returns optimized hashtags based on niche and topic
 * @param {'architecture' | 'tech' | 'general_business'} niche
 * @param {string} [customTopic]
 * @returns {Array<string>}
 */
export function generateSmartHashtags(niche = 'general_business', customTopic = '') {
  const baseTags = NICHE_HASHTAGS[niche] || NICHE_HASHTAGS.general_business;
  const customCleaned = customTopic
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/gi, '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2)
    .map(w => `#${w}`);

  return Array.from(new Set([...customCleaned.slice(0, 3), ...baseTags])).slice(0, 10);
}
