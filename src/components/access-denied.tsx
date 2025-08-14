
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "./dashboard-header";

export function AccessDenied() {
  return (
    <>
        <DashboardHeader title="Access Denied" />
        <main className="flex-1 p-4 sm:px-6 lg:px-8">
            <Card className="max-w-xl mx-auto border-destructive">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <CardTitle className="text-destructive">You do not have permission to view this page.</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Please contact your administrator if you believe you should have access to this resource.
                        You may need to be assigned a different role to view this content.
                    </p>
                </CardContent>
            </Card>
        </main>
    </>
  );
}
