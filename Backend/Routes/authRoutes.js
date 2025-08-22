const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require("../Controllers/authController");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginUser);

// @desc    Logout user/admin (clear cookie)
// @route   POST /api/auth/logout
// @access  Public
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public
router.post("/admin/register", registerAdmin);

// @desc    Authenticate admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
router.post("/admin/login", loginAdmin);

module.exports = router;
