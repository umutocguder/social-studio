/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { FIREBASE_ECOSYSTEM_CONFIG } from './firebaseConfig.js';

const SENSITIVE_KEY_PATTERNS = [
  /pass(word)?/i,
  /token/i,
  /secret/i,
  /auth(orization)?/i,
  /api[_-]?key/i,
  /card[_-]?number/i,
  /credit[_-]?card/i,
  /cvv/i,
  /cvc/i,
  /pin/i,
  /tckn/i
];

const TCKN_REGEX = /\b[1-9]\d{10}\b/g;
const CREDIT_CARD_REGEX = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
const BEARER_REGEX = /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi;

/**
 * Recursively scrubs sensitive credentials, PII (TCKN, credit cards), and auth tokens.
 * @param {any} value
 * @returns {any} Sanitized value
 */
export function scrubSensitiveData(value) {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    return value
      .replace(BEARER_REGEX, 'Bearer ***REDACTED***')
      .replace(CREDIT_CARD_REGEX, '***CARD_REDACTED***')
      .replace(TCKN_REGEX, '***TCKN_REDACTED***');
  }

  if (Array.isArray(value)) {
    return value.map((item) => scrubSensitiveData(item));
  }

  if (typeof value === 'object') {
    const scrubbed = {};
    for (const [k, v] of Object.entries(value)) {
      const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pat) => pat.test(k));
      if (isSensitiveKey) {
        scrubbed[k] = '***REDACTED***';
      } else {
        scrubbed[k] = scrubSensitiveData(v);
      }
    }
    return scrubbed;
  }

  return value;
}

/**
 * Converts a JS object into Cloud Firestore REST API field document format.
 * @param {object} obj
 * @returns {object} Firestore REST fields map
 */
export function toFirestoreFields(obj) {
  const fields = {};
  if (!obj || typeof obj !== 'object') return fields;

  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null) {
      fields[key] = { nullValue: null };
    } else if (typeof val === 'boolean') {
      fields[key] = { booleanValue: val };
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        fields[key] = { integerValue: String(val) };
      } else {
        fields[key] = { doubleValue: val };
      }
    } else if (typeof val === 'string') {
      fields[key] = { stringValue: val.substring(0, 1000) };
    } else if (typeof val === 'object') {
      try {
        fields[key] = { stringValue: JSON.stringify(val).substring(0, 1000) };
      } catch {
        fields[key] = { stringValue: '[Circular/Unserializable]' };
      }
    }
  }
  return fields;
}

export class TelemetryLogger {
  constructor(config = {}) {
    this.appName = config.appName || 'social-studio';
    this.appVersion = config.appVersion || '1.0.0';
    this.projectId = config.projectId || FIREBASE_ECOSYSTEM_CONFIG.projectId;
    this.localKey = config.localKey || `${this.appName}_telemetry_logs`;
    this.maxLocalLogs = config.maxLocalLogs || 100;
    this.inMemoryBuffer = [];
    this.offlineQueue = [];
    this.maxOfflineQueue = 50;
    this.cloudEndpoint = config.cloudEndpoint || FIREBASE_ECOSYSTEM_CONFIG.errorReportingUrl;
    this.autoCapture = config.autoCapture !== false;

    if (this.autoCapture && typeof window !== 'undefined') {
      this.attachGlobalListeners();
    }
  }

  attachGlobalListeners() {
    try {
      window.addEventListener('error', (event) => {
        this.crash(event.message || 'Window error', {
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

      window.addEventListener('online', () => {
        this.flushOfflineQueue();
      });
    } catch (_) {}
  }

  log(level, message, context = {}, targetCollection = 'app_logs') {
    try {
      const scrubbedContext = scrubSensitiveData(context || {});
      const rawMessage = typeof message === 'string' ? message : (message?.message || JSON.stringify(message));
      const scrubbedMessage = scrubSensitiveData(rawMessage);

      const entry = {
        timestamp: new Date().toISOString(),
        level: (level || 'INFO').toUpperCase(),
        appName: this.appName,
        appVersion: this.appVersion,
        projectId: this.projectId,
        targetCollection,
        message: scrubbedMessage,
        context: scrubbedContext
      };

      this.inMemoryBuffer.push(entry);
      if (this.inMemoryBuffer.length > this.maxLocalLogs) {
        this.inMemoryBuffer.shift();
      }

      if (typeof localStorage !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem(this.localKey) || '[]');
          stored.push(entry);
          if (stored.length > this.maxLocalLogs) {
            stored.shift();
          }
          localStorage.setItem(this.localKey, JSON.stringify(stored));
        } catch (_) {}
      }

      this.dispatchToCloud(entry, targetCollection);

      return entry;
    } catch (_) {
      return null;
    }
  }

  debug(msg, ctx) { return this.log('DEBUG', msg, ctx, 'app_logs'); }
  info(msg, ctx) { return this.log('INFO', msg, ctx, 'app_logs'); }
  warn(msg, ctx) { return this.log('WARN', msg, ctx, 'app_logs'); }
  error(msg, ctx) { return this.log('ERROR', msg, ctx, 'app_logs'); }
  crash(msg, ctx) { return this.log('CRASH', msg, ctx, 'crash_logs'); }
  security(event, ctx) { return this.log('SECURITY', event, ctx, 'security_audit_logs'); }
  telemetry(event, ctx) { return this.log('TELEMETRY', event, ctx, 'telemetry_logs'); }
  visitor(event, ctx) { return this.log('VISITOR', event, ctx, 'visitor_logs'); }
  performance(metric, durationMs, ctx = {}) {
    return this.log('PERF', `Metric: ${metric} - ${durationMs}ms`, { metric, durationMs, ...ctx }, 'telemetry_logs');
  }

  dispatchToCloud(entry, collection = 'app_logs') {
    if (typeof fetch === 'undefined' || !FIREBASE_ECOSYSTEM_CONFIG.apiKey) {
      return;
    }

    try {
      const firestoreUrl = `${FIREBASE_ECOSYSTEM_CONFIG.firestoreBaseUrl}/${collection}?key=${FIREBASE_ECOSYSTEM_CONFIG.apiKey}`;
      const payload = {
        fields: toFirestoreFields({
          event: `${collection.toUpperCase()}_${entry.level}`,
          timestamp: entry.timestamp,
          projectId: entry.projectId,
          appId: FIREBASE_ECOSYSTEM_CONFIG.appId,
          appName: entry.appName,
          appVersion: entry.appVersion,
          logLevel: entry.level,
          message: entry.message,
          context: entry.context
        })
      };

      fetch(firestoreUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {
        this.enqueueOffline({ firestoreUrl, payload });
      });
    } catch (_) {
      this.enqueueOffline({ entry, collection });
    }
  }

  enqueueOffline(item) {
    try {
      this.offlineQueue.push(item);
      if (this.offlineQueue.length > this.maxOfflineQueue) {
        this.offlineQueue.shift();
      }
    } catch (_) {}
  }

  flushOfflineQueue() {
    if (typeof fetch === 'undefined' || this.offlineQueue.length === 0) return;
    try {
      const items = [...this.offlineQueue];
      this.offlineQueue = [];
      for (const item of items) {
        if (item.firestoreUrl && item.payload) {
          fetch(item.firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.payload),
            keepalive: true
          }).catch(() => {
            this.enqueueOffline(item);
          });
        }
      }
    } catch (_) {}
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
      this.offlineQueue = [];
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.localKey);
      }
    } catch (_) {}
  }
}

export const logger = new TelemetryLogger();
