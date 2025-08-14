import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ratios = [
    { label: "Current Ratio", value: "2.4" },
    { label: "Quick Ratio", value: "1.8" },
    { label: "Debt-to-Equity", value: "0.35" },
    { label: "ROI", value: "18.5%", color: "text-green-600" },
    { label: "ROE", value: "22.3%", color: "text-green-600" },
    { label: "Gross Margin", value: "38.8%", color: "text-green-600" },
];

export function KeyRatios() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-base">Key Ratios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {ratios.map((ratio) => (
            <div key={ratio.label}>
                <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">{ratio.label}</p>
                    <p className={`font-semibold ${ratio.color || 'text-foreground'}`}>{ratio.value}</p>
                </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
