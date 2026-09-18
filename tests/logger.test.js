/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { TelemetryLogger } from '../src/telemetry/logger.js';
import { FIREBASE_ECOSYSTEM_CONFIG } from '../src/telemetry/firebaseConfig.js';

test('FIREBASE_ECOSYSTEM_CONFIG matches Umut Öçgüder Firebase account', () => {
  assert.equal(FIREBASE_ECOSYSTEM_CONFIG.account, 'umutocgdr@gmail.com');
  assert.equal(FIREBASE_ECOSYSTEM_CONFIG.projectId, 'hopem-software-cloud');
  assert.ok(FIREBASE_ECOSYSTEM_CONFIG.errorReportingUrl.includes('clouderrorreporting.googleapis.com'));
});

test('TelemetryLogger initializes properly with app configuration', () => {
  const logger = new TelemetryLogger({
    appName: 'test-app',
    appVersion: '2.1.0'
  });

  assert.equal(logger.appName, 'test-app');
  assert.equal(logger.appVersion, '2.1.0');
  assert.equal(logger.inMemoryBuffer.length, 0);
});

test('TelemetryLogger writes info, warn, error and crash logs', () => {
  const logger = new TelemetryLogger({ appName: 'test-logger' });

  const infoEntry = logger.info('App started successfully', { user: 'admin' });
  assert.equal(infoEntry.level, 'INFO');
  assert.equal(infoEntry.appName, 'test-logger');
  assert.equal(infoEntry.message, 'App started successfully');
  assert.equal(infoEntry.context.user, 'admin');

  const warnEntry = logger.warn('Low memory warning');
  assert.equal(warnEntry.level, 'WARN');

  const errorEntry = logger.error(new Error('Database timeout'), { retryCount: 3 });
  assert.equal(errorEntry.level, 'ERROR');
  assert.ok(errorEntry.message.includes('Database timeout'));

  const crashEntry = logger.crash('Critical render failure');
  assert.equal(crashEntry.level, 'CRASH');

  assert.equal(logger.inMemoryBuffer.length, 4);
});

test('TelemetryLogger respects max buffer limits and exports JSON', () => {
  const logger = new TelemetryLogger({
    appName: 'buffer-test',
    maxLocalLogs: 3
  });

  logger.info('Log 1');
  logger.info('Log 2');
  logger.info('Log 3');
  logger.info('Log 4'); // Should drop Log 1

  assert.equal(logger.inMemoryBuffer.length, 3);
  assert.equal(logger.inMemoryBuffer[0].message, 'Log 2');
  assert.equal(logger.inMemoryBuffer[2].message, 'Log 4');

  const jsonStr = logger.exportLogsAsJson();
  assert.ok(typeof jsonStr === 'string');
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.length, 3);
});

test('TelemetryLogger Zero-Crash tolerance guarantee', () => {
  const logger = new TelemetryLogger({ appName: 'resilience-test' });

  // Passing undefined, null, circular references or empty inputs must never throw
  assert.doesNotThrow(() => {
    logger.log(null, null);
    logger.error(undefined);
    logger.crash({});
    logger.getRecentLogs(-1);
    logger.exportLogsAsJson();
    logger.clearLogs();
  });
});
