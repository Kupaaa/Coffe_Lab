// Import required modules and libraries
const express = require("express"); // Import the 'express' library
const connection = require("../connection"); // Import the 'connection' module
const router = express.Router(); // Create an instance of Express router

var auth = require("../services/authentication"); // Import authentication middleware to protect routes

router.get("/details", auth.authenticateToken, (req, res, next) => {
  // Initialize variables to store counts.
  var categoryCount;
  var productCount;
  var billCount;

  // Query the database to count categories.
  var query = "SELECT COUNT(id) as categoryCount from category";
  connection.query(query, (err, results) => {
    if (!err) {
      categoryCount = results[0].categoryCount;
    } else {
      return res.status(500).json(err);
    }
  });

  var query = "SELECT count (id) as productCount from product";
  connection.query(query, (err, results) => {
    if (!err) {
      productCount = results[0].productCount;
    } else {
      return res.status(500).json(err);
    }
  });

  // Query the database to count bills.
  var query = "SELECT count (id) as billCount from bill";
  connection.query(query, (err, results) => {
    if (!err) {
      billCount = results[0].billCount;
      var data = {
        category: categoryCount,
        product: productCount,
        bill: billCount,
      };
      return res.status(200).json(data);
    } else {
      return res.status(500).json(err);
    }
  });
});

// Export the router for use in the application.
module.exports = router;
