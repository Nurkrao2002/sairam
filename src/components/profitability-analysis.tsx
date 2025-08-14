

"use client";

import { useMemo } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { FinancialRecord } from "@/context/financial-data-context";
import { InfoTooltip } from "./info-tooltip";

const formatChartData = (data: FinancialRecord[]) => {
  if (data.length === 0) return [];
  const first = data[0].period;
  const last = data[data.length - 1].period;
  const rangeInDays = (last.getTime() - first.getTime()) / (1000 * 3600 * 24);
  
  let dateFormat = 'MMM yy';
  if (rangeInDays <= 1) dateFormat = 'HH:mm';
  else if (rangeInDays <= 31) dateFormat = 'MMM d';
  else if (rangeInDays <= 90) dateFormat = 'MMM d';

  return data.map(item => ({
    name: format(item.period, dateFormat),
    grossMargin: item.revenue > 0 ? item.grossProfit / item.revenue : 0,
    netMargin: item.revenue > 0 ? item.netIncome / item.revenue : 0,
    // ROI would need investment data, so we simulate it based on net income
    roi: item.expenses > 0 ? item.netIncome / item.expenses : 0,
  }));
};

export function ProfitabilityAnalysis({ data }: { data: FinancialRecord[] }) {
  const chartData = useMemo(() => formatChartData(data), [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            Profitability Analysis
            <InfoTooltip>
                Tracks key profitability ratios like Gross Margin, Net Margin, and Return on Investment (ROI) over time.
            </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  domain={[0, 'dataMax']}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [`${(value * 100).toFixed(1)}%`, name]}
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Line type="monotone" dataKey="grossMargin" name="Gross Margin" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} animationDuration={800} />
                <Line type="monotone" dataKey="netMargin" name="Net Margin" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} animationDuration={800} animationBegin={200} />
                <Line type="monotone" dataKey="roi" name="ROI" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} animationDuration={800} animationBegin={400} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">No data for this period</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
