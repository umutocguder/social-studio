/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { BrandManager, DEFAULT_BRANDS } from '../src/brandManager.js';
import {
  VIRAL_HOOKS,
  CALL_TO_ACTIONS,
  CONTENT_PILLARS,
  NOLTE_PROJECT_PRESETS,
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
import { logger } from '../src/telemetry/logger.js';

// Seed demo posts for rich initial experience with real Nolte projects
const INITIAL_DEMO_POSTS = [
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
  },
  {
    id: "post-8",
    brandId: "butik-platform",
    title: "Sonbahar Kapsül Dolap 5 Temel Parça",
    format: "carousel",
    pillar: "value",
    status: "published",
    scheduledDate: "2026-09-08",
    scheduledTime: "12:30",
    coverBgColor: "#831843",
    coverText: "5 Parça ile 15 Farklı Kombin 🧥",
    caption: "Tek bir blazer ceketle hem ofis hem hafta sonu şıklığı!"
  },
  {
    id: "post-9",
    brandId: "osman-savas",
    title: "Haritada En Çok Çıkan 4 Boğaz & Kanal",
    format: "reels",
    pillar: "value",
    status: "published",
    scheduledDate: "2026-09-07",
    scheduledTime: "17:00",
    coverBgColor: "#0369a1",
    coverText: "ÖSYM'nin Asla Vazgeçmediği Boğazlar 🗺️",
    caption: "Malakka, Hürmüz, Cebelitarık ve Süveyş şifresi!"
  }
];

// Local state
let brandManager;
let gridSimulator;
let calendarEngine;
let schedulerEngine;
let analyticsEngine;
let metaGraphApiClient;

let currentBrandId = 'nolte-mimarlik';
let selectedHookPattern = VIRAL_HOOKS[0].pattern;
let selectedPostForModal = null;

