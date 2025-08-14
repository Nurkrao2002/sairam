
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [localDateRange, setLocalDateRange] = React.useState<DateRange | undefined>(date);

    React.useEffect(() => {
        setLocalDateRange(date);
    }, [date]);

    const handleApply = () => {
        onDateChange(localDateRange);
        setPopoverOpen(false);
    };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={localDateRange?.from}
            selected={localDateRange}
            onSelect={setLocalDateRange}
            numberOfMonths={2}
          />
           <div className="p-2 border-t flex justify-end bg-card">
              <Button onClick={handleApply} size="sm">
                <Check className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
