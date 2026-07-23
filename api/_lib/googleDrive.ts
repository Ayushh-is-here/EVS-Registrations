import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export async function getGoogleAuthToken(): Promise<string> {
  let auth;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
    } catch (err) {
      console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON env var:', err);
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON environment variable.');
    }
  } else {
    // Local development fallback to server/service-account.json
    const keyFilePath = path.join(process.cwd(), 'server', 'service-account.json');
    if (fs.existsSync(keyFilePath)) {
      auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
    } else {
      throw new Error('Google Drive service account credentials not found in env or server/service-account.json.');
    }
  }

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  if (!tokenResponse.token) {
    throw new Error('Failed to acquire Google Drive access token.');
  }
  return tokenResponse.token;
}
