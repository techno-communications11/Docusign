 // Import the required modules
 import mysql2 from 'mysql2';
// Load environment variables from .env file
import dotenv from 'dotenv';
// Load environment variables from .env file


dotenv.config();

// Create a MySQL connection pool with promise-based API
const db = mysql2.createPool({
  // Use the environment variables for the database connection
  
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Default: true - wait for the connection to be established
  connectionLimit: 20, // Maximum number of connections
  queueLimit: 0, // Unlimited queueing
});

// Test the database connection
db.getConnection((err, connection) => { // Get a connection
  // Check for errors
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    // console.log('Database connected!');
    connection.release(); // Release the connection
  }
});

// Export the promise-based pool
export default db.promise();