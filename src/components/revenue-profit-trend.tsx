

"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import type { FinancialRecord } from "@/context/financial-data-context";
import { InfoTooltip } from "./info-tooltip";

const formatChartData = (data: FinancialRecord[]) => {
  if (data.length === 0) return [];
  // Determine date format based on data density
  const first = data[0].period;
  const last = data[data.length - 1].period;
  const rangeInDays = (last.getTime() - first.getTime()) / (1000 * 3600 * 24);

  let dateFormat = 'MMM yy';
  if (rangeInDays <= 1) dateFormat = 'HH:mm'; // For daily view
  else if (rangeInDays <= 31) dateFormat = 'MMM d';
  else if (rangeInDays <= 90) dateFormat = 'MMM d';


  return data.map(item => ({
    ...item,
    name: format(item.period, dateFormat),
    revenue: item.revenue,
    profit: item.netIncome,
  }))
}

export function RevenueProfitTrend({ data }: { data: FinancialRecord[] }) {
  const chartData = useMemo(() => formatChartData(data), [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          Revenue & Profit Trend
          <InfoTooltip>
            An area chart showing the trend of total revenue and net profit over the selected period.
          </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} animationDuration={800} />
                <Area type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} animationDuration={800} animationBegin={200} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No data for this period</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
