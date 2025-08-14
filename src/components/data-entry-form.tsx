

"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useFinancialData } from "@/context/financial-data-context";
import React, { useEffect } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const dataEntrySchema = z.object({
  period: z.custom<DateRange>(
    (val) => typeof val === 'object' && val !== null && 'from' in val, 
    { message: "A reporting period is required." }
  ),
  revenue: z.coerce.number().min(0, "Revenue must be a positive number."),
  grossProfit: z.coerce.number(),
  netIncome: z.coerce.number(),
  expenses: z.coerce.number().min(0, "Expenses must be a positive number."),
  cashFlow: z.coerce.number(),
  ebitda: z.coerce.number(),
  customerLtv: z.coerce.number(),
  customerCac: z.coerce.number(),
});

type DataEntryFormValues = z.infer<typeof dataEntrySchema>;

const defaultValues: Partial<DataEntryFormValues> = {
  revenue: '' as any,
  grossProfit: '' as any,
  netIncome: '' as any,
  expenses: '' as any,
  cashFlow: '' as any,
  ebitda: '' as any,
  customerLtv: '' as any,
  customerCac: '' as any,
};

export function DataEntryForm() {
  const { toast } = useToast();
  const { addFinancialRecord } = useFinancialData();
  const form = useForm<DataEntryFormValues>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues,
  });

  const revenue = useWatch({ control: form.control, name: "revenue" });
  const expenses = useWatch({ control: form.control, name: "expenses" });

  useEffect(() => {
    const rev = typeof revenue === 'number' ? revenue : 0;
    const exp = typeof expenses === 'number' ? expenses : 0;
    
    form.setValue("grossProfit", rev, { shouldValidate: true });
    form.setValue("netIncome", rev - exp, { shouldValidate: true });

  }, [revenue, expenses, form]);

  const onSubmit = (data: DataEntryFormValues) => {
    if (!data.period.from) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please select a reporting period.",
        });
        return;
    }
    const recordToSave = {
        ...data,
        period: data.period.from,
    };
    addFinancialRecord(recordToSave);
    toast({
      title: "Data Saved",
      description: "Financial metrics have been successfully saved.",
    });
    form.reset(defaultValues);
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    // Allow empty string to clear the field, otherwise convert to number
    if (value === '' || value === '-') {
      field.onChange(value);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        field.onChange(num);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Record Financial Metrics</CardTitle>
            <CardDescription>
                Fill out the form below to add financial data for a specific period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Reporting Period</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                           className={cn(
                            "w-full max-w-sm justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date or range</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4 font-headline">Core Financials</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Revenue ($)</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="e.g., 670000" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Expenses ($)</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="e.g., 410000" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grossProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gross Profit ($)</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="Auto-calculated" {...field} value={field.value ?? ''} readOnly className="bg-muted/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="netIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Income ($)</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="Auto-calculated" {...field} value={field.value || ''} readOnly className="bg-muted/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="ebitda"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>EBITDA ($)</FormLabel>
                        <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="e.g., 285000" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="cashFlow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating Cash Flow ($)</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="e.g., 195000" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 font-headline">Customer Metrics</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerLtv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Lifetime Value (LTV) ($)</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="e.g., 45200" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerCac"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Acquisition Cost (CAC) ($)</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="e.g., 2850" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" size="lg">
                <Save className="mr-2 h-4 w-4" />
                Save Financial Data
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
