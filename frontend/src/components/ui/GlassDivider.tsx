import React from "react";
import { cn } from "@/lib/utils";

interface GlassDividerProps {
  vertical?: boolean;
  className?: string;
}

export function GlassDivider({ vertical = false, className = "" }: GlassDividerProps) {
  return (
    <div
      className={cn(
        vertical
          ? "h-full w-[1px] bg-gradient-to-b from-transparent via-white/[0.08] to-transparent"
          : "w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent",
        className
      )}
    />
  );
}
export default GlassDivider;
