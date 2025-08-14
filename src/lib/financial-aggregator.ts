
import type { Period } from "@/lib/types";
import type { FinancialRecord } from "@/context/financial-data-context";
import { subDays, subWeeks, subMonths, startOfYear, isWithinInterval, startOfDay, endOfDay, differenceInDays, format, startOfMonth, startOfWeek, endOfWeek, endOfMonth } from 'date-fns';
import type { DateRange } from "react-day-picker";

type StatValue = {
    value: string;
    change: string;
}

export type FinancialStats = {
    revenue: StatValue;
    grossMargin: StatValue;
    netMargin: StatValue;
    ebitda: StatValue;
    cashFlow: StatValue;
    customerLtv: StatValue;
    customerCac: StatValue;
}

const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
};

const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

const formatChange = (change: number, isPercentage: boolean = false) => {
    if (change === 0 || !isFinite(change) || isNaN(change)) return " ";
    const prefix = change > 0 ? '+' : '';
    if (isPercentage) {
        const points = (change * 100).toFixed(1);
        return `${prefix}${points} pts`;
    }
    const percentage = (change * 100).toFixed(1);
    return `${prefix}${percentage}%`;
}

const aggregateRecords = (records: FinancialRecord[]): Omit<FinancialRecord, 'period' | 'id'> & { count: number } => {
    if (records.length === 0) {
        return {
            revenue: 0, grossProfit: 0, netIncome: 0, expenses: 0,
            ebitda: 0, cashFlow: 0, customerLtv: 0, customerCac: 0, count: 0,
        };
    }
    
    const total = records.reduce((acc, rec) => ({
        revenue: acc.revenue + rec.revenue,
        grossProfit: acc.grossProfit + rec.grossProfit,
        netIncome: acc.netIncome + rec.netIncome,
        expenses: acc.expenses + rec.expenses,
        ebitda: acc.ebitda + rec.ebitda,
        cashFlow: acc.cashFlow + rec.cashFlow,
        customerLtv: acc.customerLtv + rec.customerLtv,
        customerCac: acc.customerCac + rec.customerCac,
    }), { revenue: 0, grossProfit: 0, netIncome: 0, expenses: 0, ebitda: 0, cashFlow: 0, customerLtv: 0, customerCac: 0 });

    return {
        revenue: total.revenue,
        grossProfit: total.grossProfit,
        netIncome: total.netIncome,
        expenses: total.expenses,
        ebitda: total.ebitda,
        cashFlow: total.cashFlow,
        customerLtv: records.length > 0 ? total.customerLtv / records.length : 0,
        customerCac: records.length > 0 ? total.customerCac / records.length : 0,
        count: records.length,
    }
};

const getIntervalsForStats = (period: Period, dateRange?: DateRange) => {
    const today = new Date();
    let currentInterval: Interval | null = null;
    let previousInterval: Interval | null = null;

    switch (period) {
        case 'D':
            currentInterval = { start: startOfDay(today), end: endOfDay(today) };
            previousInterval = { start: subDays(startOfDay(today), 1), end: subDays(endOfDay(today), 1) };
            break;
        case 'W':
            currentInterval = { start: subWeeks(startOfDay(today), 1), end: endOfDay(today) };
            previousInterval = { start: subWeeks(startOfDay(today), 2), end: subWeeks(endOfDay(today), 1) };
            break;
        case 'M':
            currentInterval = { start: subMonths(startOfDay(today), 1), end: endOfDay(today) };
            previousInterval = { start: subMonths(startOfDay(today), 2), end: subMonths(endOfDay(today), 1) };
            break;
        case 'YTD':
            const startOfYearDate = startOfYear(today);
            currentInterval = { start: startOfYearDate, end: endOfDay(today) };
            const prevYearStart = startOfYear(subMonths(today, 12));
            const prevYearEnd = subMonths(endOfDay(today), 12);
            previousInterval = { start: prevYearStart, end: prevYearEnd };
            break;
        case 'ALL':
            currentInterval = null; // No filtering for ALL
            previousInterval = null; // No previous period for ALL
            break;
        case 'CUSTOM':
            if (!dateRange || !dateRange.from) break;
            const end = dateRange.to || dateRange.from;
            currentInterval = { start: startOfDay(dateRange.from), end: endOfDay(end) };
            const duration = differenceInDays(end, dateRange.from);
            const prevEnd = subDays(startOfDay(dateRange.from), 1);
            const prevStart = subDays(prevEnd, duration);
            previousInterval = { start: prevStart, end: prevEnd };
            break;
    }
    return { currentInterval, previousInterval };
}

