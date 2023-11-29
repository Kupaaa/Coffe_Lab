// Import required modules and libraries
const express = require("express"); // Import the 'express' library
const connection = require("../connection"); // Import the 'connection' module
const router = express.Router(); // Create an instance of Express router

var auth = require("../services/authentication"); // Import authentication middleware to protect routes
var checkRole = require("../services/checkRole"); // Import role-checking middleware for access control

// Define a route to add a new product
router.post("/add", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let product = req.body;

  // Define the SQL query to insert a new product into the database
  var query =
    "INSERT INTO product (name, categoryId, description, price, status) VALUES (?, ?, ?, ?, 'true')";

  connection.query(
    query,
    [product.name, product.categoryId, product.description, product.price],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Product Added Successfully" });
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

// Define a route to fetch product data along with category information
router.get("/get", auth.authenticateToken, (req, res, next) => {
  // Define an SQL query to retrieve product data and include category information using INNER JOIN
  var query =
    "SELECT p.id, p.name, p.description, p.price, p.status, c.id as categoryId, c.name as categoryName FROM product as p INNER JOIN category as c WHERE p.categoryId = c.id";

  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

// Define a route to fetch products by category ID
router.get("/getByCategory/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;

  // Define an SQL query to select product IDs and names from the 'product' table
  // based on the provided category ID and a status of 'true'
  var query =
    "SELECT id, name FROM product WHERE categoryId = ? AND status = 'true'";

  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

// Define a route to fetch a product by its ID
router.get("/getById/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;

  // Define an SQL query to select specific fields (id, name, description, price) from the 'product' table
  // based on the provided product ID
  var query = "SELECT id, name, description, price FROM product WHERE id = ?";

  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(500).json(err);
    }
  });
});

// Define a route to update a product
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let product = req.body;

    // Define an SQL query to update the product's name, categoryId, description, and price based on its ID
    var query =
      "UPDATE product SET name=?, categoryId=?, description=?, price=? WHERE id=?";

    connection.query(
      query,
      [
        product.name,
        product.categoryId,
        product.description,
        product.price,
        product.id,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res
              .status(404)
              .json({ message: "Product id does not exist" });
          }
          return res
            .status(200)
            .json({ message: "Product Update Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);

// Define a route to delete a product by its ID
router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const id = req.params.id;

    // Define an SQL query to delete a product from the database based on its ID
    var query = "DELETE FROM product WHERE id=?";

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

// Define a route to update the status of a product
router.patch(
  "/updateStatus",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let user = req.body;

    // Define an SQL query to update the status of a product based on its ID
    var query = "UPDATE product SET status=? WHERE id=?";

    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product id does not exist" });
        }
        return res
          .status(200)
          .json({ message: "Product status Update Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

// Export the router for use in the application.
module.exports = router;
