
import { HeartHandshake, Smile, Star, UserMinus, UserPlus, UserX, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import type { FinancialStats } from "@/lib/financial-aggregator";

interface MembershipMetricsProps {
    stats: FinancialStats;
    visibleKpis: string[];
}

// In a real app, this data would be fetched and not derived from financial stats.
// We are simulating it for the prototype.
const getSimulatedMembershipData = (stats: FinancialStats) => {
    const revenueValue = parseFloat(stats.revenue.value.replace(/[^0-9.]/g, ''));
    const revenueMagnitude = stats.revenue.value.includes('M') ? 1000000 : stats.revenue.value.includes('K') ? 1000 : 1;
    const numericRevenue = revenueValue * revenueMagnitude;

    const totalMembers = Math.round(numericRevenue / 120); // Assume $120 revenue per member for the period
    const newMembers = Math.round(totalMembers * 0.08); // 8% new members
    const lostMembers = Math.round(totalMembers * 0.015); // 1.5% churn

    return {
        totalMembers: { value: totalMembers.toLocaleString(), change: stats.revenue.change },
        newMembers: { value: newMembers.toLocaleString(), change: "+10%" },
        lostMembers: { value: lostMembers.toLocaleString(), change: "-5%" },
        retentionRate: { value: "98.5%", icon: HeartHandshake },
        churnRate: { value: "1.5%", icon: UserX },
        csat: { value: "92%", change: "+2%" },
        nps: { value: "65", change: "+5" },
    }
}

export function MembershipMetrics({ stats, visibleKpis }: MembershipMetricsProps) {
    const data = getSimulatedMembershipData(stats);
    const isVisible = (id: string) => visibleKpis.includes(id);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {isVisible('mem_total') && <StatCard 
                title="Total Members" 
                value={data.totalMembers.value} 
                change={data.totalMembers.change} 
                icon={Users}
                tooltipText="The total number of active members or subscribers."
            />}
            {isVisible('mem_new') && <StatCard 
                title="New Members Gained" 
                value={data.newMembers.value} 
                change={data.newMembers.change} 
                icon={UserPlus}
                tooltipText="The number of new members acquired during the selected period."
            />}
            {isVisible('mem_lost') && <StatCard 
                title="Members Lost" 
                value={data.lostMembers.value} 
                change={data.lostMembers.change} 
                icon={UserMinus}
                tooltipText="The number of members who cancelled their subscription (churned)."
            />}
            {isVisible('mem_retention') && <StatCard 
                title="Retention Rate" 
                value={data.retentionRate.value} 
                icon={HeartHandshake}
                tooltipText="The percentage of members who remained active over the period."
            />}
            {isVisible('mem_churn') && <StatCard 
                title="Churn Rate" 
                value={data.churnRate.value} 
                icon={UserX}
                tooltipText="The percentage of members who cancelled their subscription over the period."
            />}
            {isVisible('mem_csat') && <StatCard 
                title="Client Satisfaction (CSAT)" 
                value={data.csat.value} 
                change={data.csat.change} 
                icon={Smile}
                tooltipText="A measure of customer satisfaction with a product or service."
            />}
            {isVisible('mem_nps') && <StatCard 
                title="Net Promoter Score (NPS)" 
                value={data.nps.value} 
                change={data.nps.change} 
                icon={Star}
                tooltipText="A measure of customer loyalty and willingness to recommend your company."
            />}
        </div>
    )
}

    