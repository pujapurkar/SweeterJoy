-- Run this once against your PostgreSQL database
-- e.g. psql -U username -d sweeterjoy -f schema.sql

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    admin_name VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP,
    reset_token TEXT,
    reset_token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price VARCHAR(20) NOT NULL,          -- kept as text: your frontend uses "₹120" style strings
    original_price VARCHAR(20),          -- optional
    tag VARCHAR(50),                     -- optional, e.g. "SALE"
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
