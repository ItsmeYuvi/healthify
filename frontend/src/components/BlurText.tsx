"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "none";
  className?: string;
}

export function BlurText({
  text,
  delay = 0,
  animateBy = "words",
  direction = "bottom",
  className = "",
}: BlurTextProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <span className={className}>{text}</span>;
  }

  const items = animateBy === "words" ? text.split(" ") : text.split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: animateBy === "words" ? 0.08 : 0.02,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      y: direction === "bottom" ? 15 : direction === "top" ? -15 : 0,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 14,
        stiffness: 90,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`inline-block ${className}`}
    >
      {items.map((item, idx) => (
        <motion.span
          key={idx}
          variants={childVariants}
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {item}
          {animateBy === "words" && idx < items.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
export default BlurText;
