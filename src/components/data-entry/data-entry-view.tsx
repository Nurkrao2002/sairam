
"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { FinanceForm } from "./finance-form";
import { SalesForm } from "./sales-form";
import { OperationsForm } from "./operations-form";
import { MembershipForm } from "./membership-form";
import { Suspense } from "react";
import { DashboardHeader } from "../dashboard-header";
import { AccessDenied } from "../access-denied";
import { Loading } from "../loading";

const forms: Record<string, React.ComponentType | undefined> = {
  "Finance Team": FinanceForm,
  "Sales & Marketing": SalesForm,
  "Operations Team": OperationsForm,
  "CEO/Executive": undefined, // No direct data entry
  "Company Admin": FinanceForm, // Default for admin for now
  "Platform Super Admin": undefined,
  "Basic User": undefined,
};

const formInfo: Record<string, { title: string; description: string } | undefined> = {
  "Finance Team": {
    title: "Finance Data Entry",
    description: "Input raw financial data. Derived metrics will be calculated automatically.",
  },
  "Sales & Marketing": {
    title: "Sales & Marketing Data Entry",
    description: "Enter lead generation, conversion, and campaign data.",
  },
  "Operations Team": {
    title: "Operations Data Entry",
    description: "Input project, time tracking, and headcount data.",
  },
  "Company Admin": {
    title: "Finance Data Entry",
    description: "Input raw financial data as an administrator.",
  },
};


function DataEntryViewContent() {
  const { role, isLoaded } = useUserRole();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!role) {
    return <AccessDenied />;
  }

  const FormComponent = forms[role];
  const info = formInfo[role];

  if (!FormComponent || !info) {
    return (
        <>
            <DashboardHeader title="Data Entry" description="No data entry form available for your role." />
            <main className="flex-1 p-4 sm:px-6 lg:px-8">
                <p>Your user role does not have a specific data entry form assigned.</p>
            </main>
        </>
    );
  }

  return (
    <>
      <DashboardHeader title={info.title} description={info.description} />
      <main className="flex-1 p-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <FormComponent />
        </div>
      </main>
    </>
  );
}

export function DataEntryView() {
    return (
        <Suspense fallback={<Loading />}>
            <DataEntryViewContent />
        </Suspense>
    )
}
