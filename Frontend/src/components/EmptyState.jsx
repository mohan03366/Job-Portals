import React from "react";

export default function EmptyState({
  title = "Nothing here yet",
  subtitle = "Try adjusting your filters or come back later.",
}) {
  return (
    <div className="w-full text-center py-20 glass rounded-2xl">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-white/70 mt-2">{subtitle}</p>
    </div>
  );
}
