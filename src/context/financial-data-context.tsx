

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { subDays, subHours } from 'date-fns';
import { useParams } from 'next/navigation';

export interface FinancialRecord {
  period: Date;
  revenue: number;
  grossProfit: number;
  netIncome: number;
  expenses: number;
  cashFlow: number;
  ebitda: number;
  customerLtv: number;
  customerCac: number;
}

interface FinancialDataContextType {
  data: FinancialRecord[];
  addFinancialRecord: (record: FinancialRecord) => void;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

// Helper to generate more realistic recent data
const generateRecentData = (factor = 1) => {
    const data: FinancialRecord[] = [];
    const now = new Date();
    for (let i = 0; i < 48; i++) { // Last 48 hours
        const period = subHours(now, i);
        const revenue = (680000 / 30 / 24 + Math.random() * 5000) * factor;
        const expenses = (515000 / 30 / 24 + Math.random() * 3000) * factor;
        const netIncome = revenue - expenses;
        const grossProfit = revenue * (0.65 + (Math.random() - 0.5) * 0.1);

        data.push({
            period,
            revenue: Math.round(revenue),
            expenses: Math.round(expenses),
            netIncome: Math.round(netIncome),
            grossProfit: Math.round(grossProfit),
            ebitda: Math.round(netIncome * 1.2),
            cashFlow: Math.round(netIncome * 1.1),
            customerLtv: (45300 + Math.random() * 500) * factor,
            customerCac: (2870 + Math.random() * 100) * factor,
        });
    }

    for (let i = 2; i < 90; i++) { // Last 90 days
        const period = subDays(now, i);
        const revenue = (680000 / 30 + Math.random() * 20000 - 10000) * factor;
        const expenses = (515000 / 30 + Math.random() * 15000 - 7500) * factor;
        const netIncome = revenue - expenses;
        const grossProfit = revenue * (0.65 + (Math.random() - 0.5) * 0.1);

        data.push({
            period,
            revenue: Math.round(revenue),
            expenses: Math.round(expenses),
            netIncome: Math.round(netIncome),
            grossProfit: Math.round(grossProfit),
            ebitda: Math.round(netIncome * 1.2),
            cashFlow: Math.round(netIncome * 1.1),
            customerLtv: (45300 + Math.random() * 500) * factor,
            customerCac: (2870 + Math.random() * 100) * factor,
        });
    }
    return data;
}

const generateYearData = (year: number, baseRevenue: number, growthFactor: number, dataFactor = 1) => {
    const data: FinancialRecord[] = [];
    for (let month = 0; month < 12; month++) {
        const revenue = baseRevenue * (1 + (growthFactor * month) / 12) * (1 + (Math.random() - 0.5) * 0.1) * dataFactor;
        const expenses = revenue * (0.75 - (Math.random() * 0.1));
        const netIncome = revenue - expenses;
        const grossProfit = revenue * (0.45 + (Math.random() - 0.5) * 0.1);
        data.push({
            period: new Date(year, month, 28),
            revenue: Math.round(revenue),
            expenses: Math.round(expenses),
            netIncome: Math.round(netIncome),
            grossProfit: Math.round(grossProfit),
            ebitda: Math.round(netIncome * 1.3),
            cashFlow: Math.round(netIncome * 1.15),
            customerLtv: (42000 + (year-2022) * 500) * dataFactor,
            customerCac: (3000 - (year-2022) * 50) * dataFactor,
        });
    }
    return data;
}

const generateCompanyData = (dataFactor = 1) => {
    return [
        ...generateYearData(2022, 400000, 0.1, dataFactor),
        ...generateYearData(2023, 450000, 0.12, dataFactor),
        ...generateYearData(2024, 550000, 0.15, dataFactor),
        ...generateRecentData(dataFactor)
    ].sort((a, b) => b.period.getTime() - a.period.getTime());
}

const companyDataCache = new Map<string, FinancialRecord[]>();
companyDataCache.set('srisys', generateCompanyData(1));
companyDataCache.set('pigeon-tech', generateCompanyData(0.8));


export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const params = useParams();
  const companySlug = params.company as string;
  const [data, setData] = useState<FinancialRecord[]>([]);

  useEffect(() => {
    const initialData = companyDataCache.get(companySlug) || companyDataCache.get('srisys') || [];
    setData(initialData);
  }, [companySlug]);

  const addFinancialRecord = (record: FinancialRecord) => {
    setData(prevData => [...prevData, record].sort((a, b) => b.period.getTime() - a.period.getTime()));
  };

  return (
    <FinancialDataContext.Provider value={{ data, addFinancialRecord }}>
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
