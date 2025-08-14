
"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { AccessDenied } from "@/components/access-denied";
import { ReportsDataTable } from "@/components/reports-data-table";
import { Suspense, useState, useMemo, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loading } from "@/components/loading";
import type { Period } from "@/lib/types";
import { DateRange } from "react-day-picker";
import { PeriodPicker } from "@/components/period-picker";
import { Input } from "@/components/ui/input";

function ReportsPageContent() {
  const { role, isLoaded } = useUserRole();
  const [period, setPeriod] = useState<Period>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filter, setFilter] = useState("");

  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'CUSTOM') {
      setDateRange(undefined);
    }
  }, []);

  const handleDateRangeChange = useCallback((newDateRange: DateRange | undefined) => {
    setPeriod('CUSTOM');
    setDateRange(newDateRange);
  }, []);


  if (!isLoaded) {
    return <Loading />;
  }

  const canViewReports =
    role && ["Finance Team", "Sales & Marketing", "Operations Team", "CEO/Executive", "Company Admin"].includes(role);

  if (!canViewReports) {
    return <AccessDenied />;
  }

  // CEO sees all reports in a tabbed view
  if (role === "CEO/Executive") {
      return (
        <>
            <DashboardHeader
                title="Reports"
                description="Generate and download departmental reports."
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Input
                  placeholder="Filter reports..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full sm:w-auto md:w-[250px]"
                />
                <PeriodPicker 
                    period={period!} 
                    onPeriodChange={handlePeriodChange}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                />
              </div>
            </DashboardHeader>
            <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
                <Tabs defaultValue="financials" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                        <TabsTrigger value="financials">Financials</TabsTrigger>
                        <TabsTrigger value="membership">Membership</TabsTrigger>
                        <TabsTrigger value="sales">Sales & Marketing</TabsTrigger>
                        <TabsTrigger value="operations">Operations</TabsTrigger>
                    </TabsList>
                    <TabsContent value="financials" className="mt-6">
                        <ReportsDataTable reportType="financial" filterValue={filter} />
                    </TabsContent>
                    <TabsContent value="membership" className="mt-6">
                        <ReportsDataTable reportType="membership" filterValue={filter} />
                    </TabsContent>
                    <TabsContent value="sales" className="mt-6">
                       <ReportsDataTable reportType="sales" filterValue={filter} />
                    </TabsContent>
                    <TabsContent value="operations" className="mt-6">
                        <ReportsDataTable reportType="operations" filterValue={filter} />
                    </TabsContent>
                </Tabs>
            </main>
        </>
      )
  }

  // Other roles see a single reports table. The specific reports would be determined by their role.
  // For the prototype, we can infer the report type from the role.
  let reportType: "financial" | "sales" | "operations" | "membership" = "financial";
  if (role === "Sales & Marketing") reportType = "sales";
  if (role === "Operations Team") reportType = "operations";
  
  return (
    <>
      <DashboardHeader
        title="Reports"
        description="Generate and download financial reports for sharing and documentation."
      />
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <ReportsDataTable reportType={reportType} />
      </main>
    </>
  );
}


export default function ReportsPage() {
  return (
    <Suspense>
        <ReportsPageContent />
    </Suspense>
  )
}
