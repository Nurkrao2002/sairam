import { LucideIcon } from "lucide-react";

export type Period = "D" | "W" | "M" | "YTD" | "ALL" | "CUSTOM";

export type Tenant = {
  id: string;
  name: string;
  plan: string;
  users: number;
  last_active: string;
  status: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  tenant_id?: string;
};

export type Role = {
  id: number;
  name: string;
};

export type Permission = {
  id: number;
  description: string;
};

export type SupportTicket = {
    id: string;
    subject: string;
    tenant: string;
    user: string;
    priority: "Low" | "Medium" | "High";
    status: "Open" | "In Progress" | "Resolved" | "Closed";
    created_at: Date;
    last_updated_at: Date;
};

export type Report = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  last_generated_at: Date;
  category: string;
};
