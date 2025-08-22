import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/30 backdrop-blur">
      <div className="container mx-auto py-8 text-center text-sm text-white/70">
        <p className="mb-2">Develpment By Scalably Vision Pvt. Ltd.</p>
        <p className="space-x-2">
          <span>© {new Date().getFullYear()} Placement Empire.</span>
          <span>All rights reserved </span>
        </p>
      </div>
    </footer>
  );
}
