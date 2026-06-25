"use client";
import React from "react";
import { SoftAurora } from "@/components/reactbits/backgrounds/SoftAurora";
import { ClickSpark } from "@/components/reactbits/animations/ClickSpark";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#0a0a0f] overflow-hidden">
      {/* Click feedback */}
      <ClickSpark sparkColor="#8B5CF6" />

      {/* Aurora visual glow */}
      <SoftAurora color1="#8B5CF6" color2="#14B8A6" speed={0.4} scale={1.5} brightness={0.7} mouseInfluence={0.12} />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-350">
        <GlassCard className="rounded-3xl p-8 bg-[#0c0c0e]/90 border-white/[0.08] shadow-2xl">
          {children}
        </GlassCard>
      </div>
    </div>
  );
}
