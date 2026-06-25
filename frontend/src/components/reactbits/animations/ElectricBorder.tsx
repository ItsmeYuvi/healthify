"use client";
import React, { useState } from "react";

interface ElectricBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export function ElectricBorder({
  children,
  className = "",
  color = "#8B5CF6",
  duration = 3,
}: ElectricBorderProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-3xl p-[1.5px] overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Moving electric border visible on hover */}
      <div
        className="absolute inset-[-300%] animate-[spin_infinite_linear] opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundImage: `conic-gradient(from 0deg, transparent 60%, ${color} 80%, transparent 100%)`,
          animationDuration: `${duration}s`,
          opacity: hovered ? 1 : 0,
        }}
      />
      {/* Inner surface */}
      <div className="relative rounded-[22.5px] bg-[#0a0a0f] h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
export default ElectricBorder;
