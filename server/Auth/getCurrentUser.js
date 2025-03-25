// components/getCurrentUser.js
async function getCurrentUser(req, res) {
  // This function is called when the client makes a GET request to /api/user/me
  // The authenticateToken middleware has already decoded the JWT and attached the user data to the request object
  // The user data is available in req.user
  // The user data is the payload that was used to create the JWT in the login function
  // The user data is an object with the user id, email, and role
  // The user data is sent back to the client as a JSON response
  // The client can use this data to display the user information on the frontend
    try {
      const user = req.user; // Decoded user data from authenticateToken middleware
      //  console.log(user,'usersdmn');
      // Send the user data back to the client
      
      res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role, // Assuming role is user.department from your JWT
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  }
  
  export default getCurrentUser;