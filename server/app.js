import express from 'express'; // `express` is the Node.js web framework
import cors from 'cors'; // `cors` is a middleware that allows/disallows cross-origin resource requests
import router from './router/auth.route.js'; // Your router file
import cookieParser from 'cookie-parser'; // `cookie-parser` is a middleware to parse cookies

const app = express(); // Create an Express app 

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// CORS configuration
app.use(cors({
  origin: `${process.env.CLIENT_URL}`, // Your frontend origin
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Routes
app.use('/auth', router); // Assuming your login route is under /auth

// Start server
const PORT = process.env.PORT || 4503; // Port number
app.listen(PORT, () => { // Start the server
  console.log(`Server running on http://localhost:${PORT}`);
});