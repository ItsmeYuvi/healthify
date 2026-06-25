"use client";
import React, { useEffect, useRef } from "react";

export function Silk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId: number;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const waves: { y: number; length: number; amplitude: number; speed: number; angle: number }[] = [];
    for (let i = 0; i < 6; i++) {
      waves.push({
        y: height * (0.25 + i * 0.12),
        length: width * (0.8 + Math.random() * 0.4),
        amplitude: 25 + Math.random() * 35,
        speed: 0.001 + Math.random() * 0.0015,
        angle: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.fillStyle = "rgba(12, 12, 12, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(197, 168, 128, 0.012)"; // Subtle gold silk line
      ctx.lineWidth = 1.5;

      waves.forEach((wave) => {
        wave.angle += wave.speed;
        
        ctx.beginPath();
        for (let x = 0; x < width; x += 15) {
          const y = wave.y + Math.sin(x / wave.length + wave.angle) * wave.amplitude * Math.cos(wave.angle * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full pointer-events-none block bg-[#0a0a0f]" />;
}
export default Silk;
