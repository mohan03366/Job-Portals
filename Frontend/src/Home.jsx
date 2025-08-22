import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";

export default function Home() {
  return (
    <main>
      <Helmet>
        <title>Find your next role | JobPortal</title>
        <meta
          name="description"
          content="Discover top tech jobs, apply instantly, and manage applications with a powerful, modern job portal."
        />
        <meta property="og:title" content="Find your next role | JobPortal" />
        <meta
          property="og:description"
          content="Discover top tech jobs, apply instantly, and manage applications with a powerful, modern job portal."
        />
      </Helmet>

      <section className="container mx-auto pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Land your dream job with a PlacementEmpire that feels like magic
            </h1>
            <p className="text-white/80 mt-4 text-lg">
              Explore curated roles, apply in seconds, and keep everything
              organized—beautifully.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Button asChild className="bg-fuchsia-600 hover:bg-fuchsia-500">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white/10 hover:bg-white/20"
              >
                <Link to="/admin">Post a Job</Link>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-fuchsia-500/30 to-indigo-500/30 blur-2xl"></div>
            <div className="relative glass rounded-3xl p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden">
                  <img
                    class="w-full h-48 object-cover"
                    alt="Team collaborating in modern office"
                    src="https://images.unsplash.com/photo-1681184025442-1517cb9319c1"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    class="w-full h-48 object-cover"
                    alt="Person reviewing resume"
                    src="https://images.unsplash.com/photo-1698047681432-006d2449c631"
                  />
                </div>
              </div>
              <p className="text-center text-sm text-white/70 mt-3">
                Real jobs. Real impact. Real simple.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto mt-16">
        <div className="glass rounded-2xl p-6 grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-2xl font-bold">Fast</p>
            <p className="text-white/70 mt-2">
              Snappy search and one-click apply.
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold">Beautiful</p>
            <p className="text-white/70 mt-2">
              Modern, responsive design—on any device.
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold">Powerful</p>
            <p className="text-white/70 mt-2">
              Admin tools to post and manage roles easily.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
