/**
 * Created by 11Hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free Starter',
    nameTr: 'Ücretsiz Başlangıç',
    badge: '⚡ FREE',
    prices: {
      TRY: { monthly: 0, yearly: 0 },
      USD: { monthly: 0, yearly: 0 }
    },
    limits: {
      maxBrands: 1,
      maxAiScriptsPerMonth: 15,
      allowWhatsAppCards: false,
      allowMultiChannel: false,
      allowSchedulerOptimizer: false,
      allowWhiteLabel: false,
      allowPriorityApi: false
    },
    featuresTr: [
      '1 Aktif Marka / Müşteri Yönetimi',
      'Ayda 15 Viral Kanca & Senaryo Üretimi',
      'Temel Instagram 9-Grid Izgara Simülatörü',
      'JSON Yedek Alma & Yükleme'
    ],
    featuresEn: [
      '1 Active Brand / Client Management',
      '15 Viral Hooks & Scripts / Month',
      'Basic Instagram 9-Grid Simulator',
      'JSON Backup & Restore'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro SMM & Creator',
    nameTr: 'Pro Sosyal Medyacı',
    badge: '⭐ PRO',
    recommended: true,
    prices: {
      TRY: { monthly: 699, yearly: 6710 },
      USD: { monthly: 29, yearly: 278 }
    },
    limits: {
      maxBrands: 5,
      maxAiScriptsPerMonth: Infinity,
      allowWhatsAppCards: true,
      allowMultiChannel: true,
      allowSchedulerOptimizer: true,
      allowWhiteLabel: false,
      allowPriorityApi: false
    },
    featuresTr: [
      '5 Aktif Marka / Müşteri Yönetimi',
      'Sınırsız AI Kanca, Senaryo & Caption Üretimi',
      'Tek Tıkla WhatsApp Müşteri Onay Kartı',
      'Çoklu Kanal Dağıtımı (TikTok, X, LinkedIn, IG)',
      'Akıllı Zamanlama & İdeal Saat Slotları',
      'Yönetici & Müşteri Analitik Raporu'
    ],
    featuresEn: [
      '5 Active Brands / Client Management',
      'Unlimited AI Hooks, Scripts & Captions',
      'One-Click WhatsApp Client Approval Card',
      'Multi-Channel Dispatch (TikTok, X, LinkedIn, IG)',
      'Smart Scheduler & Optimal Slot Optimizer',
      'Executive & Client Analytics Briefing'
    ]
  },
  agency: {
    id: 'agency',
    name: 'Agency Scale & Enterprise',
    nameTr: 'Ajans & Kurumsal Ölçek',
    badge: '👑 AGENCY',
    prices: {
      TRY: { monthly: 1499, yearly: 14390 },
      USD: { monthly: 59, yearly: 566 }
    },
    limits: {
      maxBrands: Infinity,
      maxAiScriptsPerMonth: Infinity,
      allowWhatsAppCards: true,
      allowMultiChannel: true,
      allowSchedulerOptimizer: true,
      allowWhiteLabel: true,
      allowPriorityApi: true
    },
    featuresTr: [
      'Sınırsız Marka & Müşteri Portföyü',
      'Beyaz Etiketli (White-Label) Müşteri Onay Portalı',
      'Özel Logo / Filigran & Ajans İmzası',
      'Tüm Sosyal Ağlar İçin Öncelikli API Bağlayıcıları',
      'Gelişmiş CSV / PDF Rapor Dışa Aktarımı',
      '7/24 Öncelikli Kurumsal Destek'
    ],
    featuresEn: [
      'Unlimited Brands & Client Portfolio',
      'White-Label Client Approval Portal',
      'Custom Agency Branding & Logo Watermarks',
      'Priority API Connectors for All Networks',
      'Advanced CSV / PDF Exporting',
      '24/7 Priority VIP Agency Support'
    ]
  }
};

const STORAGE_KEY = 'social_studio_subscription_v1';

export class SubscriptionEngine {
  constructor(initialData = null) {
    this.subscription = initialData || this.loadSubscription();
  }

  loadSubscription() {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.planId && SUBSCRIPTION_PLANS[parsed.planId]) {
            return parsed;
          }
        }
      } catch {
        // Fallback to default
      }
    }

    return {
      planId: 'pro', // Defaulting to Pro for Umut Öçgüder & Nolte full capabilities
      billingCycle: 'monthly',
      currency: 'TRY',
      startDate: new Date().toISOString(),
      expiresDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      monthlyAiCount: 0,
      transactionId: 'TX-INIT-PRO-11HOPEM'
    };
  }

  saveSubscription() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.subscription));
      } catch {
        // Ignore storage exceptions
      }
    }
  }

  getActivePlan() {
    const planId = this.subscription.planId || 'free';
    return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free;
  }

  getSubscription() {
    return { ...this.subscription };
  }

  canAddBrand(currentBrandCount) {
    const plan = this.getActivePlan();
    return currentBrandCount < plan.limits.maxBrands;
  }

  canGenerateAiScript(currentMonthlyUsage = 0) {
    const plan = this.getActivePlan();
    return currentMonthlyUsage < plan.limits.maxAiScriptsPerMonth;
  }

  canUseFeature(featureKey) {
    const plan = this.getActivePlan();
    return Boolean(plan.limits[featureKey]);
  }

  recordAiGeneration() {
    this.subscription.monthlyAiCount = (this.subscription.monthlyAiCount || 0) + 1;
    this.saveSubscription();
    return this.subscription.monthlyAiCount;
  }

  upgradePlan(planId, billingCycle = 'monthly', currency = 'TRY', provider = 'stripe') {
    if (!SUBSCRIPTION_PLANS[planId]) {
      throw new Error(`Invalid plan identifier: ${planId}`);
    }

    const durationDays = billingCycle === 'yearly' ? 365 : 30;
    const now = new Date();
    const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const transactionId = `TX-${provider.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    this.subscription = {
      planId,
      billingCycle,
      currency,
      startDate: now.toISOString(),
      expiresDate: expires.toISOString(),
      status: 'active',
      monthlyAiCount: 0,
      transactionId,
      provider
    };

    this.saveSubscription();

    return {
      success: true,
      subscription: this.getSubscription(),
      plan: SUBSCRIPTION_PLANS[planId],
      transactionId
    };
  }

  resetMonthlyAiQuota() {
    this.subscription.monthlyAiCount = 0;
    this.saveSubscription();
  }
}
