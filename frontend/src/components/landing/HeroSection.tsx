"use client";
import React from "react";
import Link from "next/link";
import { ShinyText } from "../reactbits/text-animations/ShinyText";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";
import { StarBorder } from "../reactbits/animations/StarBorder";
import { GlassButton } from "../ui/GlassButton";
import { SoftAurora } from "../reactbits/backgrounds/SoftAurora";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative z-10 min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Aurora Background Layer */}
      <SoftAurora color1="#8B5CF6" color2="#14B8A6" speed={0.3} scale={1.3} brightness={0.65} mouseInfluence={0.08} />

      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 flex flex-col items-center">
        {/* Brand Logo & Headline */}
        <div className="space-y-4">
          <ShinyText text="Healthify" className="text-5xl md:text-7xl font-extrabold tracking-tightest leading-none block" />
          <h2 className="text-3xl md:text-4xl font-semibold text-white/90 tracking-tighter">
            Your AI-Powered Fitness & Indian Diet Companion
          </h2>
        </div>

        {/* Subtitle / Description */}
        <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={1} className="max-w-2xl mx-auto">
          <p className="text-base md:text-lg text-white/60 leading-relaxed">
            Select your goals, map your physical metrics, and let Gemini AI engineer a precision workout, yoga, and nutrition scheme customized to your body.
          </p>
        </ScrollReveal>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto z-10">
          <Link href="/register" className="w-full sm:w-auto flex justify-center">
            <GlassButton variant="primary" className="w-full sm:w-auto min-w-[200px] h-[48px] px-8">
              Get Started Free <ArrowRight className="h-4 w-4 ml-1.5 shrink-0" />
            </GlassButton>
          </Link>
          <Link href="/login" className="w-full sm:w-auto flex justify-center">
            <GlassButton variant="ghost" className="w-full sm:w-auto min-w-[200px] h-[48px] px-8">
              Sign In
            </GlassButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
