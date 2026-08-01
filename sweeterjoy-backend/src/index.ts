import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin';
import productRoutes from './routes/products';
import { sendOtpEmail } from './mailer';

dotenv.config();
const app = express();
app.get('/test-mail', async (req, res) => {
  try {
    await sendOtpEmail(process.env.SMTP_EMAIL!, '123456');
    res.send('Test mail sent');
  } catch (err) {
    console.error('TEST MAIL ERROR:', err);
    res.status(500).send('Mail failed');
  }
});
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8443',
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);


app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    console.log('📩 New Contact Message');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    return res.json({
      success: true,
      message: 'Message received successfully',
    });
  } catch (err) {
    console.error('CONTACT ERROR:', err);

    return res.status(500).json({
      error: 'Server error',
    });
  }
});

app.get('/', (req, res) =>
  res.json({ status: 'Sweeter Joy backend running' })
);
app.get('/', (req, res) => res.json({ status: 'Sweeter Joy backend running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
