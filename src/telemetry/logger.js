/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { FIREBASE_ECOSYSTEM_CONFIG } from './firebaseConfig.js';

/**
 * Universal In-Project Telemetry and Cloud Logging Client
 * Conforms to AGENTS.md Rule 7 (Firebase & Local Data Custody Standard)
 */
export class TelemetryLogger {
  constructor(config = {}) {
    this.appName = config.appName || 'social-studio';
    this.appVersion = config.appVersion || '1.0.0';
    this.projectId = config.projectId || FIREBASE_ECOSYSTEM_CONFIG.projectId;
    this.localKey = config.localKey || `${this.appName}_telemetry_logs`;
    this.maxLocalLogs = config.maxLocalLogs || 100;
    this.inMemoryBuffer = [];
    this.cloudEndpoint = config.cloudEndpoint || FIREBASE_ECOSYSTEM_CONFIG.errorReportingUrl;
    this.autoCapture = config.autoCapture !== false;

    if (this.autoCapture && typeof window !== 'undefined') {
      this.attachGlobalListeners();
    }
  }

  attachGlobalListeners() {
    try {
      window.addEventListener('error', (event) => {
        this.error(event.message || 'Window error', {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.crash(event.reason?.message || 'Unhandled Promise Rejection', {
          stack: event.reason?.stack
        });
      });
    } catch (_) {
      // Zero-Crash: never throw
    }
  }

  log(level, message, context = {}) {
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        level: (level || 'INFO').toUpperCase(),
        appName: this.appName,
        appVersion: this.appVersion,
        projectId: this.projectId,
        message: typeof message === 'string' ? message : (message?.message || JSON.stringify(message)),
        context: context || {}
      };

      // 1. In-Memory Ring Buffer
      this.inMemoryBuffer.push(entry);
      if (this.inMemoryBuffer.length > this.maxLocalLogs) {
        this.inMemoryBuffer.shift();
      }

      // 2. Local Data Custody (localStorage if available)
      if (typeof localStorage !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem(this.localKey) || '[]');
          stored.push(entry);
          if (stored.length > this.maxLocalLogs) {
            stored.shift();
          }
          localStorage.setItem(this.localKey, JSON.stringify(stored));
        } catch (_) {
          // storage quota exceeded or disabled, in-memory remains
        }
      }

      // 3. Cloud / Firebase Dispatch (Non-blocking / Zero-Crash)
      if (entry.level === 'ERROR' || entry.level === 'CRASH') {
        this.dispatchToCloud(entry);
      }

      return entry;
    } catch (_) {
      return null; // Zero-Crash guarantee
    }
  }

  info(msg, ctx) { return this.log('INFO', msg, ctx); }
  warn(msg, ctx) { return this.log('WARN', msg, ctx); }
  error(msg, ctx) { return this.log('ERROR', msg, ctx); }
  crash(msg, ctx) { return this.log('CRASH', msg, ctx); }

  dispatchToCloud(entry) {
    if (this.cloudEndpoint && typeof fetch !== 'undefined') {
      try {
        fetch(this.cloudEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventTime: entry.timestamp,
            serviceContext: { service: entry.appName, version: entry.appVersion },
            message: `[${entry.level}] ${entry.message}\nContext: ${JSON.stringify(entry.context)}`
          }),
          mode: 'no-cors'
        }).catch(() => {
          // Zero-Crash: network issues never break app
        });
      } catch (_) {
        // Zero-Crash
      }
    }
  }

  getRecentLogs(limit = 50) {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem(this.localKey) || '[]');
        if (stored.length > 0) return stored.slice(-limit);
      }
      return this.inMemoryBuffer.slice(-limit);
    } catch (_) {
      return this.inMemoryBuffer.slice(-limit);
    }
  }

  exportLogsAsJson() {
    try {
      const logs = this.getRecentLogs(100);
      return JSON.stringify(logs, null, 2);
    } catch (_) {
      return '[]';
    }
  }

  clearLogs() {
    try {
      this.inMemoryBuffer = [];
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.localKey);
      }
    } catch (_) {}
  }
}

export const logger = new TelemetryLogger({ appName: 'social-studio' });
