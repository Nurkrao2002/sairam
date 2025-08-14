
"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { InfoTooltip } from "./info-tooltip";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  tooltipText?: string;
}

export function StatCard({ title, value, change, icon: Icon, tooltipText }: StatCardProps) {
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");
  const changeColor = isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground";

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 will-change-transform h-full">
        {/* Animated gradient border */}
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm group-hover:animate-pulse"></div>
        {/* Inner Card */}
        <div className="relative z-10 h-full bg-card p-4 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 self-start transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider break-words">{title}</p>
                 {tooltipText && <InfoTooltip>{tooltipText}</InfoTooltip>}
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2 mt-1">
                  <p className="text-xl font-bold text-foreground break-all">{value}</p>
                  {change && (
                  <span className={cn("text-sm font-semibold", changeColor)}>
                      {change}
                  </span>
                  )}
              </div>
            </div>
          </div>
      </div>
    </Card>
  );
}
