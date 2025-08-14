import { RolesView } from "@/components/roles-view";
import { DashboardHeader } from "@/components/dashboard-header";


export default function RolesPage() {
  return (
     <>
      <DashboardHeader title="Role Management" description="Define roles and manage permissions for users in your company." />
      <main className="flex-1 p-4 sm:px-6 lg:px-8">
        <RolesView />
      </main>
    </>
  )
}
