const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

/**
 * Generates a JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 * @throws {Error} If JWT_SECRET_KEY is missing
 */
const generateToken = (id) => {
  // Validate environment variable exists
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET_KEY, // Access via process.env
    { expiresIn: "30d" }
  );
};

module.exports = generateToken;
