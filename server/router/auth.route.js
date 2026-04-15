import express from 'express';
import login from '../Auth/login.js';
import logout from '../Auth/logout.js';
import register from '../Auth/register.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import requestReset from '../controllers/requestReset.js';
import resetPassword from '../controllers/resetPassword.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/request-reset', requestReset);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticateToken, logout);

router.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

export default router;
