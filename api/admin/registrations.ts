import { getSupabase } from '../_lib/supabase.js';

const ADMIN_PIN = process.env.ADMIN_PIN || '1092';

function isAuthorized(req: any, res: any): boolean {
  const pin = req.headers['x-admin-pin'];
  if (!pin || pin !== ADMIN_PIN) {
    res.status(401).json({ error: 'Unauthorized. Invalid PIN.' });
    return false;
  }
  return true;
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
      const id = req.query.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'Missing registration ID for deletion.' });
      }

      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Admin Registrations DELETE Error:', error);
      return res.status(500).json({ error: 'Failed to delete registration.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
