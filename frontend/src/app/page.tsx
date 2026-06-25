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
    <div className="relative min-h-screen bg-[#0c0c0c] text-white">
      {/* Interactive visual cursors */}
      <SplashCursor color="#c5a880" />
      <ClickSpark sparkColor="#c5a880" />
      
      {/* Core landing flow segments */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.04] text-center text-xs text-white/30 relative z-10 bg-[#0c0c0c]/40 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Healthify. AI Powered Wellness. All rights reserved.</p>
      </footer>
    </div>
  );
}
