import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock3, Building2 } from "lucide-react";

export default function JobCard({ job }) {
  return (
    <article className=" glass rounded-2xl p-5 hover:-translate-y-1 hover:shadow-2xl transition transform">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{job?.title || "Job Title"}</h3>
          <p className="text-white/70 text-sm mt-1 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{job?.company || "Company"}</span>
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-200">
          {job?.type || "Full-time"}
        </span>
      </div>

      <p className="text-white/80 mt-3 line-clamp-3">
        {job?.description || "No description provided."}
      </p>

      <div className="mt-4 flex items-center gap-4 text-white/70 text-sm">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {job?.location || "Remote"}
        </span>
        <span className="flex items-center gap-1">
          <Clock3 className="h-4 w-4" />{" "}
          {job?.postedAt
            ? new Date(job.postedAt).toLocaleDateString()
            : "Recently"}
        </span>
      </div>

      <div className="mt-5">
        <Link
          to={`/jobs/${job?._id || job?.id}`}
          className="text-sm text-indigo-300 hover:text-white underline-offset-4 hover:underline"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
