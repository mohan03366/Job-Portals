const mongoose = require("mongoose");
delete mongoose.connection.models["application"];
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Job reference is required"],
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  phone: {
    type: String,
    required: [true, "Phone/WhatsApp number is required"],
    match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
  },
  address: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  portfolio: {
    type: String,
    trim: true,
  },
  resume: {
    type: String, // Resume file ka URL/path (upload ke baad yahan store karenge)
    required: [true, "Resume is required"],
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  expectedSalary: {
    type: String,
    trim: true,
  },
  noticePeriod: {
    type: String,
    trim: true,
  },
  education: [
    {
      degree: String,
      institution: String,
      year: String,
      grade: String,
    },
  ],
  experience: [
    {
      company: String,
      position: String,
      duration: String,
      description: String,
    },
  ],
  skills: {
    type: [String],
    default: [],
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent same user applying to same job multiple times
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
