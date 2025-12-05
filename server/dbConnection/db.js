// src/config/db.js (or dbConnection.js)

// Import mysql2
import mysql2 from "mysql2";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Create a MySQL pool using promise API
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

// Convert pool to promise-based API
const db = pool.promise();

// OPTIONAL: Test the DB connection on boot
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:");
    console.error(err.message);
    // If connection fails, you may want to exit
    // process.exit(1);
  }
})();

export default db;
