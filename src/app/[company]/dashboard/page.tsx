
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
import { getChartDataForPeriod, getStatsForPeriod } from "@/lib/financial-aggregator";
import type { FinancialRecord } from "@/context/financial-data-context";
import type { FinancialStats } from "@/lib/financial-aggregator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceDashboardView } from "@/components/dashboards/finance-dashboard-view";
import { SalesMarketingDashboardView } from "@/components/dashboards/sales-marketing-dashboard-view";
import { OperationsDashboardView } from "@/components/dashboards/operations-dashboard-view";
import { MembershipDashboardView } from "@/components/dashboards/membership-dashboard-view";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


const REQUIRED_ROLES = ["CEO/Executive", "Company Admin"];

const departmentOptions = [
    { id: 'financials', label: 'Financials' },
    { id: 'membership', label: 'Membership' },
    { id: 'sales', label: 'Sales & Marketing' },
    { id: 'operations', label: 'Operations' }
];

const kpiOptions = [
    // Financials
    { id: 'fin_revenue_profit_trend', label: 'Revenue & Profit Trend Chart', department: 'financials' },
    { id: 'fin_expense_breakdown', label: 'Expense Breakdown Chart', department: 'financials' },
    { id: 'fin_profitability_analysis', label: 'Profitability Analysis Chart', department: 'financials' },
    { id: 'fin_weekly_cash_flow', label: 'Weekly Cash Flow Chart', department: 'financials' },
    { id: 'fin_key_ratios', label: 'Key Ratios Table', department: 'financials' },
    { id: 'fin_ar_table', label: 'Accounts Receivable Table', department: 'financials' },
    { id: 'fin_ap_table', label: 'Accounts Payable Table', department: 'financials' },

    // Membership
    { id: 'mem_growth_churn_chart', label: 'Member Growth vs. Churn Chart', department: 'membership' },

    // Sales & Marketing
    { id: 'sal_lead_pipeline_chart', label: 'Lead Pipeline Chart', department: 'sales' },
    { id: 'sal_campaign_roi_chart', label: 'Campaign Performance Chart', department: 'sales' },

    // Operations
    { id: 'ops_project_health_chart', label: 'Project Health Chart', department: 'operations' },
    { id: 'ops_service_delivery_chart', label: 'Service Delivery Chart', department: 'operations' },
];


function DashboardPageContent() {
    const { role, isLoaded } = useUserRole();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: allData } = useFinancialData();

    const [stats, setStats] = useState<FinancialStats | null>(null);
    const [chartData, setChartData] = useState<FinancialRecord[]>([]);
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
            const newChartData = getChartDataForPeriod(allData, period, dateRange);
            setStats(newStats);
            setChartData(newChartData);
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
    
    const visibleDepartments = useMemo(() => {
        const departments = new Set<string>();
        visibleKpis.forEach(kpiId => {
            const kpi = kpiOptions.find(k => k.id === kpiId);
            if (kpi) {
                departments.add(kpi.department);
            }
        });
        return departmentOptions.filter(d => departments.has(d.id));
    }, [visibleKpis]);

    if (!isLoaded || !stats) {
        return <Loading />;
    }
    
    if (!role || !REQUIRED_ROLES.includes(role)) {
        return <AccessDenied />;
    }
    
    return (
        <>
            <DashboardHeader
                title="CEO Dashboard"
                description="Department-level charts and performance indicators for your organization."
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
                                <DialogTitle>Configure Dashboard Widgets</DialogTitle>
                                <DialogDescription>
                                    Select the individual charts you want to display on the dashboard.
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
                                                        id={kpi.id}
                                                        checked={tempVisibleKpis.includes(kpi.id)}
                                                        onCheckedChange={() => handleKpiSelectionChange(kpi.id)}
                                                    />
                                                    <Label htmlFor={kpi.id} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                <Tabs defaultValue={visibleDepartments.length > 0 ? visibleDepartments[0].id : ""} className="w-full">
                    <TabsList className={`grid w-full grid-cols-${visibleDepartments.length > 0 ? visibleDepartments.length : 1}`}>
                        {visibleDepartments.map(tab => (
                            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {visibleDepartments.some(d => d.id === 'financials') && (
                        <TabsContent value="financials" className="mt-6">
                            <FinanceDashboardView stats={stats} chartData={chartData} visibleKpis={visibleKpis} showStats={false} />
                        </TabsContent>
                    )}
                    {visibleDepartments.some(d => d.id === 'membership') && (
                        <TabsContent value="membership" className="mt-6">
                            <MembershipDashboardView stats={stats} visibleKpis={visibleKpis} showStats={false} />
                        </TabsContent>
                    )}
                    {visibleDepartments.some(d => d.id === 'sales') && (
                        <TabsContent value="sales" className="mt-6">
                            <SalesMarketingDashboardView stats={stats} visibleKpis={visibleKpis} showStats={false} />
                        </TabsContent>
                    )}
                    {visibleDepartments.some(d => d.id === 'operations') && (
                        <TabsContent value="operations" className="mt-6">
                            <OperationsDashboardView stats={stats} visibleKpis={visibleKpis} showStats={false} />
                        </TabsContent>
                    )}
                </Tabs>
                {visibleDepartments.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">No Widgets Selected</h3>
                        <p className="text-muted-foreground mt-2">
                           Click the '+' button in the header to configure your dashboard.
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}

export default function DashboardPage() {
    return (
        <Suspense>
            <DashboardPageContent />
        </Suspense>
    )
}
