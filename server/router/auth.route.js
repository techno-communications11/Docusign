import express from 'express'; // `express` is the Node.js web framework
import login from '../Auth/login.js'; // Add this import
import logout from '../Auth/logout.js';  // Add this import
import register  from '../Auth/register.js'; //
import { authenticateToken } from '../middleware/authMiddleware.js';
import getCurrentUser from '../Auth/getCurrentUser.js'; // Add this import
import requestReset from '../controllers/requestReset.js';
import resetPassword from '../controllers/resetPassword.js';
const router = express.Router(); // Create a new router
// Define the routes
router.post('/login', login);
router.post('/register', register);
router.get('/users/me', authenticateToken, getCurrentUser);
router.post('/request-reset', requestReset);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticateToken, logout);
// Export the router
router.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  });
  
  export default router;
