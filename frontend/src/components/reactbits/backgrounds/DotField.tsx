"use client";
import React, { useEffect, useRef } from "react";

interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
}

export function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  gradientFrom = "#A855F7",
  gradientTo = "#B497CF",
  glowColor = "#120F17",
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Keep track of sparkle offsets
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      const mouse = mouseRef.current;
      const cols = Math.floor(width / dotSpacing) + 2;
      const rows = Math.floor(height / dotSpacing) + 2;

      // Draw background glow if requested
      if (!bulgeOnly && mouse.x > -500 && mouse.y > -500) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        glowGrad.addColorStop(0, glowColor);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.fillStyle = gradientFrom; // Fallback

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const originX = c * dotSpacing;
          const originY = r * dotSpacing;

          // Base wave calculations
          let waveY = 0;
          if (waveAmplitude > 0) {
            waveY = Math.sin(originX * 0.05 + frame * 0.04) * waveAmplitude;
          }

          let dotX = originX;
          let dotY = originY + waveY;

          // Bulge effect calculation
          const dx = dotX - mouse.x;
          const dy = dotY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cursorRadius && dist > 0) {
            const ratio = 1 - dist / cursorRadius; // 0 to 1
            const force = ratio * cursorForce * bulgeStrength;
            
            // Push dot away from cursor
            dotX += (dx / dist) * force;
            dotY += (dy / dist) * force;
          }

          // Calculate color based on gradient
          const t = dotY / height;
          ctx.fillStyle = interpolateColor(gradientFrom, gradientTo, Math.min(Math.max(t, 0), 1));

          // Apply sparkle effect opacity variations
          if (sparkle) {
            const randomVal = Math.sin(c * 12.9898 + r * 78.233 + frame * 0.05) * 0.5 + 0.5;
            ctx.globalAlpha = 0.3 + randomVal * 0.7;
          } else {
            ctx.globalAlpha = 0.45;
          }

          ctx.beginPath();
          ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [
    dotRadius,
    dotSpacing,
    bulgeStrength,
    glowRadius,
    sparkle,
    waveAmplitude,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    gradientFrom,
    gradientTo,
    glowColor,
  ]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

// Simple hex/rgba color interpolator for gradient drawing
function interpolateColor(color1: string, color2: string, factor: number) {
  // Simple hex parsing
  const parseHex = (c: string) => {
    const raw = c.replace("#", "");
    if (raw.length === 3) {
      return [
        parseInt(raw[0] + raw[0], 16),
        parseInt(raw[1] + raw[1], 16),
        parseInt(raw[2] + raw[2], 16),
      ];
    }
    return [
      parseInt(raw.substring(0, 2), 16),
      parseInt(raw.substring(2, 4), 16),
      parseInt(raw.substring(4, 6), 16),
    ];
  };

  try {
    const rgb1 = parseHex(color1);
    const rgb2 = parseHex(color2);
    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * factor);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * factor);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    return color1;
  }
}

export default DotField;
