"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export function GlassInput({
  label,
  icon,
  error,
  className = "",
  containerClassName = "",
  type = "text",
  ...props
}: GlassInputProps) {
  return (
    <div className={cn("w-full space-y-1", containerClassName)}>
      {label && <label className="glass-label">{label}</label>}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-zinc-400 dark:text-white/30 pointer-events-none w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "glass-input",
            icon && "pl-11",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="block text-[11px] font-semibold text-danger pl-1">
          {error}
        </span>
      )}
    </div>
  );
}
export default GlassInput;
