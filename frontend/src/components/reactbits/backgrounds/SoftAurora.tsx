"use client";
import React, { useEffect, useRef } from "react";

interface SoftAuroraProps {
  color1?: string;
  color2?: string;
  speed?: number;
  scale?: number;
  brightness?: number;
  mouseInfluence?: number;
  mouseInteraction?: boolean;
}

export function SoftAurora({
  color1 = "#8B5CF6",
  color2 = "#14B8A6",
  speed = 0.4,
  scale = 1.5,
  brightness = 0.8,
  mouseInfluence = 0.15,
  mouseInteraction = true,
}: SoftAuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    
    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let time = 0;

    const render = () => {
      time += speed * 0.01;
      
      // Interpolate mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render layered radial gradients to create fluid aurora waves
      const grad1X = width * 0.35 + Math.sin(time) * 150 * scale + (mouseRef.current.x * mouseInfluence);
      const grad1Y = height * 0.4 + Math.cos(time * 0.8) * 120 * scale + (mouseRef.current.y * mouseInfluence);
      
      const grad2X = width * 0.65 + Math.cos(time * 1.2) * 180 * scale - (mouseRef.current.x * mouseInfluence * 0.5);
      const grad2Y = height * 0.6 + Math.sin(time * 0.7) * 140 * scale - (mouseRef.current.y * mouseInfluence * 0.5);

      ctx.globalCompositeOperation = "screen";

      // Blob 1 (color1)
      const rad1 = Math.max(width, height) * 0.65 * scale;
      const g1 = ctx.createRadialGradient(grad1X, grad1Y, 0, grad1X, grad1Y, rad1);
      g1.addColorStop(0, hexToRgba(color1, brightness * 0.35));
      g1.addColorStop(0.5, hexToRgba(color1, brightness * 0.12));
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Blob 2 (color2)
      const rad2 = Math.max(width, height) * 0.6 * scale;
      const g2 = ctx.createRadialGradient(grad2X, grad2Y, 0, grad2X, grad2Y, rad2);
      g2.addColorStop(0, hexToRgba(color2, brightness * 0.32));
      g2.addColorStop(0.5, hexToRgba(color2, brightness * 0.10));
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [color1, color2, speed, scale, brightness, mouseInfluence, mouseInteraction]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full pointer-events-none block bg-[#0a0a0f]" />;
}

function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export default SoftAurora;
