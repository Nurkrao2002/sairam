

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const SidebarContext = React.createContext<{ isMobile: boolean }>({ isMobile: false });

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <SidebarContext.Provider value={{ isMobile }}>
        <div className="flex min-h-screen">
            {children}
        </div>
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const { isMobile } = React.useContext(SidebarContext);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={cn("w-64 p-0 flex flex-col bg-card", className)}>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn("hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r bg-card", className)}>
      {children}
    </aside>
  );
};
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-4 border-b h-16 flex items-center", className)} {...props} />
    )
  );
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props} />
    )
  );
SidebarContent.displayName = "SidebarContent";

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
    ({ className, ...props }, ref) => (
      <ul ref={ref} className={cn("space-y-1 p-4", className)} {...props} />
    )
  );
SidebarMenu.displayName = "SidebarMenu";

export const SidebarLabel = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("px-3 py-2 text-xs font-semibold uppercase text-muted-foreground/80", className)} {...props} />
    )
);
SidebarLabel.displayName = "SidebarLabel";

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
    ({ className, ...props }, ref) => (
      <li ref={ref} className={cn("", className)} {...props} />
    )
  );
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors w-full",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-2 mt-auto border-t", className)} {...props} />
    )
  );
SidebarFooter.displayName = "SidebarFooter";

export const SidebarInset = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <main ref={ref} className={cn("flex-1 pt-16", className)} {...props} />
    )
});
SidebarInset.displayName = "SidebarInset";
