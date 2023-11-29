// Import required modules and libraries
const express = require('express'); // Import the 'express' library for creating an Express application
var cors = require('cors'); // Import the 'cors' library for enabling CORS (Cross-Origin Resource Sharing)
const connection = require('./connection'); // Import the 'connection' module for database connectivity
const userRoute = require('./routes/user'); // Import the user routes module
const categoryRoute = require('./routes/category'); // Import the 'categoryRoute' module
const productRoute = require('./routes/product');  // Import the 'productRoute' module
const billRoute = require('./routes/bill');  // Import the 'billroute' module, which contains the routes related to billing
const dashboardRoute = require('./routes/dashboard');


const app = express(); // Create an instance of the Express application



// Middleware setup for enabling CORS, parsing URL-encoded and JSON data
app.use(cors()); // Enable CORS for handling cross-origin requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data in requests
app.use(express.json()); // Parse JSON data in requests

// Set up the user routes under the '/user' URL path
app.use('/user', userRoute);

// Set up category routes under the '/category' URL path
app.use('/category', categoryRoute);

// Set up product routes under the '/product' URL path
app.use('/product', productRoute);

//Set up bill routes under the '/bill' URL path
app.use('/bill', billRoute);

//Set up dashboard routes under the '/dashboard' URL path
app.use('/dashboard', dashboardRoute);


// Export the configured Express application for use in other parts of the project
module.exports = app;