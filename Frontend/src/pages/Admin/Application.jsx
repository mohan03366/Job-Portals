import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { RequireAdmin } from "../../components/Protected";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

function AdminApplicationsInner() {
  const { auth } = useAuth();
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getAllApplications(auth.token);
        console.log("all application is", data);
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data
          : data?.applications || data?.data || [];
        setApps(list);
      } catch (e) {
        console.error("Error fetching applications:", e);
        setApps([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [auth.token]);

  const toggleExpand = (id) => {
    if (expandedApp === id) {
      setExpandedApp(null);
    } else {
      setExpandedApp(id);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <main className="container mx-auto pt-10 px-4">
      <Helmet>
        <title>Applications | Admin | JobPortal</title>
        <meta
          name="description"
          content="Review and manage all job applications."
        />
        <meta property="og:title" content="Applications | Admin | JobPortal" />
        <meta
          property="og:description"
          content="Review and manage all job applications."
        />
      </Helmet>

      <h1 className="mt-10 text-3xl md:text-4xl font-extrabold">
        All Applications
      </h1>

      {loading ? (
        <LoadingSpinner label="Fetching applications..." />
      ) : !apps || apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          subtitle="They will appear here as candidates apply."
        />
      ) : (
        <section className="mt-8 grid gap-5">
          {apps.map((a, i) => (
            <article key={a._id || a.id || i} className="glass rounded-2xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold">
                    {a.job?.title || "Job"}
                  </p>
                  <p className="text-white/70">{a.job?.company || "Company"}</p>
                  <p className="text-white/70 mt-2 text-sm">
                    Applied on: {formatDate(a.appliedAt)}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpand(a._id || a.id || i)}
                  className="text-indigo-300 hover:text-white px-3 py-1 rounded-md text-sm"
                >
                  {expandedApp === (a._id || a.id || i)
                    ? "Collapse"
                    : "View Details"}
                </button>
              </div>

              <div className="mt-3">
                <p className="text-white/70 text-sm">
                  Applicant:{" "}
                  {a.fullName || a.user?.name || a.applicant?.name || "N/A"}
                </p>
                <p className="text-white/70 text-sm">
                  Email: {a.email || a.userEmail || "N/A"}
                </p>
                <p className="text-white/70 text-sm">
                  Phone: {a.phone || "N/A"}
                </p>
                <p className="text-white/70 text-sm">
                  Status:{" "}
                  <span className="capitalize">{a.status || "submitted"}</span>
                </p>
              </div>

              {expandedApp === (a._id || a.id || i) && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <h3 className="font-medium mb-2">Application Details</h3>

                  {a.address && (
                    <p className="text-white/70 text-sm mb-1">
                      Address: {a.address}
                    </p>
                  )}

                  {a.linkedin && (
                    <p className="text-white/70 text-sm mb-1">
                      LinkedIn:{" "}
                      <a
                        href={a.linkedin}
                        className="text-indigo-300 hover:text-white underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {a.linkedin}
                      </a>
                    </p>
                  )}

                  {a.portfolio && (
                    <p className="text-white/70 text-sm mb-1">
                      Portfolio:{" "}
                      <a
                        href={a.portfolio}
                        className="text-indigo-300 hover:text-white underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {a.portfolio}
                      </a>
                    </p>
                  )}

                  {a.coverLetter && (
                    <div className="mt-3">
                      <p className="text-white/70 text-sm font-medium">
                        Cover Letter:
                      </p>
                      <p className="text-white/70 text-sm mt-1 bg-white/10 p-3 rounded">
                        {a.coverLetter}
                      </p>
                    </div>
                  )}

                  {a.expectedSalary && (
                    <p className="text-white/70 text-sm mt-2">
                      Expected Salary: {a.expectedSalary}
                    </p>
                  )}

                  {a.noticePeriod && (
                    <p className="text-white/70 text-sm">
                      Notice Period: {a.noticePeriod}
                    </p>
                  )}

                  {a.education && a.education.length > 0 && (
                    <div className="mt-3">
                      <p className="text-white/70 text-sm font-medium">
                        Education:
                      </p>
                      {a.education.map((edu, idx) => (
                        <div
                          key={idx}
                          className="text-white/70 text-sm mt-1 ml-2"
                        >
                          • {edu.degree} from {edu.institution} ({edu.year})
                          {edu.grade && `, Grade: ${edu.grade}`}
                        </div>
                      ))}
                    </div>
                  )}

                  {a.experience && a.experience.length > 0 && (
                    <div className="mt-3">
                      <p className="text-white/70 text-sm font-medium">
                        Experience:
                      </p>
                      {a.experience.map((exp, idx) => (
                        <div
                          key={idx}
                          className="text-white/70 text-sm mt-1 ml-2"
                        >
                          • {exp.position} at {exp.company} ({exp.duration})
                          {exp.description && ` - ${exp.description}`}
                        </div>
                      ))}
                    </div>
                  )}

                  {a.skills && a.skills.length > 0 && (
                    <div className="mt-3">
                      <p className="text-white/70 text-sm font-medium">
                        Skills:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {a.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {a.resume && (
                    <div className="mt-4">
                      <a
                        href={a.resume}
                        className="inline-flex items-center text-indigo-300 hover:text-white underline text-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default function AdminApplications() {
  return (
    <RequireAdmin>
      <AdminApplicationsInner />
    </RequireAdmin>
  );
}
