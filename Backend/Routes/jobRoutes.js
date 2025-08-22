const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../Controllers/jobController");
const adminAuth = require("../Middleware/adminAuth");

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
router.post("/create", adminAuth, createJob);

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get("/getjobs", getJobs);

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
router.get("/:id", getJobById);

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
router.put("/update/:id", adminAuth, updateJob);

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
router.delete(
  "/delete/:id",
  adminAuth,

  deleteJob
);

module.exports = router;
