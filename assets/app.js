/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { BrandManager, DEFAULT_BRANDS } from '../src/brandManager.js';
import {
  VIRAL_HOOKS,
  CALL_TO_ACTIONS,
  CONTENT_PILLARS,
  NOLTE_PROJECT_PRESETS,
  UMUT_TECH_PRESETS,
  generateReelsScript,
  generateCarouselOutline,
  generateCaption
} from '../src/contentStudio.js';
import {
  GridSimulator,
  POST_FORMATS,
  POST_STATUSES
} from '../src/gridSimulator.js';
import {
  buildClientApprovalWhatsAppUrl,
  exportWorkspaceToJson,
  importWorkspaceFromJson
} from '../src/approvalEngine.js';
import { CalendarEngine, generateIcsCalendar } from '../src/calendarEngine.js';
import { SchedulerEngine } from '../src/schedulerEngine.js';
import { AnalyticsEngine } from '../src/analyticsEngine.js';
import { MetaGraphApiClient } from '../src/metaGraphApi.js';
import {
  SUPPORTED_CHANNELS,
  formatContentForChannel,
  publishToChannels
} from '../src/channelConnectors.js';
import { I18nEngine } from '../src/i18n.js';
import { logger } from '../src/telemetry/logger.js';
import { SubscriptionEngine, SUBSCRIPTION_PLANS } from '../src/subscriptionEngine.js';
import { ClientPortalEngine } from '../src/clientPortalEngine.js';
import {
  calculateViralScore,
  adaptTone,
  generateSmartHashtags,
  AI_TONES
} from '../src/aiEngine.js';

// Seed demo posts for rich initial experience (Nolte & Umut Öçgüder)
const INITIAL_DEMO_POSTS = [
  // Umut Öçgüder Software & Tech Posts
  {
    id: "post-umut-1",
    brandId: "umutocguder",
    title: "11Hopem: Sıfırdan SaaS Mimarisi (Build-in-Public)",
    format: "carousel",
    pillar: "behind_scenes",
    status: "published",
    scheduledDate: "2026-09-12",
    scheduledTime: "19:30",
    coverBgColor: "#0284c7",
    coverText: "Sıfırdan SaaS Şirketi Kurma Günlüğü 🚀",
    caption: "11Hopem çatısı altında geliştirdiğimiz multi-tenant SaaS mimarisinde Next.js 15, Turbopack ve Supabase stack'ini tercih ettik."
  },
  {
    id: "post-umut-2",
    brandId: "umutocguder",
    title: "SwiftUI & Clean Architecture ile Zero-Crash iOS Standartları",
    format: "reels",
    pillar: "value",
    status: "scheduled",
    scheduledDate: "2026-09-19",
    scheduledTime: "20:15",
    coverBgColor: "#0f172a",
    coverText: "Zero-Crash iOS Uygulama Mimarisi 📱",
    caption: "iOS uygulamalarında production çökmelerini sıfıra indirmek şans değil, mimari disiplindir."
  },
  {
    id: "post-umut-3",
    brandId: "umutocguder",
    title: "Antigravity ve Agentic AI ile Kodlama Hızımı 5 Katına Nasıl Çıkardım?",
    format: "reels",
    pillar: "value",
    status: "approved",
    scheduledDate: "2026-09-22",
    scheduledTime: "19:30",
    coverBgColor: "#312e81",
    coverText: "AI Agent'lar ile 5x Geliştirici Verimliliği ⚡",
    caption: "Sadece kod tamamlayıcı değil; otonom AI ajanlarıyla pair-programming yaparak sprint sürelerini yarıya düşürdük."
  },
  {
    id: "post-umut-4",
    brandId: "umutocguder",
    title: "Senior Seviyeye Geçişin Sırrı: Sistem Tasarımı & İş Analizi",
    format: "carousel",
    pillar: "social_proof",
    status: "draft",
    scheduledDate: "2026-09-25",
    scheduledTime: "11:30",
    coverBgColor: "#1e1b4b",
    coverText: "Senior Seviyeye Geçişin Görünmeyen Sırrı 💡",
    caption: "Kod yazmak işin %20'si. Asıl güç iş analizi ve ölçeklenebilir sistem tasarımıdır."
  },
  // Nolte Mimarlık Luxury Architecture Posts
  {
    id: "post-1",
    brandId: "nolte-mimarlik",
    title: "Lüks Villalarda Ada Mutfak Hataları",
    format: "reels",
    pillar: "value",
    status: "published",
    scheduledDate: "2026-09-06",
    scheduledTime: "19:30",
    coverBgColor: "#1e293b",
    coverText: "Ada Mutfak Yaptırırken Bu 3 Hataya Düşmeyin ❌",
    caption: "Mutfak tasarımında milimetrik hesaplama neden hayati? Nolte farkıyla inceledik.\n\nKaydetmeyi unutmayın!"
  },
  {
    id: "post-2",
    brandId: "nolte-mimarlik",
    title: "Monochrome Penthouse Teslimatı",
    format: "carousel",
    pillar: "social_proof",
    status: "published",
    scheduledDate: "2026-09-09",
    scheduledTime: "20:00",
    coverBgColor: "#0f172a",
    coverText: "Zorlu Center Penthouse Turu 👉",
    caption: "310 m² yaşam alanında Alman Nolte dokunuşu.\nDetaylar kaydırmalı postta!"
  },
  {
    id: "post-3",
    brandId: "nolte-mimarlik",
    title: "Blum Mekanizma Dayanıklılık Testi",
    format: "reels",
    pillar: "behind_scenes",
    status: "published",
    scheduledDate: "2026-09-13",
    scheduledTime: "18:45",
    coverBgColor: "#172554",
    coverText: "25 Yıl Sorunsuz Açılan Çekmece Sırrı 🤫",
    caption: "Alman mühendisliğinin görünmeyen kahramanları."
  },
  {
    id: "post-4",
    brandId: "nolte-mimarlik",
    title: "Yakapark Konutları Ada Mutfak & Salon Entegrasyonu",
    format: "reels",
    pillar: "social_proof",
    status: "scheduled",
    scheduledDate: "2026-09-18",
    scheduledTime: "20:15",
    coverBgColor: "#2a1e12",
    coverText: "Yakapark Konutları Lüks Mutfak Turu 🏡",
    caption: "Konya Yakapark Konutları için tasarladığımız Nolte Küchen mutfak projesinde Alman ergonomisi ve zarafetini buluşturduk."
  },
  {
    id: "post-5",
    brandId: "nolte-mimarlik",
    title: "Meram Villa Öncesi / Sonrası Büyük Dönüşüm",
    format: "carousel",
    pillar: "social_proof",
    status: "approved",
    scheduledDate: "2026-09-20",
    scheduledTime: "19:30",
    coverBgColor: "#141d2b",
    coverText: "Öncesi / Sonrası: Meram Villa Yenileme 👉",
    caption: "Mimar Aysun Özçelik imzasıyla Konya Meram'da hayat bulan bu villada eski doku yerini modern İskandinav lüksüne bıraktı."
  },
  {
    id: "post-6",
    brandId: "nolte-mimarlik",
    title: "Garden Villaları Cephe & İç Mekan İncelemesi",
    format: "carousel",
    pillar: "social_proof",
    status: "awaiting_approval",
    scheduledDate: "2026-09-23",
    scheduledTime: "19:30",
    coverBgColor: "#1e293b",
    coverText: "Garden Villaları Çağdaş Mimari Dönüşüm ✨",
    caption: "Konya Meram Garden Villaları için hazırladığımız özel iç mimarlık projesi."
  },
  {
    id: "post-7",
    brandId: "nolte-mimarlik",
    title: "Ada Mutfakta Altın Ölçü Kuralı (110-120 cm)",
    format: "carousel",
    pillar: "value",
    status: "draft",
    scheduledDate: "2026-09-26",
    scheduledTime: "11:30",
    coverBgColor: "#0f172a",
    coverText: "Ada Mutfakta Altın Ölçü Kuralı 📐",
    caption: "Ada ile tezgah arası en az 110-120 cm olmalı. Yanlış hesaplanan mutfaklarda hareket alanı kısıtlanır."
  }
];

