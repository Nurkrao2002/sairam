import { UsersDataTable } from "@/components/users-data-table";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function UsersPage() {
  return (
    <>
      <DashboardHeader title="User Management">
        {/* The button inside UsersDataTable will handle its own logic */}
      </DashboardHeader>
      <main className="flex-1 p-4 sm:px-6 lg:px-8">
        <UsersDataTable showHeader={false} />
      </main>
    </>
  );
}
