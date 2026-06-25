"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import Link from "next/link";

interface DockItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface DockProps {
  items: DockItem[];
  magnification?: number;
  distance?: number;
}

export function Dock({
  items,
  magnification = 58,
  distance = 140,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-16 items-end gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 pb-2.5 backdrop-blur-2xl shadow-glass-md"
    >
      {items.map((item, idx) => (
        <DockIcon
          key={idx}
          mouseX={mouseX}
          magnification={magnification}
          distance={distance}
          item={item}
        />
      ))}
    </motion.div>
  );
}

function DockIcon({
  mouseX,
  magnification,
  distance,
  item,
}: {
  mouseX: MotionValue;
  magnification: number;
  distance: number;
  item: DockItem;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distanceCalc = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [38, magnification, 38]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconScale = useTransform(
    width,
    [38, magnification],
    [1, 1.25]
  );

  const content = (
    <motion.div
      ref={ref}
      style={{ width }}
      className={`group relative aspect-square rounded-xl flex items-center justify-center transition-colors duration-200 ${
        item.isActive
          ? "bg-white/[0.08] text-[#06b6d4] border border-white/10"
          : "bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {/* Tooltip */}
      <span className="absolute -top-10 scale-0 rounded-lg bg-[#0c0c0e]/95 px-2.5 py-1 text-[11px] font-medium text-white/90 border border-white/5 transition-all group-hover:scale-100 whitespace-nowrap shadow-md">
        {item.label}
      </span>
      <motion.div style={{ scale: iconScale }} className="w-5 h-5 flex items-center justify-center">
        {item.icon}
      </motion.div>
    </motion.div>
  );

  if (item.href) {
    return (
      <Link href={item.href} onClick={item.onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={item.onClick} className="outline-none">
      {content}
    </button>
  );
}
export default Dock;