// Local state
let brandManager;
let gridSimulator;
let calendarEngine;
let schedulerEngine;
let analyticsEngine;
let metaGraphApiClient;
let i18nEngine;
let subscriptionEngine;
let clientPortalEngine;
let currentBillingCycle = 'monthly';

let currentBrandId = 'umutocguder'; // Default to Umut Öçgüder as requested
let selectedHookPattern = VIRAL_HOOKS[0].pattern;
let selectedPostForModal = null;
let currentPreviewChannel = 'all';
let lastGeneratedRawOutput = '';

document.addEventListener('DOMContentLoaded', () => {
  i18nEngine = new I18nEngine();
  subscriptionEngine = new SubscriptionEngine();
  clientPortalEngine = new ClientPortalEngine();
  loadStateFromLocal();
  calendarEngine = new CalendarEngine(2026, 9);
  schedulerEngine = new SchedulerEngine('luxury_architecture');
  analyticsEngine = new AnalyticsEngine(gridSimulator.posts);
  metaGraphApiClient = new MetaGraphApiClient();

  initLanguageSwitcher();
  initTabs();
  initBrandSelector();
  initContentStudio();
  initCalendar();
  initGridSimulator();
  initAnalytics();
  initMetaApi();
  initBrandManagerView();
  initImportExport();
  initPricingModal();
  initClientApproval();

  applyTranslations();
  updateUI();

  logger.info('Social Studio initialized for Umut Öçgüder & Multi-Channel', {
    activeBrandId: currentBrandId,
    language: i18nEngine.getLanguage(),
    totalBrands: brandManager.getAllBrands().length,
    totalPosts: gridSimulator.posts.length
  });
});

function loadStateFromLocal() {
  const localSaved = localStorage.getItem('social_studio_data_v1');
  if (localSaved) {
    const parsed = importWorkspaceFromJson(localSaved);
    if (parsed.success) {
      brandManager = new BrandManager(parsed.brands);
      // Merge initial demo posts if brand posts missing
      const hasUmutPosts = parsed.posts.some(p => p.brandId === 'umutocguder');
      const postsToUse = hasUmutPosts ? parsed.posts : [...parsed.posts, ...INITIAL_DEMO_POSTS.filter(p => p.brandId === 'umutocguder')];
      gridSimulator = new GridSimulator(postsToUse);
      return;
    }
  }
  brandManager = new BrandManager(DEFAULT_BRANDS);
  gridSimulator = new GridSimulator(INITIAL_DEMO_POSTS);
}

function persistState() {
  const json = exportWorkspaceToJson(brandManager.getAllBrands(), gridSimulator.posts);
  localStorage.setItem('social_studio_data_v1', json);
  analyticsEngine = new AnalyticsEngine(gridSimulator.posts);
}

function initLanguageSwitcher() {
  const btnTr = document.getElementById('langBtnTr');
  const btnEn = document.getElementById('langBtnEn');

  if (btnTr) {
    btnTr.addEventListener('click', () => {
      setLanguage('tr');
    });
  }

  if (btnEn) {
    btnEn.addEventListener('click', () => {
      setLanguage('en');
    });
  }
}

function setLanguage(lang) {
  if (!i18nEngine) return;
  i18nEngine.setLanguage(lang);
  applyTranslations();
  updateUI();
  logger.info(`Social Studio active language set to: ${lang.toUpperCase()}`);
}

function applyTranslations() {
  if (!i18nEngine) return;
  const lang = i18nEngine.getLanguage();
  document.documentElement.lang = lang;

  // Translate static text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18nEngine.t(key);
  });

  // Translate input placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = i18nEngine.t(key);
  });

  // Toggle active class on language buttons
  const btnTr = document.getElementById('langBtnTr');
  const btnEn = document.getElementById('langBtnEn');
  if (btnTr && btnEn) {
    btnTr.classList.toggle('active', lang === 'tr');
    btnEn.classList.toggle('active', lang === 'en');
  }

  // Update dynamic weekdays
  renderCalendarWeekdays();
}

function renderCalendarWeekdays() {
  const row = document.getElementById('calWeekdaysRow');
  if (!row) return;
  const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
  const weekdays = lang === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  row.innerHTML = weekdays.map(w => `<div class="cal-weekday">${w}</div>`).join('');
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      const targetView = document.getElementById(btn.dataset.tab);
      if (targetView) targetView.classList.add('active');

      if (btn.dataset.tab === 'tabCalendar') renderCalendar();
      if (btn.dataset.tab === 'tabAnalytics') renderAnalytics();
      if (btn.dataset.tab === 'tabGrid') renderGrid();
    });
  });
}

function initBrandSelector() {
  const select = document.getElementById('globalBrandSelect');
  if (!select) return;

  function renderOptions() {
    select.innerHTML = brandManager.getAllBrands().map(b => `
      <option value="${b.id}" ${b.id === currentBrandId ? 'selected' : ''}>
        ${b.name} (${b.handle})
      </option>
    `).join('');
  }

  renderOptions();

  select.addEventListener('change', (e) => {
    currentBrandId = e.target.value;
    updateUI();
  });
}

