import { getSupabase } from './_lib/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const { data: topics, error } = await supabase
      .from('registrations')
      .select('id, created_at, division, topic, project_topic, member2_project_topic, has_uploaded')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ topics });
  } catch (error: any) {
    console.error('Fetch Topics API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while fetching topics.' });
  }
}
