// Import the 'mysql' module for creating a MySQL database connection
const mysql = require('mysql');

// Load environment variables from a .env file to configure the database connection
require('dotenv').config();

// Create a MySQL database connection using the configuration from environment variables
const connection = mysql.createConnection({
    port: process.env.DB_PORT,         // Port number for the database server
    host: process.env.DB_HOST,         // Hostname or IP address of the database server
    user: process.env.DB_USERNAME,     // MySQL username for authentication
    password: process.env.DB_PASSWORD, // MySQL password for authentication
    database: process.env.DB_NAME     // Name of the MySQL database to connect to
});

// Attempt to connect to the MySQL database
connection.connect((err) => {
    if (!err) {
        console.log("Connected to the database"); // Log a message when successfully connected to the database
    } else {
        console.log("Error connecting to the database:", err); // Log an error message if there's a connection error
    }
});

// Export the 'connection' object to be used for database queries in other parts of the application
module.exports = connection;