/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Contact: umutocgdr@gmail.com
 *
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under proprietary software license terms.
 * Any unauthorized reproduction, transfer, or distribution is strictly prohibited.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BRANDS } from './brandManager.js';
import { exportWorkspaceToJson, importWorkspaceFromJson } from './approvalEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export const DATA_DIR = path.join(ROOT_DIR, 'data');
export const BACKUP_DIR = path.join(DATA_DIR, 'backups');
export const LATEST_BACKUP_PATH = path.join(BACKUP_DIR, 'social_studio_latest_backup.json');
export const CHECKSUM_LOG_PATH = path.join(BACKUP_DIR, 'social_studio_checksums.json');

export const SAMPLE_POSTS = [
  {
    id: "post-1",
    brandId: "nolte-mimarlik",
    title: "Villa Loft Mutfak Tasarımında 3 Gizli Lüks Detayı",
    format: "reels",
    pillar: "authority",
    status: "approved",
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: "19:00",
    coverText: "Lüks mutfaklarda göze çarpmayan ama kaliteyi belirleyen 3 unsur",
    caption: "Mutfak adasında kullanılan gizli prizler, mat lake yüzeyler ve ray sistemleri... Tasarım detaylarda gizlidir. #noltemimarlik #icmimarlik"
  },
  {
    id: "post-2",
    brandId: "umut-ocguder",
    title: "iOS 18 SwiftData vs CoreData Performans Karşılaştırması",
    format: "carousel",
    pillar: "value",
    status: "scheduled",
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: "10:00",
    coverText: "SwiftData'ya geçmeli misiniz? İşte gerçek benchmark sonuçları",
    caption: "Büyük veri setlerinde bellek tüketimi ve migration süreleri. SwiftData gelecektir. #swift #iosdev"
  }
];

export function createSocialStudioBackup(customBrands = null, customPosts = null) {
  const brands = customBrands || DEFAULT_BRANDS;
  const posts = customPosts || SAMPLE_POSTS;

  const rawJson = exportWorkspaceToJson(brands, posts);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const sha256 = crypto.createHash('sha256').update(rawJson).digest('hex');
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const timestampedPath = path.join(BACKUP_DIR, `social_studio_backup_${dateStr}.json`);

  fs.writeFileSync(timestampedPath, rawJson, 'utf-8');
  fs.writeFileSync(LATEST_BACKUP_PATH, rawJson, 'utf-8');

  const metadata = {
    timestamp: new Date().toISOString(),
    brandsCount: brands.length,
    postsCount: posts.length,
    sha256,
    fileSize: Buffer.byteLength(rawJson, 'utf-8'),
    backupFile: path.basename(timestampedPath),
    latestBackupFile: path.basename(LATEST_BACKUP_PATH)
  };

  let checksumLog = [];
  if (fs.existsSync(CHECKSUM_LOG_PATH)) {
    try {
      checksumLog = JSON.parse(fs.readFileSync(CHECKSUM_LOG_PATH, 'utf-8'));
      if (!Array.isArray(checksumLog)) checksumLog = [];
    } catch {
      checksumLog = [];
    }
  }

  checksumLog.unshift(metadata);
  if (checksumLog.length > 30) checksumLog = checksumLog.slice(0, 30);
  fs.writeFileSync(CHECKSUM_LOG_PATH, JSON.stringify(checksumLog, null, 2), 'utf-8');

  return metadata;
}

export function verifySocialStudioBackupIntegrity() {
  if (!fs.existsSync(LATEST_BACKUP_PATH)) return false;

  try {
    const raw = fs.readFileSync(LATEST_BACKUP_PATH, 'utf-8');
    const parsed = importWorkspaceFromJson(raw);
    return !!(
      Array.isArray(parsed.brands) &&
      parsed.brands.length > 0 &&
      Array.isArray(parsed.posts) &&
      parsed.posts.length > 0
    );
  } catch {
    return false;
  }
}

export function restoreSocialStudioFromBackup() {
  if (!fs.existsSync(LATEST_BACKUP_PATH)) {
    throw new Error('Latest backup file does not exist');
  }

  const raw = fs.readFileSync(LATEST_BACKUP_PATH, 'utf-8');
  return importWorkspaceFromJson(raw);
}
