export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'PUT' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadUrl = (req.query?.uploadUrl || '').toString();
  const start = parseInt((req.query?.start || '0').toString());
  const end = parseInt((req.query?.end || '0').toString());
  const total = parseInt((req.query?.total || '0').toString());

  if (!uploadUrl || isNaN(start) || isNaN(end) || isNaN(total)) {
    return res.status(400).json({ error: 'Missing or invalid chunk metadata (uploadUrl, start, end, total).' });
  }

  try {
    const buffers: Buffer[] = [];
    for await (const chunk of req) {
      buffers.push(Buffer.from(chunk));
    }
    const chunkBuffer = Buffer.concat(buffers);

    const driveRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Length': chunkBuffer.length.toString(),
        'Content-Range': `bytes ${start}-${end}/${total}`,
      },
      body: chunkBuffer,
    });

    if (driveRes.status === 308) {
      return res.status(200).json({ status: 'incomplete' });
    }

    if (driveRes.ok) {
      const data = await driveRes.json().catch(() => ({}));
      const fileId = data.id;
      const fileLink = data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
      return res.status(200).json({
        status: 'complete',
        fileId,
        fileLink,
      });
    }

    const errText = await driveRes.text().catch(() => '');
    console.error('Google Drive Chunk Upload Error:', driveRes.status, errText);
    return res.status(500).json({ error: 'Google Drive rejected chunk upload.' });
  } catch (error: any) {
    console.error('Upload Chunk Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to process chunk.' });
  }
}
