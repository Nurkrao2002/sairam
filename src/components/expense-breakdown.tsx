
"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FinancialRecord } from '@/context/financial-data-context';
import { InfoTooltip } from "./info-tooltip";

const aggregateExpenses = (data: FinancialRecord[]) => {
    if (data.length === 0) return [];
    
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    if (totalExpenses === 0) return [];

    // Simulate a breakdown - in a real app this would come from detailed data
    const salaries = totalExpenses * 0.45;
    const operations = totalExpenses * 0.25;
    const marketing = totalExpenses * 0.15;
    const technology = totalExpenses * 0.10;
    const other = totalExpenses * 0.05;

    return [
      { name: 'Salaries', value: salaries, color: 'hsl(var(--chart-1))' },
      { name: 'Operations', value: operations, color: 'hsl(var(--chart-2))' },
      { name: 'Marketing', value: marketing, color: 'hsl(var(--chart-3))' },
      { name: 'Technology', value: technology, color: 'hsl(var(--chart-4))' },
      { name: 'Other', value: other, color: 'hsl(var(--chart-5))' },
    ];
}


export function ExpenseBreakdown({ data }: { data: FinancialRecord[]}) {
  const expenseData = useMemo(() => aggregateExpenses(data), [data]);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          Expense Breakdown
          <InfoTooltip>
            A pie chart showing the distribution of total expenses across different categories.
          </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          {expenseData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  cursor={{ fill: 'hsl(var(--secondary))' }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                />
                <Legend 
                  iconType="circle" 
                  iconSize={8} 
                  verticalAlign="middle" 
                  align="right" 
                  layout="vertical"
                />
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  className='focus:outline-none'
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {expenseData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} stroke={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No data for this period</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
