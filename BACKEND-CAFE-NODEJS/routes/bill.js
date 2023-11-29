// Import required modules and libraries
const express = require("express"); // Import the 'express' library
const connection = require("../connection"); // Import the 'connection' module
const router = express.Router(); // Create an instance of Express router
let ejs = require("ejs"); // Import the 'ejs' templating engine
let pdf = require("html-pdf"); // Import the 'html-pdf' library for PDF generation
let path = require("path"); // Import the 'path' module for file paths
var fs = require("fs"); // Import the 'fs' module for file operations
var uuid = require("uuid"); // Import the 'uuid' library for generating UUIDs

var auth = require("../services/authentication"); // Import authentication middleware to protect routes


// This route handles a POST request to generate a report.
router.post('/generateReport', auth.authenticateToken, (req, res) => {
  const generatedUuid = uuid.v1();
  const orderDetails = req.body;

  // console.log("Product Details JSON String:", orderDetails.productDetails);
  var productDetailsReport = JSON.parse(orderDetails.productDetails)


  // Define an SQL query for inserting order details into the 'bill' table.
  var query = "INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  
  // Execute the SQL query with order details and user information.
  connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
    if (!err) {
      // Render an EJS template 'report.ejs' with order details.
      ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
        productDetails: productDetailsReport, 
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount
      }, (err, results) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            } else {
              return res.status(200).json({ uuid: generatedUuid });
            }
          });
        }
      });
    } else {
      return res.status(500).json(err);
    }
  });
});








// Handle a POST request to retrieve a PDF
router.post("/getPdf", auth.authenticateToken, function (req, res) {
  const orderDetails = req.body;
  // console.log('Received orderDetails:', orderDetails);

  // Define the file path for the PDF
  const pdfPath = "./generated_pdf/" + orderDetails.uuid + ".pdf";

  // Check if the PDF file exists
  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    try {
      var productDetailsReport = JSON.parse(orderDetails.productDetails);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return res.status(400).json({ error: 'Invalid JSON data' });
    }
    ejs.renderFile(path.join(__dirname, '', 'report.ejs'), {
      productDetails: productDetailsReport,
      name: orderDetails.name,
      email: orderDetails.email,
      contactNumber: orderDetails.contactNumber,
      paymentMethod: orderDetails.paymentMethod,
      totalAmount: orderDetails.totalAmount
    }, (err, results) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          } else {
            res.contentType("application/pdf");
            fs.createReadStream(pdfPath).pipe(res);
          }
        });
      }
    });
  }    
})


// Handle a GET request to retrieve a list of bills
router.get("/getBills", auth.authenticateToken, (req, res, next) => {
  // Define the SQL query to select all records from the 'bill' table in descending order of 'id'
  var query = "SELECT * FROM bill ORDER BY id DESC";

  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

// Handle a DELETE request to delete a bill by its ID
router.delete("/delete/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;

  // Define the SQL query to delete a bill with the specified 'id'
  var query = "DELETE FROM bill WHERE id=?";

  connection.query(query, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(400).json({ message: "Bill ID not found" });
      }
      return res.status(200).json({ message: "Bill Deleted Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

// Export the router for use in the application.
module.exports = router;
