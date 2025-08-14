

"use client";

import { Suspense } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { AccessDenied } from "@/components/access-denied";
import { Loading } from "@/components/loading";
import { SuperAdminDashboardView } from "@/components/dashboards/super-admin-dashboard-view";
import { PlatformManagerDashboardView } from "@/components/dashboards/platform-manager-dashboard-view";
import { CompanyAdminDashboardView } from "@/components/dashboards/company-admin-dashboard-view";
import { redirect, useParams, useSearchParams } from "next/navigation";

const REQUIRED_ROLES = ["Platform Super Admin", "Platform Manager", "Company Admin"];

function AdminDashboardPageContent() {
    const { role, isLoaded } = useUserRole();

    if (!isLoaded) {
        return <Loading />;
    }
    
    if (!role || !REQUIRED_ROLES.includes(role)) {
        return <AccessDenied />;
    }

    const renderDashboardByRole = () => {
        switch (role) {
            case "Platform Super Admin":
                return <SuperAdminDashboardView />;
            case "Platform Manager":
                return <PlatformManagerDashboardView />;
            case "Company Admin":
                return <CompanyAdminDashboardView />;
            default:
                return <AccessDenied />;
        }
    }

    return (
       <>
        {renderDashboardByRole()}
       </>
    );
}

export default function AdminDashboardPage() {
    return (
        <Suspense>
            <AdminDashboardPageContent />
        </Suspense>
    )
}
