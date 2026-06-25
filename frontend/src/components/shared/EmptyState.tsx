"use client";
import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import * as Icons from "lucide-react";

interface EmptyStateProps {
  icon: keyof typeof Icons;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  const IconComponent = Icons[icon] as React.ComponentType<any>;

  return (
    <GlassCard className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto bg-white/[0.01]">
      <div className="rounded-2xl bg-white/[0.04] p-4 border border-white/10 mb-4 text-white/40">
        {IconComponent && <IconComponent className="h-10 w-10" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <GlassButton variant="primary" onClick={onAction}>
          {actionText}
        </GlassButton>
      )}
    </GlassCard>
  );
}
export default EmptyState;
