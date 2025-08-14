

"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import type { Period } from "@/lib/types";
import type { DateRange } from "react-day-picker";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "../stat-card";
import { UserPlus, Users, MessageSquareWarning, Clock, BarChart2, LineChart as LineChartIcon, Database, ExternalLink, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { PeriodPicker } from "../period-picker";
import { Tenant, SupportTicket, User } from "@/lib/types";
import { BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts";
import { InfoTooltip } from "../info-tooltip";


const alerts = [
    { 
        icon: CheckCircle,
        title: "New Tenant Onboarded",
        description: "QuantumLeap Corp. has completed setup.", 
        time: "1h ago",
        color: "text-green-500" 
    },
    { 
        icon: AlertTriangle,
        title: "High Priority Ticket",
        description: "Support ticket #T-1234 has been escalated.", 
        time: "3h ago",
        color: "text-orange-500" 
    },
    { 
        icon: Info,
        title: "Low API Usage",
        description: "Synergy Solutions has low API usage this month.", 
        time: "1d ago",
        color: "text-blue-500"
    },
];

const newSignupsData: any[] = [];
const supportTicketsData: any[] = [];
const topTenantsByStorage: any[] = [];
const apiCallsData: any[] = [];


export function PlatformManagerDashboardView() {
  const [period, setPeriod] = useState<Period>('M');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [recentSignups, setRecentSignups] = useState<Tenant[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [openTickets, setOpenTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tenantsResponse, ticketsResponse, usersResponse] = await Promise.all([
          fetch('/api/tenants'),
          fetch('/api/support-tickets'),
          fetch('/api/users'),
        ]);
        const tenants = await tenantsResponse.json();
        const tickets = await ticketsResponse.json();
        const users = await usersResponse.json();

        setRecentSignups(tenants.slice(0, 3));
        setActiveUsers(users.slice(0, 5));
        setOpenTickets(tickets.filter((t: SupportTicket) => t.status === 'Open').slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'CUSTOM') {
      setDateRange(undefined);
    }
  }, []);

  const handleDateRangeChange = useCallback((newDateRange: DateRange | undefined) => {
    setPeriod('CUSTOM');
    setDateRange(newDateRange);
  }, []);

  // In a real app, you'd fetch filtered data. Here we simulate it.
  const filteredSignups = useMemo(() => newSignupsData.slice(0, 4 + Math.floor(Math.random() * 3)), [period, dateRange]);
  const filteredTickets = useMemo(() => supportTicketsData.map(d => ({...d, open: Math.round(d.open * (0.8 + Math.random() * 0.4))})), [period, dateRange]);
  const filteredStorage = useMemo(() => topTenantsByStorage.map(d => ({...d, storage: Math.round(d.storage * (0.8 + Math.random() * 0.4))})), [period, dateRange]);
  const filteredApiCalls = useMemo(() => apiCallsData.slice(0, 4 + Math.floor(Math.random() * 3)), [period, dateRange]);


  return (
    <>
      <DashboardHeader 
        title="Platform Manager Dashboard" 
        description="Manage tenant accounts and monitor platform activity."
      >
        <PeriodPicker 
            period={period} 
            onPeriodChange={handlePeriodChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
        />
      </DashboardHeader>
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Dialog>
                <DialogTrigger asChild>
                    <div className="cursor-pointer">
                        <StatCard 
                            icon={UserPlus} 
                            title="New Signups" 
                            value="12" 
                            change="in last 7 days"
                            tooltipText="Number of new tenants that joined the platform."
                        />
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recent Signups</DialogTitle>
                        <DialogDescription>The most recent tenants to join the platform.</DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Company</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentSignups.map(tenant => (
                                <TableRow key={tenant.id}>
                                    <TableCell>{tenant.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{tenant.plan}</Badge></TableCell>
                                    <TableCell><Badge variant={tenant.status === 'Active' ? 'secondary' : 'destructive'}>{tenant.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
            <Dialog>
                 <DialogTrigger asChild>
                    <div className="cursor-pointer">
                        <StatCard 
                            icon={Users} 
                            title="Active Users" 
                            value="1,402" 
                            change="across 88 tenants"
                            tooltipText="Total number of active users across all tenants."
                        />
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recently Active Users</DialogTitle>
                        <DialogDescription>Users who have recently logged in or performed an action.</DialogDescription>
                    </DialogHeader>
                    <Table>
                         <TableHeader>
                            <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="cursor-pointer">
                        <StatCard 
                            icon={MessageSquareWarning} 
                            title="Open Support Tickets" 
                            value="23" 
                            change="8 high priority"
                            tooltipText="Number of support tickets that are currently open."
                        />
                    </div>
                </DialogTrigger>
                 <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Open Support Tickets</span>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/admin/support-tickets">View All Tickets <ExternalLink className="h-4 w-4 ml-2" /></Link>
                            </Button>
                        </DialogTitle>
                        <DialogDescription>A list of currently open support tickets.</DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Ticket ID</TableHead><TableHead>Subject</TableHead><TableHead>Priority</TableHead><TableHead>Tenant</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {openTickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{ticket.id}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell><Badge variant={ticket.priority === 'High' ? 'destructive' : 'secondary'}>{ticket.priority}</Badge></TableCell>
                                    <TableCell>{ticket.tenant}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
            <StatCard 
                icon={Clock} 
                title="Avg. Resolution Time" 
                value="2.1h" 
                change="last 30 days"
                tooltipText="The average time it takes to resolve a support ticket."
            />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
                <CardHeader>
                    <div>
                        <CardTitle className="font-headline flex items-center">
                            Tenant Activity
                            <InfoTooltip>Tracks the number of new tenant signups over time.</InfoTooltip>
                        </CardTitle>
                        <CardDescription>New signups trend over the selected period.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredSignups}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="signups" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                     <div>
                        <CardTitle className="font-headline flex items-center">
                            Support Tickets
                             <InfoTooltip>Shows the number of open versus resolved tickets, categorized by priority.</InfoTooltip>
                        </CardTitle>
                        <CardDescription>Open vs. Resolved by priority.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredTickets}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="priority" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="open" fill="hsl(var(--chart-3))" name="Open" radius={[4,4,0,0]}/>
                                <Bar dataKey="resolved" fill="hsl(var(--chart-2))" name="Resolved" radius={[4,4,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle className="font-headline flex items-center">
                                Resource Utilization
                                <InfoTooltip>Monitors storage usage (in GB) for the top 5 tenants.</InfoTooltip>
                            </CardTitle>
                            <CardDescription>Storage usage per tenant (GB).</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-60">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredStorage} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" fontSize={12} />
                                    <YAxis type="category" width={80} dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        formatter={(val: number) => `${val} GB`}
                                        cursor={{fill: 'hsl(var(--secondary))'}}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Bar dataKey="storage" name="Storage" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle className="font-headline flex items-center">
                                API Calls
                                <InfoTooltip>Shows the volume of API calls to identify peak usage times.</InfoTooltip>
                            </CardTitle>
                            <CardDescription>Total API calls by month.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={filteredApiCalls}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" fontSize={12} />
                                    <YAxis fontSize={12} tickFormatter={(val: number) => `${val/1000}k`} />
                                    <Tooltip 
                                        formatter={(val: number) => val.toLocaleString()}
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            borderColor: "hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Line type="monotone" dataKey="calls" name="API Calls" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Tenant Onboarding</CardTitle>
                        <CardDescription>Create and manage new tenant accounts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground pb-4">Use the tenant management page to add, view, and manage all tenants.</p>
                        <Button asChild>
                            <Link href="/admin/tenants">Manage Tenants</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Alerts</CardTitle>
                        <CardDescription>Important tenant notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {alerts.map((alert, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <alert.icon className={`h-6 w-6 flex-shrink-0 ${alert.color}`} />
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{alert.title}</p>
                                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </>
  );
}
