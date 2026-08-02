import { Router } from 'express';
import pool from '../db';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

// Public — testimonials section ke liye
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at ASC');
  res.json(result.rows);
});

// Admin-protected — naya testimonial add
router.post('/', verifyAdmin, async (req, res) => {
  const { text, name, role, avatar } = req.body;

  if (!text || !name || !role) {
    return res.status(400).json({ error: 'Text, name and role are required' });
  }

  const result = await pool.query(
    `INSERT INTO testimonials (text, name, role, avatar)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [text, name, role, avatar || name.slice(0, 2).toUpperCase()]
  );

  res.status(201).json(result.rows[0]);
});

// Admin-protected — existing testimonial edit
router.put('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { text, name, role, avatar } = req.body;

  if (!text || !name || !role) {
    return res.status(400).json({ error: 'Text, name and role are required' });
  }

  const result = await pool.query(
    `UPDATE testimonials SET text = $1, name = $2, role = $3, avatar = $4
     WHERE id = $5 RETURNING *`,
    [text, name, role, avatar || name.slice(0, 2).toUpperCase(), id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Testimonial not found' });
  }

  res.json(result.rows[0]);
});

// Admin-protected — testimonial delete
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
  res.json({ success: true });
});

export default router;
