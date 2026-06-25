"use client";
import React, { useEffect, useState } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateOnLoad?: boolean;
}

export function BlurText({
  text,
  delay = 0.04,
  className = "",
  animateOnLoad = true,
}: BlurTextProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (animateOnLoad) {
      // Small timeout to trigger transition after render
      const timer = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animateOnLoad]);

  const words = text.split(" ");

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block transition-all duration-700 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? "blur(0px)" : "blur(8px)",
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transitionDelay: `${idx * delay}s`,
            whiteSpace: "pre",
            marginRight: "0.25em",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
export default BlurText;
