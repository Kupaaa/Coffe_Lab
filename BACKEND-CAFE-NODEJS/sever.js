// Load environment variables from a .env file to configure the application
require('dotenv').config();

// Import the 'http' module for creating an HTTP server
const http = require("http");

// Import the Express application from the 'index' module
const app = require('./index');

// Create an HTTP server and associate it with the Express application
const Server = http.createServer(app);

// Listen on the port specified in the environment variables (or a default port)
Server.listen(process.env.PORT);