"use client";
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection";
import { ClickSpark } from "@/components/reactbits/animations/ClickSpark";
import { SplashCursor } from "@/components/reactbits/animations/SplashCursor";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      {/* Interactive visual cursors */}
      <SplashCursor color="#8B5CF6" />
      <ClickSpark sparkColor="#8B5CF6" />
      
      {/* Core landing flow segments */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.08] text-center text-xs text-white/30 relative z-10 bg-[#0a0a0f]/40 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Healthify. AI Powered Wellness. All rights reserved.</p>
      </footer>
    </div>
  );
}
