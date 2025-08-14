
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";


const salesFormSchema = z.object({
  // Lead Generation
  leadDate: z.date(),
  leadSource: z.string(),
  leadCount: z.coerce.number().int(),
  campaignName: z.string().optional(),

  // Lead Conversion
  leadId: z.string().optional(),
  conversionDate: z.date().optional(),
  convertedToCustomer: z.boolean().optional(),
  customerId: z.string().optional(),

  // Sales Pipeline
  opportunityId: z.string().optional(),
  dealStage: z.string().optional(),
  dealValue: z.coerce.number().optional(),
  probability: z.coerce.number().min(0).max(100).optional(),
  expectedCloseDate: z.date().optional(),

  // Campaign Costs
  campaignCostName: z.string().optional(),
  campaignCostDate: z.date().optional(),
  costType: z.string().optional(),
  costAmount: z.coerce.number().optional(),

  // Revenue Attribution
  attributionCustomerId: z.string().optional(),
  attributionRevenueSource: z.string().optional(),
  attributedRevenue: z.coerce.number().optional(),
});

type SalesFormValues = z.infer<typeof salesFormSchema>;

export function SalesForm() {
    const { toast } = useToast();
    const form = useForm<SalesFormValues>({
        resolver: zodResolver(salesFormSchema),
        defaultValues: {
          leadDate: new Date(),
          convertedToCustomer: false,
        }
    });

    function onSubmit(data: SalesFormValues) {
        console.log(data);
        toast({
            title: "Sales Data Submitted",
            description: "Your sales and marketing data has been recorded.",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Sales & Marketing Data Entry</CardTitle>
                <CardDescription>
                    Enter lead generation, conversion, and campaign data.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                       <Accordion type="multiple" defaultValue={['lead-gen']} className="w-full">
                            <AccordionItem value="lead-gen">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Lead Generation</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <FormField control={form.control} name="leadDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="leadSource" render={({ field }) => ( <FormItem><FormLabel>Lead Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a source" /></SelectTrigger></FormControl><SelectContent><SelectItem value="website">Website</SelectItem><SelectItem value="social-media">Social Media</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="event">Event</SelectItem><SelectItem value="paid-ads">Paid Ads</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="leadCount" render={({ field }) => ( <FormItem><FormLabel>Lead Count</FormLabel><FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="campaignName" render={({ field }) => ( <FormItem><FormLabel>Campaign Name</FormLabel><FormControl><Input placeholder="e.g., Summer Sale 2025" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="lead-conversion">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Lead Conversion</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                                        <FormField control={form.control} name="leadId" render={({ field }) => ( <FormItem><FormLabel>Lead ID</FormLabel><FormControl><Input placeholder="e.g., LEAD-5821" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="conversionDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Conversion Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="customerId" render={({ field }) => ( <FormItem><FormLabel>Customer ID (if converted)</FormLabel><FormControl><Input placeholder="e.g., CUST-00123" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="convertedToCustomer" render={({ field }) => ( <FormItem className="flex flex-row items-end space-x-2 pb-1"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Converted to Customer?</FormLabel></div></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="pipeline">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Sales Pipeline</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                        <FormField control={form.control} name="opportunityId" render={({ field }) => ( <FormItem><FormLabel>Opportunity ID</FormLabel><FormControl><Input placeholder="e.g., OPP-045" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="dealStage" render={({ field }) => ( <FormItem><FormLabel>Deal Stage</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger></FormControl><SelectContent><SelectItem value="lead">Lead</SelectItem><SelectItem value="qualified">Qualified</SelectItem><SelectItem value="proposal">Proposal</SelectItem><SelectItem value="negotiation">Negotiation</SelectItem><SelectItem value="closed-won">Closed Won</SelectItem><SelectItem value="closed-lost">Closed Lost</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="dealValue" render={({ field }) => ( <FormItem><FormLabel>Deal Value</FormLabel><FormControl><Input type="number" placeholder="e.g., 25000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="probability" render={({ field }) => ( <FormItem><FormLabel>Probability (%)</FormLabel><FormControl><Input type="number" min="0" max="100" placeholder="e.g., 75" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="expectedCloseDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Expected Close Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="costs-attribution">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Campaign Costs & Revenue Attribution</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-6">
                                    <div>
                                        <h4 className="font-medium mb-4">Campaign Costs</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <FormField control={form.control} name="campaignCostName" render={({ field }) => ( <FormItem><FormLabel>Campaign Name</FormLabel><FormControl><Input placeholder="e.g., Q3 Social Push" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="campaignCostDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="costType" render={({ field }) => ( <FormItem><FormLabel>Cost Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ad-spend">Ad Spend</SelectItem><SelectItem value="content-creation">Content Creation</SelectItem><SelectItem value="events">Events</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="costAmount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                    <Separator />
                                     <div>
                                        <h4 className="font-medium mb-4">Revenue Attribution</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormField control={form.control} name="attributionCustomerId" render={({ field }) => ( <FormItem><FormLabel>Customer ID</FormLabel><FormControl><Input placeholder="e.g., CUST-00123" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="attributionRevenueSource" render={({ field }) => ( <FormItem><FormLabel>Revenue Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger></FormControl><SelectContent><SelectItem value="campaign">Campaign</SelectItem><SelectItem value="organic">Organic</SelectItem><SelectItem value="referral">Referral</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="attributedRevenue" render={({ field }) => ( <FormItem><FormLabel>Attributed Revenue</FormLabel><FormControl><Input type="number" placeholder="e.g., 1200" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                       </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-6">
                        <Button type="submit" size="lg">
                            <Save className="mr-2 h-4 w-4" />
                            Save Sales Entries
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
