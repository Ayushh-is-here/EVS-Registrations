const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');
const stream = require('stream');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Trust proxy is required if hosting on platforms like Render to get the real client IP for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Setup Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// ---------------------------------------------------------
// 1. INITIALIZE SUPABASE
// ---------------------------------------------------------
let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  console.log('Supabase client initialized.');
} else {
  console.warn('⚠️ Supabase initialization skipped: Missing credentials in .env');
}

// ---------------------------------------------------------
// 2. INITIALIZE GOOGLE DRIVE API
// ---------------------------------------------------------
let driveService;
try {
  const auth = new google.auth.GoogleAuth({
    keyFile: './service-account.json', 
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  driveService = google.drive({ version: 'v3', auth });
  console.log('Google Drive API initialized successfully.');
} catch (error) {
  console.warn('⚠️ Google Drive API initialization skipped: service-account.json not found or invalid.');
}

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// ---------------------------------------------------------
// RATE LIMITERS
// ---------------------------------------------------------
const lookupLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per window
  message: { error: 'Too many lookup attempts from this IP, please try again after a minute' }
});

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

app.get('/', (req, res) => {
  res.send('EVS Portal API is running with Supabase!');
});

/**
 * REGISTER TOPIC
 * Receives: division, rollNumber, name, topic
 */
app.post('/api/register', async (req, res) => {
  console.log(`[${new Date().toISOString()}] REGISTER REQUEST from IP: ${req.ip}`);
  if (!supabase) return res.status(500).json({ error: 'Database not initialized.' });

  const { division, rollNumber, name, topic, projectTopic, isGroup, member2RollNumber, member2Name, member2ProjectTopic } = req.body;

  if (!division || !rollNumber || !name || !topic) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  if (isGroup && (!member2RollNumber || !member2Name)) {
    return res.status(400).json({ error: 'Both Member 2 Roll Number and Name are required for group registration.' });
  }

  // Normalize inputs
  const normalizedName = name.trim();
  const normalizedTopic = topic.trim();
  const normalizedProjectTopic = projectTopic ? projectTopic.trim() : null;
  const normMem2Name = isGroup ? member2Name.trim() : null;
  const normalizedMem2ProjectTopic = (isGroup && member2ProjectTopic) ? member2ProjectTopic.trim() : null;

  try {
    const { data, error } = await supabase
      .from('registrations')
      .insert([
        { 
          division, 
          roll_number: parseInt(rollNumber), 
          name: normalizedName, 
          topic: normalizedTopic,
          project_topic: normalizedProjectTopic,
          member2_roll_number: isGroup ? parseInt(member2RollNumber) : null,
          member2_name: normMem2Name,
          member2_project_topic: normalizedMem2ProjectTopic
        }
      ]);

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'A student with this Roll Number in this Division has already registered.' });
      }
      throw error;
    }

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * CHECK ROLL NUMBER AVAILABILITY
 */
app.all('/api/check-roll', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not initialized.' });
  const rollNumber = req.query?.rollNumber || req.body?.rollNumber;

  if (!rollNumber) {
    return res.status(400).json({ error: 'Roll Number is required.' });
  }

  const parsedRoll = parseInt(String(rollNumber).trim());
  if (isNaN(parsedRoll) || parsedRoll < 2000 || parsedRoll > 3000) {
    return res.status(400).json({ error: 'Roll number must be between 2000 and 3000.' });
  }

  try {
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
  } catch (err) {
    console.error('Check Roll error:', err);
    res.status(500).json({ error: 'Failed to check roll number.' });
  }
});

/**
 * GET ALL TOPICS
 * Returns a public list of all registered topics, without exposing names or roll numbers.
 */
