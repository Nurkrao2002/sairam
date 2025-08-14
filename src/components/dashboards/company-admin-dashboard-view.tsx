

"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { UsersDataTable } from "../users-data-table";
import { CompanyAdminSettings } from "../company-admin-settings";
import { StatCard } from "../stat-card";
import { BadgeDollarSign, Users, PieChart as PieChartIcon, CalendarCheck2, UserPlus, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format } from "date-fns";
import { InfoTooltip } from "../info-tooltip";

const userLoginsData = [
    { name: 'Finance', logins: 120 },
    { name: 'Sales', logins: 250 },
    { name: 'Ops', logins: 180 },
    { name: 'Admin', logins: 45 },
    { name: 'Other', logins: 90 },
];

const revenueHistory = [
    { month: 'Jan', revenue: 450000 }, { month: 'Feb', revenue: 475000 },
    { month: 'Mar', revenue: 510000 }, { month: 'Apr', revenue: 500000 },
    { month: 'May', revenue: 520000 }, { month: 'Jun', revenue: 540000 },
];
export function CompanyAdminDashboardView() {
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const users = await response.json();
        setRecentUsers(users.slice(0, 5).map((u: any) => ({...u, lastLogin: format(new Date(), 'PPP')})));
      } catch (error) {
        console.error("Failed to fetch recent users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <DashboardHeader 
        title="Company Admin Dashboard" 
        description="Manage your company's users, settings, and subscription."
      />
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Dialog>
                <DialogTrigger asChild>
                    <div className="cursor-pointer">
                        <StatCard 
                            icon={BadgeDollarSign} 
                            title="Total Revenue (YTD)" 
                            value="$4.8M" 
                            change="+12.5%" 
                            tooltipText="Year-to-date total revenue across all sources."
                        />
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Year-to-Date Revenue</DialogTitle>
                        <DialogDescription>Monthly breakdown of total revenue.</DialogDescription>
                    </DialogHeader>
                    <div className="h-60 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueHistory}>
                                <XAxis dataKey="month" fontSize={12} />
                                <YAxis fontSize={12} tickFormatter={(val) => `$${(val as number)/1000}k`}/>
                                <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </DialogContent>
            </Dialog>

             <Dialog>
                <DialogTrigger asChild>
                    <div className="cursor-pointer">
                        <StatCard 
                            icon={Users} 
                            title="Active Members" 
                            value="1,402" 
                            change="+32 this month"
                            tooltipText="Total number of active members in your organization."
                        />
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recent User Activity</DialogTitle>
                        <DialogDescription>Users who have logged in recently.</DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Last Login</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.lastLogin}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>

            <StatCard 
                icon={PieChartIcon} 
                title="Team Utilization" 
                value="88%" 
                change="-2%"
                tooltipText="Percentage of team capacity being utilized."
            />
            <StatCard 
                icon={CalendarCheck2} 
                title="Next Billing Date" 
                value="Aug 1, 2025" 
                change="in 21 days"
                tooltipText="The date your subscription will be automatically renewed."
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <UsersDataTable />
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2">
                        <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" /> Add User</Button>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Company Data</Button>
                    </CardContent>
                </Card>
                 <CompanyAdminSettings />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center">
                        User Logins by Department
                        <InfoTooltip>Tracks login activity across different departments for the current month.</InfoTooltip>
                    </CardTitle>
                    <CardDescription>Team login activity for the current month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-60">
                       <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userLoginsData}>
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="logins" fill="hsl(var(--chart-2))" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
        
      </main>
    </>
  );
}
