
"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { FinanceForm } from "@/components/data-entry/finance-form";
import { SalesForm } from "@/components/data-entry/sales-form";
import { OperationsForm } from "@/components/data-entry/operations-form";
import { MembershipForm } from "@/components/data-entry/membership-form";
import { DashboardHeader } from "@/components/dashboard-header";
import { AccessDenied } from "@/components/access-denied";
import { Suspense } from "react";

const forms: Record<string, React.ComponentType> = {
    "Finance Team": FinanceForm,
    "Sales & Marketing": SalesForm,
    "Operations Team": OperationsForm,
    "Company Admin": FinanceForm, // Default for admin
};

const titles: Record<string, string> = {
    "Finance Team": "Finance Data Entry",
    "Sales & Marketing": "Sales & Marketing Data Entry",
    "Operations Team": "Operations Data Entry",
    "Company Admin": "Finance Data Entry",
}

const descriptions: Record<string, string> = {
    "Finance Team": "Input financial metrics and KPIs for a specific period",
    "Sales & Marketing": "Input sales and marketing metrics",
    "Operations Team": "Input operational metrics and KPIs",
    "Company Admin": "Input financial metrics and KPIs",
}


function DataEntryPageContent() {
    const { role, isLoaded } = useUserRole();

    if (!isLoaded) {
        return null; // Or a loading spinner
    }

    if (!role) {
        return <AccessDenied />;
    }

    // A special case for Sales & Marketing who can also do membership entry.
    // We could add a tab for this or a separate page. For now, we'll just show the main one.
    let formRole = role;
    if (role === "Sales & Marketing") {
        // This is a placeholder for a potential sub-navigation if a role has multiple forms.
        // For now, it just defaults to the main sales form.
    }

    const FormComponent = forms[formRole];
    const title = titles[formRole] || "Data Entry";
    const description = descriptions[formRole] || "Input data for your department.";


    if (!FormComponent) {
        return <AccessDenied />;
    }

    return (
        <>
            <DashboardHeader title={title} description={description} />
            <main className="flex-1 p-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <FormComponent />
                </div>
            </main>
        </>
    );
}

export default function DataEntryPage() {
    return (
        <Suspense>
            <DataEntryPageContent />
        </Suspense>
    )
}
