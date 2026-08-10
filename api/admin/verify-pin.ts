import { generateAdminToken } from '../_lib/auth.js';

const ADMIN_PIN = process.env.ADMIN_PIN || '1092';

// In-memory rate limiting map for PIN attempts (IP -> { count, lockUntil })
const attemptMap = new Map<string, { count: number; lockUntil: number }>();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const attemptInfo = attemptMap.get(clientIp) || { count: 0, lockUntil: 0 };

  // Check if locked
  if (attemptInfo.lockUntil > now) {
    const remainingSec = Math.ceil((attemptInfo.lockUntil - now) / 1000);
    return res.status(429).json({ 
      error: `Too many failed attempts. Security lock active. Please wait ${remainingSec} seconds.` 
    });
  }

  const { pin } = req.body || {};

  if (!pin || String(pin).trim() !== ADMIN_PIN.trim()) {
    const newCount = attemptInfo.count + 1;
    let lockUntil = 0;
    if (newCount >= 5) {
      lockUntil = now + 5 * 60 * 1000; // 5 minute lockout after 5 failures
    }
    attemptMap.set(clientIp, { count: newCount, lockUntil });

    if (lockUntil > 0) {
      return res.status(429).json({ 
        error: 'Too many incorrect PIN attempts. Admin panel locked for 5 minutes for security.' 
      });
    }

    return res.status(401).json({ 
      error: `Invalid PIN. ${5 - newCount} attempt(s) remaining before lockout.` 
    });
  }

  // Reset attempts on successful authentication and issue server-signed session token
  attemptMap.delete(clientIp);
  const token = generateAdminToken();

  return res.status(200).json({ 
    success: true, 
    token: token,
    message: 'Authentication successful.' 
  });
}
