"use client";
import React from "react";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  return (
    <ScrollReveal enableBlur={true} baseOpacity={0.05} baseRotation={1} className={className}>
      {children}
    </ScrollReveal>
  );
}
export default AnimatedSection;
