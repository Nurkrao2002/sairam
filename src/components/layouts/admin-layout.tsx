

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import { LogOut, ChevronDown, Bell, LayoutDashboard, Users, Shield, User, Component, AlertCircle, CheckCircle, MessageSquare, Building, MessageSquarePlus } from "lucide-react";

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
    PLATFORM: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Platform Dashboard", roles: ["Platform Super Admin", "Platform Manager"] },
        { href: "/admin/tenants", icon: Component, label: "Tenants", roles: ["Platform Super Admin", "Platform Manager"] },
        { href: "/admin/support-tickets", icon: MessageSquare, label: "Support", roles: ["Platform Manager"] },
    ],
    COMPANY_ADMIN: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Dashboard", roles: ["Company Admin"] },
        { href: "/users", icon: Users, label: "Users", roles: ["Company Admin"] },
        { href: "/roles", icon: Shield, label: "Roles", roles: ["Company Admin"] },
    ]
};

const adminNotifications = {
    "Platform Super Admin": [
        { icon: AlertCircle, text: "System update scheduled for tonight at 11 PM PST.", time: "1h ago", color: "text-orange-500" },
        { icon: CheckCircle, text: "Database backup completed successfully.", time: "4h ago", color: "text-green-500" },
        { icon: AlertCircle, text: "High CPU usage detected on server-3.", time: "1d ago", color: "text-red-500" },
    ],
    "Platform Manager": [
        { icon: CheckCircle, text: "New tenant 'Innovate Inc.' successfully onboarded.", time: "2h ago", color: "text-green-500" },
        { icon: AlertCircle, text: "Support ticket #T-1234 escalated to high priority.", time: "6h ago", color: "text-orange-500" },
    ],
    "Company Admin": [
        { icon: CheckCircle, text: "User 'Jane Doe' has been added to the Finance Team.", time: "30m ago", color: "text-green-500" },
        { icon: AlertCircle, text: "Your company subscription will renew in 7 days.", time: "1d ago", color: "text-orange-500" },
    ]
}

const companyNames: Record<string, string> = {
    "srisys": "Srisys Inc.",
    "pigeon-tech": "Pigeon-Tech",
}

function Header() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || "Admin";
  const { role } = useUserRole();
  const userRole = searchParams.get('role') || "Administrator";
  const avatarUrl = searchParams.get('avatar');
  const notifications = (role && adminNotifications[role as keyof typeof adminNotifications]) || [];
  const params = useParams();
  const companySlug = params.company as string || "srisys";
  
  const getHeaderText = () => {
    if (role === "Platform Super Admin" || role === "Platform Manager") {
        return "";
    }
    return companySlug ? companyNames[companySlug] || "Srisys Inc." : "Srisys Inc.";
  }

  const createHref = (href: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const finalHref = href.startsWith('/admin') ? href : `/${companySlug}${href}`;
    return `${finalHref}?${newSearchParams.toString()}`;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:left-64">
        <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg font-headline flex items-center gap-2">
              {role !== "Platform Super Admin" && role !== "Platform Manager" && <Building className="h-5 w-5 text-muted-foreground"/>}
              <span>{getHeaderText()}</span>
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
                  <AvatarFallback>{name ? name.split(' ').map(n => n[0]).join('') : 'A'}</AvatarFallback>
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
    if (!role) return [];

    let items = [];
    if (role === "Company Admin") {
        items = allNavItems.COMPANY_ADMIN;
    } else {
        items = allNavItems.PLATFORM;
    }
    
    return items.filter(item => item.roles.includes(role));
}


export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role } = useUserRole();
  const searchParams = useSearchParams();
  const params = useParams();
  const navItems = getVisibleNavItems(role);

  const getDashboardHomeLink = () => {
    return "/admin/dashboard";
  }

  const createHref = (href: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    if (role === 'Company Admin') {
        const companySlug = params.company as string || "srisys"; 
        const finalHref = href.startsWith('/admin') ? href : `/${companySlug}${href}`;
        return `${finalHref}?${newSearchParams.toString()}`;
    }
    
    // For platform-level roles
    return `${href}?${newSearchParams.toString()}`;
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
