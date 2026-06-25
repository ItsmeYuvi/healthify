"use client";
import React from "react";

interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: string;
  as?: "button" | "div";
}

export function StarBorder({
  children,
  className = "",
  color = "#8B5CF6",
  speed = "3s",
  as = "button",
  ...props
}: StarBorderProps) {
  const Component = as as any;
  return (
    <Component
      className={`group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-300 ${
        as === "button" ? "active:scale-95 cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {/* Rotating conic gradient container */}
      <div
        className="absolute inset-[-300%] animate-[spin_infinite_linear] opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          backgroundImage: `conic-gradient(from 0deg, transparent 40%, ${color} 75%, transparent 100%)`,
          animationDuration: speed,
        }}
      />
      
      {/* Inner surface */}
      <div className="relative flex items-center justify-center rounded-[15px] bg-[#0a0a0f]/95 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl group-hover:bg-[#121217]/95 transition-colors duration-300 w-full h-full">
        {children}
      </div>
    </Component>
  );
}
export default StarBorder;
