

"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { FinancialRecord } from "@/context/financial-data-context";
import { InfoTooltip } from "./info-tooltip";

const formatChartData = (data: FinancialRecord[]) => {
  if (data.length === 0) return [];
  const first = data[0].period;
  const last = data[data.length - 1].period;
  const rangeInDays = (last.getTime() - first.getTime()) / (1000 * 3600 * 24);

  let dateFormat: string;
  if (rangeInDays <= 7) dateFormat = 'EEE'; // Sun, Mon
  else if (rangeInDays <= 31) dateFormat = 'd'; // 1, 2, 3
  else dateFormat = 'MMM d'; // Jan 1

  return data.map(item => ({
    name: format(item.period, dateFormat),
    // For cash flow, we simulate outflow as total expenses for this chart
    inflow: item.revenue,
    outflow: item.expenses,
  }));
};

export function WeeklyCashFlow({ data }: { data: FinancialRecord[] }) {
  const chartData = useMemo(() => formatChartData(data), [data]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            Cash Flow
            <InfoTooltip>
                A bar chart comparing cash inflow (money coming in) versus cash outflow (money going out) over the selected period.
            </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--secondary))' }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Bar dataKey="inflow" fill="hsl(var(--chart-2))" name="Inflow" radius={[4, 4, 0, 0]} animationDuration={800} />
                <Bar dataKey="outflow" fill="hsl(var(--chart-5))" name="Outflow" radius={[4, 4, 0, 0]} animationDuration={800} animationBegin={200}/>
              </BarChart>
            </ResponsiveContainer>
          ): (
            <div className="flex items-center justify-center h-full text-muted-foreground">No data for this period</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
