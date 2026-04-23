import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserWithRolesByEmail } from '../utils/authUser.js';

async function login(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured.');
    return res.status(500).json({ error: 'Authentication is not configured.' });
  }

  try {
    const user = await findUserWithRolesByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (Number(user.is_active) !== 1) {
      return res.status(403).json({ error: 'Your account is inactive. Please contact support.' });
    }

    if (user.roles.length === 0) {
      return res.status(403).json({ error: 'No role is assigned to this account.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'An error occurred during login.' });
  }
}

export default login;
