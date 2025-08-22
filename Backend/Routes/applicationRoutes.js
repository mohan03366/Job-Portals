const express = require("express");
const router = express.Router();
const {
  applyJob,
  getUserApplications,
  getAllApplications,
} = require("../Controllers/applicationController");
const adminAuth = require("../Middleware/adminAuth");
const userAuth = require("../Middleware/userAuth");
const upload = require("../Config/multer");

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private/User
//router.post("/:jobId", userAuth, applyForJob);

// @desc    Apply for a job
// @route   POST /api/applications/apply
// @access  Private/User
router.post(
  "/apply",

  userAuth,
  upload.single("resume"),

  applyJob
);
// @desc    Get logged-in user's applications
// @route   GET /api/applications/my
// @access  Private/User
router.get("/my", userAuth, getUserApplications);

// @desc    Get all applications (Admin Dashboard)
// @route   GET /api/applications
// @access  Private/Admin
router.get("/", adminAuth, getAllApplications);

module.exports = router;
