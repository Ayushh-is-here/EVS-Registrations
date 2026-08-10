import { getSupabase } from '../_lib/supabase.js';
import { verifyAdminToken } from '../_lib/auth.js';

const ADMIN_PIN = process.env.ADMIN_PIN || '1092';

function isAuthorized(req: any, res: any): boolean {
  const authHeader = req.headers['authorization'];
  const tokenHeader = req.headers['x-admin-token'];
  const pinHeader = req.headers['x-admin-pin'];

  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : tokenHeader;

  // Check 1: Signed Session Token verification
  if (token && verifyAdminToken(token)) {
    return true;
  }

  // Check 2: Direct PIN header verification fallback
  if (pinHeader && String(pinHeader).trim() === ADMIN_PIN.trim()) {
    return true;
  }

  res.status(401).json({ error: 'Unauthorized access. Valid Admin session or PIN required.' });
  return false;
}

export default async function handler(req: any, res: any) {
  if (!isAuthorized(req, res)) return;

  const supabase = getSupabase();

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ registrations: data });
    } catch (error: any) {
      console.error('Admin Registrations GET Error:', error);
      return res.status(500).json({ error: 'Failed to fetch registrations.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const rawId = req.query.id || req.body?.id;
      const parsedId = parseInt(String(rawId));

      if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: 'Invalid or missing registration ID for deletion.' });
      }

      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', parsedId);

      if (error) throw error;
      return res.status(200).json({ success: true, message: `Registration ${parsedId} deleted.` });
    } catch (error: any) {
      console.error('Admin Registrations DELETE Error:', error);
      return res.status(500).json({ error: 'Failed to delete registration.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
