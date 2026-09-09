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

// Seed demo posts for rich initial experience
const INITIAL_DEMO_POSTS = [
  {
    id: "post-1",
    brandId: "nolte-mimarlik",
    title: "Lüks Villalarda Ada Mutfak Hataları",
    format: "reels",
    pillar: "value",
    status: "awaiting_approval",
    scheduledDate: "2026-09-12",
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
    status: "scheduled",
    scheduledDate: "2026-09-14",
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
    status: "approved",
    scheduledDate: "2026-09-16",
    scheduledTime: "18:45",
    coverBgColor: "#172554",
    coverText: "25 Yıl Sorunsuz Açılan Çekmece Sırrı 🤫",
    caption: "Alman mühendisliğinin görünmeyen kahramanları."
  },
  {
    id: "post-4",
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
    id: "post-5",
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
let currentBrandId = 'nolte-mimarlik';
let selectedHookPattern = VIRAL_HOOKS[0].pattern;
let selectedPostForModal = null;

document.addEventListener('DOMContentLoaded', () => {
  loadStateFromLocal();
  initTabs();
  initBrandSelector();
  initContentStudio();
  initGridSimulator();
  initBrandManagerView();
  initImportExport();
  updateUI();
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
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      const targetView = document.getElementById(btn.dataset.tab);
      if (targetView) targetView.classList.add('active');
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
    banner.innerHTML = `
      <div class="brand-meta">
        <h2>${brand.name} <span class="brand-handle">${brand.handle}</span></h2>
        <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
          <span class="brand-pill">🏢 ${brand.sector}</span>
          <span class="brand-pill">🎭 ${brand.tone}</span>
          <span class="brand-pill">📱 Müşteri: ${brand.clientPhone || 'Belirtilmedi'}</span>
        </div>
      </div>
      <div class="brand-stats-row">
        <div class="stat-pill">
          <span>Toplam İçerik</span>
          <strong>${posts.length}</strong>
        </div>
        <div class="stat-pill">
          <span>Onay Bekleyen</span>
          <strong style="color:var(--accent-amber);">${posts.filter(p => p.status === 'awaiting_approval').length}</strong>
        </div>
        <div class="stat-pill">
          <span>Yayında</span>
          <strong style="color:var(--accent-green);">${posts.filter(p => p.status === 'published').length}</strong>
        </div>
      </div>
    `;
  }

  renderHooks();
  renderGrid();
  renderPillars();
  renderBrandList();
}

function initContentStudio() {
  const categoryContainer = document.getElementById('hookCategories');
  if (categoryContainer) {
    const categories = [
      { id: "all", label: "Tümü" },
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
    // Caption / Post
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

  gridSimulator.addPost({
    brandId: currentBrandId,
    title: topic,
    format: format === 'reels' ? 'reels' : (format === 'carousel' ? 'carousel' : 'single_photo'),
    pillar,
    status: 'draft',
    caption
  });

  persistState();
  updateUI();
  alert("İçerik başarıyla 9'lu Instagram ızgarasına eklendi!");
}

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
        scheduledDate: date
      });

      persistState();
      updateUI();
      addPostForm.reset();
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
  if (!gridContainer) return;

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
  document.getElementById('modalPostFormat').textContent = `${post.format.toUpperCase()} • ${post.scheduledDate}`;
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
        <p style="font-size:0.8rem; color:var(--text-dim); margin-top:4px;">📞 WhatsApp Onay Hattı: ${b.clientPhone || 'Yok'}</p>
      </div>
      <button class="btn btn-outline js-switch-brand" data-id="${b.id}">Yönet</button>
    </div>
  `).join('');

  listContainer.querySelectorAll('.js-switch-brand').forEach(btn => {
    btn.addEventListener('click', () => {
      currentBrandId = btn.dataset.id;
      document.getElementById('globalBrandSelect').value = currentBrandId;
      updateUI();
      // switch to studio tab
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
