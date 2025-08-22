import React, { useState } from "react";
import { Button } from "./ui/button";

export default function JobForm({ initial = {}, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    company: initial.company || "",
    location: initial.location || "",
    type: initial.type || "Full-time",
    salary: initial.salary || "",
    description: initial.description || "",
    requirements: initial.requirements || "",
    applicationLink: initial.applicationLink || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    // Requirements ko array mein convert karein
    const formattedData = {
      ...form,
      requirements: form.requirements
        .split("\n") // New line se separate karein
        .filter((req) => req.trim() !== ""), // Empty lines remove karein
    };

    onSubmit?.(formattedData);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/80">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            placeholder="e.g., Senior React Developer"
          />
        </div>
        <div>
          <label className="text-sm text-white/80">Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            placeholder="Company name"
          />
        </div>
        <div>
          <label className="text-sm text-white/80">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            placeholder="Remote / City, Country"
          />
        </div>
        <div>
          <label className="text-sm text-white/80">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-white/80">Salary</label>
          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            placeholder="e.g., $120k - $150k"
          />
        </div>

        <div>
          <label className="text-sm text-white/80">Application Link</label>
          <input
            name="applicationLink"
            value={form.applicationLink}
            onChange={handleChange}
            required
            type="url"
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            placeholder="https://company.com/apply"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            placeholder="Describe responsibilities, mission, team, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-white/80">
            Requirements (one per line)
          </label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            placeholder="JavaScript\nReact\nNode.js\nMongoDB"
          />
          <p className="text-xs text-white/60 mt-1">
            Enter each requirement on a new line
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-fuchsia-600 hover:bg-fuchsia-500"
        >
          {submitting ? "Saving..." : "Save Job"}
        </Button>
      </div>
    </form>
  );
}
