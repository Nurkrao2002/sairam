
"use client";

import { Suspense, useCallback, useMemo, useState, useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { AccessDenied } from "@/components/access-denied";
import { DashboardHeader } from "@/components/dashboard-header";
import { PeriodPicker } from "@/components/period-picker";
import type { Period } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { formatISO, parseISO } from "date-fns";
import { Loading } from "@/components/loading";
import { useFinancialData } from "@/context/financial-data-context";
import { getStatsForPeriod } from "@/lib/financial-aggregator";
import type { FinancialStats as FinancialStatsType } from "@/lib/financial-aggregator";
import { CeoOverviewTab } from "@/components/dashboards/tabs/ceo-overview-tab";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const REQUIRED_ROLES = ["CEO/Executive"];

const departmentOptions = [
    { id: 'financials', label: 'Financials' },
    { id: 'membership', label: 'Membership' },
    { id: 'sales', label: 'Sales & Marketing' },
    { id: 'operations', label: 'Operations' },
];

const kpiOptions = [
    // Financials
    { id: 'fin_revenue', label: 'Revenue Stat Card', department: 'financials' },
    { id: 'fin_gross_margin', label: 'Gross Margin Stat Card', department: 'financials' },
    { id: 'fin_net_margin', label: 'Net Margin Stat Card', department: 'financials' },
    { id: 'fin_ebitda', label: 'EBITDA Stat Card', department: 'financials' },
    { id: 'fin_cash_flow', label: 'Cash Flow Stat Card', department: 'financials' },
    { id: 'fin_ltv', label: 'Customer LTV Stat Card', department: 'financials' },
    { id: 'fin_cac', label: 'Customer CAC Stat Card', department: 'financials' },
    
    // Membership
    { id: 'mem_total', label: 'Total Members Stat Card', department: 'membership' },
    { id: 'mem_new', label: 'New Members Stat Card', department: 'membership' },
    { id: 'mem_lost', label: 'Lost Members Stat Card', department: 'membership' },
    { id: 'mem_retention', label: 'Retention Rate Stat Card', department: 'membership' },
    { id: 'mem_churn', label: 'Churn Rate Stat Card', department: 'membership' },
    { id: 'mem_csat', label: 'CSAT Stat Card', department: 'membership' },
    { id: 'mem_nps', label: 'NPS Stat Card', department: 'membership' },

    // Sales & Marketing
    { id: 'sal_lead_gen', label: 'Lead Generation Stat Card', department: 'sales' },
    { id: 'sal_conversion_rate', label: 'Conversion Rate Stat Card', department: 'sales' },
    { id: 'sal_pipeline_value', label: 'Pipeline Value Stat Card', department: 'sales' },
    { id: 'sal_avg_revenue', label: 'Avg. Revenue per Client Stat Card', department: 'sales' },
    { id: 'sal_marketing_roi', label: 'Marketing ROI Stat Card', department: 'sales' },
    { id: 'sal_cpl', label: 'Cost Per Lead (CPL) Stat Card', department: 'sales' },

    // Operations
    { id: 'ops_utilization', label: 'Utilization Rate Stat Card', department: 'operations' },
    { id: 'ops_completion_rate', label: 'Project Completion Stat Card', department: 'operations' },
    { id: 'ops_delivery_time', label: 'Service Delivery Time Stat Card', department: 'operations' },
    { id: 'ops_revenue_per_employee', label: 'Revenue Per Employee Stat Card', department: 'operations' },
    { id: 'ops_employee_utilization', label: 'Employee Utilization Stat Card', department: 'operations' },
];

function OverviewPageContent() {
    const { role, isLoaded } = useUserRole();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: allData } = useFinancialData();

    const [stats, setStats] = useState<FinancialStatsType | null>(null);
    const [visibleKpis, setVisibleKpis] = useState<string[]>(kpiOptions.map(k => k.id));
    const [tempVisibleKpis, setTempVisibleKpis] = useState<string[]>(visibleKpis);

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
        if (allData.length > 0) {
            const newStats = getStatsForPeriod(allData, period, dateRange);
            setStats(newStats);
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
    
    const handleKpiSelectionChange = (kpiId: string) => {
        setTempVisibleKpis(prev => 
            prev.includes(kpiId) ? prev.filter(id => id !== kpiId) : [...prev, kpiId]
        );
    };

    const applyKpiChanges = () => {
        setVisibleKpis(tempVisibleKpis);
    }


    if (!isLoaded || !stats) {
        return <Loading />;
    }
    
    if (!role || !REQUIRED_ROLES.includes(role)) {
        return <AccessDenied />;
    }

    return (
        <>
            <DashboardHeader
                title="Business Overview"
                description="A high-level, cross-functional summary of key performance indicators."
            >
                 <div className="flex items-center gap-2">
                    <Dialog onOpenChange={(open) => !open && setTempVisibleKpis(visibleKpis)}>
                        <DialogTrigger asChild>
                             <Button variant="outline" size="icon" aria-label="Configure KPIs">
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Configure Overview Widgets</DialogTitle>
                                <DialogDescription>
                                    Select the individual KPIs and charts you want to display on the overview.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-96">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 p-4">
                                    {departmentOptions.map(dept => (
                                        <div key={dept.id} className="space-y-3">
                                            <h3 className="font-semibold font-headline">{dept.label}</h3>
                                            <Separator />
                                            {kpiOptions.filter(kpi => kpi.department === dept.id).map(kpi => (
                                                <div key={kpi.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`ov-${kpi.id}`}
                                                        checked={tempVisibleKpis.includes(kpi.id)}
                                                        onCheckedChange={() => handleKpiSelectionChange(kpi.id)}
                                                    />
                                                    <Label htmlFor={`ov-${kpi.id}`} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {kpi.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" onClick={applyKpiChanges}>
                                        Apply Changes
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <PeriodPicker 
                        period={period} 
                        onPeriodChange={handlePeriodChange}
                        dateRange={dateRange}
                        onDateRangeChange={handleDateRangeChange}
                    />
                </div>
            </DashboardHeader>
            <main className="flex-1 space-y-6 p-4 sm:px-6 lg:px-8">
                <CeoOverviewTab stats={stats} visibleKpis={visibleKpis} />
            </main>
        </>
    );
}

export default function OverviewPage() {
    return (
        <Suspense>
            <OverviewPageContent />
        </Suspense>
    )
}
