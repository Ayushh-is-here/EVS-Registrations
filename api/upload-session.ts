import { getSupabase } from './_lib/supabase.js';
import { getGoogleAuthToken } from './_lib/googleDrive.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      return res.status(500).json({ error: 'Google Drive Folder ID not configured in environment.' });
    }

    const { division, rollNumber, name, replace, fileName, fileType } = req.body || {};

    if (!division || !rollNumber || !name || !fileName) {
      return res.status(400).json({ error: 'Missing required student or file information.' });
    }

    const normalizedName = String(name).trim();

    // 1. Verify student registration
    const { data: students, error: fetchError } = await supabase
      .from('registrations')
      .select('id, name, has_uploaded, file_id, member2_name')
      .eq('division', division)
      .or(`and(roll_number.eq.${parseInt(rollNumber)},name.ilike.%${normalizedName}%),and(member2_roll_number.eq.${parseInt(rollNumber)},member2_name.ilike.%${normalizedName}%)`);

    if (fetchError) throw fetchError;

    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'Registration not found. Please check Division, Roll Number, and Name.' });
    }

    const student = students[0];

    // 2. Check replacement confirmation
    if (student.has_uploaded && replace !== 'true' && replace !== true) {
      return res.status(409).json({ error: 'A file already exists. Explicit replacement confirmation required.' });
    }

    // 3. Obtain Google Drive Access Token
    const accessToken = await getGoogleAuthToken();

    // 4. Create Google Drive Resumable Upload Session
    const fileMetadata = {
      name: `${division}_${rollNumber}_${student.name.replace(/\s+/g, '_')}_${fileName}`,
      parents: [folderId],
    };

    const mimeType = fileType || 'application/octet-stream';

    const driveRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': mimeType,
      },
      body: JSON.stringify(fileMetadata),
    });

    if (!driveRes.ok) {
      const errText = await driveRes.text();
      console.error('Google Drive Session Error:', errText);
      return res.status(500).json({ error: 'Failed to initiate Google Drive session.' });
    }

    const uploadUrl = driveRes.headers.get('location');

    if (!uploadUrl) {
      return res.status(500).json({ error: 'Google Drive did not return an upload location.' });
    }

    return res.status(200).json({
      uploadUrl,
      studentId: student.id,
    });
  } catch (error: any) {
    console.error('Upload Session Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to start presentation upload.' });
  }
}