function updateUI() {
  const brand = brandManager.getBrandById(currentBrandId) || brandManager.getAllBrands()[0];
  currentBrandId = brand.id;

  // Update Brand Banner
  const banner = document.getElementById('brandBanner');
  if (banner) {
    const posts = gridSimulator.getPostsByBrand(brand.id);
    let channelsHtml = '';

    if (brand.socialAccounts) {
      channelsHtml = `
        <span class="brand-pill" style="background:#e1306c22; color:#f43f5e; border-color:#e1306c55;">📸 ${brand.socialAccounts.instagram}</span>
        <span class="brand-pill" style="background:#ff005022; color:#fda4af; border-color:#ff005055;">🎵 ${brand.socialAccounts.tiktok}</span>
        <span class="brand-pill" style="background:#0a66c222; color:#38bdf8; border-color:#0a66c255;">💼 ${brand.socialAccounts.linkedin}</span>
        <span class="brand-pill" style="background:#ffffff15; color:#f8fafc; border-color:#ffffff33;">𝕏 ${brand.socialAccounts.x}</span>
        ${brand.socialAccounts.web ? `<a href="${brand.socialAccounts.web}" target="_blank" class="brand-pill" style="text-decoration:none; color:var(--primary);">🌐 Web</a>` : ''}
      `;
    } else {
      const locationInfo = brand.showroomLocation ? `📍 ${brand.showroomLocation}` : '';
      const clientLabel = i18nEngine ? i18nEngine.t('brandBanner.client') : 'Müşteri:';
      const notSpecLabel = i18nEngine ? i18nEngine.t('brandBanner.notSpecified') : 'Belirtilmedi';
      channelsHtml = `
        <span class="brand-pill">🏢 ${brand.sector}</span>
        <span class="brand-pill">🎭 ${brand.tone}</span>
        <span class="brand-pill">📱 ${clientLabel} ${brand.clientPhone || notSpecLabel}</span>
        ${locationInfo ? `<span class="brand-pill">${locationInfo}</span>` : ''}
      `;
    }

    const totalContentLabel = i18nEngine ? i18nEngine.t('brandBanner.totalContent') : 'Toplam İçerik';
    const schedPubLabel = i18nEngine ? i18nEngine.t('brandBanner.scheduledPublished') : 'Planlanan / Yayında';
    const awaitingLabel = i18nEngine ? i18nEngine.t('brandBanner.awaitingApproval') : 'Onay Bekleyen';

    banner.innerHTML = `
      <div class="brand-meta">
        <h2>${brand.name} <span class="brand-handle">${brand.handle}</span></h2>
        <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap; align-items:center;">
          ${channelsHtml}
        </div>
      </div>
      <div class="brand-stats-row">
        <div class="stat-pill">
          <span>${totalContentLabel}</span>
          <strong>${posts.length}</strong>
        </div>
        <div class="stat-pill">
          <span>${schedPubLabel}</span>
          <strong style="color:var(--accent-cyan);">${posts.filter(p => p.status === 'scheduled' || p.status === 'published').length}</strong>
        </div>
        <div class="stat-pill">
          <span>${awaitingLabel}</span>
          <strong style="color:var(--accent-amber);">${posts.filter(p => p.status === 'awaiting_approval').length}</strong>
        </div>
      </div>
    `;
  }

  // Update Channel Cards in Multi-Channel tab
  updateChannelCards();

  renderNoltePresets();
  renderUmutPresets();
  renderHooks();
  renderCalendar();
  renderGrid();
  renderPillars();
  renderAnalytics();
  renderOptimalSlots();
  renderBrandList();
  updateSubscriptionBadge();
}

function updateSubscriptionBadge() {
  const badgeText = document.getElementById('tierBadgeText');
  if (!badgeText || !subscriptionEngine) return;
  const plan = subscriptionEngine.getActivePlan();
  badgeText.textContent = plan.badge;
}

function updateChannelCards() {
  const brand = brandManager.getBrandById(currentBrandId);
  const igEl = document.getElementById('channelIgHandle');
  const tiktokEl = document.getElementById('channelTiktokHandle');
  const linkedinEl = document.getElementById('channelLinkedinHandle');
  const xEl = document.getElementById('channelXHandle');
  const metaAccInput = document.getElementById('metaAccountHandle');

  if (brand?.id === 'umutocguder') {
    if (igEl) igEl.textContent = '@umutocguder';
    if (tiktokEl) tiktokEl.textContent = '@umutocguder';
    if (linkedinEl) linkedinEl.textContent = 'in/umutocguder';
    if (xEl) xEl.textContent = '@umutocguder';
    if (metaAccInput) metaAccInput.value = '@umutocguder (Umut Öçgüder Tech Ecosystem)';
  } else {
    if (igEl) igEl.textContent = brand?.handle || '@noltemimarlik';
    if (tiktokEl) tiktokEl.textContent = brand?.handle || '@noltemimarlik';
    if (linkedinEl) linkedinEl.textContent = `in/${brand?.id || 'noltemimarlik'}`;
    if (xEl) xEl.textContent = brand?.handle || '@noltemimarlik';
    if (metaAccInput) metaAccInput.value = `${brand?.handle || '@noltemimarlik'} (${brand?.name || ''})`;
  }
}

/* ==========================================================
   CONTENT STUDIO & PRESETS
   ========================================================== */

function renderNoltePresets() {
  const container = document.getElementById('noltePresetChips');
  const wrap = document.getElementById('noltePresetWrap');
  if (!container || !wrap) return;

  if (currentBrandId === 'nolte-mimarlik') {
    wrap.style.display = 'block';
    container.innerHTML = NOLTE_PROJECT_PRESETS.map((preset, index) => `
      <button class="preset-chip" data-idx="${index}">
        ${preset.coverText || preset.title}
      </button>
    `).join('');

    container.querySelectorAll('.preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = NOLTE_PROJECT_PRESETS[Number(btn.dataset.idx)];
        if (!p) return;
        document.getElementById('topicInput').value = p.title;
        document.getElementById('formatSelect').value = p.format;
        document.getElementById('pillarSelect').value = p.pillar;
        handleContentGeneration();
      });
    });
  } else {
    wrap.style.display = 'none';
  }
}

function renderUmutPresets() {
  const container = document.getElementById('umutPresetChips');
  const wrap = document.getElementById('umutPresetWrap');
  if (!container || !wrap) return;

  if (currentBrandId === 'umutocguder') {
    wrap.style.display = 'block';
    container.innerHTML = UMUT_TECH_PRESETS.map((preset, index) => `
      <button class="preset-chip" data-idx="${index}" style="background:rgba(2, 132, 199, 0.2); border-color:rgba(56, 189, 248, 0.4); color:#7dd3fc;">
        ${preset.coverText || preset.title}
      </button>
    `).join('');

    container.querySelectorAll('.preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = UMUT_TECH_PRESETS[Number(btn.dataset.idx)];
        if (!p) return;
        document.getElementById('topicInput').value = p.title;
        document.getElementById('formatSelect').value = p.format;
        document.getElementById('pillarSelect').value = p.pillar;
        handleContentGeneration();
      });
    });
  } else {
    wrap.style.display = 'none';
  }
}

function initContentStudio() {
  const categoryContainer = document.getElementById('hookCategories');
  if (categoryContainer) {
    const categories = [
      { id: "all", label: "Tümü" },
      { id: "tech_developer", label: "💻 Yazılım & Tech" },
      { id: "architecture", label: "🏛️ Mimari & Nolte" },
      { id: "curiosity", label: "Merak Uyandıran" },
      { id: "shock", label: "Zıt Görüş / Şok" },
      { id: "mistake", label: "Büyük Hatalar" },
      { id: "how_to", label: "Adım Adım Rehber" },
      { id: "secret", label: "Sektör Sırları" }
    ];

    categoryContainer.innerHTML = categories.map((c, i) => `
      <button class="hook-chip ${i === 0 ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>
    `).join('');

    categoryContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.hook-chip');
      if (!chip) return;
      categoryContainer.querySelectorAll('.hook-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderHooks(chip.dataset.cat);
    });
  }

  // Channel Preview Tab Bar in Studio Output
  const channelBar = document.getElementById('channelPreviewBar');
  if (channelBar) {
    channelBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.channel-tab-btn');
      if (!btn) return;
      channelBar.querySelectorAll('.channel-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreviewChannel = btn.dataset.channel;
      renderFormattedChannelOutput();
    });
  }

  // Generate Button
  const genBtn = document.getElementById('generateContentBtn');
  if (genBtn) {
    genBtn.addEventListener('click', handleContentGeneration);
  }

  // Copy Button
  const copyBtn = document.getElementById('copyOutputBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('contentOutput').textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = i18nEngine ? i18nEngine.t('studio.copiedBtn') : '✅ Kopyalandı!';
        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
      });
    });
  }

  // Add to Grid Button
  const addToGridBtn = document.getElementById('addToGridBtn');
  if (addToGridBtn) {
    addToGridBtn.addEventListener('click', handleAddToGridFromStudio);
  }
}

