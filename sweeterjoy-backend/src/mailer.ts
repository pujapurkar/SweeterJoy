import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const data = await resend.emails.send({
      from: 'Sweeter Joy <onboarding@resend.dev>',
      to,
      subject: 'Your password reset OTP',
      html: `
        <p>Your OTP to reset your Sweeter Joy admin password is:</p>
        <h2 style="letter-spacing:4px;">${otp}</h2>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    console.log('MAIL SENT:', data);
  } catch (err) {
    console.error('MAIL SEND ERROR:', err);
    throw err;
  }
}

export async function sendContactEmail(
  name: string,
  email: string,
  message: string
) {
  try {
    const data = await resend.emails.send({
      from: 'Sweeter Joy <onboarding@resend.dev>',
      to: process.env.SMTP_EMAIL!,
      subject: 'New Contact Form Message',
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    console.log('CONTACT MAIL SENT:', data);
  } catch (err) {
    console.error('CONTACT MAIL ERROR:', err);
    throw err;
  }
}