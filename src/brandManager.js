/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

/**
 * Strips HTML tags and script injections
 * @param {string} text
 * @returns {string}
 */
export function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Normalizes phone numbers to international format without leading plus
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('90')) {
    cleaned = cleaned.substring(2);
  }
  if (cleaned.length === 10) {
    return `90${cleaned}`;
  }
  return cleaned;
}

export const DEFAULT_BRANDS = [
  {
    id: "nolte-mimarlik",
    name: "Nolte Mimarlık",
    handle: "@noltemimarlik",
    sector: "İç Mimarlık & Lüks Konut",
    tone: "Rafine, lüks, mimari ve estetik",
    primaryColor: "#c5a059",
    secondaryColor: "#14161d",
    targetAudience: "Villa ve rezidans sahipleri, mimari meraklıları",
    defaultHashtags: ["#noltemimarlik", "#icmimarlik", "#villatasarimi", "#luxuryinteriors", "#almanmuhendisligi"],
    clientPhone: "0535 403 13 63"
  },
  {
    id: "butik-platform",
    name: "Maison Butik",
    handle: "@maisonbutik",
    sector: "Moda & Kadın Giyim",
    tone: "Samimi, enerjik, trend ve stil sahibi",
    primaryColor: "#e11d48",
    secondaryColor: "#fff1f2",
    targetAudience: "Şık giyinmeyi seven 20-45 yaş kadınlar",
    defaultHashtags: ["#butikgiyim", "#kombinonerileri", "#modatrendleri", "#stilrehberi", "#yenisezon"],
    clientPhone: "0535 403 13 63"
  },
  {
    id: "osman-savas",
    name: "Osman Savaş Akademi",
    handle: "@osmansavasakademi",
    sector: "Eğitim & KPSS / YKS Coğrafya",
    tone: "Motive edici, öğretici, dinamik ve net",
    primaryColor: "#0284c7",
    secondaryColor: "#0f172a",
    targetAudience: "KPSS ve YKS sınavlarına hazırlanan öğrenciler",
    defaultHashtags: ["#kpsscografya", "#ykscografya", "#sorucozumu", "#haritabilgisi", "#sinavahazirlik"],
    clientPhone: "0535 403 13 63"
  },
  {
    id: "ocguderler-sigorta",
    name: "Öçgüder Sigorta",
    handle: "@ocgudersigorta",
    sector: "Sigorta & Finansal Güvence",
    tone: "Güvenilir, kurumsal, koruyucu ve açıklayıcı",
    primaryColor: "#d97706",
    secondaryColor: "#0f2b48",
    targetAudience: "Araç, konut ve sağlık sigortası arayan aileler & KOBİ'ler",
    defaultHashtags: ["#sigorta", "#kasko", "#trafiksigortasi", "#dask", "#tamamlayicisaglik"],
    clientPhone: "0535 403 13 63"
  }
];

export class BrandManager {
  constructor(initialBrands = DEFAULT_BRANDS) {
    this.brands = [...initialBrands];
  }

  getAllBrands() {
    return [...this.brands];
  }

  getBrandById(id) {
    return this.brands.find(b => b.id === id) || null;
  }

  addBrand(brandData) {
    const name = sanitizeInput(brandData.name);
    if (!name) {
      throw new Error("Marka adı zorunludur.");
    }

    const id = brandData.id 
      ? sanitizeInput(brandData.id) 
      : name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (this.getBrandById(id)) {
      throw new Error(`'${id}' kimlikli marka zaten mevcut.`);
    }

    const newBrand = {
      id,
      name,
      handle: sanitizeInput(brandData.handle || `@${id}`),
      sector: sanitizeInput(brandData.sector || 'Genel Ticaret'),
      tone: sanitizeInput(brandData.tone || 'Profesyonel ve samimi'),
      primaryColor: brandData.primaryColor || '#6366f1',
      secondaryColor: brandData.secondaryColor || '#0f172a',
      targetAudience: sanitizeInput(brandData.targetAudience || 'Genel kitle'),
      defaultHashtags: Array.isArray(brandData.defaultHashtags) 
        ? brandData.defaultHashtags.map(h => sanitizeInput(h)) 
        : ['#socialmedia'],
      clientPhone: normalizePhone(brandData.clientPhone || '')
    };

    this.brands.push(newBrand);
    return newBrand;
  }

  updateBrand(id, updateData) {
    const brand = this.getBrandById(id);
    if (!brand) {
      throw new Error(`Marka bulunamadı: ${id}`);
    }

    if (updateData.name) brand.name = sanitizeInput(updateData.name);
    if (updateData.handle) brand.handle = sanitizeInput(updateData.handle);
    if (updateData.sector) brand.sector = sanitizeInput(updateData.sector);
    if (updateData.tone) brand.tone = sanitizeInput(updateData.tone);
    if (updateData.primaryColor) brand.primaryColor = updateData.primaryColor;
    if (updateData.secondaryColor) brand.secondaryColor = updateData.secondaryColor;
    if (updateData.targetAudience) brand.targetAudience = sanitizeInput(updateData.targetAudience);
    if (updateData.clientPhone) brand.clientPhone = normalizePhone(updateData.clientPhone);
    if (Array.isArray(updateData.defaultHashtags)) {
      brand.defaultHashtags = updateData.defaultHashtags.map(h => sanitizeInput(h));
    }

    return brand;
  }
}
