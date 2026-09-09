/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { sanitizeInput } from './brandManager.js';
import { CONTENT_PILLARS } from './contentStudio.js';

export const POST_FORMATS = [
  { id: "reels", label: "Reels / Video", icon: "🎬", ratio: "9:16" },
  { id: "carousel", label: "Kaydırmalı (Carousel)", icon: "📑", ratio: "4:5" },
  { id: "single_photo", label: "Tekil Fotoğraf", icon: "📷", ratio: "1:1" },
  { id: "quote_graphic", label: "Alıntı / Tipografi", icon: "💬", ratio: "1:1" }
];

export const POST_STATUSES = [
  { id: "idea", label: "Fikir / Not", color: "#64748b" },
  { id: "draft", label: "Metin Taslağı", color: "#3b82f6" },
  { id: "design_ready", label: "Görsel Hazır", color: "#8b5cf6" },
  { id: "awaiting_approval", label: "Müşteri Onayında", color: "#f59e0b" },
  { id: "approved", label: "Onaylandı", color: "#10b981" },
  { id: "scheduled", label: "Planlandı", color: "#06b6d4" },
  { id: "published", label: "Yayında", color: "#22c55e" }
];

export class GridSimulator {
  constructor(initialPosts = []) {
    this.posts = [...initialPosts];
  }

  getPostsByBrand(brandId) {
    return this.posts.filter(p => p.brandId === brandId);
  }

  getNineGrid(brandId) {
    // Returns up to 9 posts for the 3x3 Instagram feed view, sorted by scheduledDate or creation
    const brandPosts = this.getPostsByBrand(brandId);
    return brandPosts.slice(0, 9);
  }

  addPost(postData) {
    const title = sanitizeInput(postData.title);
    if (!title) {
      throw new Error("İçerik başlığı zorunludur.");
    }
    if (!postData.brandId) {
      throw new Error("Marka kimliği (brandId) zorunludur.");
    }

    const newPost = {
      id: postData.id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      brandId: postData.brandId,
      title,
      format: postData.format || "reels",
      pillar: postData.pillar || "value",
      status: postData.status || "draft",
      scheduledDate: postData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: postData.scheduledTime || "19:00",
      caption: sanitizeInput(postData.caption || ""),
      coverBgColor: postData.coverBgColor || "#1e293b",
      coverText: sanitizeInput(postData.coverText || title),
      createdAt: new Date().toISOString()
    };

    this.posts.unshift(newPost); // newest first for grid
    return newPost;
  }

  updatePostStatus(postId, newStatus) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`İçerik bulunamadı: ${postId}`);
    }
    const valid = POST_STATUSES.some(s => s.id === newStatus);
    if (!valid) {
      throw new Error(`Geçersiz durum: ${newStatus}`);
    }
    post.status = newStatus;
    return post;
  }

  calculatePillarDistribution(brandId) {
    const brandPosts = this.getPostsByBrand(brandId);
    const total = brandPosts.length;
    if (total === 0) {
      return CONTENT_PILLARS.map(p => ({
        ...p,
        count: 0,
        actualPercentage: 0
      }));
    }

    const counts = {
      value: 0,
      social_proof: 0,
      behind_scenes: 0,
      conversion: 0
    };

    brandPosts.forEach(p => {
      if (counts[p.pillar] !== undefined) {
        counts[p.pillar]++;
      } else {
        counts.value++;
      }
    });

    return CONTENT_PILLARS.map(p => {
      const count = counts[p.id] || 0;
      const actualPercentage = Math.round((count / total) * 100);
      return {
        ...p,
        count,
        actualPercentage,
        isBalanced: Math.abs(actualPercentage - p.targetPercentage) <= 15
      };
    });
  }
}
