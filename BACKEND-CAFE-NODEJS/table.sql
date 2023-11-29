-- Create a table named 'user' to store user information
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,   -- Unique user identifier
    name VARCHAR(250),                   -- User's name
    contactNumber VARCHAR(20),           -- User's contact number
    email VARCHAR(250),                  -- User's email address
    password VARCHAR(250),               -- User's password (consider hashing in production)
    status VARCHAR(20),                  -- User's status (e.g., 'true' or 'false')
    role VARCHAR(20),                    -- User's role (e.g., 'admin', 'user', etc.)
    UNIQUE(email)                        -- Ensure email addresses are unique
);

-- Insert an example user into the 'user' table
INSERT INTO user (name, contactNumber, email, password, status, role)
VALUES ('Admin', '1231231231', 'admin@gmail.com', 'admin', 'true', 'admin');


-- Create a table named 'category' to store category information
CREATE TABLE category (
    id INT NOT NULL AUTO_INCREMENT,  -- Unique identifier for each category, automatically incremented
    name VARCHAR(255) NOT NULL,      -- Name of the category, must not be empty
    PRIMARY KEY (id)                 -- Define 'id' as the primary key for the table
);


-- Create a table named 'product' to store product information
CREATE TABLE product (
    id INT NOT NULL AUTO_INCREMENT,  -- Unique identifier for each product, automatically incremented
    name VARCHAR(255) NOT NULL,      -- Name of the product, must not be empty
    categoryId INT NOT NULL,         -- Category ID associated with the product, must not be empty
    description VARCHAR(255),        -- Description of the product (optional)
    price INT,                       -- Price of the product (optional)
    status VARCHAR(20),              -- Status of the product (optional)
    PRIMARY KEY (id)                 -- Define 'id' as the primary key for the table
);

Create TABLE bill(
    id INT NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(200) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    total INT NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)

);