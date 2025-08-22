const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  // console.log("Admin auth token:", token);
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) {
      return res
        .status(401)
        .json({ message: "Not authorized, admin not found" });
    }
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = adminAuth;
