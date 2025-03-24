// components/logout.js
export default function logout(req, res) { // Define the logout function
    try {
      // console.log("Logging out, token was:", req.cookies.token); // Debug token presence
      res.clearCookie("token", { // Clear the token cookie
        httpOnly: true, // Prevent client-side JavaScript from reading the cookie
        secure: process.env.NODE_ENV === "production",  // Cookie is only set in production
        sameSite: "strict", // Cookie is not sent with cross-origin requests
      });
      return res.status(200).json({ message: "Logged out successfully" }); // Send a success response
    } catch (error) { // Catch any errors
      // console.error("Logout error:", error);
      return res.status(500).json({ error: "Failed to log out" }); // Send an error response
    }
  }