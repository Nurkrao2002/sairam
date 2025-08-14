
"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, TrendingUp, AlertTriangle, Target, HandCoins, User, Lightbulb, Activity, FileText, Clock } from "lucide-react";
import { Loading } from "@/components/loading";

const metricActivityLog = [
    {
      icon: TrendingUp,
      title: "Positive Revenue Trend",
      description: "Monthly revenue increased by 8% compared to the previous month, exceeding projections.",
      timestamp: "1 day ago",
      color: "text-green-500",
    },
    {
      icon: Target,
      title: "New Market Segment Entry",
      description: "Successfully launched the new product line targeting the SMB market segment.",
      timestamp: "3 days ago",
      color: "text-primary",
    },
    {
      icon: CheckCircle,
      title: "Q2 Financials Closed",
      description: "The quarterly financial reports have been finalized and are available for review.",
      timestamp: "5 days ago",
      color: "text-green-500",
    },
     {
      icon: AlertTriangle,
      title: "Churn Rate Spike",
      description: "Customer churn rate increased by 1.2% this week, investigation is underway.",
      timestamp: "6 days ago",
      color: "text-orange-500",
    },
    {
      icon: HandCoins,
      title: "Cost-Saving Initiative Success",
      description: "Operational cost-saving measures have reduced overhead by 6% in the last quarter.",
      timestamp: "1 week ago",
      color: "text-primary",
    },
];

const financeActivityLog = [
  {
    icon: FileText,
    user: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    action: "updated the financial report for Q2 2025.",
    timestamp: "2 hours ago",
  },
  {
    icon: FileText,
    user: "Bob Williams",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    action: "added new data for June 2025.",
    timestamp: "1 day ago",
  },
  {
    icon: FileText,
    user: "System",
    avatar: "/placeholder.svg",
    action: "generated the monthly P&L statement.",
    timestamp: "5 days ago",
  },
];

const salesActivityLog = [
  {
    icon: Lightbulb,
    user: "Charlie Brown",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    action: "added 50 new leads from the 'Summer Sale' campaign.",
    timestamp: "3 hours ago",
  },
  {
    icon: Lightbulb,
    user: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    action: "converted 'Innovate Inc.' to a customer.",
    timestamp: "2 days ago",
  },
  {
    icon: Lightbulb,
    user: "System",
    avatar: "/placeholder.svg",
    action: "generated the weekly pipeline report.",
    timestamp: "4 days ago",
  },
];

const operationsActivityLog = [
  {
    icon: Activity,
    user: "Diane Prince",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    action: "marked project 'Phoenix' as completed.",
    timestamp: "8 hours ago",
  },
  {
    icon: Activity,
    user: "System",
    avatar: "/placeholder.svg",
    action: "updated the resource utilization forecast.",
    timestamp: "1 day ago",
  },
  {
    icon: Activity,
    user: "Diane Prince",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    action: "assigned 3 new tasks to the development team.",
    timestamp: "3 days ago",
  },
];

const basicUserActivityLog = [
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


const getRoleSpecificActivity = (role: string | null) => {
    switch (role) {
        case "CEO/Executive":
            return {
                log: metricActivityLog,
                title: "Business Activity",
                description: "A feed of key business events, milestones, and metric changes.",
                feedTitle: "Key Business Events",
                feedDescription: "Here are the most important recent events in your organization.",
                isMetric: true,
            }
        case "Finance Team":
             return {
                log: financeActivityLog,
                title: "Finance Team Activity",
                description: "A log of recent financial data entries and report generations.",
                feedTitle: "Recent Financial Actions",
                feedDescription: "Here are the recent activities from the finance department.",
                isMetric: false,
            }
        case "Sales & Marketing":
            return {
                log: salesActivityLog,
                title: "Sales Team Activity",
                description: "A log of recent lead updates, campaign activities, and sales events.",
                feedTitle: "Recent Sales & Marketing Actions",
                feedDescription: "Here are the recent activities from the sales & marketing department.",
                isMetric: false,
            }
        case "Operations Team":
             return {
                log: operationsActivityLog,
                title: "Operations Team Activity",
                description: "A log of recent project updates, resource assignments, and operational changes.",
                feedTitle: "Recent Operational Actions",
                feedDescription: "Here are the recent activities from the operations department.",
                isMetric: false,
            }
        case "Basic User":
            return {
                log: basicUserActivityLog,
                title: "Your Recent Activity",
                description: "A log of your recent actions on the platform.",
                feedTitle: "Your Activity",
                feedDescription: "Here are your most recent actions.",
                isMetric: true,
            }
        default:
            return {
                log: [],
                title: "Recent Activity",
                description: "No activity to display for your role.",
                feedTitle: "Activity Feed",
                feedDescription: "There is no recent activity to show.",
                isMetric: false,
            }
    }
}


function RecentActivityPageContent() {
  const { role, isLoaded } = useUserRole();

  if (!isLoaded) {
    return <Loading />;
  }
  
  const { log: activityLog, title, description, feedTitle, feedDescription, isMetric } = getRoleSpecificActivity(role);

  return (
    <>
      <DashboardHeader 
        title={title} 
        description={description}
      />
      <main className="flex-1 p-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{feedTitle}</CardTitle>
            <CardDescription>{feedDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activityLog.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  {isMetric ? (
                     <div className="p-2 bg-primary/10 rounded-full">
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                     </div>
                  ) : (
                    <Avatar>
                        <AvatarImage src={item.avatar} alt={item.user} />
                        <AvatarFallback>
                        {item.user.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="text-sm flex-1">
                    {isMetric ? (
                        <>
                            <p className="font-semibold">{item.title}</p>
                            <p>{item.description}</p>
                        </>
                    ) : (
                        <p>
                            <span className="font-semibold">{item.user}</span> {item.action}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function RecentActivityPage() {
    return <RecentActivityPageContent />
}
