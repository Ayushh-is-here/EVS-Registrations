import { getSupabase } from './_lib/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const { division, rollNumber, name, topic, projectTopic, isGroup, member2RollNumber, member2Name, member2ProjectTopic } = req.body || {};

    if (!division || !rollNumber || !name || !topic) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const parsedRoll1 = parseInt(rollNumber);
    if (isNaN(parsedRoll1) || parsedRoll1 < 2000 || parsedRoll1 > 3000) {
      return res.status(400).json({ error: 'Roll number must be between 2000 and 3000.' });
    }

    if (isGroup && (!member2RollNumber || !member2Name)) {
      return res.status(400).json({ error: 'Both Member 2 Roll Number and Name are required for group registration.' });
    }

    if (isGroup && member2RollNumber) {
      const parsedRoll2 = parseInt(member2RollNumber);
      if (isNaN(parsedRoll2) || parsedRoll2 < 2000 || parsedRoll2 > 3000) {
        return res.status(400).json({ error: 'Member 2 Roll number must be between 2000 and 3000.' });
      }
    }

    // Global roll number check regardless of division
    const roll2Val = isGroup && member2RollNumber ? parseInt(member2RollNumber) : null;
    const orQuery = roll2Val
      ? `roll_number.eq.${parsedRoll1},member2_roll_number.eq.${parsedRoll1},roll_number.eq.${roll2Val},member2_roll_number.eq.${roll2Val}`
      : `roll_number.eq.${parsedRoll1},member2_roll_number.eq.${parsedRoll1}`;

    const { data: existingRolls } = await supabase
      .from('registrations')
      .select('id, division, roll_number, member2_roll_number')
      .or(orQuery);

    if (existingRolls && existingRolls.length > 0) {
      return res.status(409).json({ error: 'This Roll Number has already registered a topic in the system.' });
    }

    const normalizedName = String(name).trim();
    const normalizedTopic = String(topic).trim();
    const normalizedProjectTopic = projectTopic ? String(projectTopic).trim() : null;
    const normMem2Name = isGroup ? String(member2Name).trim() : null;
    const normalizedMem2ProjectTopic = (isGroup && member2ProjectTopic) ? String(member2ProjectTopic).trim() : null;

    const record: Record<string, any> = {
      division,
      roll_number: parseInt(rollNumber),
      name: normalizedName,
      topic: normalizedTopic,
      project_topic: normalizedProjectTopic,
      member2_roll_number: isGroup ? parseInt(member2RollNumber) : null,
      member2_name: normMem2Name,
      member2_project_topic: normalizedMem2ProjectTopic,
      pin: '0000'
    };

    let { error } = await supabase
      .from('registrations')
      .insert([record]);

    if (error && (error.code === '42703' || error.code === 'PGRST204' || (error.message && (error.message.includes('pin') || error.message.includes('project_topic') || error.message.includes('member2_project_topic'))))) {
      delete record.pin;
      delete record.project_topic;
      delete record.member2_project_topic;
      const retry = await supabase.from('registrations').insert([record]);
      error = retry.error;
    }

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'A student with this Roll Number in this Division has already registered.' });
      }
      throw error;
    }

    return res.status(201).json({ message: 'Registration successful!' });
  } catch (error: any) {
    console.error('Register API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error.' });
  }
}
