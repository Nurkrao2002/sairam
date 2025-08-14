
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const auditLogs = [
  {
    id: "log_1",
    user: "super@pinnsight.com",
    action: "Enabled Maintenance Mode",
    details: "Platform-wide maintenance",
    timestamp: "2025-07-25T10:00:00Z",
    status: "Success",
  },
  {
    id: "log_2",
    user: "manager@pinnsight.com",
    action: "Suspended Tenant",
    details: "Tenant ID: ten_5 (DataWeavers)",
    timestamp: "2025-07-25T09:30:00Z",
    status: "Success",
  },
    {
    id: "log_3",
    user: "super@pinnsight.com",
    action: "Updated API Rate Limit",
    details: "Set to 120 requests/min",
    timestamp: "2025-07-24T15:00:00Z",
    status: "Success",
  },
    {
    id: "log_4",
    user: "manager@pinnsight.com",
    action: "Created New Tenant",
    details: "Tenant ID: ten_2 (Innovate Inc.)",
    timestamp: "2025-07-23T11:00:00Z",
    status: "Success",
  },
    {
    id: "log_5",
    user: "super@pinnsight.com",
    action: "Deleted Tenant",
    details: "Tenant ID: ten_x (Legacy Corp)",
    timestamp: "2025-07-22T18:00:00Z",
    status: "Failure",
  },
];


export default function AuditLogsPage() {
  return (
    <>
      <DashboardHeader 
        title="Audit Logs" 
        description="A chronological record of actions and events on the platform." 
      />
      <main className="flex-1 p-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Platform Audit Trail</CardTitle>
            <CardDescription>
              Review all administrative actions performed across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell>{log.details}</TableCell>
                            <TableCell>
                                <Badge variant={log.status === "Success" ? "secondary" : "destructive"}>
                                    {log.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
