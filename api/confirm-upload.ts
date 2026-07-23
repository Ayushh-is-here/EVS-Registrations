import { getSupabase } from './_lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const { studentId, fileId, fileLink } = req.body || {};

    if (!studentId || !fileId) {
      return res.status(400).json({ error: 'Missing studentId or fileId.' });
    }

    const { error } = await supabase
      .from('registrations')
      .update({
        has_uploaded: true,
        file_id: fileId,
        file_link: fileLink || `https://drive.google.com/file/d/${fileId}/view`,
      })
      .eq('id', studentId);

    if (error) throw error;

    return res.status(200).json({
      message: 'Upload confirmed successfully!',
      fileLink,
    });
  } catch (error: any) {
    console.error('Confirm Upload Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to update upload status.' });
  }
}
