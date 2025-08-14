
"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { SalesForm } from "@/components/data-entry/sales-form";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";

export default function SalesDataEntryPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const handleActionClick = (action: "Download" | "Upload") => {
    toast({
      title: `${action} Initiated`,
      description: `The template ${action.toLowerCase()} process has started.`,
    });
  }
  
  return (
    <>
      <DashboardHeader
        title="Sales & Marketing Data Entry"
        description="Input sales and marketing metrics for a specific period"
      >
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} className="w-full sm:w-auto" />
            <div className="flex items-center gap-2 w-full sm:w-auto border p-1 rounded-lg">
              <Button variant="outline" onClick={() => handleActionClick("Download")} className="flex-1 sm:flex-initial text-xs">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <Button onClick={() => handleActionClick("Upload")} className="flex-1 sm:flex-initial text-xs">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
        </div>
      </DashboardHeader>
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <div className="mx-auto max-w-7xl">
            <SalesForm />
        </div>
      </main>
    </>
  );
}
