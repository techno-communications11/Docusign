import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './router/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/auth', router);

const PORT = process.env.PORT || 4503;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
