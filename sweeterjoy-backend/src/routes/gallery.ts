import { Router } from 'express';
import multer from 'multer';
import pool from '../db';
import cloudinary from '../cloudinary';
import { verifyAdmin } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public — gallery section ke liye
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
  res.json(result.rows);
});

// Admin-protected — nayi gallery image add
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'sweeterjoy/gallery' }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(req.file!.buffer);
    });

    const result = await pool.query(
      `INSERT INTO gallery (image_url) VALUES ($1) RETURNING *`,
      [uploadResult.secure_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

// Admin-protected — gallery image delete
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
  res.json({ success: true });
});

export default router;
