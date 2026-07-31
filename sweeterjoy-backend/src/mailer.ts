import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASS exists:', !!process.env.SMTP_APP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP ERROR:', error);
  } else {
    console.log('SMTP READY');
  }
});

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Sweeter Joy" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: 'Your password reset OTP',
      html: `
        <p>Your OTP to reset your Sweeter Joy admin password is:</p>
        <h2 style="letter-spacing:4px;">${otp}</h2>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    console.log('MAIL SENT:', info.messageId);
  } catch (err) {
    console.error('MAIL SEND ERROR:', err);
    throw err;
  }
}