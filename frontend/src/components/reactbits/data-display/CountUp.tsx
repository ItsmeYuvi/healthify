"use client";
import React, { useEffect, useState } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  startWhen?: boolean;
  className?: string;
  suffix?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  startWhen = true,
  className = "",
  suffix = "",
}: CountUpProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!startWhen) return;

    const end = to;
    const range = end - from;
    const totalFrames = Math.max(1, duration * 60);
    const stepValue = range / totalFrames;

    let frame = 0;
    let animId: number;

    const animateCount = () => {
      frame++;
      const current = from + stepValue * frame;

      if (frame >= totalFrames) {
        setCount(end);
      } else {
        setCount(Math.round(current));
        animId = requestAnimationFrame(animateCount);
      }
    };

    animId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animId);
  }, [to, from, duration, startWhen]);

  return <span className={className}>{count}{suffix}</span>;
}
export default CountUp;
