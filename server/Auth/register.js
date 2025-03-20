import db from '../dbConnection/db.js';
import bcrypt from 'bcrypt';

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// The Register function
const register = async (req, res) => {
  let { email, password, department } = req.body; // Use `role` instead of `department`
  console.log('Incoming request body:', req.body);

  // Validate input fields
  if (!email || !password || !department) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    // Check if the user already exists
    const userCheckQuery = 'SELECT * FROM users WHERE email = ?';
    const [userCheckResult] = await db.execute(userCheckQuery, [email]);

    if (userCheckResult.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, now())';
    await db.execute(insertQuery, [email, hashedPassword, department]);

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