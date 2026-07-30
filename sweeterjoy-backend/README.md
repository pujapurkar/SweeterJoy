# Sweeter Joy — Backend

Express + TypeScript + PostgreSQL + Cloudinary backend for the Sweeter Joy
chocolate website admin panel.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
   - `DATABASE_URL`: your PostgreSQL connection string
   - `CLOUDINARY_*`: from cloudinary.com dashboard (free tier)
   - `JWT_SECRET`: any long random string
   - `FRONTEND_URL`: your React app's URL (currently `http://localhost:8443`
     based on your Vite dev server)

3. Create the database tables:
   ```
   psql -U your_user -d your_db -f schema.sql
   ```

4. Create your first admin login:
   ```
   npm run seed:admin
   ```
   (uses `SEED_ADMIN_NAME` / `SEED_ADMIN_PASSWORD` from `.env`)

5. Start the dev server:
   ```
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

## API

| Method | Route                        | Auth   | Purpose                             |
|--------|--------------------------------|--------|---------------------------------------|
| POST   | /api/admin/login                | —      | Returns a JWT token                   |
| POST   | /api/admin/forgot-password       | —      | Sends a 6-digit OTP to admin's email  |
| POST   | /api/admin/verify-otp            | —      | Verify OTP, returns a reset token     |
| POST   | /api/admin/reset-password         | —      | Set new password using reset token    |
| GET    | /api/products                     | —      | List all products (public)            |
| POST   | /api/products                     | Admin  | Add product (multipart form)          |
| DELETE | /api/products/:id                 | Admin  | Delete a product                      |

Admin routes require header: `Authorization: Bearer <token>`

### Forgot password flow

1. `POST /api/admin/forgot-password` with `{ "email": "..." }` → OTP emailed
   to that address (valid 10 min)
2. `POST /api/admin/verify-otp` with `{ "email": "...", "otp": "123456" }` →
   returns `{ resetToken }` (valid 10 min)
3. `POST /api/admin/reset-password` with `{ "resetToken": "...", "newPassword": "..." }`
   → password updated

OTP emails are sent via Gmail SMTP — you need a Gmail **App Password**
(not your normal password): enable 2FA on the sending Gmail account, then
generate one at https://myaccount.google.com/apppasswords
