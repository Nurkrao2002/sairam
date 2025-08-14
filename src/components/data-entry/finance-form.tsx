
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Textarea } from "../ui/textarea";
import { InfoTooltip } from "../info-tooltip";

const financeFormSchema = z.object({
  // Revenue
  revenueDate: z.date(),
  revenueSource: z.string(),
  revenueAmount: z.coerce.number(),
  revenueType: z.string(),
  
  // COGS
  cogsDate: z.date().optional(),
  cogsCategory: z.string().optional(),
  cogsAmount: z.coerce.number().optional(),

  // Operating Expenses
  opexDate: z.date().optional(),
  opexType: z.string().optional(),
  opexAmount: z.coerce.number().optional(),

  // Depreciation & Amortization
  depreciationDate: z.date().optional(),
  assetCategory: z.string().optional(),
  depreciationAmount: z.coerce.number().optional(),

  // Interest & Taxes
  interestTaxDate: z.date().optional(),
  interestTaxType: z.string().optional(),
  interestTaxAmount: z.coerce.number().optional(),

  // Cash Flow
  cashInflowDate: z.date().optional(),
  cashInflowSource: z.string().optional(),
  cashInflowAmount: z.coerce.number().optional(),
  cashOutflowDate: z.date().optional(),
  cashOutflowPurpose: z.string().optional(),
  cashOutflowAmount: z.coerce.number().optional(),

  // Accounts Receivable/Payable
  invoiceDate: z.date().optional(),
  customerVendorName: z.string().optional(),
  invoiceAmount: z.coerce.number().optional(),
  dueDate: z.date().optional(),
  arApStatus: z.string().optional(),

  // Shareholders' Equity
  equityDate: z.date().optional(),
  shareholdersEquity: z.coerce.number().optional(),
  dividendsPaid: z.coerce.number().optional(),
});

type FinanceFormValues = z.infer<typeof financeFormSchema>;

