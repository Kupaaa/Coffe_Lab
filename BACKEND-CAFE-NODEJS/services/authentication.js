// Import necessary libraries and load environment variables
require("dotenv").config();
const jwt = require("jsonwebtoken");

// console.log(jwt)

// Define the 'authenticateToken' middleware function
function authenticateToken(req, res, next) {
  // Retrieve the 'authorization' header from the request
  const authHeader = req.headers["authorization"];
  // Extract the token from the header
  const token = authHeader && authHeader.split(" ")[1];


  // Check if the token is missing
  if (token == null) {
    // If the token is missing, send a 401 Unauthorized status
    return res.sendStatus(401);
  }

  // Verify the token using the secret key from environment variables
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
    if (err) {
      // If verification fails, send a 403 Forbidden status
      return res.sendStatus(403);
    }
    // Store the token payload in 'res.locals'
    res.locals = response;
    // Continue to the next middleware or route
    next();
  });
}

// Export the 'authenticateToken' middleware for use in the application
module.exports = { authenticateToken: authenticateToken };
