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

app.get('/', (req, res) => res.json({ status: 'Sweeter Joy backend running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