document.addEventListener('DOMContentLoaded', () => {
  loadStateFromLocal();
  calendarEngine = new CalendarEngine(2026, 9); // September 2026
  schedulerEngine = new SchedulerEngine('luxury_architecture');
  analyticsEngine = new AnalyticsEngine(gridSimulator.posts);
  metaGraphApiClient = new MetaGraphApiClient();

  initTabs();
  initBrandSelector();
  initContentStudio();
  initCalendar();
  initGridSimulator();
  initAnalytics();
  initMetaApi();
  initBrandManagerView();
  initImportExport();

  updateUI();

  logger.info('Social Studio initialized for Nolte Mimarlık', {
    activeBrandId: currentBrandId,
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
      gridSimulator = new GridSimulator(parsed.posts);
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

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      const targetView = document.getElementById(btn.dataset.tab);
      if (targetView) targetView.classList.add('active');

      // Refresh specific tab views upon activation
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
    const locationInfo = brand.showroomLocation ? `📍 ${brand.showroomLocation}` : '';
    banner.innerHTML = `
      <div class="brand-meta">
        <h2>${brand.name} <span class="brand-handle">${brand.handle}</span></h2>
        <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
          <span class="brand-pill">🏢 ${brand.sector}</span>
          <span class="brand-pill">🎭 ${brand.tone}</span>
          <span class="brand-pill">📱 Müşteri: ${brand.clientPhone || 'Belirtilmedi'}</span>
          ${locationInfo ? `<span class="brand-pill">${locationInfo}</span>` : ''}
        </div>
      </div>
      <div class="brand-stats-row">
        <div class="stat-pill">
          <span>Toplam İçerik</span>
          <strong>${posts.length}</strong>
        </div>
        <div class="stat-pill">
          <span>Planlanan / Yayında</span>
          <strong style="color:var(--accent-cyan);">${posts.filter(p => p.status === 'scheduled' || p.status === 'published').length}</strong>
        </div>
        <div class="stat-pill">
          <span>Onay Bekleyen</span>
          <strong style="color:var(--accent-amber);">${posts.filter(p => p.status === 'awaiting_approval').length}</strong>
        </div>
      </div>
    `;
  }

  renderNoltePresets();
  renderHooks();
  renderCalendar();
  renderGrid();
  renderPillars();
  renderAnalytics();
  renderOptimalSlots();
  renderBrandList();
}

/* ==========================================================
   CONTENT STUDIO & NOLTE PRESETS
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

function initContentStudio() {
  const categoryContainer = document.getElementById('hookCategories');
  if (categoryContainer) {
    const categories = [
      { id: "all", label: "Tümü" },
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
        copyBtn.textContent = '✅ Kopyalandı!';
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
  const brand = brandManager.getBrandById(currentBrandId);
  const topic = document.getElementById('topicInput').value.trim() || 'Önemli Bir Konu';
  const format = document.getElementById('formatSelect').value;
  const ctaType = document.getElementById('ctaSelect').value;
  const outputEl = document.getElementById('contentOutput');

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

  outputEl.textContent = outputText;
}

function handleAddToGridFromStudio() {
  const topic = document.getElementById('topicInput').value.trim() || 'Yeni İçerik';
  const format = document.getElementById('formatSelect').value;
  const pillar = document.getElementById('pillarSelect').value;
  const caption = document.getElementById('contentOutput').textContent;

  // Find optimal slot
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

  titleEl.textContent = calendarEngine.getMonthLabel();
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

    return `
      <div class="cal-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${cell.isToday ? 'today' : ''}" data-date="${cell.isoDate}">
        <div class="cal-day-num">
          <span>${cell.dayNumber}</span>
          ${cell.isToday ? '<span style="font-size:0.65rem; color:var(--primary);">BUGÜN</span>' : ''}
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

  // Clicking empty day cell to add a post on that date
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

  // Render KPI cards
  kpiRow.innerHTML = `
    <div class="kpi-card">
      <span class="kpi-card-label">Toplam Erişim</span>
      <div class="kpi-card-val">${kpis.totalReach.toLocaleString('tr-TR')}</div>
      <div class="kpi-card-sub">▲ %18.4 Geçen Aya Göre Artış</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-card-label">Toplam Gösterim</span>
      <div class="kpi-card-val">${kpis.totalImpressions.toLocaleString('tr-TR')}</div>
      <div class="kpi-card-sub">▲ %24.1 Keşfet Erişimi</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-card-label">Etkileşim Oranı (ER)</span>
      <div class="kpi-card-val">%${kpis.engagementRate}</div>
      <div class="kpi-card-sub">⭐ Sektör Ortalamasının 2.1x Katı</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-card-label">Hesap Sağlık Skoru</span>
      <div class="kpi-card-val" style="color:var(--accent-green);">${kpis.healthScore} <span style="font-size:1rem;">/ 100</span></div>
      <div class="kpi-card-sub">Mükemmel Algoritma Dengesi</div>
    </div>
  `;

  // Render Format Performance
  const formats = analyticsEngine.getFormatPerformance(currentBrandId);
  formatGrid.innerHTML = formats.map(f => `
    <div class="format-bar-row">
      <div class="format-bar-meta">
        <span>${f.icon} <strong>${f.label}</strong> (${f.count} İçerik)</span>
        <span style="color:var(--accent-cyan);">%${f.avgEngagement} Ortalama ER • Potansiyel: <strong>${f.viralPotential}</strong></span>
      </div>
      <div class="pillar-bar-wrap">
        <div class="pillar-bar-fill" style="width:${f.avgEngagement * 10}%; background:var(--primary);"></div>
      </div>
    </div>
  `).join('');

  // Render Executive Report
  if (reportOutput) {
    reportOutput.textContent = analyticsEngine.generateExecutiveReport(brand, 'Eylül 2026');
  }
}

/* ==========================================================
   META GRAPH API INTEGRATION
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
        badge.textContent = '🚀 Canlı Meta Graph API v20.0';
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
      logToConsole('Meta Access Token doğrulanıyor...');
      const res = await metaGraphApiClient.verifyToken(token);
      logToConsole('Token doğrulama sonucu:', res);
      if (res.valid) {
        alert('Token geçerli! İzinler: ' + res.scopes.join(', '));
      } else {
        alert('Hata: ' + res.error);
      }
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', async () => {
      const accountId = document.getElementById('metaAccountId').value;
      logToConsole(`Instagram Account ID (${accountId}) sorgulanıyor...`);
      try {
        const profile = await metaGraphApiClient.getAccountProfile(accountId);
        logToConsole('Instagram Business Profil Yanıtı:', profile);
        alert(`Profil Bilgisi Başarıyla Çekildi:\n${profile.name} (${profile.username})\nTakipçi: ${profile.followersCount.toLocaleString('tr-TR')}\nGönderi: ${profile.mediaCount}`);
      } catch (err) {
        logToConsole(`Profil çekme hatası: ${err.message}`);
        alert(`Hata: ${err.message}`);
      }
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

      logToConsole(`Gönderi yayınlama akışı başlatıldı: "${targetPost.title}"`);
      logToConsole('1. Adım: Container oluşturuluyor (POST /{ig-user-id}/media)...');
      
      try {
        const result = await metaGraphApiClient.simulatePublishWorkflow(targetPost, brand);
        logToConsole('2. Adım: Medya akışta yayınlandı (POST /{ig-user-id}/media_publish):', result);
        
        targetPost.status = 'published';
        persistState();
        updateUI();

        alert(`Tebrikler! '${targetPost.title}' içeriği Meta Graph API üzerinden başarıyla yayınlandı!\nKalıcı Bağlantı: ${result.permalink}`);
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

  // Modal Setup
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

  // Status Change in Modal
  const statusSelect = document.getElementById('modalStatusSelect');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      if (!selectedPostForModal) return;
      gridSimulator.updatePostStatus(selectedPostForModal.id, e.target.value);
      persistState();
      updateUI();
    });
  }

  // WhatsApp Approval Button
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

  // Fill up to 9 cells
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
        <p style="font-size:0.8rem; color:var(--text-dim); margin-top:4px;">📞 WhatsApp: ${b.clientPhone || 'Yok'} ${b.showroomLocation ? `• ${b.showroomLocation}` : ''}</p>
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
