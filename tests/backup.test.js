/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Contact: umutocgdr@gmail.com
 *
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under proprietary software license terms.
 * Any unauthorized reproduction, transfer, or distribution is strictly prohibited.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  createSocialStudioBackup,
  verifySocialStudioBackupIntegrity,
  restoreSocialStudioFromBackup,
  LATEST_BACKUP_PATH,
  CHECKSUM_LOG_PATH
} from '../src/backupService.js';

test('Social Studio Backup: createSocialStudioBackup generates verified snapshot and checksums', () => {
  const meta = createSocialStudioBackup();
  assert.ok(meta.sha256, 'SHA256 must be present');
  assert.ok(meta.brandsCount > 0, 'Brands count must be greater than zero');
  assert.ok(meta.postsCount > 0, 'Posts count must be greater than zero');
  assert.ok(fs.existsSync(LATEST_BACKUP_PATH), 'Latest backup file must exist');
  assert.ok(fs.existsSync(CHECKSUM_LOG_PATH), 'Checksums log must exist');

  const content = fs.readFileSync(LATEST_BACKUP_PATH, 'utf-8');
  const computedHash = crypto.createHash('sha256').update(content).digest('hex');
  assert.strictEqual(computedHash, meta.sha256, 'SHA256 must match file content');
});

test('Social Studio Backup: verifySocialStudioBackupIntegrity validates active backup file', () => {
  const isValid = verifySocialStudioBackupIntegrity();
  assert.strictEqual(isValid, true, 'Backup integrity should be valid');
});

test('Social Studio Backup: restoreSocialStudioFromBackup parses and returns valid workspace data', () => {
  const restored = restoreSocialStudioFromBackup();
  assert.ok(Array.isArray(restored.brands), 'Restored brands must be an array');
  assert.ok(restored.brands.length > 0, 'Restored brands must not be empty');
  assert.ok(Array.isArray(restored.posts), 'Restored posts must be an array');
  assert.ok(restored.posts.length > 0, 'Restored posts must not be empty');
});
