"use client";
import React from "react";
import Link from "next/link";
import { ShinyText } from "../reactbits/text-animations/ShinyText";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";
import { StarBorder } from "../reactbits/animations/StarBorder";
import { GlassButton } from "../ui/GlassButton";
import { SoftAurora } from "../reactbits/backgrounds/SoftAurora";
import { DotField } from "../reactbits/backgrounds/DotField";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Aurora Background Layer */}
      <SoftAurora color1="#8B5CF6" color2="#14B8A6" speed={0.3} scale={1.3} brightness={0.65} mouseInfluence={0.08} />
      
      {/* Decorative interactive Dot Field */}
      <div className="absolute inset-0 opacity-60 pointer-events-none z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#A855F7"
          gradientTo="#B497CF"
          glowColor="#120F17"
        />
      </div>

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
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <StarBorder color="#8B5CF6" speed="3.5s" className="w-full sm:w-auto">
              <span className="flex items-center gap-1">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </span>
            </StarBorder>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <GlassButton variant="ghost" className="w-full sm:w-auto px-8">
              Sign In
            </GlassButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
