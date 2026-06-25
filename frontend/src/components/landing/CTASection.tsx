"use client";
import React from "react";
import Link from "next/link";
import { GlassCard } from "../ui/GlassCard";
import { ShinyText } from "../reactbits/text-animations/ShinyText";
import { StarBorder } from "../reactbits/animations/StarBorder";
import { GlassButton } from "../ui/GlassButton";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";

export function CTASection() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto relative z-10">
      <ScrollReveal enableBlur={true} baseOpacity={0.05} baseRotation={1}>
        <GlassCard className="relative overflow-hidden p-10 md:p-16 text-center space-y-8 bg-white/[0.01] border-white/10 shadow-2xl flex flex-col items-center">
          {/* Faint aurora inside card */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_60%)] pointer-events-none" />

          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tightest leading-tight">
              <ShinyText text="Start Your Transformation" />
            </h2>
            <p className="text-sm md:text-base text-white/50 leading-relaxed">
              Join thousands of athletes mapping plans, analyzing metrics, and engineering their strength progression. Free consultation takes less than 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10">
            <Link href="/register" className="w-full sm:w-auto">
              <StarBorder color="#8B5CF6" speed="3.5s" className="w-full sm:w-auto">
                Begin Onboarding
              </StarBorder>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <GlassButton className="w-full sm:w-auto px-8">
                Access Dashboard
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      </ScrollReveal>
    </section>
  );
}
export default CTASection;
