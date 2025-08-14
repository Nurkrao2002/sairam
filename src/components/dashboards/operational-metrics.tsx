
import { Activity, BadgeDollarSign, CheckCircle, Clock, UserCog } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import type { FinancialStats } from "@/lib/financial-aggregator";

interface OperationalMetricsProps {
    stats: FinancialStats;
}

// In a real app, this data would be fetched and not derived from financial stats.
// We are simulating it for the prototype.
const getSimulatedOperationsData = (stats: FinancialStats) => {
    return {
        utilizationRate: { value: "85%", change: "+5%" },
        projectCompletionRate: { value: "98%", icon: CheckCircle },
        serviceDeliveryTime: { value: "48h", change: "-4h" },
        revenuePerEmployee: { value: stats.revenue.value, change: stats.revenue.change }, // Simplified
        employeeUtilization: { value: "92%", icon: UserCog },
    }
}


export function OperationalMetrics({ stats }: OperationalMetricsProps) {
    const data = getSimulatedOperationsData(stats);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Utilization Rate" 
                value={data.utilizationRate.value} 
                change={data.utilizationRate.change} 
                icon={Activity}
                tooltipText="The percentage of available resources (e.g., employee hours, equipment) being used."
            />
            <StatCard 
                title="Project Completion Rate" 
                value={data.projectCompletionRate.value} 
                icon={CheckCircle}
                tooltipText="The percentage of projects completed on time and within budget."
            />
            <StatCard 
                title="Service Delivery Time" 
                value={data.serviceDeliveryTime.value} 
                change={data.serviceDeliveryTime.change} 
                icon={Clock}
                tooltipText="The average time it takes to deliver a service to a customer."
            />
            <StatCard 
                title="Revenue Per Employee" 
                value={data.revenuePerEmployee.value} 
                change={data.revenuePerEmployee.change} 
                icon={BadgeDollarSign}
                tooltipText="A measure of the total revenue generated divided by the number of employees."
            />
            <StatCard 
                title="Employee Utilization Rate" 
                value={data.employeeUtilization.value} 
                icon={UserCog}
                tooltipText="The percentage of an employee's paid hours that are billable."
            />
        </div>
    )
}

    
