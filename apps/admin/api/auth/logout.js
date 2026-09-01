import { setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(200).json({ message: 'Berhasil logout' });
}
