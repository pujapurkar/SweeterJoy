import { Router } from 'express';
import pool from '../db';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

// Public — homepage stats section ke liye
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM stats');
  res.json(result.rows);
});

// Admin-protected — sabhi stats ek saath update karo
// Body: [{ key, value, label }, ...]
router.put('/', verifyAdmin, async (req, res) => {
  const stats = req.body;

  if (!Array.isArray(stats)) {
    return res.status(400).json({ error: 'Expected an array of stats' });
  }

  try {
    for (const s of stats) {
      await pool.query(
        `INSERT INTO stats (key, value, label)
         VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET value = $2, label = $3`,
        [s.key, s.value, s.label]
      );
    }
    const result = await pool.query('SELECT * FROM stats');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

export default router;
