import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export function GradientText({
  children,
  className = "",
  colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"],
  animationSpeed = 6,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to r, ${colors.join(", ")})`,
    backgroundSize: "300% auto",
    animation: `gradient-shift ${animationSpeed}s ease-in-out infinite`,
  };

  return (
    <span
      style={gradientStyle}
      className={`inline-block bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
export default GradientText;
