import { Router } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendOtpEmail } from '../mailer';

const router = Router();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

router.post('/login', async (req, res) => {
  const { adminName, password } = req.body;

  if (!adminName || !password) {
    return res.status(400).json({ error: 'Admin name and password required' });
  }

  const result = await pool.query(
    'SELECT * FROM admins WHERE admin_name = $1',
    [adminName]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const admin = result.rows[0];
  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });

  res.json({ token, adminName: admin.admin_name });
});

// Step 1 — request an OTP by email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const result = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
  // Always respond the same way whether or not the email exists,
  // so no one can use this to check which emails are registered admins
  if (result.rows.length === 0) {
    return res.json({ message: 'If that email is registered, an OTP has been sent.' });
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await pool.query(
    'UPDATE admins SET otp_code = $1, otp_expires_at = $2 WHERE email = $3',
    [otp, expiresAt, email]
  );

  await sendOtpEmail(email, otp);
  res.json({ message: 'If that email is registered, an OTP has been sent.' });
});

// Step 2 — verify the OTP, get a short-lived reset token back
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  const result = await pool.query(
    'SELECT * FROM admins WHERE email = $1 AND otp_code = $2',
    [email, otp]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  const admin = result.rows[0];
  if (!admin.otp_expires_at || new Date(admin.otp_expires_at) < new Date()) {
    return res.status(400).json({ error: 'OTP expired, please request a new one' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query(
    `UPDATE admins
     SET reset_token = $1, reset_token_expires_at = $2, otp_code = NULL, otp_expires_at = NULL
     WHERE email = $3`,
    [resetToken, resetTokenExpiresAt, email]
  );

  res.json({ resetToken });
});

// Step 3 — set the new password using the reset token from step 2
router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password required' });
  }

  const result = await pool.query(
    'SELECT * FROM admins WHERE reset_token = $1',
    [resetToken]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ error: 'Invalid or expired reset link' });
  }

  const admin = result.rows[0];
  if (!admin.reset_token_expires_at || new Date(admin.reset_token_expires_at) < new Date()) {
    return res.status(400).json({ error: 'Reset link expired, please start again' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE admins
     SET password_hash = $1, reset_token = NULL, reset_token_expires_at = NULL
     WHERE id = $2`,
    [passwordHash, admin.id]
  );

  res.json({ message: 'Password reset successful' });
});

export default router;
