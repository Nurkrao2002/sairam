
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Lightbulb, Activity } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { Loading } from "@/components/loading";
import { AccessDenied } from "@/components/access-denied";

const basicUserActivity = [
    {
        icon: CheckCircle,
        title: "Logged In",
        description: "Successfully logged in to the platform.",
        timestamp: "5 minutes ago",
        color: "text-green-500",
    },
    {
        icon: Clock,
        title: "Viewed Dashboard",
        description: "Accessed the main dashboard.",
        timestamp: "2 hours ago",
        color: "text-primary",
    }
];

const marketingHighlights = [
    { icon: Lightbulb, title: "Summer Sale Campaign", description: "Generated 50 new leads this week.", color: "text-primary" },
    { icon: Activity, title: "Project Phoenix", description: "Reached 'In Progress' milestone.", color: "text-green-500" },
]

export default function MyDashboardPage() {
    const searchParams = useSearchParams();
    const { role, isLoaded } = useUserRole();
    const name = searchParams.get('name') || "User";
    const email = searchParams.get('email') || "";
    const avatarUrl = searchParams.get('avatar');
    
    const createHref = (href: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        return `${href}?${newSearchParams.toString()}`;
    }

    if (!isLoaded) {
        return <Loading />
    }

    if (role !== "Basic User") {
        return <AccessDenied />
    }
    
    return (
        <>
            <DashboardHeader 
                title={`Welcome, ${name}!`}
                description="This is your personal dashboard. Here's a summary of your profile and recent activity."
            />
            <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="font-headline">Your Profile</CardTitle>
                            <CardDescription>Your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="h-24 w-24 text-4xl">
                                {avatarUrl && <AvatarImage src={decodeURIComponent(avatarUrl)} alt={name} />}
                                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">{name}</h3>
                                <p className="text-sm text-muted-foreground">{email}</p>
                                <p className="text-sm text-muted-foreground">{role}</p>
                            </div>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={createHref('/settings')}>
                                    Edit Profile
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Recent Activity</CardTitle>
                                <CardDescription>A log of your most recent actions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {basicUserActivity.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="p-2 bg-primary/10 rounded-full">
                                                <item.icon className={`h-6 w-6 ${item.color}`} />
                                            </div>
                                            <div className="text-sm flex-1">
                                                <p className="font-semibold">{item.title}</p>
                                                <p>{item.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Company Highlights</CardTitle>
                                <CardDescription>A view-only summary of operational and marketing data.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {marketingHighlights.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="p-2 bg-primary/10 rounded-full">
                                                <item.icon className={`h-6 w-6 ${item.color}`} />
                                            </div>
                                            <div className="text-sm flex-1">
                                                <p className="font-semibold">{item.title}</p>
                                                <p>{item.description}</p>
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
