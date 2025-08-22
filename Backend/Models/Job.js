//const mongoose = require("mongoose");
const mongoose = require("mongoose");
delete mongoose.connection.models["Job"]; // Cache clear karein

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
    maxlength: [100, "Job title cannot exceed 100 characters"],
  },
  company: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    maxlength: [100, "Company name cannot exceed 100 characters"],
  },
  location: {
    type: String,
    required: [true, "Job location is required"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Job type is required"],
    enum: {
      values: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      message: "Please select a valid job type",
    },
  },
  salary: {
    type: String,
    required: [true, "Salary information is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
    minlength: [50, "Job description should be at least 50 characters long"],
  },
  requirements: {
    type: [String], // Array of strings
    required: [true, "Job requirements are required"],
    validate: {
      validator: function (arr) {
        return arr.length > 0; // At least one requirement
      },
      message: "Please provide at least one job requirement",
    },
  },
  applicationLink: {
    type: String,
    required: [true, "Application link is required"],
    trim: true,
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      "Please provide a valid URL",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
