"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const monthlyRevenueData: any[] = [];
const userAcquisitionData: any[] = [];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const acquisitionChartConfig = {
  users: {
    label: "Users",
  },
  Organic: {
    label: "Organic",
    color: "hsl(var(--chart-1))",
  },
  Referral: {
    label: "Referral",
    color: "hsl(var(--chart-2))",
  },
  Paid: {
    label: "Paid",
    color: "hsl(var(--chart-3))",
  },
  Social: {
    label: "Social",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Monthly Revenue</CardTitle>
          <CardDescription>
            A look at the revenue generated over the last 6 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
            <RechartsAreaChart
              accessibilityLayer
              data={monthlyRevenueData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
              />
            </RechartsAreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">User Acquisition</CardTitle>
          <CardDescription>
            Breakdown of new users by acquisition channel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={acquisitionChartConfig}
            className="mx-auto aspect-square h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <Pie data={userAcquisitionData} dataKey="value" nameKey="name" />
               <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
