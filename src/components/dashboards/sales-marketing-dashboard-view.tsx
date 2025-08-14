
import { SalesMarketingMetrics } from "./sales-marketing-metrics";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import type { FinancialStats } from "@/lib/financial-aggregator";
import { InfoTooltip } from "../info-tooltip";
import { BarChart, Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip, Bar, XAxis, YAxis } from "recharts";

const leadFunnelData = [
  { value: 1200, name: 'Leads', fill: 'hsl(var(--chart-1))' },
  { value: 850, name: 'Qualified', fill: 'hsl(var(--chart-2))' },
  { value: 550, name: 'Proposals', fill: 'hsl(var(--chart-3))' },
  { value: 250, name: 'Negotiation', fill: 'hsl(var(--chart-4))' },
  { value: 62, name: 'Won', fill: 'hsl(var(--chart-5))' },
];

const campaignRoiData = [
    { name: 'Summer Sale', roi: 4.5, fill: 'hsl(var(--chart-1))' },
    { name: 'Q3 Social', roi: 3.2, fill: 'hsl(var(--chart-2))' },
    { name: 'Referral Program', roi: 7.8, fill: 'hsl(var(--chart-3))' },
    { name: 'Email Campaign', roi: 5.1, fill: 'hsl(var(--chart-4))' },
];

const allKpis = [
    'sal_lead_pipeline_chart', 'sal_campaign_roi_chart',
    'sal_lead_gen', 'sal_conversion_rate', 'sal_pipeline_value',
    'sal_avg_revenue', 'sal_marketing_roi', 'sal_cpl'
]

interface SalesMarketingDashboardViewProps {
  stats: FinancialStats;
  visibleKpis?: string[];
  showStats?: boolean;
}

export function SalesMarketingDashboardView({ stats, visibleKpis = allKpis, showStats = true }: SalesMarketingDashboardViewProps) {
    const isWidgetVisible = (id: string) => visibleKpis.includes(id);
    
    return (
      <div className="space-y-6">
        {showStats && <SalesMarketingMetrics stats={stats} visibleKpis={visibleKpis} />}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {isWidgetVisible('sal_lead_pipeline_chart') && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center">
                            Lead Pipeline
                            <InfoTooltip>A visual representation of the sales funnel, from lead to conversion.</InfoTooltip>
                        </CardTitle>
                        <CardDescription>Lead volume by source and conversion trends.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Funnel dataKey="value" data={leadFunnelData} isAnimationActive>
                                        <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}
            {isWidgetVisible('sal_campaign_roi_chart') && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center">
                            Campaign Performance
                            <InfoTooltip>Measures the return on investment (ROI) for each marketing campaign.</InfoTooltip>
                        </CardTitle>
                        <CardDescription>Marketing ROI by campaign.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={campaignRoiData} margin={{left: 10}}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}x`} />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}x ROI`, 'ROI']}
                                        cursor={{fill: 'hsl(var(--secondary))'}}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Bar dataKey="roi" radius={[4, 4, 0, 0]} />
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
