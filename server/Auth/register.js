import db from '../dbConnection/db.js';
import bcrypt from 'bcrypt';

// Email validation function
const validateEmail = (email) => {
  // regural expression to validate the email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // return the email regex test
  return emailRegex.test(email);
};

// The Register function
const register = async (req, res) => {
  // Destructure the incoming request body  and use `role` instead of `department`
  let { email, password, department } = req.body; // Use `role` instead of `department`
  //  console.log('Incoming request body:', req.body);
  console.log('Incoming request body:', req.body);
  

  // Validate input fields
  if (!email || !password || !department) {
    // console.log('Missing required fields');
    // returing the 400 status code with the message if email or password or department is missing and the error of 400 says that the request is not valid
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Validate email format

  if (!validateEmail(email)) 
    {
      // return the 400 status code with the message if the email format is invalid and the error of 400 says that the request is not valid
    return res.status(400).json({ message: 'Invalid email format' });
  }
 // Validate password length  for the password length to be at least 8 characters
  if (password.length < 8) {
    // return the 400 status code with the message if the password length is less than 8 characters and the error of 400 says that the request is not valid
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    // Check if the user already exists
    const userCheckQuery = 'SELECT * FROM users WHERE email = ?';
    // Execute the query to check if the user already exists in the database  and the userCheckResult is the array of the object
    const [userCheckResult] = await db.execute(userCheckQuery, [email]);
 // if the user already exists then return the 400 status code with the message and the code tells that the request is not valid
    if (userCheckResult.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, now())';
    // Execute the query to insert the new user into the database
    await db.execute(insertQuery, [email, hashedPassword, department]);
 
    // return the 201 status code with the message if the registration is successful and the code tells that the request is successful
    res.status(201).json({
      message: 'Registration successful! Please login with your credentials.',
    });
  } catch (error) { // catch block to handle the error
    // console.error('Error during registration:', error);
    console.error('Error during registration:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User already exists' });
    }
    // return the 500 status code with the message if the server error occurs and the code tells that the server error
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default register;