import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { initDatabase, getConfigAsync, updateConfigAsync, resetConfigAsync } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Active admin session tokens: token -> expiration timestamp (ms)
  const adminSessions = new Map<string, number>();

  const cleanExpiredSessions = () => {
    const now = Date.now();
    for (const [token, expiry] of adminSessions.entries()) {
      if (expiry < now) {
        adminSessions.delete(token);
      }
    }
  };

  const getAdminPassword = (): string => {
    return (process.env.ADMIN_PASSWORD || 'Adm_vcZePIMJNXU2J3je')
      .replace(/^["']|["']$/g, '')
      .trim();
  };

  const normalizePasswordString = (str: string): string => {
    return str
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
  };

  // Helper to verify admin authorization via valid session token
  const verifyAdminAuth = (req: express.Request): boolean => {
    cleanExpiredSessions();
    const token = (req.headers['x-admin-token'] as string) || (req.headers['authorization']?.replace(/^Bearer\s+/i, ''));
    if (!token || typeof token !== 'string') {
      return false;
    }

    if (adminSessions.has(token)) {
      const expiry = adminSessions.get(token)!;
      if (expiry > Date.now()) {
        return true;
      }
      adminSessions.delete(token);
    }

    // Stateless HMAC verification fallback (supports server restarts or container scaling)
    if (token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const [randPart, expStr, sig] = parts;
        const expTime = Number(expStr);
        if (!isNaN(expTime) && expTime > Date.now()) {
          const expectedSig = crypto
            .createHmac('sha256', getAdminPassword())
            .update(`${randPart}.${expStr}`)
            .digest('hex');
          const bufA = Buffer.from(sig);
          const bufB = Buffer.from(expectedSig);
          if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
            adminSessions.set(token, expTime);
            return true;
          }
        }
      }
    }

    return false;
  };

  // Initialize database / Firestore connection
  initDatabase();

  // Middleware for parsing JSON bodies
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // POST /api/admin/verify - Verify admin password on server side
  app.post('/api/admin/verify', (req, res) => {
    try {
      const { password } = req.body || {};

      if (!password || typeof password !== 'string') {
        return res.status(400).json({
          success: false,
          error: '請輸入管理密碼'
        });
      }

      const inputNormalized = normalizePasswordString(password);
      const expectedNormalized = normalizePasswordString(getAdminPassword());

      // Support exact and case-insensitive match (for mobile auto-capitalization e.g. Yy661003)
      const isExact = inputNormalized === expectedNormalized;
      const isCaseInsensitive = inputNormalized.toLowerCase() === expectedNormalized.toLowerCase();
      const isValid = isExact || isCaseInsensitive;

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: '密碼錯誤！請輸入正確的管理密碼。'
        });
      }

      // Generate a cryptographically secure 24-hour signed session token
      cleanExpiredSessions();
      const randPart = crypto.randomBytes(16).toString('hex');
      const expiry = Date.now() + 24 * 60 * 60 * 1000;
      const payload = `${randPart}.${expiry}`;
      const sig = crypto.createHmac('sha256', expectedNormalized).update(payload).digest('hex');
      const token = `${payload}.${sig}`;
      adminSessions.set(token, expiry);

      return res.json({
        success: true,
        token,
        message: '管理員驗證成功'
      });
    } catch (error) {
      console.error('Error verifying admin credentials:', error);
      return res.status(500).json({
        success: false,
        error: '伺服器端驗證發生錯誤'
      });
    }
  });

  // GET /api/config - Retrieve Firestore-persisted configuration
  app.get('/api/config', async (req, res) => {
    try {
      const config = await getConfigAsync();
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error('Error fetching config:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve configuration from Firestore'
      });
    }
  });

  // POST /api/config - Save and persist configuration changes to Firestore
  app.post('/api/config', async (req, res) => {
    try {
      const updates = { ...req.body };
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Invalid payload. Expected a JSON object.'
        });
      }

      // Strip sensitive client-submitted fields before saving
      delete (updates as any).adminPassword;
      delete (updates as any).adminToken;
      delete (updates as any)._serverSecret;

      const updated = await updateConfigAsync(updates);
      res.json({
        success: true,
        message: '設定已成功永久儲存至 Firebase Firestore 雲端資料庫！',
        data: updated
      });
    } catch (error) {
      console.error('Error saving config to Firestore:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save configuration to Firestore'
      });
    }
  });

  // POST /api/config/reset - Reset configuration to default values
  app.post('/api/config/reset', async (req, res) => {
    try {
      const restored = await resetConfigAsync();
      res.json({
        success: true,
        message: '已成功重置為預設設定並同步至 Firestore！',
        data: restored
      });
    } catch (error) {
      console.error('Error resetting config:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset configuration'
      });
    }
  });

  // Vite middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
