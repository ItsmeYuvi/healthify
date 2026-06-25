import React from "react";
import { cn } from "@/lib/utils";

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "violet" | "teal";
  className?: string;
}

export function GlassBadge({ children, variant = "secondary", className = "" }: GlassBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
        variant === "primary" && "bg-accent/10 border-accent/20 text-accent",
        variant === "secondary" && "bg-white/[0.04] border-white/10 text-white/60",
        variant === "success" && "bg-accent-secondary/10 border-accent-secondary/20 text-accent-secondary",
        variant === "warning" && "bg-warning/10 border-warning/20 text-warning",
        variant === "danger" && "bg-danger/10 border-danger/20 text-danger",
        variant === "violet" && "bg-violet-500/10 border-violet-500/20 text-violet-400",
        variant === "teal" && "bg-teal-500/10 border-teal-500/20 text-teal-400",
        className
      )}
    >
      {children}
    </span>
  );
}
export default GlassBadge;
