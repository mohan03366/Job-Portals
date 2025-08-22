import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { api } from "./utils/api";
import LoadingSpinner from "./components/LoadingSpinner";
import { Button } from "./components/ui/button";
import { useAuth } from "./context/AuthContext";
import { toast } from "./components/ui/use-toast";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [resume, setResume] = useState("");
  const [cover, setCover] = useState("");

  const { auth, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getJobById(id);
        if (!mounted) return;
        setJob(data?.job || data);
      } catch (e) {
        setJob(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const apply = async () => {
    if (!isAuthenticated || isAdmin) {
      toast({
        title: "Login required",
        description: "Please login as a user to apply.",
      });
      return;
    }
    if (!resume) {
      toast({
        title: "Resume required",
        description: "Please provide a resume link.",
      });
      return;
    }
    setApplying(true);
    try {
      const payload = { resume, coverLetter: cover };
      const res = await api.applyToJob(id, payload, auth.token);
      toast({
        title: "Application sent!",
        description: res?.message || "Good luck!",
      });
      setResume("");
      setCover("");
    } catch (e) {
      toast({ title: "Failed to apply", description: e.message });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading job details..." />;

  if (!job) {
    return (
      <main className="container mx-auto pt-10">
        <Helmet>
          <title>Job not found | JobPortal</title>
          <meta name="description" content="This job could not be found." />
          <meta property="og:title" content="Job not found | JobPortal" />
          <meta
            property="og:description"
            content="This job could not be found."
          />
        </Helmet>
        <p className="text-xl">This job is no longer available.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto pt-10">
      <Helmet>
        <title>{job?.title || "Job"} | JobPortal</title>
        <meta
          name="description"
          content={`Apply for ${job?.title || "a great role"} at ${
            job?.company || "a great company"
          }.`}
        />
        <meta
          property="og:title"
          content={`${job?.title || "Job"} | JobPortal`}
        />
        <meta
          property="og:description"
          content={`Apply for ${job?.title || "a great role"} at ${
            job?.company || "a great company"
          }.`}
        />
      </Helmet>

      <h1 className="text-3xl md:text-4xl font-extrabold">{job.title}</h1>
      <p className="text-white/70 mt-2">
        {job.company} • {job.location} • {job.type}
      </p>

      <section className="mt-8 grid lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-xl font-bold">About the role</h2>
          <p className="mt-3 whitespace-pre-line text-white/90">
            {job.description}
          </p>

          {job.requirements && (
            <>
              <h3 className="text-lg font-semibold mt-6">Requirements</h3>
              <p className="mt-2 whitespace-pre-line text-white/90">
                {job.requirements}
              </p>
            </>
          )}

          {job.salary && (
            <>
              <h3 className="text-lg font-semibold mt-6">Salary</h3>
              <p className="mt-2 text-white/90">{job.salary}</p>
            </>
          )}
        </article>

        <aside className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold">Apply now</h2>
          {!isAuthenticated ? (
            <p className="text-white/80 mt-2">Please log in to apply.</p>
          ) : isAdmin ? (
            <p className="text-white/80 mt-2">Admin accounts cannot apply.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                apply();
              }}
              className="mt-3 space-y-3"
            >
              <div>
                <label className="text-sm text-white/80">Resume link</label>
                <input
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-white/80">
                  Cover letter (optional)
                </label>
                <textarea
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
                />
              </div>
              <Button
                disabled={applying}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-500"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
