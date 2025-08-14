

import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { AlertTriangle, Info, XCircle, Shield, BarChart, Server, GanttChartSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Tenant } from "@/lib/types";
import { StatCard } from "../stat-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

const systemAlerts = [
    {
      icon: XCircle,
      iconColor: "text-red-500",
      title: "Integration Failed: QuickBooks",
      description: "Tenant: Acme Inc. - Could not sync invoices.",
      time: "5m ago"
    },
    {
      icon: AlertTriangle,
      iconColor: "text-orange-500",
      title: "High Login Attempts",
      description: "User: user@synergy.com - 15 failed attempts in 1 hour.",
      time: "45m ago"
    },
    {
      icon: Info,
      iconColor: "text-blue-500",
      title: "Database Maintenance",
      description: "Scheduled for 2 AM tonight. Expect brief downtime.",
      time: "2h ago"
    }
];


export function SuperAdminDashboardView() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants');
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error("Failed to fetch tenants", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenants();
  }, []);

  return (
    <>
      <DashboardHeader 
        title="Super Admin Dashboard" 
        description="Platform-wide oversight and management."
      >
         <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/admin/audit-logs">View Audit Logs</Link>
            </Button>
            <Button variant="outline">Generate Platform Report</Button>
        </div>
      </DashboardHeader>
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={GanttChartSquare} title="Active Companies" value={tenants.length.toString()} change="+5 this month" />
            <StatCard icon={BarChart} title="Platform MRR" value="$125,430" change="+2.1%" />
            <StatCard icon={Server} title="System Uptime" value="99.98%" change="30 days" />
            <StatCard icon={Shield} title="API Latency" value="85ms" change="avg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Tenant Management</CardTitle>
                        <CardDescription>View, suspend, or delete tenant accounts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Users</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Loading tenants...</TableCell>
                                </TableRow>
                            ) : tenants.map(tenant => (
                                <TableRow key={tenant.id}>
                                    <TableCell className="font-medium">{tenant.name}</TableCell>
                                    <TableCell>{tenant.plan}</TableCell>
                                    <TableCell>
                                        <Badge variant={tenant.status === 'Active' ? 'secondary' : 'destructive'}>{tenant.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{tenant.users}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">System Alerts</CardTitle>
                        <CardDescription>Critical platform notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {systemAlerts.map((alert, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <alert.icon className={cn("h-6 w-6 flex-shrink-0", alert.iconColor)} />
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{alert.title}</p>
                                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Platform Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Toggle Maintenance Mode</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Maintenance Mode</DialogTitle>
                                    <DialogDescription>
                                        Enable maintenance mode to take the platform offline for updates.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2">
                                    <Switch id="maintenance-mode" />
                                    <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                         <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="outline">Manage API Rate Limits</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>API Rate Limits</DialogTitle>
                                    <DialogDescription>
                                        Set the number of API requests allowed per minute for tenants.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="rate-limit" className="text-right">
                                        Requests/min
                                    </Label>
                                    <Input id="rate-limit" defaultValue="100" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </>
  );
}
