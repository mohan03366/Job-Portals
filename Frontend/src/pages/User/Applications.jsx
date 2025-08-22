import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "./../../context/AuthContext";
import { api } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

export default function Applications() {
  const { auth } = useAuth();
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getMyApplications(auth?.token);
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data
          : data?.applications || data?.data || [];
        setApps(list);
      } catch (e) {
        setApps([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [auth?.token]);

  return (
    <main className=" container mx-auto pt-10">
      <Helmet>
        <title>My Applications | JobPortal</title>
        <meta
          name="description"
          content="Track your job applications in one place."
        />
        <meta property="og:title" content="My Applications | JobPortal" />
        <meta
          property="og:description"
          content="Track your job applications in one place."
        />
      </Helmet>

      <h1 className=" mt-10 p-3 text-3xl md:text-4xl font-extrabold">
        My Applications
      </h1>

      {loading ? (
        <LoadingSpinner label="Loading your applications..." />
      ) : !apps || apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          subtitle="Apply to a job to see it here."
        />
      ) : (
        <section className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {apps.map((a, i) => (
            <article key={a._id || a.id || i} className="glass rounded-2xl p-5">
              <p className="text-lg font-semibold">
                {a.job?.title || a.title || "Job"}
              </p>
              <p className="text-white/70 mt-1">
                {a.job?.company || a.company || "Company"}
              </p>
              <p className="text-white/70 mt-2 text-sm">
                Status: {a.status || "Submitted"}
              </p>
              {a.resume && (
                <a
                  href={a.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 hover:text-white underline text-sm mt-3 inline-block"
                >
                  View Resume
                </a>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
