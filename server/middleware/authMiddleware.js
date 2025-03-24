// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) { // Middleware function to authenticate JWT
  // Get the JWT from the request cookies
  
  const token = req.cookies.token;
  // console.log(token, "token"); // Debug: Logs undefined if no token
 // If no token is found, return an error response
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }
 // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If the token is invalid or expired, return an error response
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    } //  Attach the user data to the request object
    req.user = user;
    // Call the next middleware function
    next();
  });
}
