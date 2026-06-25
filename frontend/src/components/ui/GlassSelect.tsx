"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface GlassSelectOption {
  value: string | number;
  label: string;
}

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  options?: GlassSelectOption[];
  containerClassName?: string;
}

export function GlassSelect({
  label,
  icon,
  error,
  options,
  children,
  className = "",
  containerClassName = "",
  ...props
}: GlassSelectProps) {
  return (
    <div className={cn("w-full space-y-1", containerClassName)}>
      {label && <label className="glass-label">{label}</label>}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-zinc-450 dark:text-white/30 pointer-events-none w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <select
          className={cn(
            "glass-select pr-10",
            icon && "pl-11",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0c0c12] text-white">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-4 text-zinc-450 dark:text-white/30 pointer-events-none w-4 h-4 flex items-center justify-center">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && (
        <span className="block text-[11px] font-semibold text-danger pl-1">
          {error}
        </span>
      )}
    </div>
  );
}
export default GlassSelect;
