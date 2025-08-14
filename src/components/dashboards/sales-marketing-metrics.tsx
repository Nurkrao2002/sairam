
import { CircleDollarSign, Crosshair, Database, GitCompareArrows, Lightbulb, Target } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import type { FinancialStats } from "@/lib/financial-aggregator";

interface SalesMarketingMetricsProps {
    stats: FinancialStats;
    visibleKpis: string[];
}

// In a real app, this data would be fetched and not derived from financial stats.
// We are simulating it for the prototype.
const getSimulatedSalesData = (stats: FinancialStats) => {
    return {
        leadGeneration: { value: "1,200", change: "+15%" },
        conversionRate: { value: "5.2%", change: "+0.8%" },
        pipelineValue: { value: "$1.5M", change: stats.revenue.change },
        avgRevenue: { value: "$1,200", change: stats.customerLtv.change },
        marketingRoi: { value: "4.5x", change: "+0.5x" },
        cpl: { value: stats.customerCac.value, change: stats.customerCac.change },
    }
}


export function SalesMarketingMetrics({ stats, visibleKpis }: SalesMarketingMetricsProps) {
    const data = getSimulatedSalesData(stats);
    const isVisible = (id: string) => visibleKpis.includes(id);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {isVisible('sal_lead_gen') && <StatCard 
                title="Lead Generation" 
                value={data.leadGeneration.value} 
                change={data.leadGeneration.change} 
                icon={Lightbulb}
                tooltipText="The total number of potential customers generated from marketing efforts."
            />}
            {isVisible('sal_conversion_rate') && <StatCard 
                title="Conversion Rates" 
                value={data.conversionRate.value} 
                change={data.conversionRate.change} 
                icon={GitCompareArrows}
                tooltipText="The percentage of leads that are converted into paying customers."
            />}
            {isVisible('sal_pipeline_value') && <StatCard 
                title="Sales Pipeline Value" 
                value={data.pipelineValue.value} 
                change={data.pipelineValue.change} 
                icon={Database}
                tooltipText="The total estimated value of all open sales opportunities."
            />}
            {isVisible('sal_avg_revenue') && <StatCard 
                title="Average Revenue per Client" 
                value={data.avgRevenue.value} 
                change={data.avgRevenue.change} 
                icon={CircleDollarSign}
                tooltipText="The average revenue generated from a single client."
            />}
            {isVisible('sal_marketing_roi') && <StatCard 
                title="Marketing ROI" 
                value={data.marketingRoi.value} 
                change={data.marketingRoi.change} 
                icon={Target}
                tooltipText="The return on investment from marketing activities."
            />}
            {isVisible('sal_cpl') && <StatCard 
                title="Cost Per Lead (CPL)" 
                value={data.cpl.value} 
                change={data.cpl.change} 
                icon={Crosshair}
                tooltipText="The average cost to acquire one new lead."
            />}
        </div>
    )
}

    