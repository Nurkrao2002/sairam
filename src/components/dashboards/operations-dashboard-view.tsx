
import { OperationalMetrics } from "./operational-metrics";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import type { FinancialStats } from "@/lib/financial-aggregator";
import { InfoTooltip } from "../info-tooltip";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const projectHealthData = [
    { name: 'On Time', value: 98, fill: 'hsl(var(--chart-2))'},
    { name: 'Delayed', value: 2, fill: 'hsl(var(--chart-3))'},
];

const slaComplianceData = [
    { name: 'Met', value: 99.5, fill: 'hsl(var(--chart-1))'},
    { name: 'Missed', value: 0.5, fill: 'hsl(var(--chart-5))'},
]

interface OperationsDashboardViewProps {
  stats: FinancialStats;
  visibleKpis?: string[];
  showStats?: boolean;
}

export function OperationsDashboardView({ stats, showStats = true }: OperationsDashboardViewProps) {
    
    return (
      <div className="space-y-6">
        {showStats && <OperationalMetrics stats={stats} />}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center">
                            Project Health
                            <InfoTooltip>
                                An overview of project status, including on-time completion rates and budget adherence.
                            </InfoTooltip>
                        </CardTitle>
                        <CardDescription>Completion rate and status overview.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectHealthData} layout="vertical" margin={{ left: 10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        formatter={(value: number) => `${value}%`}
                                        cursor={{fill: 'hsl(var(--secondary))'}}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center">
                            Service Delivery
                            <InfoTooltip>
                                Tracks Service Level Agreement (SLA) compliance and average delivery times for services.
                            </InfoTooltip>
                        </CardTitle>
                        <CardDescription>SLA compliance and average delivery times.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={slaComplianceData} layout="vertical" margin={{ left: 10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        formatter={(value: number) => `${value}%`}
                                        cursor={{fill: 'hsl(var(--secondary))'}}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
        </div>
      </div>
    );
}
