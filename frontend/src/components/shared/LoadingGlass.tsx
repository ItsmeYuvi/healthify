"use client";
import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { BlurText } from "../reactbits/text-animations/BlurText";

export function LoadingGlass() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      {/* Header skeleton */}
      <GlassCard className="animate-pulse bg-white/[0.01] border-[#00D4FF]/10">
        <div className="h-6 w-1/3 bg-white/10 rounded-lg mb-3" />
        <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
      </GlassCard>

      {/* Grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} className="animate-pulse bg-white/[0.01] border-[#00D4FF]/10">
            <div className="h-4 w-1/4 bg-white/10 rounded-lg mb-4" />
            <div className="h-10 w-full bg-white/5 rounded-lg mb-3" />
            <div className="h-6 w-1/2 bg-white/5 rounded-lg" />
          </GlassCard>
        ))}
      </div>

      <div className="text-center pt-8 text-white/30 text-xs font-semibold uppercase tracking-wider">
        <BlurText text="Securing connection to server..." delay={0.02} />
      </div>
    </div>
  );
}
export default LoadingGlass;
