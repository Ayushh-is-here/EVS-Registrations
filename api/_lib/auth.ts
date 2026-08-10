import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'evs-portal-secure-admin-secret-key-2026';

export function generateAdminToken(): string {
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour valid session
  const payload = `admin:${expiresAt}`;
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return `${payload}:${signature}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return false;
    const [role, expiresAtStr, signature] = parts;
    if (role !== 'admin') return false;

    const expiresAt = parseInt(expiresAtStr);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(`${role}:${expiresAtStr}`).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}
