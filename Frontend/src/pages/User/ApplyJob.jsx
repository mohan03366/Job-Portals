import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Upload,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { toast } from "../../components/ui/use-toast";
// Updated validation schema
const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"),
  address: z.string().min(1, "Address is required"),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid URL").optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
  skills: z.string().min(1, "Skills are required"), // This field is required
});

const ApplyJob = () => {
  const { id: jobId } = useParams();
  console.log("Applying for job ID:", jobId);
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });
  const [educationEntries, setEducationEntries] = useState([
    { degree: "", institution: "", year: "", grade: "" },
  ]);
  const [experienceEntries, setExperienceEntries] = useState([
    { company: "", position: "", duration: "", description: "" },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      skills: "", // Initialize skills with empty string
    },
  });

  // Watch the skills value from form
  const skillsValue = watch("skills");

  // Add new education entry
  const addEducationEntry = () => {
    setEducationEntries([
      ...educationEntries,
      { degree: "", institution: "", year: "", grade: "" },
    ]);
  };

  // Remove education entry
  const removeEducationEntry = (index) => {
    if (educationEntries.length > 1) {
      const updatedEntries = [...educationEntries];
      updatedEntries.splice(index, 1);
      setEducationEntries(updatedEntries);
    }
  };

  // Update education entry
  const updateEducationEntry = (index, field, value) => {
    const updatedEntries = [...educationEntries];
    updatedEntries[index][field] = value;
    setEducationEntries(updatedEntries);
  };

  // Add new experience entry
  const addExperienceEntry = () => {
    setExperienceEntries([
      ...experienceEntries,
      { company: "", position: "", duration: "", description: "" },
    ]);
  };

  // Remove experience entry
  const removeExperienceEntry = (index) => {
    if (experienceEntries.length > 1) {
      const updatedEntries = [...experienceEntries];
      updatedEntries.splice(index, 1);
      setExperienceEntries(updatedEntries);
    }
  };

  // Update experience entry
  const updateExperienceEntry = (index, field, value) => {
    const updatedEntries = [...experienceEntries];
    updatedEntries[index][field] = value;
    setExperienceEntries(updatedEntries);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({ title: "Please select a PDF or DOC file", description: "" });

        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form data on submit:", data);
    if (!resumeFile) {
      setSubmitStatus({ success: false, message: "Please upload your resume" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobId", jobId);

      // Clean phone number
      const cleanPhone = data.phone.replace(/\D/g, "");
      formData.append("phone", cleanPhone);

      // Append other form data
      Object.keys(data).forEach((key) => {
        if (key !== "phone") {
          formData.append(key, data[key]);
        }
      });

      // Handle skills - now it comes from form data directly
      const skillsArray = data.skills.split(",").map((skill) => skill.trim());
      formData.append("skills", JSON.stringify(skillsArray));

      // Handle education and experience as arrays
      formData.append("education", JSON.stringify(educationEntries));
      formData.append("experience", JSON.stringify(experienceEntries));

      console.log("Submitting application with data:", formData);
      const response = await fetch(
        "https://job-portals-2-j5ez.onrender.com/api/applications/apply",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Application submitted successfully ✅",
        });
        setTimeout(() => navigate("/jobs"), 2000);
      } else {
        setSubmitStatus({
          success: false,
          message:
            result.error || result.message || "Error submitting application",
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Apply for Job</h2>
            <p className="mt-1 text-sm text-gray-600">
              Please fill out the form below to apply for this position.
            </p>
          </div>

          {submitStatus.message && (
            <div
              className={`mx-6 mt-6 p-4 rounded-md ${
                submitStatus.success
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {submitStatus.success ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <p>{submitStatus.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Personal Information
                </h3>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    {...register("fullName")}
                    type="text"
                    id="fullName"
                    className={`block w-full rounded-md border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className={`block w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number (10 digits) *
                  </label>
                  <input
                    {...register("phone")}
                    type="text"
                    id="phone"
                    maxLength={10}
                    className={`block w-full rounded-md border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                    placeholder="1234567890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address / Location *
                  </label>
                  <input
                    {...register("address")}
                    type="text"
                    id="address"
                    className={`block w-full rounded-md border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    LinkedIn Profile
                  </label>
                  <input
                    {...register("linkedin")}
                    type="url"
                    id="linkedin"
                    className={`block w-full rounded-md border ${
                      errors.linkedin ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  {errors.linkedin && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.linkedin.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="portfolio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Portfolio / GitHub
                  </label>
                  <input
                    {...register("portfolio")}
                    type="url"
                    id="portfolio"
                    className={`block w-full rounded-md border ${
                      errors.portfolio ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                    placeholder="https://github.com/yourprofile"
                  />
                  {errors.portfolio && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.portfolio.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Information Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Professional Information
                </h3>

                <div>
                  <label
                    htmlFor="resume"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Resume Upload (PDF/DOC) *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="resume"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="resume"
                            name="resume"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                  {resumeFile && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {resumeFile.name} selected
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Skills (comma-separated) *
                  </label>
                  <input
                    {...register("skills")}
                    type="text"
                    id="skills"
                    className={`block w-full rounded-md border ${
                      errors.skills ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.skills.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="expectedSalary"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Expected Salary
                  </label>
                  <input
                    {...register("expectedSalary")}
                    type="text"
                    id="expectedSalary"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900"
                    placeholder="e.g. 8 LPA"
                  />
                </div>

                <div>
                  <label
                    htmlFor="noticePeriod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Notice Period
                  </label>
                  <input
                    {...register("noticePeriod")}
                    type="text"
                    id="noticePeriod"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900"
                    placeholder="e.g. 2 Months"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Education
              </h3>
              {educationEntries.map((entry, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-200 rounded-md relative"
                >
                  {educationEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducationEntry(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={entry.degree}
                        onChange={(e) =>
                          updateEducationEntry(index, "degree", e.target.value)
                        }
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={entry.institution}
                        onChange={(e) =>
                          updateEducationEntry(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={entry.year}
                        onChange={(e) =>
                          updateEducationEntry(index, "year", e.target.value)
                        }
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade/Percentage
                      </label>
                      <input
                        type="text"
                        value={entry.grade}
                        onChange={(e) =>
                          updateEducationEntry(index, "grade", e.target.value)
                        }
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addEducationEntry}
                className="flex items-center text-blue-600 hover:text-blue-800 mt-2"
              >
                <Plus size={16} className="mr-1" /> Add Another Education
              </button>
            </div>

            {/* Experience Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Work Experience
              </h3>
              {experienceEntries.map((entry, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-200 rounded-md relative"
                >
                  {experienceEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperienceEntry(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={entry.company}
                        onChange={(e) =>
                          updateExperienceEntry(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={entry.position}
                        onChange={(e) =>
                          updateExperienceEntry(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={entry.duration}
                        onChange={(e) =>
                          updateExperienceEntry(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={entry.description}
                        onChange={(e) =>
                          updateExperienceEntry(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="block w-full rounded-md border border-gray-300  shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900 "
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExperienceEntry}
                className="flex items-center text-blue-600 hover:text-blue-800 mt-2"
              >
                <Plus size={16} className="mr-1" /> Add Another Experience
              </button>
            </div>

            {/* Cover Letter - Full Width */}
            <div className="mt-6">
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cover Letter
              </label>
              <textarea
                {...register("coverLetter")}
                id="coverLetter"
                rows={5}
                className={`block w-full rounded-md border ${
                  errors.coverLetter ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-900`}
                placeholder="Explain why you are a good fit for this position..."
              />
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.coverLetter.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