function renderHooks(category = 'all') {
  const hookList = document.getElementById('hookList');
  if (!hookList) return;

  const filtered = category === 'all' 
    ? VIRAL_HOOKS 
    : VIRAL_HOOKS.filter(h => h.category === category);

  hookList.innerHTML = filtered.map((h, idx) => `
    <div class="hook-item ${idx === 0 ? 'selected' : ''}" data-pattern="${h.pattern}">
      <strong>${h.pattern}</strong>
      <div style="font-size:0.75rem; color:var(--text-dim); margin-top:2px;">Örnek: ${h.example}</div>
    </div>
  `).join('');

  if (filtered.length > 0) {
    selectedHookPattern = filtered[0].pattern;
  }

  hookList.addEventListener('click', (e) => {
    const item = e.target.closest('.hook-item');
    if (!item) return;
    hookList.querySelectorAll('.hook-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    selectedHookPattern = item.dataset.pattern;
  });
}

function handleContentGeneration() {
  const currentMonthlyUsage = subscriptionEngine ? subscriptionEngine.getSubscription().monthlyAiCount || 0 : 0;
  if (subscriptionEngine && !subscriptionEngine.canGenerateAiScript(currentMonthlyUsage)) {
    const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
    alert(i18nEngine ? i18nEngine.t('subscription.aiLimitReached') : 'Aylık AI senaryo limitinize ulaştınız. Sınırsız üretim için Pro plana geçin.');
    document.getElementById('pricingModalBtn')?.click();
    return;
  }

  const brand = brandManager.getBrandById(currentBrandId);
  const topic = document.getElementById('topicInput').value.trim() || 'Önemli Bir Konu';
  const format = document.getElementById('formatSelect').value;
  const ctaType = document.getElementById('ctaSelect').value;
  const toneKey = document.getElementById('toneSelect')?.value || 'luxury_architecture';
  const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';

  let outputText = '';

  if (format === 'reels') {
    const script = generateReelsScript({ brand, topic, hookPattern: selectedHookPattern, ctaType });
    outputText = [
      `🎬 REELS / TIKTOK VİRAL VİDEO SENARYOSU`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 Konu: ${script.topic} | Süre: ${script.estimatedDuration}`,
      ``,
      `[00:00 - 00:03] 🪝 KANCA (HOOK):`,
      `🗣️ Sözler: "${script.hook.spokenWords}"`,
      `👁️ Görsel: ${script.hook.visual}`,
      ``,
      `[00:03 - 00:12] ⏱️ İLGİ TUTMA (RETENTION):`,
      `🗣️ Sözler: "${script.retention.spokenWords}"`,
      `👁️ Görsel: ${script.retention.visual}`,
      ``,
      `[00:12 - 00:35] 💡 DEĞER VE ÇÖZÜM (VALUE):`,
      ...script.valueBody.points.map(p => `• ${p}`),
      `👁️ Görsel: ${script.valueBody.visual}`,
      ``,
      `[00:35 - 00:45] 🎯 EYLEME ÇAĞRI (CTA):`,
      `🗣️ Sözler: "${script.callToAction.spokenWords}"`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📝 ÖNERİLEN AÇIKLAMA (CAPTION):`,
      generateCaption({ brand, topic, hook: script.hook.spokenWords, ctaType })
    ].join('\n');
  } else if (format === 'carousel') {
    const outline = generateCarouselOutline({ brand, topic, ctaType });
    outputText = [
      `📑 KAYDIRMALI POST (CAROUSEL) TASARIM PLANI`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 Toplam Slayt: ${outline.totalSlides} Slayt | Konu: ${outline.topic}`,
      ``,
      ...outline.slides.map(s => [
        `[SLAYT ${s.slideNumber}] ${s.headline}`,
        `Metin: ${s.subtext}`,
        `Tasarım İpucu: ${s.aestheticTip}`,
        `---`
      ].join('\n')),
      ``,
      `📝 ÖNERİLEN AÇIKLAMA METNİ:`,
      generateCaption({ brand, topic, hook: outline.slides[0].headline, ctaType })
    ].join('\n');
  } else {
    outputText = generateCaption({
      brand,
      topic,
      hook: selectedHookPattern.replace('{TOPIC}', topic),
      ctaType
    });
  }

  // Strategic Tone Adaptation & Smart Hashtags
  const niche = brand?.id === 'umutocguder' ? 'tech' : (brand?.id === 'nolte-mimarlik' ? 'architecture' : 'general_business');
  const smartTags = generateSmartHashtags(niche, topic);
  outputText = adaptTone(outputText, toneKey, lang);
  outputText += `\n\n📌 ${i18nEngine ? i18nEngine.t('aiStudio.smartHashtagsLabel') : 'Akıllı Önerilen Etiketler'}:\n${smartTags.join(' ')}`;

  // Viral Score Calculation & UI Widget Render
  const viralResult = calculateViralScore({ hook: selectedHookPattern, body: outputText, cta: ctaType, format });
  const scoreWidget = document.getElementById('viralScoreWidget');
  if (scoreWidget) {
    scoreWidget.style.display = 'block';
    const badge = document.getElementById('viralScoreRatingBadge');
    const num = document.getElementById('viralScoreNumber');
    const fill = document.getElementById('viralScoreFill');
    const suggestions = document.getElementById('viralScoreSuggestions');

    if (badge) {
      badge.textContent = lang === 'en' ? viralResult.ratingLabelEn : viralResult.ratingLabelTr;
      badge.className = `api-badge ${viralResult.score >= 70 ? 'connected' : (viralResult.score >= 50 ? 'sandbox' : '')}`;
    }
    if (num) num.textContent = `${viralResult.score}/100`;
    if (fill) fill.style.width = `${viralResult.score}%`;
    if (suggestions) {
      if (viralResult.suggestions.length > 0) {
        suggestions.textContent = `💡 ${viralResult.suggestions.join(' ')}`;
      } else {
        suggestions.textContent = lang === 'en' 
          ? '✨ High-retention algorithmic drivers detected.' 
          : '✨ Yüksek tutundurma ve viral algoritmik tetikleyiciler devrede.';
      }
    }
  }

  if (subscriptionEngine) {
    subscriptionEngine.recordAiGeneration();
  }

  lastGeneratedRawOutput = outputText;
  renderFormattedChannelOutput();
}

function renderFormattedChannelOutput() {
  const outputEl = document.getElementById('contentOutput');
  if (!outputEl) return;

  const brand = brandManager.getBrandById(currentBrandId);
  const topic = document.getElementById('topicInput').value.trim() || 'Yazılım & Teknoloji';

  if (!lastGeneratedRawOutput) {
    outputEl.textContent = i18nEngine
      ? i18nEngine.t('studio.initialPlaceholder')
      : "Sol taraftan bir kanca ve konu seçip 'Senaryo & Metni Üret' butonuna tıkladığınızda senaryo ve açıklamalar burada oluşturulacaktır.";
    return;
  }

  if (currentPreviewChannel === 'all') {
    outputEl.textContent = lastGeneratedRawOutput;
    return;
  }

  const formatted = formatContentForChannel({
    topic,
    baseText: lastGeneratedRawOutput,
    channel: currentPreviewChannel,
    brand
  });

  if (currentPreviewChannel === 'x') {
    outputEl.textContent = [
      `🕮 X / TWITTER THREAD (FLOOD) FORMATI`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Toplam Tweet: ${formatted.totalTweets} (Her biri max 280 karakter)`,
      ``,
      ...formatted.tweets.map((t, i) => `[TWEET ${i + 1}]\n${t}\n-----------------------------------------`)
    ].join('\n');
  } else {
    outputEl.textContent = formatted.text;
  }
}

function handleAddToGridFromStudio() {
  const topic = document.getElementById('topicInput').value.trim() || 'Yeni İçerik';
  const format = document.getElementById('formatSelect').value;
  const pillar = document.getElementById('pillarSelect').value;
  const caption = document.getElementById('contentOutput').textContent;

  const nextSlot = schedulerEngine.findNextOptimalSlot(gridSimulator.posts);

  gridSimulator.addPost({
    brandId: currentBrandId,
    title: topic,
    format: format === 'reels' ? 'reels' : (format === 'carousel' ? 'carousel' : 'single_photo'),
    pillar,
    status: 'draft',
    scheduledDate: nextSlot.scheduledDate,
    scheduledTime: nextSlot.scheduledTime,
    caption
  });

  persistState();
  updateUI();
  alert(`İçerik başarıyla takvime (${nextSlot.scheduledDate} ${nextSlot.scheduledTime}) ve 9-Grid'e eklendi!`);
}

/* ==========================================================
   EDITORIAL CALENDAR & SCHEDULER
   ========================================================== */

function initCalendar() {
  const prevBtn = document.getElementById('calPrevMonthBtn');
  const nextBtn = document.getElementById('calNextMonthBtn');
  const todayBtn = document.getElementById('calTodayBtn');
  const autoBtn = document.getElementById('autoScheduleBtn');
  const icsBtn = document.getElementById('exportIcsBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      calendarEngine.previousMonth();
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      calendarEngine.nextMonth();
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      calendarEngine.setDate(new Date().getFullYear(), new Date().getMonth() + 1);
      renderCalendar();
    });
  }

  if (autoBtn) {
    autoBtn.addEventListener('click', handleAutoSchedule);
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', handleExportIcs);
  }
}

