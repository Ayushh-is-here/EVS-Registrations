const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const { Pool } = require('pg');
const stream = require('stream');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup Multer for file uploads (memory storage so we can stream to Google Drive)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// ---------------------------------------------------------
// 1. INITIALIZE POSTGRESQL (SQL CONNECT)
// ---------------------------------------------------------
// You must set the DATABASE_URL in your .env file
// Example: DATABASE_URL=postgresql://user:password@host:port/dbname
let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for most managed DBs
  });
  console.log('PostgreSQL database pool initialized.');
} else {
  console.warn('⚠️ PostgreSQL initialization skipped: DATABASE_URL not found in .env');
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
// ROUTES
// ---------------------------------------------------------

// Health Check
app.get('/', (req, res) => {
  res.send('EVS Portal API is running with PostgreSQL!');
});

/**
 * REGISTER TOPIC
 * Receives: division, rollNumber, name, topic, pin
 */
app.post('/api/register', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not initialized.' });

  const { division, rollNumber, name, topic, pin } = req.body;

  if (!division || !rollNumber || !name || !topic || !pin) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Insert into PostgreSQL
    // We use ON CONFLICT to prevent duplicates (requires a UNIQUE constraint on division and roll_number)
    const query = `
      INSERT INTO registrations (division, roll_number, name, topic, pin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    
    await pool.query(query, [division, parseInt(rollNumber), name, topic, pin]);

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Registration Error:', error);
    // Code 23505 is PostgreSQL unique violation error
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A student with this Roll Number in this Division has already registered.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * UPLOAD PRESENTATION
 * Receives: division, rollNumber, pin, and the file
 */
app.post('/api/upload', upload.single('presentation'), async (req, res) => {
  if (!pool || !driveService) return res.status(500).json({ error: 'Services not initialized.' });
  if (!GOOGLE_DRIVE_FOLDER_ID) return res.status(500).json({ error: 'Google Drive Folder ID not configured.' });

  const { division, rollNumber, pin } = req.body;
  const file = req.file;

  if (!division || !rollNumber || !pin || !file) {
    return res.status(400).json({ error: 'Missing required fields or file.' });
  }

  try {
    // 1. Verify student exists and PIN matches
    const selectQuery = `
      SELECT id, name, pin, has_uploaded 
      FROM registrations 
      WHERE division = $1 AND roll_number = $2;
    `;
    const result = await pool.query(selectQuery, [division, parseInt(rollNumber)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found. Did you register your topic first?' });
    }

    const student = result.rows[0];

    if (student.pin !== pin) {
      return res.status(401).json({ error: 'Incorrect PIN.' });
    }

    // 2. Upload file to Google Drive
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

    // 3. Update PostgreSQL to mark as uploaded
    const updateQuery = `
      UPDATE registrations 
      SET has_uploaded = true, file_id = $1, file_link = $2 
      WHERE id = $3;
    `;
    await pool.query(updateQuery, [fileId, fileLink, student.id]);

    res.status(200).json({ 
      message: 'Upload successful!', 
      fileLink: fileLink 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload presentation.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
