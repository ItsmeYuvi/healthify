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
        variant === "primary" && "bg-[#00D4FF] text-[#050A0F] font-bold hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] border border-transparent",
        variant === "secondary" && "bg-transparent border border-[#00D4FF] text-white hover:bg-[#00D4FF]/10",
        variant === "ghost" && "bg-transparent text-[#7A9BB5] hover:bg-[#00D4FF]/5 hover:text-white border border-transparent",
        variant === "outline" && "bg-transparent border border-[#00D4FF] text-white hover:bg-[#00D4FF]/10",
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
