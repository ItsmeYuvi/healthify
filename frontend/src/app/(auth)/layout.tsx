"use client";
import React from "react";
import { SoftAurora } from "@/components/reactbits/backgrounds/SoftAurora";
import { ClickSpark } from "@/components/reactbits/animations/ClickSpark";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#050A0F] overflow-hidden">
      {/* Click feedback */}
      <ClickSpark sparkColor="#00D4FF" />

      {/* Aurora visual glow */}
      <SoftAurora color1="#00D4FF" color2="#060D18" speed={0.4} scale={1.5} brightness={0.7} mouseInfluence={0.12} />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-350">
        <div 
          className="rounded-[20px] p-10 border border-[#00D4FF]/15 shadow-[0_0_60px_rgba(0,212,255,0.06)] relative overflow-hidden backdrop-blur-2xl"
          style={{ background: "#0C1A26" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
