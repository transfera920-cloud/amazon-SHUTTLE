import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { SiteConfig } from '../src/types';
import { DEFAULT_CONFIG } from '../src/data/mountainData';

// Path to local backup cache file
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json');
const FIRESTORE_SERVER_SECRET = process.env.FIRESTORE_SERVER_SECRET || 'amz_srv_sec_f98c21a4';

// In-memory cache
let cachedConfig: SiteConfig | null = null;
let firestoreInitialized = false;
let db: any = null;

// Read firebase-applet-config.json
function getFirebaseConfig() {
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (err) {
    console.warn('[Firestore] Could not load firebase-applet-config.json:', err);
  }
  return null;
}

// Initialize Firestore SDK
export function initDatabase(): void {
  try {
    const fbConfig = getFirebaseConfig();
    if (fbConfig && fbConfig.apiKey && fbConfig.projectId) {
      const app = getApps().length === 0 ? initializeApp(fbConfig) : getApp();
      // Use firestoreDatabaseId if provisioned with custom database ID
      db = fbConfig.firestoreDatabaseId
        ? getFirestore(app, fbConfig.firestoreDatabaseId)
        : getFirestore(app);
      firestoreInitialized = true;
      console.log(`[Firestore] Connected to Firebase Firestore (Project: ${fbConfig.projectId}, DB: ${fbConfig.firestoreDatabaseId || '(default)'})`);
    } else {
      console.warn('[Firestore] Firebase credentials not found, falling back to disk cache.');
    }
  } catch (err) {
    console.error('[Firestore] Initialization error:', err);
  }

  // Load initial cache from local backup if present
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      cachedConfig = {
        ...DEFAULT_CONFIG,
        ...parsed,
        features: Array.isArray(parsed.features) && parsed.features.length > 0
          ? parsed.features
          : DEFAULT_CONFIG.features
      };
    } else {
      cachedConfig = { ...DEFAULT_CONFIG };
    }
  } catch {
    cachedConfig = { ...DEFAULT_CONFIG };
  }
}

// Sync local backup file for safety
function saveDiskBackup(config: SiteConfig) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = path.join(DATA_DIR, `site-config.tmp.${Date.now()}`);
    fs.writeFileSync(tempFile, JSON.stringify(config, null, 2), 'utf-8');
    fs.renameSync(tempFile, CONFIG_FILE);
  } catch (err) {
    console.warn('[Firestore] Warning saving local backup:', err);
  }
}

// Get configuration: prefer Firestore, fall back to memory/local cache
export async function getConfigAsync(): Promise<SiteConfig> {
  if (!firestoreInitialized || !db) {
    initDatabase();
  }

  if (firestoreInitialized && db) {
    try {
      const configDocRef = doc(db, 'settings', 'siteConfig');
      const snap = await getDoc(configDocRef);
      if (snap.exists()) {
        const rawData = snap.data() as any;
        const { _serverSecret: _secret, ...data } = rawData || {};
        const merged: SiteConfig = {
          ...DEFAULT_CONFIG,
          ...data,
          features: Array.isArray(data.features) && data.features.length > 0
            ? data.features
            : DEFAULT_CONFIG.features
        };
        cachedConfig = merged;
        saveDiskBackup(merged);
        return merged;
      } else {
        // Document does not exist in Firestore yet: seed it with DEFAULT_CONFIG or cached
        console.log('[Firestore] settings/siteConfig not found in Firestore. Seeding default config...');
        const initial = cachedConfig || DEFAULT_CONFIG;
        await setDoc(configDocRef, {
          ...initial,
          _serverSecret: FIRESTORE_SERVER_SECRET,
          updatedAt: new Date().toISOString()
        });
        return initial;
      }
    } catch (err) {
      console.error('[Firestore] Error fetching from Firestore:', err);
    }
  }

  return cachedConfig || DEFAULT_CONFIG;
}

// Update configuration: write to Firestore and sync local cache
export async function updateConfigAsync(updates: Partial<SiteConfig>): Promise<SiteConfig> {
  if (!firestoreInitialized || !db) {
    initDatabase();
  }

  const current = cachedConfig || DEFAULT_CONFIG;
  const newConfig: SiteConfig = {
    ...current,
    ...updates,
    features: Array.isArray(updates.features) && updates.features.length > 0
      ? updates.features
      : (current.features && current.features.length > 0 ? current.features : DEFAULT_CONFIG.features)
  };

  if (firestoreInitialized && db) {
    try {
      const configDocRef = doc(db, 'settings', 'siteConfig');
      await setDoc(configDocRef, {
        ...newConfig,
        _serverSecret: FIRESTORE_SERVER_SECRET,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('[Firestore] Successfully persisted siteConfig to Cloud Firestore!');
    } catch (err) {
      console.error('[Firestore] Failed to write to Firestore:', err);
      throw err;
    }
  }

  cachedConfig = newConfig;
  saveDiskBackup(newConfig);
  return newConfig;
}

// Reset configuration: reset in Firestore to default
export async function resetConfigAsync(): Promise<SiteConfig> {
  if (!firestoreInitialized || !db) {
    initDatabase();
  }

  const defaultConfig = { ...DEFAULT_CONFIG };

  if (firestoreInitialized && db) {
    try {
      const configDocRef = doc(db, 'settings', 'siteConfig');
      await setDoc(configDocRef, {
        ...defaultConfig,
        _serverSecret: FIRESTORE_SERVER_SECRET,
        updatedAt: new Date().toISOString()
      });
      console.log('[Firestore] Successfully reset siteConfig in Cloud Firestore!');
    } catch (err) {
      console.error('[Firestore] Failed to reset in Firestore:', err);
      throw err;
    }
  }

  cachedConfig = defaultConfig;
  saveDiskBackup(defaultConfig);
  return defaultConfig;
}
