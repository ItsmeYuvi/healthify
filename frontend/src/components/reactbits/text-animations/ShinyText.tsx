"use client";
import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shineColor?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = "",
  shineColor = "#8B5CF6",
}: ShinyTextProps) {
  if (disabled) return <span className={className}>{text}</span>;

  return (
    <span
      className={`inline-block text-transparent bg-clip-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, var(--text-primary) 40%, ${shineColor} 50%, var(--text-primary) 60%)`,
        backgroundSize: "200% auto",
        animation: `gradient-shift ${speed}s linear infinite`,
      }}
    >
      {text}
    </span>
  );
}
export default ShinyText;
