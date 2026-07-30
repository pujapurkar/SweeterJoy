// Creates (or updates) the first admin account using SEED_ADMIN_NAME /
// SEED_ADMIN_PASSWORD from .env. Run with: npm run seed:admin
import pool from './db';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  const adminName = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!adminName || !email || !password) {
    console.error('Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env first');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admins (admin_name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (admin_name) DO UPDATE SET email = $2, password_hash = $3`,
    [adminName, email, passwordHash]
  );

  console.log(`Admin "${adminName}" created/updated successfully.`);
  process.exit(0);
}

seed();
