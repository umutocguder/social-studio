/**
 * Created by 11Hopem
 * Contact: umutocgdr@gmail.com
 *
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under proprietary software license terms.
 * Any unauthorized reproduction, transfer, or distribution is strictly prohibited.
 */

import { createSocialStudioBackup, verifySocialStudioBackupIntegrity } from '../src/backupService.js';

try {
  const meta = createSocialStudioBackup();
  const isValid = verifySocialStudioBackupIntegrity();
  console.log(`[Social Studio Backup Success] File: ${meta.backupFile}, Brands: ${meta.brandsCount}, Posts: ${meta.postsCount}, Size: ${meta.fileSize} bytes, Verified: ${isValid}`);
} catch (err) {
  console.error('[Social Studio Backup Error]:', err.message);
  process.exit(1);
}
