"use client";
import React, { useRef, useState } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
  spotlightColor?: string;
  gloss?: boolean;
  borderGlowColor?: string;
}

export function GlassCard({
  children,
  className = "",
  spotlight = true,
  spotlightColor = "rgba(6, 182, 212, 0.08)",
  gloss = true,
  borderGlowColor = "rgba(6, 182, 212, 0.25)",
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-2xl shadow-glass-md transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12] ${className}`}
      {...props}
    >
      {/* Glossy Top Highlight */}
      {gloss && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      )}
      
      {/* Background Spotlight Glow */}
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isFocused ? 1 : 0,
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}
      
      {/* Border Spotlight Mask (Refractive edge glow) */}
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, ${borderGlowColor}, transparent 100%)`,
            padding: "1px",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
      
      {/* Specular sheen (adds liquid glass quality) */}
      {gloss && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
export default GlassCard;