function renderCalendar() {
  const gridEl = document.getElementById('calendarGrid');
  const titleEl = document.getElementById('calMonthTitle');
  if (!gridEl || !titleEl) return;

  const activeLang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
  titleEl.textContent = calendarEngine.getMonthLabel(activeLang);
  const cells = calendarEngine.getGridWithPosts(gridSimulator.posts, currentBrandId);

  gridEl.innerHTML = cells.map(cell => {
    const postChips = cell.posts.map(p => {
      const formatIcon = p.format === 'reels' ? '🎬' : (p.format === 'carousel' ? '📑' : '📷');
      return `
        <div class="cal-post-chip status-${p.status}" data-post-id="${p.id}" title="${p.title} (${p.scheduledTime || '19:00'})">
          ${formatIcon} ${p.scheduledTime ? p.scheduledTime.substring(0, 5) : ''} ${p.title}
        </div>
      `;
    }).join('');

    const todayText = i18nEngine ? i18nEngine.t('calendar.today').toUpperCase() : 'BUGÜN';

    return `
      <div class="cal-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${cell.isToday ? 'today' : ''}" data-date="${cell.isoDate}">
        <div class="cal-day-num">
          <span>${cell.dayNumber}</span>
          ${cell.isToday ? `<span style="font-size:0.65rem; color:var(--primary);">${todayText}</span>` : ''}
        </div>
        <div style="display:flex; flex-direction:column; gap:3px; overflow:hidden;">
          ${postChips}
        </div>
      </div>
    `;
  }).join('');

  gridEl.querySelectorAll('.cal-post-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const post = gridSimulator.posts.find(p => p.id === chip.dataset.postId);
      if (post) openPostModal(post);
    });
  });

  gridEl.querySelectorAll('.cal-day-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const targetDate = cell.dataset.date;
      document.getElementById('quickPostDate').value = targetDate;
      document.querySelector('.tab-btn[data-tab="tabGrid"]').click();
      document.getElementById('quickPostTitle').focus();
    });
  });
}

function handleAutoSchedule() {
  const brandPosts = gridSimulator.getPostsByBrand(currentBrandId);
  const drafts = brandPosts.filter(p => p.status === 'draft' || !p.scheduledDate);

  if (drafts.length === 0) {
    const next = schedulerEngine.findNextOptimalSlot(gridSimulator.posts);
    alert(`Tüm içerikler zaten planlanmış durumda!\nSıradaki en uygun boş saat: ${next.dayName} (${next.scheduledDate}) Saat: ${next.scheduledTime}\nGerekçe: ${next.reason}`);
    return;
  }

  let scheduledCount = 0;
  drafts.forEach(post => {
    const slot = schedulerEngine.findNextOptimalSlot(gridSimulator.posts);
    post.scheduledDate = slot.scheduledDate;
    post.scheduledTime = slot.scheduledTime;
    post.status = 'scheduled';
    scheduledCount++;
  });

  persistState();
  updateUI();
  alert(`${scheduledCount} adet taslak içerik en yüksek etkileşimli saat slotlarına otomatik olarak yerleştirildi!`);
}

function handleExportIcs() {
  const brand = brandManager.getBrandById(currentBrandId);
  const brandPosts = gridSimulator.getPostsByBrand(currentBrandId);
  const icsString = generateIcsCalendar(brandPosts, brand);

  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${brand.id}-sosyal-medya-takvimi.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

function renderOptimalSlots() {
  const container = document.getElementById('optimalSlotsList');
  if (!container) return;

  const slots = schedulerEngine.getOptimalSlots();
  container.innerHTML = slots.map(s => `
    <div style="background:var(--bg-surface); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:var(--text-main); font-size:0.95rem;">${s.dayName}</strong>
        <span style="color:var(--accent-cyan); font-weight:700; font-size:0.95rem;">${s.time}</span>
      </div>
      <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${s.reason}</p>
      <div style="margin-top:6px; font-size:0.72rem; color:var(--accent-green);">Etkileşim Skoru: %${s.weight} ⭐</div>
    </div>
  `).join('');
}

/* ==========================================================
   ANALYTICS & EXECUTIVE REPORTING
   ========================================================== */

function initAnalytics() {
  const copyBtn = document.getElementById('copyExecReportBtn');
  const waBtn = document.getElementById('waExecReportBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('executiveReportOutput').textContent;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✅ Kopyalandı!';
        setTimeout(() => { copyBtn.textContent = '📋 Raporu Kopyala'; }, 2000);
      });
    });
  }

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const brand = brandManager.getBrandById(currentBrandId);
      const report = analyticsEngine.generateExecutiveReport(brand);
      const encoded = encodeURIComponent(report);
      const phone = brand.clientPhone ? brand.clientPhone.replace(/\D/g, '') : '';
      window.open(`https://wa.me/90${phone.slice(-10)}?text=${encoded}`, '_blank');
    });
  }
}

