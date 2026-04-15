import db from '../dbConnection/db.js';
import bcrypt from 'bcrypt';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const register = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const role = req.body.role || req.body.department;
  const allowedRoles = ['Admin', 'User'];

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid user role' });
  }

  try {
    const [userCheckResult] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);

    if (userCheckResult.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = 'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, now())';
    await db.execute(insertQuery, [email, hashedPassword, role]);
 
    res.status(201).json({
      message: 'Registration successful! Please login with your credentials.',
    });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default register;
