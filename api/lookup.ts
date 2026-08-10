import { getSupabase } from './_lib/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const { division, rollNumber, name } = req.body || {};

    if (!division || !rollNumber || !name) {
      return res.status(400).json({ error: 'Please enter Division, Roll Number, and Full Name.' });
    }

    const normalizedName = String(name).trim();
    const parsedRollNumber = parseInt(rollNumber);

    if (isNaN(parsedRollNumber) || parsedRollNumber < 2000 || parsedRollNumber > 3000) {
      return res.status(400).json({ error: 'Please enter a valid Roll Number between 2000 and 3000.' });
    }

    const { data: students, error: fetchError } = await supabase
      .from('registrations')
      .select('id, name, topic, project_topic, member2_name, member2_project_topic, has_uploaded')
      .eq('division', division)
      .or(`and(roll_number.eq.${parsedRollNumber},name.ilike.%${normalizedName}%),and(member2_roll_number.eq.${parsedRollNumber},member2_name.ilike.%${normalizedName}%)`);

    if (fetchError) throw fetchError;

    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'No registered student found matching this Division, Roll Number, and Name. Please verify your details or register first.' });
    }

    const student = students[0];
    const isMember2Match = Boolean(student.member2_name && student.member2_name.toLowerCase().includes(normalizedName.toLowerCase()));
    const resolvedProjectTopic = isMember2Match ? (student.member2_project_topic || student.project_topic) : student.project_topic;
    const resolvedName = isMember2Match ? student.member2_name : student.name;

    return res.status(200).json({
      student: {
        id: student.id,
        name: resolvedName,
        topic_title: student.topic,
        project_topic: resolvedProjectTopic,
        has_uploaded: student.has_uploaded,
      }
    });
  } catch (error: any) {
    console.error('Lookup API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error during student lookup.' });
  }
}