function renderAnalytics() {
  const kpiRow = document.getElementById('analyticsKpiRow');
  const formatGrid = document.getElementById('formatBarGrid');
  const reportOutput = document.getElementById('executiveReportOutput');
  if (!kpiRow || !formatGrid) return;

  const kpis = analyticsEngine.calculateBrandKPIs(currentBrandId);
  const brand = brandManager.getBrandById(currentBrandId);
  const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
  const locale = lang === 'en' ? 'en-US' : 'tr-TR';

  kpiRow.innerHTML = `
    <div class="kpi-card">
      <span class="kpi-card-label">${i18nEngine ? i18nEngine.t('analytics.reachLabel') : 'Toplam Erişim'}</span>
      <div class="kpi-card-val">${kpis.totalReach.toLocaleString(locale)}</div>
      <div class="kpi-card-sub">▲ %22.4 ${lang === 'en' ? 'Cross-Channel Distribution' : 'Çoklu Kanal Dağıtımı'}</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-card-label">${i18nEngine ? i18nEngine.t('analytics.impressionsLabel') : 'Toplam Gösterim'}</span>
      <div class="kpi-card-val">${kpis.totalImpressions.toLocaleString(locale)}</div>
      <div class="kpi-card-sub">▲ %28.6 ${lang === 'en' ? 'TikTok & LinkedIn Explore' : 'TikTok & LinkedIn Keşfet'}</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-card-label">${i18nEngine ? i18nEngine.t('analytics.erLabel') : 'Etkileşim Oranı (ER)'}</span>
      <div class="kpi-card-val">%${kpis.engagementRate}</div>
      <div class="kpi-card-sub">⭐ ${lang === 'en' ? '2.4x Industry Benchmark' : 'Sektör Ortalamasının 2.4x Katı'}</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-card-label">${i18nEngine ? i18nEngine.t('analytics.healthScoreLabel') : 'Hesap Sağlık Skoru'}</span>
      <div class="kpi-card-val" style="color:var(--accent-green);">${kpis.healthScore} <span style="font-size:1rem;">/ 100</span></div>
      <div class="kpi-card-sub">${lang === 'en' ? 'Cross-Platform Active' : 'Cross-Platform Dağıtım Aktif'}</div>
    </div>
  `;

  const formats = analyticsEngine.getFormatPerformance(currentBrandId);
  formatGrid.innerHTML = formats.map(f => `
    <div class="format-bar-row">
      <div class="format-bar-meta">
        <span>${f.icon} <strong>${f.label}</strong> (${f.count} ${lang === 'en' ? 'Posts' : 'İçerik'})</span>
        <span style="color:var(--accent-cyan);">%${f.avgEngagement} ${lang === 'en' ? 'Avg ER' : 'Ortalama ER'} • ${lang === 'en' ? 'Potential' : 'Potansiyel'}: <strong>${f.viralPotential}</strong></span>
      </div>
      <div class="pillar-bar-wrap">
        <div class="pillar-bar-fill" style="width:${f.avgEngagement * 10}%; background:var(--primary);"></div>
      </div>
    </div>
  `).join('');

  if (reportOutput) {
    const periodLabel = calendarEngine.getMonthLabel(lang);
    reportOutput.textContent = analyticsEngine.generateExecutiveReport(brand, periodLabel);
  }
}

/* ==========================================================
   MULTI-CHANNEL & META GRAPH API INTEGRATION
   ========================================================== */

function initMetaApi() {
  const modeSelect = document.getElementById('metaModeSelect');
  const verifyBtn = document.getElementById('verifyTokenBtn');
  const profileBtn = document.getElementById('fetchProfileBtn');
  const testPublishBtn = document.getElementById('testPublishBtn');
  const consoleEl = document.getElementById('metaConsoleOutput');

  function logToConsole(message, data = null) {
    if (!consoleEl) return;
    const time = new Date().toLocaleTimeString('tr-TR');
    let logLine = `[${time}] ${message}\n`;
    if (data) {
      logLine += JSON.stringify(data, null, 2) + '\n';
    }
    consoleEl.textContent += logLine + '-----------------------------------------\n';
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      const mode = e.target.value;
      metaGraphApiClient.setMode(mode);
      const badge = document.getElementById('apiStatusBadge');
      if (mode === 'live') {
        badge.className = 'api-badge connected';
        badge.textContent = '🚀 Canlı API Modu';
      } else {
        badge.className = 'api-badge sandbox';
        badge.textContent = '🧪 Sandbox Modu';
      }
      logToConsole(`Çalışma modu değiştirildi: ${mode.toUpperCase()}`);
    });
  }

  if (verifyBtn) {
    verifyBtn.addEventListener('click', async () => {
      const token = document.getElementById('metaTokenInput').value;
      logToConsole('Meta & Sosyal Ağ API İzinleri denetleniyor...');
      const res = await metaGraphApiClient.verifyToken(token);
      logToConsole('Token doğrulama sonucu:', res);
      if (res.valid) {
        alert('Tüm platform izinleri geçerli!\nİzinler: ' + res.scopes.join(', '));
      } else {
        alert('Hata: ' + res.error);
      }
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', async () => {
      const brand = brandManager.getBrandById(currentBrandId);
      logToConsole(`Kanal profilleri sorgulanıyor: ${brand.name} (${brand.handle})...`);
      
      const channelProfiles = {
        brand: brand.name,
        handle: brand.handle,
        instagram: { status: 'CONNECTED', followers: 14850, handle: brand.handle },
        tiktok: { status: 'CONNECTED', followers: 28400, handle: brand.handle },
        linkedin: { status: 'CONNECTED', connections: '500+', handle: brand.socialAccounts?.linkedin || brand.handle },
        x: { status: 'CONNECTED', followers: 8920, handle: brand.handle }
      };

      logToConsole('Çoklu Kanal Profil Durumu:', channelProfiles);
      alert(`Tüm Kanallar Başarıyla Bağlandı:\n• Instagram: ${brand.handle}\n• TikTok: ${brand.handle}\n• LinkedIn: ${brand.socialAccounts?.linkedin || brand.handle}\n• X (Twitter): ${brand.handle}`);
    });
  }

  if (testPublishBtn) {
    testPublishBtn.addEventListener('click', async () => {
      const brand = brandManager.getBrandById(currentBrandId);
      const brandPosts = gridSimulator.getPostsByBrand(currentBrandId);
      const targetPost = brandPosts.find(p => p.status !== 'published') || brandPosts[0];

      if (!targetPost) {
        alert('Yayınlanacak gönderi bulunamadı.');
        return;
      }

      // Collect checked channels
      const targetChannels = [];
      if (document.getElementById('chkInstagram')?.checked) targetChannels.push('instagram');
      if (document.getElementById('chkTiktok')?.checked) targetChannels.push('tiktok');
      if (document.getElementById('chkLinkedin')?.checked) targetChannels.push('linkedin');
      if (document.getElementById('chkX')?.checked) targetChannels.push('x');

      if (targetChannels.length === 0) {
        alert('Lütfen en az bir yayın kanalı seçiniz.');
        return;
      }

      logToConsole(`Cross-Posting dağıtım başlatıldı: "${targetPost.title}"`);
      logToConsole(`Hedef Ağlar: ${targetChannels.map(c => c.toUpperCase()).join(', ')}`);

      try {
        const mode = document.getElementById('metaModeSelect')?.value || 'sandbox';
        const result = await publishToChannels({
          post: targetPost,
          channels: targetChannels,
          brand,
          mode
        });

        logToConsole('Çoklu Kanal Dağıtım Tamamlandı:', result);

        targetPost.status = 'published';
        persistState();
        updateUI();

        const channelSummary = result.results.map(r => `${r.icon} ${r.channelName}: ${r.status}`).join('\n');
        alert(`Tebrikler! '${targetPost.title}' içeriği seçtiğiniz tüm kanallara başarıyla dağıtıldı!\n\n${channelSummary}`);
      } catch (err) {
        logToConsole(`Yayınlama hatası: ${err.message}`);
        alert(`Yayınlama hatası: ${err.message}`);
      }
    });
  }
}

/* ==========================================================
   9-GRID SIMULATOR & MODAL
   ========================================================== */