export const getStatsForPeriod = (allData: FinancialRecord[], period: Period, dateRange?: DateRange): FinancialStats => {
    const { currentInterval, previousInterval } = getIntervalsForStats(period, dateRange);

    const currentRecords = currentInterval ? allData.filter(d => isWithinInterval(d.period, currentInterval!)) : allData;
    const previousRecords = previousInterval ? allData.filter(d => isWithinInterval(d.period, previousInterval!)) : [];
    
    const currentAgg = aggregateRecords(currentRecords);
    const previousAgg = aggregateRecords(previousRecords);
    
    if (currentAgg.count === 0) {
        return getNoDataStats();
    }
    
    const calculateChange = (current: number, previous: number) => {
        if (previousAgg.count === 0) return 0; // No previous data to compare against
        if (previous === 0) return current === 0 ? 0 : Infinity;
        return (current - previous) / Math.abs(previous);
    }
    
    const currentGrossMargin = currentAgg.revenue > 0 ? currentAgg.grossProfit / currentAgg.revenue : 0;
    const previousGrossMargin = previousAgg.revenue > 0 ? previousAgg.grossProfit / previousAgg.revenue : 0;

    const currentNetMargin = currentAgg.revenue > 0 ? currentAgg.netIncome / currentAgg.revenue : 0;
    const previousNetMargin = previousAgg.revenue > 0 ? previousAgg.netIncome / previousAgg.revenue : 0;

    return {
        revenue: { value: formatCurrency(currentAgg.revenue), change: formatChange(calculateChange(currentAgg.revenue, previousAgg.revenue)) },
        grossMargin: { value: formatPercentage(currentGrossMargin), change: formatChange(currentGrossMargin - previousGrossMargin, true) },
        netMargin: { value: formatPercentage(currentNetMargin), change: formatChange(currentNetMargin - previousNetMargin, true) },
        ebitda: { value: formatCurrency(currentAgg.ebitda), change: formatChange(calculateChange(currentAgg.ebitda, previousAgg.ebitda)) },
        cashFlow: { value: formatCurrency(currentAgg.cashFlow), change: formatChange(calculateChange(currentAgg.cashFlow, previousAgg.cashFlow)) },
        customerLtv: { value: formatCurrency(currentAgg.customerLtv), change: formatChange(calculateChange(currentAgg.customerLtv, previousAgg.customerLtv)) },
        customerCac: { value: formatCurrency(currentAgg.customerCac), change: formatChange(calculateChange(currentAgg.customerCac, previousAgg.customerCac)) },
    }
};

const getIntervalForChart = (period: Period, dateRange?: DateRange): Interval | null => {
    const today = new Date();
    switch (period) {
        case 'D': // For daily stats, show the whole week in chart
            return { start: startOfWeek(today), end: endOfWeek(today) };
        case 'W': // For weekly stats, show last 30 days in chart
            return { start: subDays(today, 30), end: endOfDay(today) };
        case 'M': // For monthly stats, show last 90 days in chart
            return { start: subDays(today, 90), end: endOfDay(today) };
        case 'YTD':
            return { start: startOfYear(today), end: endOfDay(today) };
        case 'ALL':
            return null; // All data
        case 'CUSTOM':
             if (!dateRange || !dateRange.from) return null;
             const end = dateRange.to || dateRange.from;
             return { start: startOfDay(dateRange.from), end: endOfDay(end) };
        default:
            return null;
    }
}


export const getChartDataForPeriod = (allData: FinancialRecord[], period: Period, dateRange?: DateRange): FinancialRecord[] => {
    const chartInterval = getIntervalForChart(period, dateRange);
    const records = chartInterval ? allData.filter(d => isWithinInterval(d.period, chartInterval)) : allData;
    
    // For D and W, we need to aggregate by day/week
    if (period === 'D' || period === 'W') {
        const aggregationMap = new Map<string, FinancialRecord[]>();
        records.forEach(record => {
            // For both daily and weekly selections, we now aggregate by day for chart granularity
            const key = format(record.period, 'yyyy-MM-dd');
            if (!aggregationMap.has(key)) {
                aggregationMap.set(key, []);
            }
            aggregationMap.get(key)!.push(record);
        });

        const aggregatedRecords: FinancialRecord[] = [];
        for (const [key, group] of aggregationMap.entries()) {
            const aggregated = aggregateRecords(group);
            aggregatedRecords.push({
                ...aggregated,
                period: new Date(key),
            });
        }
        return aggregatedRecords.sort((a,b) => a.period.getTime() - b.period.getTime());
    }

    // For M, YTD, ALL - group by month
    if (['M', 'YTD', 'ALL'].includes(period) && records.length > 30) { // Aggregate by month if many data points
        const monthlyMap = new Map<string, FinancialRecord[]>();
        records.forEach(record => {
            const key = format(startOfMonth(record.period), 'yyyy-MM-dd');
            if(!monthlyMap.has(key)) monthlyMap.set(key, []);
            monthlyMap.get(key)!.push(record);
        });

        const aggregated: FinancialRecord[] = [];
        for(const [key, group] of monthlyMap.entries()){
            const aggResult = aggregateRecords(group);
            aggregated.push({
                ...aggResult,
                period: new Date(key),
            })
        }
        return aggregated.sort((a,b) => a.period.getTime() - b.period.getTime());
    }
    
    return records.sort((a,b) => a.period.getTime() - b.period.getTime());
}

const getNoDataStats = (): FinancialStats => {
    const noDataStat = { value: "N/A", change: " " };
    return {
        revenue: noDataStat,
        grossMargin: noDataStat,
        netMargin: noDataStat,
        ebitda: noDataStat,
        cashFlow: noDataStat,
        customerLtv: noDataStat,
        customerCac: noDataStat,
    };
};
