"use client";
import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Silk } from "@/components/reactbits/backgrounds/Silk";
import { ClickSpark } from "@/components/reactbits/animations/ClickSpark";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative bg-[var(--bg-canvas)] text-[var(--text-primary)] overflow-x-hidden">
      {/* Subtle silk background animation */}
      <Silk />

      {/* Satisfying click spark feedback */}
      <ClickSpark sparkColor="#8B5CF6" />

      {/* Secure layout wrapper */}
      <AppShell>{children}</AppShell>
    </div>
  );
}
