import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FileSpreadsheet } from "lucide-react";

type AccountsTableProps = {
    type: "Receivable" | "Payable";
}

const receivableData = {
    items: [
        { label: "Current (0-30 days)", value: 125000 },
        { label: "Past Due (31-60 days)", value: 45000, color: "text-orange-500" },
        { label: "Overdue (60+ days)", value: 18000, color: "text-red-500" },
    ],
    total: 188000,
}

const payableData = {
    items: [
        { label: "Current (0-30 days)", value: 85000 },
        { label: "Due Soon (31-60 days)", value: 32000, color: "text-orange-500" },
        { label: "Overdue (60+ days)", value: 8000, color: "text-red-500" },
    ],
    total: 125000,
}

export function AccountsTable({ type }: AccountsTableProps) {
    const data = type === "Receivable" ? receivableData : payableData;
    const title = `Accounts ${type}`;
    const totalLabel = `Total A${type.charAt(0)}`;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline text-base">{title}</CardTitle>
        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {data.items.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm">
                <p className={cn("text-muted-foreground", item.color)}>{item.label}</p>
                <p className={cn("font-medium", item.color)}>${item.value.toLocaleString()}</p>
            </div>
        ))}
        <Separator />
        <div className="flex justify-between items-center font-bold text-sm">
            <p>{totalLabel}</p>
            <p>${data.total.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
