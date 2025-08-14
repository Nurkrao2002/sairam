
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { DashboardHeader } from "./dashboard-header";
import { SupportTicket } from "@/lib/types";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const priorityVariantMap: Record<SupportTicket['priority'], "destructive" | "default" | "secondary"> = {
    High: "destructive",
    Medium: "default",
    Low: "secondary"
}

const statusVariantMap: Record<SupportTicket['status'], "secondary" | "default" | "destructive"> = {
    Open: "secondary",
    "In Progress": "default",
    Resolved: "secondary",
    Closed: "destructive",
}

export function SupportTicketsDataTable() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [data, setData] = React.useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/support-tickets');
        const tickets = await response.json();
        setData(tickets.map((ticket: SupportTicket) => ({
          ...ticket,
          created: new Date(ticket.created),
          lastUpdated: new Date(ticket.lastUpdated),
        })));
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch support tickets.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [toast]);

  const createHref = (href: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    return `${href}?${newSearchParams.toString()}`;
  }

  const handleChangeStatus = async (ticketId: string, newStatus: SupportTicket['status']) => {
    try {
      const response = await fetch(`/api/support-tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedTicket = await response.json();
      setData(prevData => prevData.map(ticket => ticket.id === ticketId ? {
        ...updatedTicket,
        created: new Date(updatedTicket.created),
        lastUpdated: new Date(updatedTicket.lastUpdated),
      } : ticket));
      toast({
          title: "Status Updated",
          description: `Ticket ${ticketId} has been updated to "${newStatus}".`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the ticket status.",
        variant: "destructive",
      });
    }
  }

  const columns: ColumnDef<SupportTicket>[] = [
    {
      accessorKey: "id",
      header: "Ticket ID",
      cell: ({ row }) => (
        <div className="capitalize font-mono">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => <div className="font-medium">{row.getValue("subject")}</div>,
    },
    {
      accessorKey: "tenant",
      header: "Tenant",
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.original.priority;
            return <Badge variant={priorityVariantMap[priority]}>{priority}</Badge>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return <Badge variant={statusVariantMap[status]}>{status}</Badge>
        }
    },
    {
        accessorKey: "created",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Created
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => format(row.original.created, "PPP")
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const ticket = row.original;
        const statuses: SupportTicket['status'][] = ["Open", "In Progress", "Resolved", "Closed"];
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                  <Link href={createHref(`/admin/support-tickets/${ticket.id}`)}>View ticket details</Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                         {statuses.map(status => (
                            <DropdownMenuItem key={status} onClick={() => handleChangeStatus(ticket.id, status)}>
                                <Badge variant={statusVariantMap[status]} className="mr-2 h-2 w-2 p-0 rounded-full" />
                                {status}
                            </DropdownMenuItem>
                         ))}
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id)}
              >
                Copy ticket ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <DashboardHeader
        title="Support Tickets"
        description="Review and manage all support tickets from tenants."
      >
        <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
        </Button>
      </DashboardHeader>
      <div className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <Card>
          <CardContent className="p-4">
             <div className="flex flex-wrap items-center gap-4">
                <Input
                    placeholder="Filter by subject..."
                    value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                    table.getColumn("subject")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Select onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === 'all' ? undefined : value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                 <Select onValueChange={(value) => table.getColumn("priority")?.setFilterValue(value === 'all' ? undefined : value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        Columns <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                            }
                            >
                            {column.id}
                            </DropdownMenuCheckboxItem>
                        )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-0">
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                </TableHead>
                                )
                            })}
                            </TableRow>
                        ))}
                        </TableHeader>
                        <TableBody>
                          {isLoading ? (
                            <TableRow>
                              <TableCell colSpan={columns.length} className="h-24 text-center">
                                Loading...
                              </TableCell>
                            </TableRow>
                          ) : table.getRowModel().rows?.length ? (
                              table.getRowModel().rows.map((row) => (
                              <TableRow
                                  key={row.id}
                                  data-state={row.getIsSelected() && "selected"}
                              >
                                  {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                      {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                      )}
                                  </TableCell>
                                  ))}
                              </TableRow>
                              ))
                          ) : (
                              <TableRow>
                              <TableCell
                                  colSpan={columns.length}
                                  className="h-24 text-center"
                              >
                                  No results.
                              </TableCell>
                              </TableRow>
                          )}
                        </TableBody>
                    </Table>
                    </div>
            </CardContent>
        </Card>
         <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
