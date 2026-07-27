import formidable from 'formidable';
import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';
import { getSupabase } from './_lib/supabase.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getDriveService() {
  let auth;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
  } else {
    const keyFilePath = path.join(process.cwd(), 'server', 'service-account.json');
    if (fs.existsSync(keyFilePath)) {
      auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
    } else {
      throw new Error('Google Drive service account credentials not found.');
    }
  }
  return google.drive({ version: 'v3', auth });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = getSupabase();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    return res.status(500).json({ error: 'Google Drive Folder ID not configured in environment.' });
  }

  try {
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      multiples: false,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    const getFieldValue = (field: any) => (Array.isArray(field) ? field[0] : field);

    const division = getFieldValue(fields.division);
    const rollNumber = getFieldValue(fields.rollNumber);
    const name = getFieldValue(fields.name);
    const replace = getFieldValue(fields.replace);

    const fileArray = files.presentation;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!division || !rollNumber || !name || !file) {
      return res.status(400).json({ error: 'Missing required fields or presentation file.' });
    }

    const normalizedName = String(name).trim();

    // 1. Verify student exists
    const { data: students, error: fetchError } = await supabase
      .from('registrations')
      .select('id, name, has_uploaded, file_id, member2_name')
      .eq('division', division)
      .or(`and(roll_number.eq.${parseInt(rollNumber)},name.ilike.%${normalizedName}%),and(member2_roll_number.eq.${parseInt(rollNumber)},member2_name.ilike.%${normalizedName}%)`);

    if (fetchError) throw fetchError;

    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'Registration not found. Check Division, Roll Number, and Name.' });
    }

    const student = students[0];

    // 2. Check replacement confirmation
    if (student.has_uploaded && replace !== 'true' && replace !== true) {
      return res.status(409).json({ error: 'A file already exists. Replacement confirmation required.' });
    }

    // 3. Upload file to Google Drive using driveService
    const driveService = getDriveService();
    const originalFileName = file.originalFilename || 'presentation';
    const filePath = file.filepath;
    const fileStream = fs.createReadStream(filePath);

    const fileMetadata = {
      name: `${division}_${rollNumber}_${student.name.replace(/\s+/g, '_')}_${originalFileName}`,
      parents: [folderId],
    };

    const media = {
      mimeType: file.mimetype || 'application/octet-stream',
      body: fileStream,
    };

    const driveResponse = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = driveResponse.data.id;
    const fileLink = driveResponse.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

    // 4. Update Supabase record
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        has_uploaded: true,
        file_id: fileId,
        file_link: fileLink,
      })
      .eq('id', student.id);

    if (updateError) throw updateError;

    return res.status(200).json({
      message: 'Upload successful!',
      fileLink: fileLink,
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to upload presentation.' });
  }
}
