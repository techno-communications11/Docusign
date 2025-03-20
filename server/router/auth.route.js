import express from 'express';
import login from '../Auth/login.js';
import logout from '../Auth/logout.js'; 
import register  from '../Auth/register.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import resetpassword from '../Auth/resetpassword.js';
import getCurrentUser from '../Auth/getCurrentUser.js'; // Add this import
const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.get('/users/me', authenticateToken, getCurrentUser);
router.post('/reset-password', authenticateToken, resetpassword);
router.post('/logout', authenticateToken, logout);
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    }
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  });
  
  export default router;