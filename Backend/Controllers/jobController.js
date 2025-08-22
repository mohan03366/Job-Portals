const Job = require("../Models/Job");
const asyncHandler = require("express-async-handler");

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      applicationLink,
    } = req.body;

    // Check for all required fields
    if (
      !title ||
      !company ||
      !location ||
      !type ||
      !salary ||
      !description ||
      !requirements ||
      !applicationLink
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Validate requirements is an array with at least one item
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide at least one requirement" });
    }

    // Validate job type
    const validJobTypes = [
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
      "Remote",
    ];
    if (!validJobTypes.includes(type)) {
      return res.status(400).json({ error: "Please select a valid job type" });
    }

    const job = await Job.create({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      applicationLink,
    });

    res.status(201).json({
      message: "Job created successfully",
      job: job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    // Mongoose validation errors handle karein
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors.join(", ") });
    }

    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 });

  res.json(jobs);
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.json(job);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      applicationLink,
    } = req.body;
    console.log("Update job request body:", req.body);
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    // Validate requirements is an array with at least one item if provided
    if (
      requirements &&
      (!Array.isArray(requirements) || requirements.length === 0)
    ) {
      return res
        .status(400)
        .json({ error: "Please provide at least one requirement" });
    }

    // Validate job type if provided
    if (type) {
      const validJobTypes = [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Remote",
      ];
      if (!validJobTypes.includes(type)) {
        return res
          .status(400)
          .json({ error: "Please select a valid job type" });
      }
    }

    // Update job fields
    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.type = type || job.type;
    job.salary = salary || job.salary;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.applicationLink = applicationLink || job.applicationLink;

    const updatedJob = await job.save();

    res.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors.join(", ") });
    }

    res.status(500).json({ error: "Server error" });
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  await job.deleteOne();
  res.json({ message: "Job deleted" });
});

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
