"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "violet" | "teal" | "danger";
  loading?: boolean;
  className?: string;
}

export function GlassButton({
  children,
  variant = "secondary",
  loading = false,
  className = "",
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 select-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
        variant === "primary" && "bg-gradient-to-r from-accent to-[#a3865e] text-[#0c0c0c] font-semibold hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(197,168,128,0.35)] border border-transparent",
        variant === "secondary" && "bg-white/[0.04] border border-white/10 text-white/95 hover:bg-white/[0.08] hover:border-white/20",
        variant === "ghost" && "bg-transparent text-white/70 hover:bg-white/[0.05] hover:text-white border border-transparent",
        variant === "outline" && "bg-transparent border border-white/10 text-white hover:bg-white/[0.04] hover:border-white/20",
        variant === "violet" && "bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/50",
        variant === "teal" && "bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 hover:border-teal-500/50",
        variant === "danger" && "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50",
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

export default GlassButton;
