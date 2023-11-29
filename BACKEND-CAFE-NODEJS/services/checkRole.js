// Import necessary libraries and load environment variables
require("dotenv").config();

// Define the 'checkRole' middleware function
function checkRole(req, res, next) {
  // Check if the 'role' stored in 'res.locals' matches the 'USER' role from environment variables
  if (res.locals.role == process.env.USER) {
    // If there's a match, send a 401 Unauthorized status
    res.sendStatus(401);
  } else {
    // If there's no match, proceed to the next middleware or route
    next();
  }
}

// Export the 'checkRole' middleware for use in the application
module.exports = { checkRole: checkRole };
