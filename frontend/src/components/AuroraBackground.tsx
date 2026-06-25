"use client";
import React from "react";

export function AuroraBackground({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl p-8 md:p-12 ${className}`}>
      {/* Aurora Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -inset-[10px] opacity-35 dark:opacity-30 filter blur-[70px]">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/20 dark:bg-emerald-600/10 animate-aurora-slow" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/20 dark:bg-teal-600/10 animate-aurora-fast" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-400/20 dark:bg-emerald-700/10 animate-aurora-medium" />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
