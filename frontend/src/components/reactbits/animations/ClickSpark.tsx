"use client";
import React, { useEffect, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function ClickSpark({ sparkColor = "#8B5CF6" }: { sparkColor?: string }) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    let sparkId = 0;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "SELECT", "TEXTAREA", "OPTION"].includes(target.tagName)) {
        return;
      }

      const numParticles = 8 + Math.floor(Math.random() * 6);
      const newSparks: Spark[] = [];

      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3;
        newSparks.push({
          id: sparkId++,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 2,
          opacity: 1,
        });
      }

      setSparks((prev) => [...prev, ...newSparks]);
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (sparks.length === 0) return;

    const animId = requestAnimationFrame(() => {
      setSparks((prev) =>
        prev
          .map((spark) => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            opacity: spark.opacity - 0.04,
          }))
          .filter((spark) => spark.opacity > 0)
      );
    });

    return () => cancelAnimationFrame(animId);
  }, [sparks]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute rounded-full"
          style={{
            left: spark.x,
            top: spark.y,
            width: spark.size,
            height: spark.size,
            backgroundColor: sparkColor,
            opacity: spark.opacity,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 6px ${sparkColor}`,
          }}
        />
      ))}
    </div>
  );
}
export default ClickSpark;
