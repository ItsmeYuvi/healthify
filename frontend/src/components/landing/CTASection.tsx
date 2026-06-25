"use client";
import React from "react";
import Link from "next/link";
import { GlassCard } from "../ui/GlassCard";
import { ShinyText } from "../reactbits/text-animations/ShinyText";
import { GlassButton } from "../ui/GlassButton";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";

export function CTASection() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto relative z-10">
      <ScrollReveal enableBlur={true} baseOpacity={0.05} baseRotation={1}>
        <div className="relative overflow-hidden p-10 md:p-16 text-center space-y-8 bg-[#141414] border border-white/[0.04] rounded-3xl shadow-2xl flex flex-col items-center">
          {/* Faint gold aurora inside card */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.04)_0%,transparent_60%)] pointer-events-none" />

          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-medium block">Executive Onboarding</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light leading-tight">
              Begin Your <span className="italic text-luxury-gold">Vitality Journey</span>
            </h2>
            <p className="text-sm md:text-base text-white/50 leading-relaxed font-light max-w-xl mx-auto">
              Join elite members mapping customized longevity blueprints, auditing biometrics, and executing high-performance physical logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto z-10">
            <Link href="/register" className="w-full sm:w-auto flex justify-center">
              <GlassButton variant="primary" className="w-full sm:w-auto min-w-[200px] h-[48px] px-8">
                Begin Onboarding
              </GlassButton>
            </Link>
            <Link href="/login" className="w-full sm:w-auto flex justify-center">
              <GlassButton variant="secondary" className="w-full sm:w-auto min-w-[200px] h-[48px] px-8">
                Access Dashboard
              </GlassButton>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
export default CTASection;
