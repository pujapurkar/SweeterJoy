import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string) {
  await resend.emails.send({
    from: 'Sweeter Joy <support@sweeterjoy.com>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
  });
}

export async function sendContactEmail(
  name: string,
  email: string,
  message: string
) {
  await resend.emails.send({
    from: 'Sweeter Joy <support@sweeterjoy.com>',
    to: process.env.SEED_ADMIN_EMAIL || process.env.SMTP_EMAIL!,
    subject: `New Contact Message from ${name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
}