export function FinanceForm() {
  const { toast } = useToast();
  const form = useForm<FinanceFormValues>({
    resolver: zodResolver(financeFormSchema),
    defaultValues: {
        revenueDate: new Date(),
    }
  });

  function onSubmit(data: FinanceFormValues) {
    console.log(data);
    toast({
      title: "Finance Data Submitted",
      description: "Your financial data has been recorded.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Finance Department Data Entry</CardTitle>
        <CardDescription>
          Enter raw financial data below. Derived metrics will be calculated automatically.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <Accordion type="multiple" defaultValue={['revenue']} className="w-full">
              {/* Revenue Tracking */}
              <AccordionItem value="revenue">
                <AccordionTrigger className="text-lg font-semibold font-headline">
                  <div className="flex items-center">
                    Revenue Tracking
                    <InfoTooltip>Record all sources of incoming revenue.</InfoTooltip>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FormField control={form.control} name="revenueDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="revenueSource" render={({ field }) => ( <FormItem><FormLabel>Revenue Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a source" /></SelectTrigger></FormControl><SelectContent><SelectItem value="membership">Membership</SelectItem><SelectItem value="services">Services</SelectItem><SelectItem value="products">Products</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="revenueAmount" render={({ field }) => ( <FormItem><FormLabel>Revenue Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="revenueType" render={({ field }) => ( <FormItem><FormLabel>Revenue Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="recurring">Recurring</SelectItem><SelectItem value="one-time">One-time</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Expenses */}
              <AccordionItem value="expenses">
                <AccordionTrigger className="text-lg font-semibold font-headline">
                   <div className="flex items-center">
                      Expenses
                      <InfoTooltip>Record all business expenses, including COGS and operating costs.</InfoTooltip>
                   </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                    <div>
                        <h4 className="font-medium mb-4">Cost of Goods Sold (COGS)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <FormField control={form.control} name="cogsDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="cogsCategory" render={({ field }) => ( <FormItem><FormLabel>Expense Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent><SelectItem value="direct-labor">Direct Labor</SelectItem><SelectItem value="materials">Materials</SelectItem><SelectItem value="overhead">Overhead</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="cogsAmount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 15000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                     <Separator />
                    <div>
                        <h4 className="font-medium my-4">Operating Expenses</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <FormField control={form.control} name="opexDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="opexType" render={({ field }) => ( <FormItem><FormLabel>Expense Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="salaries">Salaries</SelectItem><SelectItem value="rent">Rent</SelectItem><SelectItem value="marketing">Marketing</SelectItem><SelectItem value="r-d">R&D</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="opexAmount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 25000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>

               {/* Depreciation & Amortization */}
              <AccordionItem value="depreciation">
                <AccordionTrigger className="text-lg font-semibold font-headline">
                    <div className="flex items-center">
                        Depreciation & Amortization
                        <InfoTooltip>Record the expense of an asset over its useful life.</InfoTooltip>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name="depreciationDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="assetCategory" render={({ field }) => ( <FormItem><FormLabel>Asset Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent><SelectItem value="equipment">Equipment</SelectItem><SelectItem value="software">Software</SelectItem><SelectItem value="buildings">Buildings</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="depreciationAmount" render={({ field }) => ( <FormItem><FormLabel>Depreciation Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Interest & Taxes */}
              <AccordionItem value="interest-taxes">
                <AccordionTrigger className="text-lg font-semibold font-headline">
                    <div className="flex items-center">
                        Interest & Taxes
                        <InfoTooltip>Record payments for interest on debt and taxes.</InfoTooltip>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name="interestTaxDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="interestTaxType" render={({ field }) => ( <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="interest-expense">Interest Expense</SelectItem><SelectItem value="tax-expense">Tax Expense</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="interestTaxAmount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Cash Flow */}
              <AccordionItem value="cash-flow">
                <AccordionTrigger className="text-lg font-semibold font-headline">
                    <div className="flex items-center">
                        Cash Flow Components
                        <InfoTooltip>Record the movement of cash into and out of the company.</InfoTooltip>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                     <div>
                        <h4 className="font-medium mb-4">Cash Inflow</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <FormField control={form.control} name="cashInflowDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="cashInflowSource" render={({ field }) => ( <FormItem><FormLabel>Inflow Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a source" /></SelectTrigger></FormControl><SelectContent><SelectItem value="customer-payments">Customer Payments</SelectItem><SelectItem value="loans">Loans</SelectItem><SelectItem value="investments">Investments</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="cashInflowAmount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 30000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                     <Separator />
                    <div>
                        <h4 className="font-medium my-4">Cash Outflow</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <FormField control={form.control} name="cashOutflowDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="cashOutflowPurpose" render={({ field }) => ( <FormItem><FormLabel>Outflow Purpose</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a purpose" /></SelectTrigger></FormControl><SelectContent><SelectItem value="supplier-payments">Supplier Payments</SelectItem><SelectItem value="salaries">Salaries</SelectItem><SelectItem value="capex">CapEx</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="cashOutflowAmount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 18000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>

              {/* Accounts Receivable/Payable */}
              <AccordionItem value="ar-ap">
                <AccordionTrigger className="text-lg font-semibold font-headline">
                    <div className="flex items-center">
                        Accounts Receivable/Payable
                        <InfoTooltip>Track money owed to your company and money your company owes.</InfoTooltip>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <FormField control={form.control} name="invoiceDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Invoice Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="customerVendorName" render={({ field }) => ( <FormItem><FormLabel>Customer/Vendor</FormLabel><FormControl><Input placeholder="e.g., Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="invoiceAmount" render={({ field }) => ( <FormItem><FormLabel>Invoice Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 1200" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="dueDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="arApStatus" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="paid">Paid</SelectItem><SelectItem value="unpaid">Unpaid</SelectItem><SelectItem value="partially-paid">Partially Paid</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Shareholders' Equity & Dividends */}
              <AccordionItem value="equity">
                <AccordionTrigger className="text-lg font-semibold font-headline">
                    <div className="flex items-center">
                        Shareholders' Equity & Dividends
                        <InfoTooltip>Record changes in equity and dividends paid out to shareholders.</InfoTooltip>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="equityDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="shareholdersEquity" render={({ field }) => ( <FormItem><FormLabel>Shareholders' Equity</FormLabel><FormControl><Input type="number" placeholder="e.g., 1200000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="dividendsPaid" render={({ field }) => ( <FormItem><FormLabel>Dividends Paid</FormLabel><FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Financial Entries
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
