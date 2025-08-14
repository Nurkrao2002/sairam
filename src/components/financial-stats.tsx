
import { AreaChart, BadgePercent, DollarSign, Target, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import type { FinancialStats as FinancialStatsType } from "@/lib/financial-aggregator";

interface FinancialStatsProps {
    stats: FinancialStatsType;
    visibleKpis: string[];
}

export function FinancialStats({ stats, visibleKpis }: FinancialStatsProps) {
    const isVisible = (id: string) => visibleKpis.includes(id);
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {isVisible('fin_revenue') && <StatCard 
                title="Revenue" 
                value={stats.revenue.value} 
                change={stats.revenue.change} 
                icon={DollarSign}
                tooltipText="Total income generated from sales of goods or services."
            />}
            {isVisible('fin_gross_margin') && <StatCard 
                title="Gross Margin" 
                value={stats.grossMargin.value} 
                change={stats.grossMargin.change} 
                icon={TrendingUp}
                tooltipText="Percentage of revenue left after subtracting the cost of goods sold (COGS)."
            />}
            {isVisible('fin_net_margin') && <StatCard 
                title="Net Margin" 
                value={stats.netMargin.value} 
                change={stats.netMargin.change} 
                icon={TrendingUp}
                tooltipText="Percentage of revenue left after all expenses, including taxes and interest, are deducted."
            />}
            {isVisible('fin_ebitda') && <StatCard 
                title="EBITDA" 
                value={stats.ebitda.value} 
                change={stats.ebitda.change} 
                icon={AreaChart}
                tooltipText="Earnings Before Interest, Taxes, Depreciation, and Amortization."
            />}
            {isVisible('fin_cash_flow') && <StatCard 
                title="Cash Flow" 
                value={stats.cashFlow.value} 
                change={stats.cashFlow.change} 
                icon={Wallet}
                tooltipText="Net amount of cash being transferred into and out of the business."
            />}
            {isVisible('fin_ltv') && <StatCard 
                title="Customer LTV" 
                value={stats.customerLtv.value} 
                change={stats.customerLtv.change} 
                icon={BadgePercent}
                tooltipText="Predicted net profit attributed to the entire future relationship with a customer."
            />}
            {isVisible('fin_cac') && <StatCard 
                title="Customer CAC" 
                value={stats.customerCac.value} 
                change={stats.customerCac.change} 
                icon={Target}
                tooltipText="The cost of acquiring a new customer."
            />}
        </div>
    )
}

    