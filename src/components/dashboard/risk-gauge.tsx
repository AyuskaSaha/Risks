"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  level: string;
  className?: string;
}

export function RiskGauge({ score, level, className }: RiskGaugeProps) {
  // Calculate stroke dasharray
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 30) return "text-green-400";
    if (s < 60) return "text-yellow-400";
    if (s < 85) return "text-orange-400";
    return "text-red-500";
  };

  const getBorderColor = (s: number) => {
    if (s < 30) return "stroke-green-400";
    if (s < 60) return "stroke-yellow-400";
    if (s < 85) return "stroke-orange-400";
    return "stroke-red-500";
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="w-48 h-48 transform -rotate-90">
        <circle
          className="text-muted/20"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
        />
        <circle
          className={cn("transition-all duration-1000 ease-in-out", getBorderColor(score))}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-5xl font-bold font-headline", getColor(score))}>{score}</span>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{level} RISK</span>
      </div>
    </div>
  );
}
