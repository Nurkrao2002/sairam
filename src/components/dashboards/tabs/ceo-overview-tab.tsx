
"use client";

import type { FinancialRecord } from "@/context/financial-data-context";
import type { FinancialStats } from "@/lib/financial-aggregator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialStats as FinancialStatsCards } from "@/components/financial-stats";
import { MembershipMetrics } from "../membership-metrics";
import { SalesMarketingMetrics } from "../sales-marketing-metrics";
import { OperationalMetrics } from "../operational-metrics";
import { InfoTooltip } from "@/components/info-tooltip";

interface CeoOverviewTabProps {
  stats: FinancialStats;
  visibleKpis: string[];
}

export function CeoOverviewTab({ stats, visibleKpis }: CeoOverviewTabProps) {
  const showSection = (prefix: string) => visibleKpis.some(kpi => kpi.startsWith(prefix));

  return (
    <div className="space-y-6">
      {showSection('fin_') && (
        <>
          <h2 className="text-xl font-bold font-headline flex items-center">
            Financial Health
            <InfoTooltip>
              An overview of the company's key financial performance indicators for the selected period.
            </InfoTooltip>
          </h2>
          <FinancialStatsCards stats={stats} visibleKpis={visibleKpis} />
        </>
      )}

      {showSection('mem_') && (
        <>
          <h2 className="text-xl font-bold font-headline pt-4 flex items-center">
            Membership Trends
            <InfoTooltip>
              Key metrics related to customer growth, churn, and satisfaction.
            </InfoTooltip>
          </h2>
          <MembershipMetrics stats={stats} visibleKpis={visibleKpis} />
        </>
      )}

      {showSection('sal_') && (
        <>
          <h2 className="text-xl font-bold font-headline pt-4 flex items-center">
            Sales & Marketing
            <InfoTooltip>
                Performance indicators for your sales funnel and marketing campaign effectiveness.
            </InfoTooltip>
          </h2>
          <SalesMarketingMetrics stats={stats} visibleKpis={visibleKpis} />
        </>
      )}

      {showSection('ops_') && (
        <>
          <h2 className="text-xl font-bold font-headline pt-4 flex items-center">
            Operational Efficiency
            <InfoTooltip>
              Metrics that measure the efficiency of your company's core operations.
            </InfoTooltip>
          </h2>
          <OperationalMetrics stats={stats} visibleKpis={visibleKpis} />
        </>
      )}

      {visibleKpis.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No Widgets Selected</h3>
            <p className="text-muted-foreground mt-2">
                Click the '+' button in the header to configure your overview.
            </p>
        </div>
      )}
    </div>
  );
}
