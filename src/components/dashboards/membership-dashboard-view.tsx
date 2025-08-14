
import { MembershipMetrics } from "./membership-metrics";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import type { FinancialStats } from "@/lib/financial-aggregator";
import { InfoTooltip } from "../info-tooltip";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";


const memberGrowthData = [
    { name: "Jan", new: 25, lost: 5 },
    { name: "Feb", new: 30, lost: 8 },
    { name: "Mar", new: 45, lost: 10 },
    { name: "Apr", new: 40, lost: 7 },
    { name: "May", new: 55, lost: 12 },
    { name: "Jun", new: 60, lost: 15 },
];


interface MembershipDashboardViewProps {
  stats: FinancialStats;
  visibleKpis: string[];
  showStats?: boolean;
}

export function MembershipDashboardView({ stats, visibleKpis, showStats = true }: MembershipDashboardViewProps) {
    const isWidgetVisible = (id: string) => visibleKpis.includes(id);

    return (
      <div className="space-y-6">
        {showStats && <MembershipMetrics stats={stats} visibleKpis={visibleKpis} />}
        
        <div className="grid grid-cols-1 gap-6">
             {isWidgetVisible('mem_growth_churn_chart') && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center">
                            Member Growth vs. Churn
                            <InfoTooltip>Tracks new members gained versus members lost (churn) over time.</InfoTooltip>
                        </CardTitle>
                        <CardDescription>New members vs. lost members per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={memberGrowthData}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{fill: 'hsl(var(--secondary))'}}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Legend iconType="circle" iconSize={8} />
                                    <Bar dataKey="new" name="New Members" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="lost" name="Lost Members" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
             )}
        </div>
      </div>
    );
}
