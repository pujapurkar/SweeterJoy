import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD, // Gmail App Password, not your normal password
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"Sweeter Joy" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: 'Your password reset OTP',
    html: `
      <p>Your OTP to reset your Sweeter Joy admin password is:</p>
      <h2 style="letter-spacing: 4px;">${otp}</h2>
      <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    `,
  });
}
