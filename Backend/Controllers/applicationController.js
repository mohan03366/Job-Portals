const Application = require("../Models/Application");
const Job = require("../Models/Job");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const safeDeleteFile = (filePath) => {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};
// @desc    Apply for a Job
// @route   POST /api/applications/apply
// @access  Private (User)
const applyJob = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const {
      jobId,
      fullName,
      email,
      phone,
      address,
      linkedin,
      portfolio,
      coverLetter,
      expectedSalary,
      noticePeriod,
      education,
      experience,
      skills,
    } = req.body;

    // ✅ Required fields check
    if (!jobId || !fullName || !email || !phone) {
      // Delete the uploaded file if validation fails
      if (req.file) {
        safeDeleteFile(req.file.path);
      }
      return res.status(400).json({
        error:
          "Please provide all required fields: jobId, fullName, email, and phone",
      });
    }

    // ✅ Phone number validation (basic check for 10 digits)
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      if (req.file) {
        safeDeleteFile(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "Please provide a valid 10-digit phone number" });
    }

    // ✅ Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      // Delete the uploaded file if job not found
      if (req.file) {
        safeDeleteFile(req.file.path);
      }
      return res.status(404).json({ error: "Job not found" });
    }

    // ✅ Prevent duplicate applications
    const existingApplication = await Application.findOne({
      user: req.user._id,
      job: jobId,
    });
    if (existingApplication) {
      // Delete the uploaded file if duplicate application
      if (req.file) {
        safeDeleteFile(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "You have already applied for this job" });
    }

    // Parse skills if it's a string
    let skillsArray = [];
    if (typeof skills === "string") {
      try {
        skillsArray = JSON.parse(skills);
      } catch (e) {
        // If parsing fails, split by commas
        skillsArray = skills.split(",").map((skill) => skill.trim());
      }
    } else if (Array.isArray(skills)) {
      skillsArray = skills;
    }

    // Parse education data - UPDATED FOR NEW SCHEMA
    let educationData = [];
    if (education) {
      if (typeof education === "string") {
        try {
          educationData = JSON.parse(education);
        } catch (e) {
          // If it's a simple string (old format), convert to new format
          educationData = [
            {
              degree: education,
              institution: "",
              year: "",
              grade: "",
            },
          ];
        }
      } else if (Array.isArray(education)) {
        educationData = education;
      }
    }

    // Parse experience data - UPDATED FOR NEW SCHEMA
    let experienceData = [];
    if (experience) {
      if (typeof experience === "string") {
        try {
          experienceData = JSON.parse(experience);
        } catch (e) {
          // If it's a simple string (old format), convert to new format
          experienceData = [
            {
              company: "",
              position: "",
              duration: "",
              description: experience,
            },
          ];
        }
      } else if (Array.isArray(experience)) {
        experienceData = experience;
      }
    }

    // ✅ Validate education data structure
    if (educationData && educationData.length > 0) {
      educationData = educationData.map((edu) => ({
        degree: edu.degree || "",
        institution: edu.institution || "",
        year: edu.year || "",
        grade: edu.grade || "",
      }));
    }

    // ✅ Validate experience data structure
    if (experienceData && experienceData.length > 0) {
      experienceData = experienceData.map((exp) => ({
        company: exp.company || "",
        position: exp.position || "",
        duration: exp.duration || "",
        description: exp.description || "",
      }));
    }

    // ✅ Create new application with updated schema
    const application = await Application.create({
      user: req.user._id,
      job: jobId,
      fullName,
      email,
      phone: cleanPhone,
      address: address || "",
      linkedin: linkedin || "",
      portfolio: portfolio || "",
      resume: req.file.filename,
      resumePath: req.file.path,
      coverLetter: coverLetter || "",
      expectedSalary: expectedSalary || "",
      noticePeriod: noticePeriod || "",
      education: educationData,
      experience: experienceData,
      skills: skillsArray,
    });

    res.status(201).json({
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    // Delete the uploaded file if error occurs
    if (req.file) {
      safeDeleteFile(req.file.path);
    }
    console.error("Apply Job Error:", error);

    // Handle specific mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors.join(", ") });
    }

    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        error: "You have already applied for this job",
      });
    }

    res.status(500).json({ error: "Server error" });
  }
};
// @desc    Get logged-in user's applications
// @route   GET /api/applications/my-applications
// @access  Private/User
const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .populate({
      path: "job",
      select: "title description applicationLink createdAt",
    })
    .sort({ appliedAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Get all applications (Admin Dashboard)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = asyncHandler(async (req, res) => {
  console.log("Fetching all applications for admin dashboard");
  const applications = await Application.find({})
    .populate({
      path: "user",
      select: "name email",
      options: { retainNullValues: true }, // Handle potential deleted users
    })
    .populate({
      path: "job",
      select: "title company", // Added company field
      options: { retainNullValues: true }, // Handle potential deleted jobs
    })
    .sort({ appliedAt: -1 })
    .lean(); // Convert to plain JS objects
  console.log("all applications fetched are", applications);
  // Format for admin dashboard with all necessary fields
  const dashboardData = applications.map((app) => ({
    _id: app._id,
    appliedAt: app.appliedAt,
    status: app.status || "submitted",
    fullName: app.fullName,
    email: app.email,
    phone: app.phone,
    address: app.address,
    linkedin: app.linkedin,
    portfolio: app.portfolio,
    resume: app.resume,
    coverLetter: app.coverLetter,
    expectedSalary: app.expectedSalary,
    noticePeriod: app.noticePeriod,
    education: app.education || [],
    experience: app.experience || [],
    skills: app.skills || [],
    user: app.user
      ? {
          name: app.user.name,
          email: app.user.email,
        }
      : { name: "Deleted User", email: "N/A" },
    job: app.job
      ? {
          title: app.job.title,
          company: app.job.company || "Unknown Company", // Added company field
        }
      : { title: "Deleted Job", company: "Unknown Company" },
  }));
  console.log("dashboard data is", dashboardData);
  res.json({
    success: true,
    count: dashboardData.length,
    applications: dashboardData, // Changed from 'data' to 'applications' for clarity
  });
});

module.exports = {
  applyJob,
  getUserApplications,
  getAllApplications,
};
