const User = require("../Models/User");
const Admin = require("../Models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require("../Utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/user/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("hii"),
      // Check if user exists
      console.log("Registering user:", { name, email, password });
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (password will be hashed via pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });
    //console.log("User created successfully:", user);

    if (user) {
      res.cookie("token", generateToken(user._id), {
        httpOnly: true, // Block JavaScript access
        secure: process.env.NODE_ENV === "production", // HTTPS-only in production
        sameSite: "none", // Prevent CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
      });

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // Token is now in cookies, not response body
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", error.message);
    res.status(401).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/user/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.cookie("token", generateToken(user._id), {
        httpOnly: true, // Block JavaScript access
        secure: process.env.NODE_ENV === "production", // HTTPS-only in production
        sameSite: "none", // Prevent CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
      });

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // Token is now in cookies, not response body
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create admin (password will be hashed via pre-save hook)
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    if (admin) {
      res.cookie("token", generateToken(admin._id), {
        httpOnly: true, // Block JavaScript access
        secure: process.env.NODE_ENV === "production", // HTTPS-only in production
        sameSite: "none", // Prevent CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
      });

      res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        // Token is now in cookies, not response body
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Server error during admin registration" });
  }
};

// @desc    Authenticate admin
// @route   POST /api/auth/admin/login
// @access  Public
// @desc    Authenticate admin
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Pehle admin ko find karo with password
    const admin = await Admin.findOne({ email }).select("+password");

    // Agar admin nahi mila to error return karo
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Password verify karo
    console.log("Stored hash:", admin.password);
    const isMatch = await admin.matchPassword(password);
    console.log("✅ Password match result:", isMatch);

    if (isMatch) {
      res.cookie("token", generateToken(admin._id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      });
    } else {
      console.log("❌ Password does not match for admin:", email);
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
};
