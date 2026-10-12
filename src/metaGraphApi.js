/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { sanitizeInput } from './brandManager.js';

export const GRAPH_API_VERSION = 'v20.0';
export const GRAPH_API_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export const DEFAULT_META_CONFIG = {
  mode: 'sandbox', // 'sandbox' | 'live'
  pageId: '109283746592817',
  instagramAccountId: '17841405309284752',
  accessToken: 'EAAG_SIMULATED_TOKEN_11HOPEM_NOLTE_STUDIO',
  connectedUsername: '@noltemimarlik',
  accountName: 'Nolte Mimarlık & Mutfak'
};

/**
 * Meta & Instagram Graph API Client
 */
export class MetaGraphApiClient {
  /**
   * @param {Object} config
   */
  constructor(config = {}) {
    this.config = {
      ...DEFAULT_META_CONFIG,
      ...config
    };
  }

  /**
   * Sets client execution mode
   * @param {'sandbox' | 'live'} mode
   */
  setMode(mode) {
    if (mode !== 'sandbox' && mode !== 'live') {
      throw new Error("Invalid mode. Allowed values: 'sandbox' | 'live'");
    }
    this.config.mode = mode;
  }

  /**
   * Verifies access token permissions and expiration
   * @param {string} [token]
   * @returns {Promise<{valid: boolean, appId: string, scopes: string[], expiresAt: number, mode: string}>}
   */
  async verifyToken(token = this.config.accessToken) {
    const cleanToken = sanitizeInput(token || '');
    if (!cleanToken) {
      return {
        valid: false,
        error: 'Missing access token',
        mode: this.config.mode
      };
    }

    if (this.config.mode === 'sandbox') {
      return {
        valid: true,
        appId: '11hopem-social-studio-app',
        type: 'USER',
        application: 'Social Studio Professional',
        scopes: [
          'instagram_basic',
          'instagram_content_publish',
          'instagram_manage_insights',
          'pages_show_list',
          'pages_read_engagement'
        ],
        expiresAt: Math.floor(Date.now() / 1000) + (60 * 24 * 3600), // 60 days
        mode: 'sandbox'
      };
    }

    try {
      const url = `${GRAPH_API_BASE_URL}/debug_token?input_token=${encodeURIComponent(cleanToken)}&access_token=${encodeURIComponent(cleanToken)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        return { valid: false, error: data.error.message, mode: 'live' };
      }
      return {
        valid: data.data?.is_valid || false,
        appId: data.data?.app_id || '',
        scopes: data.data?.scopes || [],
        expiresAt: data.data?.expires_at || 0,
        mode: 'live'
      };
    } catch (err) {
      return {
        valid: false,
        error: err.message,
        mode: 'live'
      };
    }
  }

  /**
   * Fetches Instagram Business Account Profile details
   * @param {string} [accountId]
   * @returns {Promise<Object>}
   */
  async getAccountProfile(accountId = this.config.instagramAccountId) {
    if (this.config.mode === 'sandbox') {
      return {
        id: accountId || '17841405309284752',
        username: this.config.connectedUsername || 'noltemimarlik',
        name: this.config.accountName || 'Nolte Mimarlık Konya Showroom',
        biography: 'Konya Meram Showroom • Alman Nolte Küchen & Möbel Bayii • Lüks İç Mimarlık & Villa Tasarımları',
        followersCount: 14850,
        followsCount: 320,
        mediaCount: 142,
        profilePictureUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150',
        website: 'https://doryamimarlik.com.tr',
        mode: 'sandbox'
      };
    }

    const cleanId = sanitizeInput(accountId);
    const token = encodeURIComponent(this.config.accessToken);
    const fields = 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website';
    const url = `${GRAPH_API_BASE_URL}/${cleanId}?fields=${fields}&access_token=${token}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      biography: data.biography,
      followersCount: data.followers_count,
      followsCount: data.follows_count,
      mediaCount: data.media_count,
      profilePictureUrl: data.profile_picture_url,
      website: data.website,
      mode: 'live'
    };
  }

