import React, { useState } from "react";
//import axios from "axios";
import { Helmet } from "react-helmet";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate(from);
    } catch (_) {}
  };

  return (
    <main className=" mt-10 container mx-auto pt-10">
      <Helmet>
        <title>Create your account | JobPortal</title>
        <meta
          name="description"
          content="Register to apply for jobs and track your applications."
        />
        <meta property="og:title" content="Create your account | JobPortal" />
        <meta
          property="og:description"
          content="Register to apply for jobs and track your applications."
        />
      </Helmet>

      <h1 className="text-3xl md:text-4xl font-extrabold">Create account</h1>

      <section className="mt-8 glass rounded-2xl p-6 max-w-xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              required
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-white/80">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              required
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2"
            />
          </div>
          <Button
            disabled={loading}
            className="bg-fuchsia-600 hover:bg-fuchsia-500"
          >
            {loading ? "Creating..." : "Sign up"}
          </Button>
        </form>
      </section>
    </main>
  );
}
