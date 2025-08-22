import React from "react";

export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div
        className="h-10 w-10 border-2 border-white/20 border-t-fuchsia-400 rounded-full animate-spin"
        aria-label="Loading"
      ></div>
      <p className="mt-3 text-white/70 text-sm">{label}</p>
    </div>
  );
}
