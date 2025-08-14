
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InfoTooltip({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="ml-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" aria-label="More info">
            <Info className="h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
