// components/login.js
import bcrypt from 'bcrypt'; //importing bcrypt and used to compare the password with the hashed password
import jwt from 'jsonwebtoken'; // importing jwt to create the token for the user
import db from '../dbConnection/db.js'; //importing the database connection
//login function to authenticate the user

async function login(req, res) { // async function
  //taking incomming request from client as req.body
  const { email, password } = req.body; //destructuring the object
  //checking the incomming values
  if (!email || !password) { 
    // console.log('Missing email or password');
    // returing the 400 status code with the message if email or password is missing and the error of 400 says that the request is not valid
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  // try block to handle the error

  try {
    // Query to get the user with the email
    const query = 'SELECT * FROM users WHERE email = ?';
    // Execute the query
    //rows is the array of the object await is used to wait for the response, db.execute is used to execute the query
    const [rows] = await db.execute(query, [email]);
    //checking if the user is not found because the rows is the array of the object is empty
    if (rows.length === 0) {
      // console.log('User not found for email:', email);
      // returing the 404 status code with the message if user is not found and the error of 404 says that the resource is not found
      return res.status(404).json({ error: 'User not found.' });
    }
    // console.log('User found:', rows[0]);
    //getting the user from the rows array
    const user = rows[0];
    // comparing the password with the hashed password using bcrypt and compare is used to compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // if the password is not valid then return the 401 status code with the message and the code tells that the user is not authenticated
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    } 
    //creating the token for the user using jwt.sign and the token is created with the user id, email and role and the secret key is used to create the token and the token is expired in 1 hour
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key tied to the token and stored in the .env file
      { expiresIn: '7d' } // Expiry time for the token in seconds (1 hour) 
    );
    // console.log('Token created:', token);
    //setting the cookie with the token and the cookie is httpOnly, secure and sameSite and the maxAge is 1 hour
    res.cookie('token', token, {
      // httpOnly: true, // Cookie is only accessible via HTTP(S)
      // secure: process.env.NODE_ENV === 'production', // Cookie is only set in production
      // sameSite: 'strict', // Cookie is not sent with cross-origin requests it means the cookie is only sent with the same site requests
      // maxAge: 60 * 60 * 1000, // 1 hour in milliseconds means the cookie is expired in 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    // console.log('Login successful.');
    // returing the 200 status code with the message if login is successful and the code tells that the request is successful
    return res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error('Error during login:', error);
    // returing the 500 status code with the message if error occurred during login and the code tells that the server has encountered an error
    return res.status(500).json({ error: 'An error occurred during login.' });
  }
}

export default login; // exporting the login function
