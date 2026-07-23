const ADMIN_PIN = process.env.ADMIN_PIN || '1092';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pin } = req.body || {};
  if (pin === ADMIN_PIN) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: 'Invalid PIN' });
  }
}
