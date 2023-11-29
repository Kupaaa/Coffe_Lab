// Import required modules and libraries
const express = require("express"); // Import the 'express' library
const connection = require("../connection"); // Import the 'connection' module
const router = express.Router(); // Create an instance of Express router

const jwt = require("jsonwebtoken"); // Import the 'jsonwebtoken' library for JWT authentication
const nodemailer = require("nodemailer"); // Import the 'nodemailer' library for sending emails
require("dotenv").config(); // Load environment variables from a '.env' file
var auth = require("../services/authentication"); // Import authentication middleware to protect routes
var checkRole = require("../services/checkRole"); // Import role-checking middleware for access control

// router.get('/test',(req,res)=>{
//     res.json({ message: 'Hello, Worldasdd!' });
// });

// Define a route for handling user signup requests
router.post("/signup", (req, res) => {
  let user = req.body;

  // Define a SQL query to check if a user with the given email already exists
  query =
    "SELECT contactNumber, email, password, role, status FROM user WHERE email=?";

  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      console.log("results", results);
      if (results.length <= 0) {
        // Define a SQL query to insert a new user into the database
        query =
          "INSERT INTO user(name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";

        connection.query(
          query,
          [user.name, user.contactNumber, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "Successfully Registered" });
            }
            else {
              return res.status(500).json(err);
            }
          }
        );
      }
      else {
        return res.status(400).json({ message: "Email Already Exists" });
      }
    }
    else {
      return res.status(500).json(err);
    }
  });
});

// Define a route for handling user login requests
router.post("/login", (req, res) => {
  const user = req.body;

  // Define a SQL query to retrieve email, password, role, and status from the database for the given email
  query = "SELECT email, password, role, status FROM user WHERE email=?";

  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res
          .status(401)
          .json({ message: "Incorrect Username or Password" });
      }
      else if (results[0].status === "false") {
        return res.status(401).json({ message: "Wait for Admin Approval" });
      }
      else if (results[0].password == user.password) {
        const response = {email:results[0].email, role:results[0].role}
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{expiresIn:'8h'})
        res.status(200).json({token:accessToken});
      } 
      else {
        return res
          .status(400)
          .json({ message: "Something went wrong. Please try again later" });
      }
    } else {
      return res.status(500).json(err); 
    }
  });
});

// Create a nodemailer transporter for sending emails via Gmail
var transporter = nodemailer.createTransport({
  // Specify the email service (Gmail in this case)
  service: "gmail",
  auth: {
    // Use environment variables to securely store the email credentials
    user: process.env.EMAIL, // Your Gmail email address
    pass: process.env.PASSWORD, // Your Gmail password or an application-specific password
  },
});

// Define a route for handling password reset requests
router.post("/forgotPassword", (req, res) => {
  // Extract the user object from the request body
  const user = req.body;

  // Define a SQL query to retrieve email and password from the database
  const query = "SELECT email, password FROM user WHERE email=?";

  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(404).json({ message: "User not found." });
      } else {
        var mailOptions = {
          from: process.env.EMAIL, // Sender's email address
          to: results[0].email, // Recipient's email address from the database
          subject: "Password by Cafe Management System",
          html: `<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b>${results[0].email}<br><b>Password: </b>${results[0].password}<br><a href="http://localhost:4200">Click here to login</a></p>`,
        };

        // Send the password reset email
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            // Handle email sending error
            console.log(error);
          } else {
            // Log success message when email is sent
            console.log("Email sent: " + info.response);
          }
        });

        return res
          .status(200)
          .json({ message: "Password sent successfully to your email." });
      }
    } else {
      return res.status(500).json(err); 
    }
  });
});

// Define a route to fetch user data
router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  // Define a SQL query to select specific fields from the 'user' table based on the 'role' condition
  var query =
    "SELECT id, name, email, contactNumber, status FROM user WHERE role = 'user'";

  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results); 
    } else {
      return res.status(500).json(err); 
    }
  });
});

// Define a route to update user status
router.patch("/update",
  auth.authenticateToken, // Middleware to authenticate user tokens
  checkRole.checkRole, // Middleware to check user roles
  (req, res) => {
    let user = req.body; // Extract user data from the request body
    var query = "Update user set status=? WHERE id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "user id does not exist" }); 
        }
        return res.status(200).json({ message: "User Update Successfully" }); 
      } else {
        return res.status(500).json(err); 
      }
    });
  }
);

// Define a route to check the validity of the user's token
router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

// Define a route to change the user's password
router.post("/changePassword", auth.authenticateToken, (req, res) => {
  const user = req.body; // Extract user data from the request body
  const email = res.locals.email; // Get the user's email from authentication

  // Check if the provided old password matches the one in the database
  var query = "SELECT * FROM user WHERE email=? AND password=?";
  connection.query(query, [email, user.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Incorrect Old Password" }); // Respond with an error message if old password is incorrect
      } else if (results[0].password == user.oldPassword) {
        // Update the user's password with the new password
        query = "UPDATE user SET password=? WHERE email=?";
        connection.query(query, [user.newPassword, email], (err, results) => {
          if (!err) {
            return res
              .status(200)
              .json({ message: "Password Updated Successfully." }); 
          } else {
            return res.status(500).json(err); 
          }
        });
      } else {
        return res
          .status(400)
          .json({ message: "Something went wrong. Please try again later" }); 
      }
    } else {
      return res.status(500).json(err); 
    }
  });
});


// Define a route to delete a user by ID
router.delete(
  '/delete/:id',
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const id = req.params.id;

    // Define an SQL query to delete a user from the database based on their ID
    const query = 'DELETE FROM user WHERE id = ?';

    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'User does not exist' });
        }
        return res.status(200).json({ message: 'User Deleted Successfully' });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

// Export the router for use in the application.
module.exports = router;
