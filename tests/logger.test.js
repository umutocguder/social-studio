/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { TelemetryLogger, scrubSensitiveData, toFirestoreFields } from '../src/telemetry/logger.js';
import { FIREBASE_ECOSYSTEM_CONFIG } from '../src/telemetry/firebaseConfig.js';

test('FIREBASE_ECOSYSTEM_CONFIG targets umutocgdr@gmail.com and hopem-software-cloud', () => {
  assert.equal(FIREBASE_ECOSYSTEM_CONFIG.account, 'umutocgdr@gmail.com');
  assert.equal(FIREBASE_ECOSYSTEM_CONFIG.projectId, 'hopem-software-cloud');
});

test('TelemetryLogger logs info, error and handles local storage safely', () => {
  const logger = new TelemetryLogger({ appName: 'social-studio-test' });
  const entry = logger.info('Test event recorded', { action: 'view' });
  assert.equal(entry.level, 'INFO');
  assert.equal(entry.appName, 'social-studio-test');

  const crash = logger.crash('Simulated crash error');
  assert.equal(crash.level, 'CRASH');
  assert.equal(logger.inMemoryBuffer.length, 2);

  assert.doesNotThrow(() => {
    logger.getRecentLogs();
    logger.exportLogsAsJson();
    logger.clearLogs();
  });
});

test('scrubSensitiveData redacts sensitive keys, TCKN and credit card numbers', () => {
  const sensitivePayload = {
    username: 'testuser',
    password: 'supersecretpassword123',
    token: 'jwt-token-xyz',
    userTckn: '12345678901',
    payment: {
      creditCard: '4543 1234 5678 9012',
      cvv: '123',
      description: 'Transaction for customer with TCKN 23456789012'
    }
  };

  const scrubbed = scrubSensitiveData(sensitivePayload);
  assert.equal(scrubbed.username, 'testuser');
  assert.equal(scrubbed.password, '***REDACTED***');
  assert.equal(scrubbed.token, '***REDACTED***');
  assert.equal(scrubbed.payment.cvv, '***REDACTED***');
  assert.equal(scrubbed.payment.creditCard, '***REDACTED***');
  assert.equal(scrubbed.payment.description.includes('***TCKN_REDACTED***'), true);
});

test('toFirestoreFields correctly maps JavaScript types to Firestore REST types', () => {
  const sample = {
    title: 'Event Action',
    count: 5,
    rate: 98.5,
    active: true,
    deletedAt: null,
    meta: { category: 'action' }
  };

  const fields = toFirestoreFields(sample);
  assert.equal(fields.title.stringValue, 'Event Action');
  assert.equal(fields.count.integerValue, '5');
  assert.equal(fields.rate.doubleValue, 98.5);
  assert.equal(fields.active.booleanValue, true);
  assert.equal(fields.deletedAt.nullValue, null);
  assert.ok(fields.meta.stringValue.includes('action'));
});

test('TelemetryLogger handles multi-level logging and collection routing', () => {
  const logger = new TelemetryLogger({ appName: 'social-studio-multi-test' });

  const secLog = logger.security('Admin login attempt', { ip: '127.0.0.1' });
  assert.equal(secLog.level, 'SECURITY');
  assert.equal(secLog.targetCollection, 'security_audit_logs');

  const teleLog = logger.telemetry('feature_interacted', { featureId: 'ft-01' });
  assert.equal(teleLog.level, 'TELEMETRY');
  assert.equal(teleLog.targetCollection, 'telemetry_logs');

  const visLog = logger.visitor('page_visited', { path: '/home' });
  assert.equal(visLog.level, 'VISITOR');
  assert.equal(visLog.targetCollection, 'visitor_logs');

  const perfLog = logger.performance('render_latency', 16);
  assert.equal(perfLog.level, 'PERF');

  assert.equal(logger.inMemoryBuffer.length, 4);
});
