import { getSupabase } from './_lib/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const rollNumber = req.query?.rollNumber || req.body?.rollNumber;

    if (!rollNumber) {
      return res.status(400).json({ error: 'Roll Number is required.' });
    }

    const parsedRoll = parseInt(String(rollNumber).trim());
    if (isNaN(parsedRoll) || parsedRoll < 2000 || parsedRoll > 3000) {
      return res.status(400).json({ error: 'Roll number must be between 2000 and 3000.' });
    }

    const { data: existing, error } = await supabase
      .from('registrations')
      .select('id, name, division, roll_number, member2_name, member2_roll_number')
      .or(`roll_number.eq.${parsedRoll},member2_roll_number.eq.${parsedRoll}`);

    if (error) throw error;

    const isTaken = existing && existing.length > 0;
    const match = isTaken ? existing[0] : null;

    return res.status(200).json({
      available: !isTaken,
      taken: isTaken,
      division: match ? match.division : null,
      studentName: match ? (match.roll_number === parsedRoll ? match.name : match.member2_name) : null
    });
  } catch (error: any) {
    console.error('Check Roll API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
