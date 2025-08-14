

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams, useSearchParams } from "next/navigation";
import {
  DollarSign,
  ClipboardPlus,
  FileBarChart2,
  LogOut,
  ChevronDown,
  Bell,
  Building,
  History,
  LayoutDashboard,
  Users2,
  Activity,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Eye,
  User,
  Package,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { useUserRole } from "@/hooks/use-user-role";

const allNavItems = {
    GENERAL: [
      { href: "/my-dashboard", icon: User, label: "My Dashboard", roles: ["Basic User"] },
      { href: "/overview", icon: Eye, label: "Overview", roles: ["CEO/Executive"] },
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["CEO/Executive"] },
      { href: "/financial-dashboard", icon: DollarSign, label: "Financial Dashboard", roles: ["Finance Team"] },
      { href: "/sales-marketing-dashboard", icon: Lightbulb, label: "Sales & Marketing", roles: ["Sales & Marketing"] },
      { href: "/operations-dashboard", icon: Activity, label: "Operations Dashboard", roles: ["Operations Team"] },
      { href: "/recent-activity", icon: History, label: "Recent Activity", roles: ["CEO/Executive", "Finance Team", "Sales & Marketing", "Operations Team", "Basic User"] },
    ],
    MANAGEMENT: [
      { href: "/data-entry/finance", icon: ClipboardPlus, label: "Finance Data Entry", roles: ["Finance Team"] },
      { href: "/data-entry/sales", icon: ClipboardPlus, label: "Sales Data Entry", roles: ["Sales & Marketing"] },
      { href: "/data-entry/operations", icon: ClipboardPlus, label: "Operations Data Entry", roles: ["Operations Team"] },
      { href: "/data-entry/membership", icon: ClipboardPlus, label: "Membership Data Entry", roles: ["Sales & Marketing"] },
      
      { href: "/reports", icon: FileBarChart2, label: "Reports", roles: ["Finance Team", "Sales & Marketing", "Operations Team", "CEO/Executive"] },
    ],
};

const userNotifications = {
    "CEO/Executive": [
        { icon: AlertCircle, text: "Q2 financial report is ready for review.", time: "2h ago", color: "text-orange-500" },
        { icon: CheckCircle, text: "Market share increased by 0.5% this month.", time: "1d ago", color: "text-green-500" },
    ],
    "Finance Team": [
        { icon: CheckCircle, text: "Q2 P&L statement has been generated.", time: "1h ago", color: "text-green-500" },
        { icon: AlertCircle, text: "Accounts payable for 'Supplier Inc.' is due tomorrow.", time: "1d ago", color: "text-orange-500" },
    ],
    "Sales & Marketing": [
        { icon: CheckCircle, text: "New lead 'John Smith' has been assigned to you.", time: "15m ago", color: "text-green-500" },
        { icon: AlertCircle, text: "'Summer Sale' campaign ends in 3 days.", time: "3d ago", color: "text-orange-500" },
    ],
    "Operations Team": [
        { icon: AlertCircle, text: "Project 'Phoenix' is at risk of delay.", time: "4h ago", color: "text-red-500" },
        { icon: CheckCircle, text: "Weekly resource utilization report is available.", time: "1d ago", color: "text-green-500" },
    ],
    "Basic User": [
      { icon: CheckCircle, text: "Welcome to the platform!", time: "1m ago", color: "text-green-500" },
    ]
}

const companyNames: Record<string, string> = {
    "srisys": "Srisys Inc.",
    "pigeon-tech": "Pigeon-Tech",
}

function Header() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || "User";
  const { role } = useUserRole();
  const userRole = searchParams.get('role') || "User";
  const avatarUrl = searchParams.get('avatar');
  const notifications = (role && userNotifications[role as keyof typeof userNotifications]) || [];
  const params = useParams();
  const companySlug = params.company as string;
  const companyName = companySlug ? companyNames[companySlug] || "Select Company" : "Select Company";
  
  const createHref = (href: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    return `/${companySlug}${href}?${newSearchParams.toString()}`;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:left-64">
        <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg font-headline flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground"/>
              <span>{companyName}</span>
            </h1>
        </div>

        <div className="flex items-center gap-4">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5"/>
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 justify-center text-white text-[10px] items-center">{notifications.length}</span>
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? notifications.map((item, index) => (
                        <DropdownMenuItem key={index} className="flex items-start gap-3">
                            <item.icon className={`h-4 w-4 mt-1 ${item.color}`} />
                            <div>
                                <p className="text-sm leading-tight">{item.text}</p>
                                <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                        </DropdownMenuItem>
                    )) : (
                        <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-medium">
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={decodeURIComponent(avatarUrl)} alt={name} />}
                  <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                    <span className="font-semibold">{name}</span>
                    <span className="text-xs text-muted-foreground">{userRole}</span>
                </div>
                <ChevronDown className="h-4 w-4 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={createHref('/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href={createHref('/raise-ticket')}>
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        Support
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/login">
                  <DropdownMenuItem className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4"/>
                      Log out
                  </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </header>
  )
}

function SidebarHeaderContent({ href }: { href: string }) {
    return (
        <Link href={href} className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="font-bold text-lg font-headline">PinnSight</h1>
        </Link>
    )
}

function getVisibleNavItems(role: string | null) {
    if (!role) {
        return [];
    }
    const allItems = [...allNavItems.GENERAL, ...allNavItems.MANAGEMENT];
    return allItems.filter(item => item.roles.includes(role));
}


export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const { role } = useUserRole();
  const companySlug = params.company as string;
  const searchParams = useSearchParams();
  const navItems = getVisibleNavItems(role);

  const getDashboardHomeLink = () => {
    if (!role) return '/login';
    const homeNav = allNavItems.GENERAL.find(item => item.roles.includes(role));
    return homeNav ? homeNav.href : '/dashboard';
  }
  
  const createHref = (href: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    return `/${companySlug}${href}?${newSearchParams.toString()}`;
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarHeaderContent href={createHref(getDashboardHomeLink())} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={createHref(item.href)}>
                  <SidebarMenuButton
                    isActive={pathname.endsWith(item.href)}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-1 flex-col md:ml-64">
        <Header />
        <SidebarInset>
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
