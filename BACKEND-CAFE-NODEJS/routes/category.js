// Import required modules and libraries
const express = require("express"); // Import the 'express' library
const connection = require("../connection"); // Import the 'connection' module
const router = express.Router(); // Create an instance of Express router

var auth = require("../services/authentication"); // Import authentication middleware to protect routes
var checkRole = require("../services/checkRole"); // Import role-checking middleware for access control

// Define a route to add a new category
router.post(
  "/add",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let category = req.body;

    // Define the SQL query to insert a new category into the 'category' table
    query = "INSERT INTO category (name) VALUES (?)";

    connection.query(query, [category.name], (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Category Added Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);


// Define a route to fetch category data
router.get("/get", auth.authenticateToken, (req, res, next) => {
  // Define the SQL query to select all categories from the 'category' table and order them by name
  var query = "SELECT * FROM category ORDER BY name";

  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});


// Define a route to update category status
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let category = req.body;
    var query = "UPDATE category SET name=? WHERE id=?";
    connection.query(query, [category.name, category.id], (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          // If no rows were affected, the category ID was not found
          return res.status(404).json({ message: "Category ID not found" });
        }
        return res
          .status(200)
          .json({ message: "Category Updated Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const id = req.params.id;

    // Define an SQL query to delete a category from the database based on its ID
    var query = "DELETE FROM category WHERE id=?";

    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product id does not exist" });
        }
        return res
          .status(200)
          .json({ message: "Product Deleted Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);


// Export the router for use in the application.
module.exports = router;