app.get('/api/topics', async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET TOPICS REQUEST from IP: ${req.ip}`);
  if (!supabase) return res.status(500).json({ error: 'Database not initialized.' });

  try {
    const { data: topics, error } = await supabase
      .from('registrations')
      .select('id, division, topic, has_uploaded')
      .order('division', { ascending: true })
      .order('id', { ascending: true }); // deterministic ordering

    if (error) throw error;

    res.status(200).json({ topics });
  } catch (error) {
    console.error('Fetch Topics Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching topics.' });
  }
});

/**
 * LOOKUP REGISTRATION
 * Step 1 of upload flow. Identifies user without PIN.
 */
app.post('/api/lookup', lookupLimiter, async (req, res) => {
  console.log(`[${new Date().toISOString()}] LOOKUP REQUEST from IP: ${req.ip}`);
  if (!supabase) return res.status(500).json({ error: 'Database not initialized.' });

  const { division, rollNumber, name } = req.body;

  if (!division || !rollNumber || !name) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const { data: students, error: fetchError } = await supabase
      .from('registrations')
      .select('id, name, topic, has_uploaded, member2_name')
      .eq('division', division)
      .or(`and(roll_number.eq.${parseInt(rollNumber)},name.ilike.%${name.trim()}%),and(member2_roll_number.eq.${parseInt(rollNumber)},member2_name.ilike.%${name.trim()}%)`);

    if (fetchError) throw fetchError;

    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'Registration not found. Did you enter the correct Division, Roll Number, and Name?' });
    }

    const student = students[0];
    
    // Return topic for confirmation, and has_uploaded state
    res.status(200).json({ 
      id: student.id,
      topic: student.topic,
      has_uploaded: student.has_uploaded 
    });

  } catch (error) {
    console.error('Lookup Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * UPLOAD PRESENTATION
 * Receives: division, rollNumber, name, replace (boolean), and the file
 */
app.post('/api/upload', upload.single('presentation'), async (req, res) => {
  console.log(`[${new Date().toISOString()}] UPLOAD REQUEST from IP: ${req.ip}`);
  if (!supabase || !driveService) return res.status(500).json({ error: 'Services not initialized.' });
  if (!GOOGLE_DRIVE_FOLDER_ID) return res.status(500).json({ error: 'Google Drive Folder ID not configured.' });

  const { division, rollNumber, name, replace } = req.body;
  const file = req.file;

  if (!division || !rollNumber || !name || !file) {
    return res.status(400).json({ error: 'Missing required fields or file.' });
  }

  try {
    // 1. Verify student exists
    const { data: students, error: fetchError } = await supabase
      .from('registrations')
      .select('id, name, has_uploaded, file_id, member2_name')
      .eq('division', division)
      .or(`and(roll_number.eq.${parseInt(rollNumber)},name.ilike.%${name.trim()}%),and(member2_roll_number.eq.${parseInt(rollNumber)},member2_name.ilike.%${name.trim()}%)`);

    if (fetchError) throw fetchError;

    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const student = students[0];

    // 2. Prevent silent overwrites
    if (student.has_uploaded && replace !== 'true') {
      return res.status(409).json({ error: 'A file already exists. Explicit replace confirmation required.' });
    }

    // Optional: If they are replacing, we could theoretically delete the old file from Google Drive here.
    // For safety and simplicity, we just upload the new one (it will just be a new file in the folder).

    // 3. Upload file to Google Drive
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const fileMetadata = {
      name: `${division}_${rollNumber}_${student.name.replace(/\s+/g, '_')}_${file.originalname}`,
      parents: [GOOGLE_DRIVE_FOLDER_ID] 
    };

    const media = {
      mimeType: file.mimetype,
      body: bufferStream,
    };

    const driveResponse = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = driveResponse.data.id;
    const fileLink = driveResponse.data.webViewLink;

    // 4. Update Supabase to mark as uploaded
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ 
        has_uploaded: true, 
        file_id: fileId, 
        file_link: fileLink 
      })
      .eq('id', student.id);

    if (updateError) throw updateError;

    res.status(200).json({ 
      message: 'Upload successful!', 
      fileLink: fileLink 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload presentation.' });
  }
});

// ---------------------------------------------------------
// ADMIN ROUTES
// ---------------------------------------------------------
const ADMIN_PIN = process.env.ADMIN_PIN || '1092';

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 failed/attempt calls
  message: { error: 'Too many admin PIN attempts. Please wait 15 minutes.' }
});

const requireAdmin = (req, res, next) => {
  const pin = req.headers['x-admin-pin'];
  if (!pin || String(pin).trim() !== ADMIN_PIN.trim()) {
    return res.status(401).json({ error: 'Unauthorized. Invalid PIN.' });
  }
  next();
};

app.post('/api/admin/verify-pin', adminLimiter, (req, res) => {
  const { pin } = req.body || {};
  if (pin && String(pin).trim() === ADMIN_PIN.trim()) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid PIN' });
  }
});

app.get('/api/admin/registrations', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not initialized.' });
  
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ registrations: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

app.delete('/api/admin/registrations/:id', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not initialized.' });
  
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete registration.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
