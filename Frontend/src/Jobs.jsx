import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ArrowRight,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { toast } from "./components/ui/use-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: "Please log in to view job listings" });
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // For cookie-based authentication, we include credentials
        const response = await fetch("https://job-portals-2-j5ez.onrender.com/api/jobs/getjobs", {
          method: "GET",
          credentials: "include", // This ensures cookies are sent with the request
        });

        if (!response.ok) {
          // If we get a 401, it might mean the user needs to log in
          if (response.status === 401) {
            throw new Error("Please log in to view job listings");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Jobs
          </h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          {error.includes("log in") ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </Link>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10  min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Job Opportunities
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Find your next career move from our curated listings
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No jobs available
            </h3>
            <p className="mt-1 text-gray-500">
              Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1.5" />
                      <span>{job.salary}</span>
                    </div>

                    {job.postedAt && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>
                          Posted on{" "}
                          {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Description
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Requirements
                      </h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {job.requirements
                          .slice(0, 3)
                          .map((requirement, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {requirement}
                            </span>
                          ))}
                        {job.requirements.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <Link
                      to={`/apply/${job._id}`}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
