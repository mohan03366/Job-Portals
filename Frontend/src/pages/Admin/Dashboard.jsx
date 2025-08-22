import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { RequireAdmin } from "../../components/Protected";
import JobForm from "../../components/JobForm";
import { Button } from "../../components/ui/button";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "../../components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-diaog";

function AdminDashboardInner() {
  const { auth } = useAuth();
  const [creating, setCreating] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  async function loadJobs() {
    setLoading(true);
    try {
      const data = await api.getJobs();
      const list = Array.isArray(data) ? data : data?.jobs || data?.data || [];
      setJobs(list);
    } catch (e) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  const createJob = async (payload) => {
    setSaving(true);
    try {
      const res = await api.createJob(payload, auth.token);
      toast({
        title: "Job created",
        description: res?.message || "Your job is now live.",
      });
      setCreating(false);
      await loadJobs();
    } catch (e) {
      toast({ title: "Failed to create", description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const updateJob = async (payload) => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await api.updateJob(
        editing._id || editing.id,
        payload,
        auth.token
      );
      toast({
        title: "Job updated",
        description: res?.message || "Changes saved.",
      });
      setEditing(null);
      await loadJobs();
    } catch (e) {
      toast({ title: "Failed to update", description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await api.deleteJob(jobToDelete._id || jobToDelete.id, auth.token);
      toast({ title: "Job deleted", description: "It has been removed." });
      await loadJobs();
    } catch (e) {
      toast({ title: "Failed to delete", description: e.message });
    } finally {
      setJobToDelete(null);
    }
  };

  return (
    <main className="container mx-auto pt-10">
      <Helmet>
        <title>Admin | JobPortal</title>
        <meta
          name="description"
          content="Create, update, and manage job postings and applicants."
        />
        <meta property="og:title" content="Admin | JobPortal" />
        <meta
          property="og:description"
          content="Create, update, and manage job postings and applicants."
        />
      </Helmet>

      <h1 className="mt-10  text-3xl md:text-4xl font-extrabold">
        Admin dashboard
      </h1>

      <section className="mt-6 glass rounded-2xl p-6">
        {!creating && !editing && (
          <div className="flex items-center justify-between">
            <p className="text-white/80">Manage your job postings</p>
            <Button
              onClick={() => setCreating(true)}
              className="bg-fuchsia-600 hover:bg-fuchsia-500"
            >
              Create Job
            </Button>
          </div>
        )}

        {creating && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">New Job</h2>
            <JobForm onSubmit={createJob} submitting={saving} />
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => setCreating(false)}
                className="bg-white/10 hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {editing && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Edit Job</h2>
            <JobForm
              initial={editing}
              onSubmit={updateJob}
              submitting={saving}
            />
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => setEditing(null)}
                className="bg-white/10 hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-8">
        {loading ? (
          <LoadingSpinner label="Loading jobs..." />
        ) : !jobs || jobs.length === 0 ? (
          <EmptyState
            title="No jobs yet"
            subtitle="Create your first job above."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((j) => (
              <article key={j._id || j.id} className="glass rounded-2xl p-5">
                <p className="text-lg font-semibold">{j.title}</p>
                <p className="text-white/70">
                  {j.company} • {j.location}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    onClick={() => setEditing(j)}
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                  <Button
                    onClick={() => setJobToDelete(j)}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <AlertDialog
        open={!!jobToDelete}
        onOpenChange={(open) => !open && setJobToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "
              {jobToDelete?.title}" job posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setJobToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <RequireAdmin>
      <AdminDashboardInner />
    </RequireAdmin>
  );
}
