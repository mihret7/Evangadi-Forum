require("dotenv").config();
// require("dotenv"): This imports the dotenv package.
// .config(): This method loads variables from a .env file into process.env.

const mysql2 = require("mysql2/promise");
 // Import mysql2 for promise-based queries, but for callbacks we use mysql2/callback or mysql2 only
// allows you to use async/await syntax

// This creates a pool of reusable connections instead of a single connection.
// faster and more scalable than opening a new one for every request.
//! using .env for sensitive credentials
const dbconnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  // Max number of active connections allowed in the pool.
});

module.exports = dbconnection;