  /**
   * Step 1: Creates an Instagram Media Container
   * @param {Object} params
   * @returns {Promise<{containerId: string, status: string}>}
   */
  async createMediaContainer({ mediaType = 'IMAGE', mediaUrl, caption = '', isReels = false }) {
    if (this.config.mode === 'sandbox') {
      const mockContainerId = `container_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        containerId: mockContainerId,
        status: 'IN_PROGRESS',
        mode: 'sandbox',
        mediaType: isReels ? 'REELS' : mediaType,
        captionSnippet: caption.substring(0, 80)
      };
    }

    const accountId = this.config.instagramAccountId;
    const token = this.config.accessToken;
    const url = `${GRAPH_API_BASE_URL}/${accountId}/media`;

    const bodyParams = new URLSearchParams();
    bodyParams.append('access_token', token);
    bodyParams.append('caption', caption);

    if (isReels || mediaType === 'VIDEO') {
      bodyParams.append('media_type', 'REELS');
      bodyParams.append('video_url', mediaUrl);
    } else {
      bodyParams.append('image_url', mediaUrl);
    }

    const res = await fetch(url, {
      method: 'POST',
      body: bodyParams
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return {
      containerId: data.id,
      status: 'READY',
      mode: 'live'
    };
  }

  /**
   * Step 2: Publishes the created media container to Instagram
   * @param {string} containerId
   * @returns {Promise<{publishedMediaId: string, permalink: string, timestamp: string}>}
   */
  async publishMedia(containerId) {
    if (!containerId) {
      throw new Error('containerId is required for publishing.');
    }

    if (this.config.mode === 'sandbox') {
      const mockMediaId = `ig_media_${Date.now()}`;
      return {
        publishedMediaId: mockMediaId,
        permalink: `https://instagram.com/p/mock_${mockMediaId}`,
        timestamp: new Date().toISOString(),
        mode: 'sandbox',
        success: true
      };
    }

    const accountId = this.config.instagramAccountId;
    const token = this.config.accessToken;
    const url = `${GRAPH_API_BASE_URL}/${accountId}/media_publish`;

    const bodyParams = new URLSearchParams();
    bodyParams.append('creation_id', containerId);
    bodyParams.append('access_token', token);

    const res = await fetch(url, {
      method: 'POST',
      body: bodyParams
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return {
      publishedMediaId: data.id,
      permalink: `https://instagram.com/p/${data.id}`,
      timestamp: new Date().toISOString(),
      mode: 'live',
      success: true
    };
  }

  /**
   * Retrieves insights for a specific published media
   * @param {string} mediaId
   * @returns {Promise<Object>}
   */
  async getMediaInsights(mediaId) {
    if (this.config.mode === 'sandbox') {
      return {
        mediaId: mediaId || 'mock-media-1',
        impressions: 4820,
        reach: 3950,
        saved: 248,
        saves: 248,
        shares: 114,
        likes: 672,
        comments: 43,
        engagementRate: '9.8%',
        mode: 'sandbox'
      };
    }

    const token = encodeURIComponent(this.config.accessToken);
    const metrics = 'impressions,reach,saved,shares,likes,comments';
    const url = `${GRAPH_API_BASE_URL}/${mediaId}/insights?metric=${metrics}&access_token=${token}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return {
      mediaId,
      raw: data.data,
      mode: 'live'
    };
  }

  /**
   * Executes a complete simulated publish workflow for UI previews
   * @param {Object} post
   * @param {Object} brand
   * @returns {Promise<Object>}
   */
  async simulatePublishWorkflow(post, brand) {
    if (!post) throw new Error('Post data is required');

    const isReels = post.format === 'reels';
    const mediaType = isReels ? 'VIDEO' : 'IMAGE';
    const mediaUrl = isReels
      ? 'https://example.com/assets/reels-video.mp4'
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080';

    const container = await this.createMediaContainer({
      mediaType,
      mediaUrl,
      caption: post.caption || post.title,
      isReels
    });

    const publishResult = await this.publishMedia(container.containerId);

    return {
      workflow: 'META_GRAPH_API_PUBLISH',
      brand: brand?.name || 'Nolte Mimarlık',
      handle: brand?.handle || '@noltemimarlik',
      postTitle: post.title,
      containerId: container.containerId,
      publishedMediaId: publishResult.publishedMediaId,
      permalink: publishResult.permalink,
      status: 'PUBLISHED_SUCCESS',
      publishedAt: publishResult.timestamp
    };
  }
}
