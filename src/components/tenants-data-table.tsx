

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";


import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "./dashboard-header";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { type Tenant } from "@/lib/types";
import { FormSheet } from "./form-sheet";


const tenantSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  plan: z.enum(["Free", "Trial", "Paid", "Enterprise"]),
});


export function TenantsDataTable() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants');
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch tenants.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenants();
  }, [toast]);

  const form = useForm<z.infer<typeof tenantSchema>>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: "", plan: "Trial" },
  });

  const handleAddNew = () => {
    setEditingTenant(null);
    form.reset({ name: "", plan: "Trial" });
    setSheetOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    form.reset({ name: tenant.name, plan: tenant.plan as "Free" | "Trial" | "Paid" | "Enterprise" });
    setSheetOpen(true);
  };
  
  const createHref = (href: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    return `${href}?${newSearchParams.toString()}`;
  }


  const onSubmit = async (values: z.infer<typeof tenantSchema>) => {
    try {
      if (editingTenant) {
        const response = await fetch(`/api/tenants/${editingTenant.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const updatedTenant = await response.json();
        setTenants(tenants.map((t) => (t.id === editingTenant.id ? updatedTenant : t)));
        toast({ title: "Tenant Updated", description: "The tenant details have been successfully updated." });
      } else {
        const response = await fetch('/api/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const newTenant = await response.json();
        setTenants([newTenant, ...tenants]);
        toast({ title: "Tenant Added", description: "A new tenant has been successfully added." });
      }
      setSheetOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the tenant.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (tenantId: string) => {
    try {
      await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
      });
      setTenants(tenants.filter((t) => t.id !== tenantId));
      toast({ title: "Tenant Deleted", description: "The tenant has been successfully deleted." });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the tenant.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DashboardHeader title="Tenant Management" description="Onboard, manage, and monitor all tenant accounts on the platform.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Tenant
        </Button>
      </DashboardHeader>
      <main className="flex-1 p-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>
                          <Badge variant={tenant.plan === 'Enterprise' ? 'default' : 'secondary'}>{tenant.plan}</Badge>
                      </TableCell>
                      <TableCell>
                          <Badge variant={tenant.status === 'Active' ? 'secondary' : 'destructive'}>{tenant.status}</Badge>
                      </TableCell>
                      <TableCell>{tenant.users}</TableCell>
                      <TableCell>{tenant.last_active}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(tenant)}>Edit</DropdownMenuItem>
                           <DropdownMenuItem asChild>
                              <Link href={createHref(`/admin/tenants/${tenant.id}`)}>View Details</Link>
                            </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(tenant.id)} className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <FormSheet 
        isOpen={isSheetOpen}
        onOpenChange={setSheetOpen}
        isEditing={!!editingTenant}
        form={form}
        onSubmit={onSubmit}
        schema={tenantSchema}
        title={editingTenant ? "Edit Tenant" : "Add New Tenant"}
        description={editingTenant ? "Update the tenant's details below." : "Fill in the form to add a new tenant."}
       />
    </>
  );
}
