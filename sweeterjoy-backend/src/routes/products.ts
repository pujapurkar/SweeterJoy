import { Router } from 'express';
import multer from 'multer';
import pool from '../db';
import cloudinary from '../cloudinary';
import { verifyAdmin } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public — website ke Products section ke liye
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json(result.rows);
});

// Admin-protected — naya product add
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, originalPrice, tag } = req.body;

    if (!name || !price || !req.file) {
      return res.status(400).json({ error: 'Name, price and image are required' });
    }

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'sweeterjoy' }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(req.file!.buffer);
    });

    const result = await pool.query(
      `INSERT INTO products (name, price, original_price, tag, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, price, originalPrice || null, tag || null, uploadResult.secure_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Admin-protected — product delete
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  res.json({ success: true });
});

export default router;
