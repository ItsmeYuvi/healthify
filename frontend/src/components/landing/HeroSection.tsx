"use client";
import React from "react";
import Link from "next/link";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";
import { GlassButton } from "../ui/GlassButton";
import { SoftAurora } from "../reactbits/backgrounds/SoftAurora";
import { DotField } from "../reactbits/backgrounds/DotField";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative z-10 min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Radial Gradient Glow behind hero */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%)"
        }}
      />

      {/* Aurora Background Layer */}
      <SoftAurora color1="#00D4FF" color2="#060D18" speed={0.2} scale={1.3} brightness={0.55} mouseInfluence={0.06} />
      
      {/* Decorative interactive Dot Field with bottom fade mask */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      >
        <DotField
          dotRadius={1.2}
          dotSpacing={16}
          bulgeStrength={50}
          glowRadius={180}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={400}
          cursorForce={0.08}
          bulgeOnly
          gradientFrom="#00D4FF"
          gradientTo="#060D18"
          glowColor="#050A0F"
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-10 flex flex-col items-center">
        {/* Brand Logo & Headline */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-medium block">Healthify Portfolio</span>
          <h1 className="text-5xl md:text-8xl font-serif tracking-tight text-white font-light block leading-none">
            Healthify
          </h1>
          <h2 className="text-xl md:text-3xl font-serif text-white tracking-wide max-w-2xl mx-auto mt-2">
            Your <span className="bg-gradient-to-r from-[#00D4FF] to-[#0097B2] bg-clip-text text-transparent font-bold">AI-Powered</span> Executive Wellness Portfolio
          </h2>
        </div>

        {/* Subtitle / Description */}
        <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={1} className="max-w-2xl mx-auto">
          <p className="text-sm md:text-base text-[#7A9BB5] leading-relaxed font-light tracking-wide max-w-xl mx-auto">
            Bespoke diagnostic plans, vitality optimization, and fine-tailored nutrition schemes engineered for peak intellectual and physical output.
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
            <GlassButton variant="outline" className="w-full sm:w-auto min-w-[200px] h-[48px] px-8">
              Sign In
            </GlassButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
