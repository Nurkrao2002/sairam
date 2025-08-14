

"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tenant, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, DollarSign, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersDataTable } from "@/components/users-data-table";

// Simulate activity for a tenant
const activityLog = [
  {
    user: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    action: "upgraded the plan to Enterprise.",
    timestamp: "1 hour ago",
  },
  {
    user: "Robert Williams",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    action: "added a new user 'sales@srisys.com'.",
    timestamp: "3 hours ago",
  },
   {
    user: "System",
    avatar: "/placeholder.svg",
    action: "generated the monthly invoice.",
    timestamp: "1 day ago",
  },
  {
    user: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    action: "reset the password for 'ops@srisys.com'.",
    timestamp: "2 days ago",
  },
];


export default function TenantDetailsPage() {
    const params = useParams();
    const tenantId = params.tenantId as string;
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [tenantUsers, setTenantUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tenantResponse, usersResponse] = await Promise.all([
                    fetch(`/api/tenants/${tenantId}`),
                    fetch('/api/users')
                ]);

                if (!tenantResponse.ok) {
                    notFound();
                    return;
                }

                const tenantData = await tenantResponse.json();
                const usersData = await usersResponse.json();

                setTenant(tenantData);
                setTenantUsers(usersData.filter((user: User) => user.tenant_id === tenantId));
            } catch (error) {
                console.error("Failed to fetch tenant data", error);
                notFound();
            } finally {
                setIsLoading(false);
            }
        };

        if (tenantId) {
            fetchData();
        }
    }, [tenantId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!tenant) {
        return notFound();
    }

    return (
        <>
            <DashboardHeader 
                title={tenant.name} 
                description={`Details and management for ${tenant.name}.`} 
            />
            <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tenant.plan}</div>
                            <Badge variant={tenant.status === 'Active' ? 'secondary' : 'destructive'} className="mt-1">{tenant.status}</Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tenant.users}</div>
                            <p className="text-xs text-muted-foreground">users currently active</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tenant.last_active}</div>
                            <p className="text-xs text-muted-foreground">last interaction recorded</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">API Usage</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.2M</div>
                            <p className="text-xs text-muted-foreground">requests this month</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                         <UsersDataTable initialUsers={tenantUsers} />
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col space-y-2">
                                <Button>Change Plan</Button>
                                <Button variant="outline">Reset Admin Password</Button>
                                <Button variant="destructive">Suspend Tenant</Button>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>A log of recent events for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                {activityLog.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={item.avatar} alt={item.user} />
                                        <AvatarFallback>
                                        {item.user.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <p>
                                        <span className="font-semibold">{item.user}</span> {item.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
}
