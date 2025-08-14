
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function DashboardHeader({ title, description, children, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row items-start justify-between gap-4 border-b bg-card px-4 py-6 sm:px-6 lg:px-8", className)}>
      <div>
        <h1 className="font-headline text-2xl font-bold text-foreground md:text-3xl">
            {title}
        </h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
}
