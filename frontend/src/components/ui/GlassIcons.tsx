import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassIconProps {
  name: keyof typeof Icons;
  color?: "violet" | "teal" | "pink" | "amber" | "rose";
  className?: string;
}

export function GlassIcon({ name, color = "violet", className = "" }: GlassIconProps) {
  const IconComponent = Icons[name] as React.ComponentType<any>;

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-md shadow-sm",
        color === "violet" && "bg-violet-500/10 border-violet-500/25 text-violet-400 shadow-violet-500/5",
        color === "teal" && "bg-teal-500/10 border-teal-500/25 text-teal-400 shadow-teal-500/5",
        color === "pink" && "bg-pink-500/10 border-pink-500/25 text-pink-400 shadow-pink-500/5",
        color === "amber" && "bg-amber-500/10 border-amber-500/25 text-amber-400 shadow-amber-500/5",
        color === "rose" && "bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-rose-500/5",
        className
      )}
    >
      {IconComponent && <IconComponent className="h-6 w-6" />}
    </div>
  );
}
export default GlassIcon;