function initGridSimulator() {
  const addPostForm = document.getElementById('quickAddPostForm');
  if (addPostForm) {
    addPostForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('quickPostTitle').value;
      const format = document.getElementById('quickPostFormat').value;
      const pillar = document.getElementById('quickPostPillar').value;
      const date = document.getElementById('quickPostDate').value;

      gridSimulator.addPost({
        brandId: currentBrandId,
        title,
        format,
        pillar,
        status: 'draft',
        scheduledDate: date,
        scheduledTime: '19:30'
      });

      persistState();
      updateUI();
      addPostForm.reset();
      alert(`'${title}' içeriği ızgaraya ve takvime eklendi!`);
    });
  }

  const modal = document.getElementById('postModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  const statusSelect = document.getElementById('modalStatusSelect');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      if (!selectedPostForModal) return;
      gridSimulator.updatePostStatus(selectedPostForModal.id, e.target.value);
      persistState();
      updateUI();
    });
  }

  const waBtn = document.getElementById('modalWhatsAppBtn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!selectedPostForModal) return;
      const brand = brandManager.getBrandById(currentBrandId);
      const url = buildClientApprovalWhatsAppUrl({ brand, post: selectedPostForModal });
      window.open(url, '_blank');
    });
  }
}

function renderGrid() {
  const gridContainer = document.getElementById('instaGrid');
  const handleEl = document.getElementById('phoneHandle');
  if (!gridContainer) return;

  const brand = brandManager.getBrandById(currentBrandId);
  if (handleEl && brand) {
    handleEl.textContent = brand.handle;
  }

  const nineGrid = gridSimulator.getNineGrid(currentBrandId);

  let cellsHtml = '';
  for (let i = 0; i < 9; i++) {
    const post = nineGrid[i];
    if (post) {
      const formatIcon = post.format === 'reels' ? '🎬' : (post.format === 'carousel' ? '📑' : '📷');
      const statusObj = POST_STATUSES.find(s => s.id === post.status) || POST_STATUSES[0];
      cellsHtml += `
        <div class="grid-cell" style="background:${post.coverBgColor};" data-id="${post.id}">
          <span class="grid-cell-badge">${formatIcon}</span>
          <p class="grid-cell-title">${post.coverText || post.title}</p>
          <span class="grid-cell-status" style="background:${statusObj.color};">${statusObj.label}</span>
        </div>
      `;
    } else {
      cellsHtml += `
        <div class="grid-cell" style="background:#131b2e; border:1px dashed var(--border-subtle); opacity:0.5;">
          <span style="font-size:1.5rem; color:var(--text-dim);">+</span>
        </div>
      `;
    }
  }

  gridContainer.innerHTML = cellsHtml;

  gridContainer.querySelectorAll('.grid-cell[data-id]').forEach(cell => {
    cell.addEventListener('click', () => {
      const post = gridSimulator.posts.find(p => p.id === cell.dataset.id);
      if (post) openPostModal(post);
    });
  });
}

function openPostModal(post) {
  selectedPostForModal = post;
  const modal = document.getElementById('postModal');
  if (!modal) return;

  document.getElementById('modalPostTitle').textContent = post.title;
  document.getElementById('modalPostFormat').textContent = `${post.format.toUpperCase()} • ${post.scheduledDate} ${post.scheduledTime || '19:00'}`;
  document.getElementById('modalStatusSelect').value = post.status;
  document.getElementById('modalPostCaption').textContent = post.caption || '(Açıklama metni henüz eklenmemiş)';

  renderModalAuditTrail(post.id);
  modal.classList.add('open');
}

function renderPillars() {
  const listEl = document.getElementById('pillarMeterList');
  if (!listEl) return;

  const distribution = gridSimulator.calculatePillarDistribution(currentBrandId);

  listEl.innerHTML = distribution.map(p => `
    <div class="pillar-meter-item">
      <div class="pillar-meter-header">
        <span>${p.icon} <strong>${p.name}</strong> (${p.count} Post)</span>
        <span style="color:${p.isBalanced ? 'var(--accent-green)' : 'var(--accent-amber)'};">
          %${p.actualPercentage} / Hedef: %${p.targetPercentage}
        </span>
      </div>
      <div class="pillar-bar-wrap">
        <div class="pillar-bar-fill" style="width:${Math.min(100, p.actualPercentage)}%; background:${p.color};"></div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================
   BRAND MANAGER & IMPORT/EXPORT
   ========================================================== */

function initBrandManagerView() {
  const form = document.getElementById('newBrandForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const currentBrandCount = brandManager.getAllBrands().length;
        if (subscriptionEngine && !subscriptionEngine.canAddBrand(currentBrandCount)) {
          const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
          alert(i18nEngine ? i18nEngine.t('subscription.brandLimitReached') : 'Marka limitinize ulaştınız. Yeni marka eklemek için Pro veya Agency planına geçin.');
          document.getElementById('pricingModalBtn')?.click();
          return;
        }

        const name = document.getElementById('newBrandName').value;
        const handle = document.getElementById('newBrandHandle').value;
        const sector = document.getElementById('newBrandSector').value;
        const phone = document.getElementById('newBrandPhone').value;
        const tone = document.getElementById('newBrandTone').value;

        const newBrand = brandManager.addBrand({
          name,
          handle,
          sector,
          clientPhone: phone,
          tone
        });

        persistState();
        initBrandSelector();
        currentBrandId = newBrand.id;
        updateUI();
        form.reset();
        alert(`'${name}' markası başarıyla eklendi!`);
      } catch (err) {
        alert(err.message);
      }
    });
  }
}

function renderBrandList() {
  const listContainer = document.getElementById('brandList');
  if (!listContainer) return;

  listContainer.innerHTML = brandManager.getAllBrands().map(b => `
    <div class="card" style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4>${b.name} <span style="color:var(--primary); font-size:0.85rem;">${b.handle}</span></h4>
        <p style="font-size:0.82rem; color:var(--text-muted);">${b.sector} • ${b.tone}</p>
        <p style="font-size:0.8rem; color:var(--text-dim); margin-top:4px;">📞 İletişim: ${b.clientPhone || 'Yok'}</p>
      </div>
      <button class="btn btn-outline js-switch-brand" data-id="${b.id}">Yönet</button>
    </div>
  `).join('');

  listContainer.querySelectorAll('.js-switch-brand').forEach(btn => {
    btn.addEventListener('click', () => {
      currentBrandId = btn.dataset.id;
      document.getElementById('globalBrandSelect').value = currentBrandId;
      updateUI();
      document.querySelector('.tab-btn[data-tab="tabStudio"]').click();
    });
  });
}

function initImportExport() {
  const exportBtn = document.getElementById('exportJsonBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const json = exportWorkspaceToJson(brandManager.getAllBrands(), gridSimulator.posts);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `social-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const importInput = document.getElementById('importJsonInput');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = importWorkspaceFromJson(event.target.result);
        if (res.success) {
          brandManager = new BrandManager(res.brands);
          gridSimulator = new GridSimulator(res.posts);
          persistState();
          initBrandSelector();
          updateUI();
          alert("Veriler başarıyla içe aktarıldı!");
        } else {
          alert(`Hata: ${res.error}`);
        }
      };
      reader.readAsText(file);
    });
  }
}

/* ==========================================================
   SUBSCRIPTION, PRICING & CLIENT REVIEW PORTAL
   ========================================================== */

