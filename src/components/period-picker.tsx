

"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon, Check } from "lucide-react"
import type { DateRange } from "react-day-picker"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Period } from "@/lib/types"
import { Separator } from "./ui/separator"

interface PeriodPickerProps {
    period: Period;
    onPeriodChange: (period: Period) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (dateRange: DateRange | undefined) => void;
    className?: string
}

export function PeriodPicker({
    period,
    onPeriodChange,
    dateRange,
    onDateRangeChange,
    className
}: PeriodPickerProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [localDateRange, setLocalDateRange] = React.useState<DateRange | undefined>(dateRange);

  React.useEffect(() => {
    setLocalDateRange(dateRange);
  }, [dateRange]);

  const handleApplyDateRange = () => {
    onDateRangeChange(localDateRange);
    setPopoverOpen(false);
  }

  const handlePeriodChange = (value: string) => {
    const newPeriod = value as Period;
    if (newPeriod !== 'CUSTOM') {
      onPeriodChange(newPeriod);
    }
  }

  return (
    <div className={cn("flex items-center gap-2 bg-card p-1 rounded-lg border w-full sm:w-auto", className)}>
        <Tabs value={period} onValueChange={handlePeriodChange} className="w-full sm:w-auto">
            <TabsList className="h-9 w-full bg-transparent p-0">
                <TabsTrigger value="D" className="text-xs px-2.5">
                    <span className="hidden sm:inline">Daily</span>
                    <span className="sm:hidden">D</span>
                </TabsTrigger>
                <TabsTrigger value="W" className="text-xs px-2.5">
                    <span className="hidden sm:inline">Weekly</span>
                    <span className="sm:hidden">W</span>
                </TabsTrigger>
                <TabsTrigger value="M" className="text-xs px-2.5">
                    <span className="hidden sm:inline">Monthly</span>
                    <span className="sm:hidden">M</span>
                </TabsTrigger>
                <TabsTrigger value="YTD" className="text-xs px-2.5">YTD</TabsTrigger>
                <TabsTrigger value="ALL" className="text-xs px-2.5">
                    <span className="hidden sm:inline">All Time</span>
                    <span className="sm:hidden">All</span>
                </TabsTrigger>
            </TabsList>
        </Tabs>
        <Separator orientation="vertical" className="h-6" />
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"ghost"}
                size={"icon"}
                className={cn(
                "justify-center text-left font-normal h-9 w-9 transition-all duration-200",
                "bg-transparent hover:bg-secondary",
                !dateRange && "text-muted-foreground",
                period === 'CUSTOM' && "text-primary ring-2 ring-primary"
                )}
            >
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Open custom date picker</span>
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={localDateRange?.from}
                  selected={localDateRange}
                  onSelect={setLocalDateRange}
                  numberOfMonths={2}
              />
              <div className="p-2 border-t flex justify-end bg-card">
                <Button onClick={handleApplyDateRange} size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              </div>
            </PopoverContent>
        </Popover>
    </div>
  )
}
