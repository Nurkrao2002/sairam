
"use client";

import { Suspense, useEffect, useMemo, useState, useCallback } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { AccessDenied } from "@/components/access-denied";
import { DashboardHeader } from "@/components/dashboard-header";
import { useFinancialData } from "@/context/financial-data-context";
import { getChartDataForPeriod, getStatsForPeriod } from "@/lib/financial-aggregator";
import type { FinancialRecord } from "@/context/financial-data-context";
import type { Period } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { formatISO, parseISO } from "date-fns";
import { PeriodPicker } from "@/components/period-picker";
import { Loading } from "@/components/loading";
import { FinanceDashboardView } from "@/components/dashboards/finance-dashboard-view";

const REQUIRED_ROLES = ["Finance Team", "Company Admin", "CEO/Executive"];

function FinancialDashboardPageContent() {
    const { role, isLoaded } = useUserRole();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: allData } = useFinancialData();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<FinancialRecord[]>([]);

    const period = (searchParams.get('period') as Period) || 'M';
  
    const dateRange = useMemo(() => {
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');
        if (period === 'CUSTOM' && fromParam) {
        return {
            from: parseISO(fromParam),
            to: toParam ? parseISO(toParam) : undefined
        };
        }
        return undefined;
    }, [period, searchParams]);
  
    useEffect(() => {
        setIsLoading(true);
        if (allData.length > 0) {
        const newStats = getStatsForPeriod(allData, period, dateRange);
        const newChartData = getChartDataForPeriod(allData, period, dateRange);
        setStats(newStats);
        setChartData(newChartData);
        setIsLoading(false);
        }
    }, [allData, period, dateRange]);


    const handlePeriodChange = useCallback((newPeriod: Period) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('period', newPeriod);
        if (newPeriod !== 'CUSTOM') {
        params.delete('from');
        params.delete('to');
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    const handleDateRangeChange = useCallback((newDateRange: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newDateRange?.from) {
        params.set('period', 'CUSTOM');
        params.set('from', formatISO(newDateRange.from, { representation: 'date' }));
        if (newDateRange.to) {
            params.set('to', formatISO(newDateRange.to, { representation: 'date' }));
        } else {
            params.delete('to');
        }
        router.push(`${pathname}?${params.toString()}`);
        }
    }, [pathname, router, searchParams]);


    if (!isLoaded || isLoading || !stats) {
        return <Loading />; 
    }
    
    if (!role || !REQUIRED_ROLES.includes(role)) {
        return <AccessDenied />;
    }

    return (
        <>
            <DashboardHeader
                title="Financial Dashboard"
                description="Comprehensive financial metrics and performance indicators."
            >
                <PeriodPicker 
                    period={period} 
                    onPeriodChange={handlePeriodChange}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                />
            </DashboardHeader>
            <main className="flex-1 space-y-6 p-4 sm:px-6 lg:px-8">
                <FinanceDashboardView stats={stats} chartData={chartData} />
            </main>
        </>
    );
}


export default function FinancialDashboardPage() {
  return (
    <Suspense>
      <FinancialDashboardPageContent />
    </Suspense>
  )
}