function initPricingModal() {
  const modal = document.getElementById('pricingModal');
  const openBtn = document.getElementById('pricingModalBtn');
  const closeBtn = document.getElementById('closePricingModalBtn');
  const monthlyBtn = document.getElementById('billingMonthlyBtn');
  const annualBtn = document.getElementById('billingAnnualBtn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      renderPricingCards();
      modal.classList.add('open');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  if (monthlyBtn && annualBtn) {
    monthlyBtn.addEventListener('click', () => {
      currentBillingCycle = 'monthly';
      monthlyBtn.classList.add('active');
      annualBtn.classList.remove('active');
      renderPricingCards();
    });

    annualBtn.addEventListener('click', () => {
      currentBillingCycle = 'yearly';
      annualBtn.classList.add('active');
      monthlyBtn.classList.remove('active');
      renderPricingCards();
    });
  }

  renderPricingCards();
}

function renderPricingCards() {
  const grid = document.getElementById('pricingCardsGrid');
  if (!grid || !subscriptionEngine) return;

  const currentPlan = subscriptionEngine.getActivePlan();
  const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
  const plans = Object.values(SUBSCRIPTION_PLANS);

  grid.innerHTML = plans.map(p => {
    const isActive = p.id === currentPlan.id;
    const isRecommended = Boolean(p.recommended);
    const priceTRY = currentBillingCycle === 'yearly' ? Math.round(p.prices.TRY.yearly / 12) : p.prices.TRY.monthly;
    const features = lang === 'en' ? p.featuresEn : p.featuresTr;
    const planName = lang === 'en' ? p.name : p.nameTr;
    const periodLabel = lang === 'en' ? '/ mo' : '/ ay';
    const billedLabel = currentBillingCycle === 'yearly'
      ? (lang === 'en' ? `Billed $${p.prices.USD.yearly} / yr` : `Yıllık ₺${p.prices.TRY.yearly} faturalanır`)
      : '';

    let actionBtnHtml = '';
    if (isActive) {
      actionBtnHtml = `<button class="btn btn-outline" style="width:100%; cursor:default; opacity:0.8;" disabled>
        ${i18nEngine ? i18nEngine.t('subscription.activePlanBtn') : 'Aktif Plan'}
      </button>`;
    } else {
      actionBtnHtml = `<button class="btn ${isRecommended ? 'btn-primary' : 'btn-outline'} js-upgrade-plan-btn" data-plan="${p.id}" style="width:100%;">
        ${i18nEngine ? i18nEngine.t('subscription.upgradeBtn') : 'Bu Plana Geç'}
      </button>`;
    }

    return `
      <div class="pricing-card ${isRecommended ? 'recommended' : ''} ${isActive ? 'active' : ''}">
        ${isRecommended ? `<div class="recommended-badge">${lang === 'en' ? '⭐ MOST POPULAR' : '⭐ EN POPÜLER'}</div>` : ''}
        <h4 style="font-size:1.15rem; margin-top:8px;">${planName}</h4>
        <div class="pricing-price">
          ${priceTRY === 0 ? (lang === 'en' ? 'Free' : 'Ücretsiz') : `₺${priceTRY} <span style="font-size:0.85rem; font-weight:400; color:var(--text-muted);">${periodLabel}</span>`}
        </div>
        ${billedLabel ? `<div style="font-size:0.75rem; color:var(--accent-cyan); margin-bottom:12px;">${billedLabel}</div>` : '<div style="margin-bottom:12px;"></div>'}
        <ul class="pricing-features">
          ${features.map(f => `<li><span class="pricing-check">✓</span> ${f}</li>`).join('')}
        </ul>
        <div style="margin-top:auto;">
          ${actionBtnHtml}
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.js-upgrade-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPlan = btn.dataset.plan;
      try {
        subscriptionEngine.upgradePlan(targetPlan, currentBillingCycle);
        updateSubscriptionBadge();
        renderPricingCards();
        document.getElementById('pricingModal')?.classList.remove('open');
        const plan = subscriptionEngine.getActivePlan();
        alert(lang === 'en'
          ? `🎉 Plan successfully upgraded to ${plan.name}!`
          : `🎉 Tebrikler! Planınız başarıyla ${plan.nameTr} olarak güncellendi!`);
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

function initClientApproval() {
  const approveBtn = document.getElementById('modalApproveBtn');
  const revisionBtn = document.getElementById('modalRevisionBtn');

  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      if (!selectedPostForModal) return;
      const brand = brandManager.getBrandById(currentBrandId);

      clientPortalEngine.processClientDecision(
        selectedPostForModal.id,
        'approved',
        'İçerik onaylandı, yayına hazır.',
        brand?.name || 'Müşteri'
      );

      selectedPostForModal.status = 'approved';
      gridSimulator.updatePostStatus(selectedPostForModal.id, 'approved');
      const statusSelect = document.getElementById('modalStatusSelect');
      if (statusSelect) statusSelect.value = 'approved';

      persistState();
      updateUI();
      renderModalAuditTrail(selectedPostForModal.id);

      const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
      alert(lang === 'en'
        ? '✅ Post successfully approved by client!'
        : '✅ Gönderi müşteri tarafından başarıyla onaylandı!');
    });
  }

  if (revisionBtn) {
    revisionBtn.addEventListener('click', () => {
      if (!selectedPostForModal) return;
      const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
      const promptMsg = lang === 'en'
        ? 'Please specify your revision request / feedback:'
        : 'Lütfen talep ettiğiniz revizyon veya değişiklik notlarını giriniz:';
      const defaultNote = lang === 'en' ? 'Refine the hook for higher curiosity' : 'Kancayı daha dikkat çekici yapalım';
      const userFeedback = prompt(promptMsg, defaultNote);

      if (userFeedback === null) return;

      const brand = brandManager.getBrandById(currentBrandId);
      clientPortalEngine.processClientDecision(
        selectedPostForModal.id,
        'revision_requested',
        userFeedback || defaultNote,
        brand?.name || 'Müşteri'
      );

      selectedPostForModal.status = 'draft';
      gridSimulator.updatePostStatus(selectedPostForModal.id, 'draft');
      const statusSelect = document.getElementById('modalStatusSelect');
      if (statusSelect) statusSelect.value = 'draft';

      persistState();
      updateUI();
      renderModalAuditTrail(selectedPostForModal.id);

      alert(lang === 'en'
        ? '🔄 Revision request logged and post marked as draft.'
        : '🔄 Revizyon talebi kaydedildi ve içerik taslak durumuna alındı.');
    });
  }
}

function renderModalAuditTrail(postId) {
  const auditContainer = document.getElementById('modalPortalAuditTrail');
  if (!auditContainer || !clientPortalEngine) return;

  const logs = clientPortalEngine.getReviewLogsByPost(postId);
  if (!logs || logs.length === 0) {
    auditContainer.style.display = 'none';
    auditContainer.innerHTML = '';
    return;
  }

  const lang = i18nEngine ? i18nEngine.getLanguage() : 'tr';
  const title = lang === 'en' ? '📜 Client Approval Audit Trail' : '📜 Müşteri Onay Denetim Kayıtları';

  auditContainer.style.display = 'block';
  auditContainer.innerHTML = `
    <div style="font-weight:700; margin-bottom:6px; color:var(--text-light);">${title}:</div>
    ${logs.map(log => `
      <div style="margin-bottom:4px; padding-bottom:4px; border-bottom:1px solid var(--border-subtle);">
        <span>${log.decision === 'approved' ? '🟢 ONAYLANDI' : '🔄 REVİZYON İSTENDİ'}</span> • 
        <span>${new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span> • 
        <span style="color:var(--text-muted);">${log.notes || '-'}</span>
      </div>
    `).join('')}
  `;
}

