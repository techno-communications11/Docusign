import db from '../dbConnection/db.js';
import bcrypt from 'bcrypt';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const register = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const roleName = req.body.role?.name || req.body.roleName || req.body.role || req.body.department;
  const rolePortal = req.body.role?.portal || req.body.portal;

  if (!email || !password || !roleName || !rolePortal) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [userCheckResult] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);

    if (userCheckResult.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'User already exists' });
    }

    const [roleResult] = await connection.execute(
      'SELECT id, name, portal FROM roles WHERE name = ? AND portal = ? LIMIT 1',
      [roleName, rolePortal]
    );

    if (roleResult.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid user role or portal' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = 'INSERT INTO users (email, password, created_at) VALUES (?, ?, now())';
    const [insertResult] = await connection.execute(insertUserQuery, [email, hashedPassword]);

    await connection.execute(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [insertResult.insertId, roleResult[0].id]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Registration successful! Please login with your credentials.',
      user: {
        id: insertResult.insertId,
        email,
        role: roleResult[0].name,
        portal: roleResult[0].portal,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error during registration:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    connection?.release();
  }
};

export default register;
