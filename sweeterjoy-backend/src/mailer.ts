import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});
// Existing OTP function
export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
  });
}

// New Contact function
export async function sendContactEmail(
  name: string,
  email: string,
  message: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: process.env.SEED_ADMIN_EMAIL || process.env.SMTP_EMAIL,
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