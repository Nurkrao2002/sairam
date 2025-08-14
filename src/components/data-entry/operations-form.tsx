
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

const operationsFormSchema = z.object({
  // Project Tracking
  projectId: z.string().optional(),
  projectStartDate: z.date().optional(),
  plannedEndDate: z.date().optional(),
  actualEndDate: z.date().optional(),
  projectStatus: z.string().optional(),
  projectValue: z.coerce.number().optional(),

  // Time Tracking
  employeeId: z.string().optional(),
  timeTrackingDate: z.date().optional(),
  billableHours: z.coerce.number().optional(),
  nonBillableHours: z.coerce.number().optional(),
  timeTrackingProjectId: z.string().optional(),

  // Service Delivery
  serviceId: z.string().optional(),
  serviceCustomerId: z.string().optional(),
  startTime: z.string().optional(), // Using string for time input simplicity
  endTime: z.string().optional(),
  deliveredOnTime: z.boolean().optional(),

  // Headcount
  headcountDate: z.date().optional(),
  department: z.string().optional(),
  employeeCount: z.coerce.number().int().optional(),
});

type OperationsFormValues = z.infer<typeof operationsFormSchema>;

export function OperationsForm() {
    const { toast } = useToast();
    const form = useForm<OperationsFormValues>({
        resolver: zodResolver(operationsFormSchema),
    });

    function onSubmit(data: OperationsFormValues) {
        console.log(data);
        toast({
            title: "Operations Data Submitted",
            description: "Your operational data has been recorded.",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Operations Department Data Entry</CardTitle>
                <CardDescription>
                    Enter project, time tracking, and headcount data.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                       <Accordion type="multiple" defaultValue={['project']} className="w-full">
                            <AccordionItem value="project">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Project Tracking</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField control={form.control} name="projectId" render={({ field }) => ( <FormItem><FormLabel>Project ID</FormLabel><FormControl><Input placeholder="e.g., PROJ-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="projectStartDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="plannedEndDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Planned End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="actualEndDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Actual End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="projectStatus" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="not-started">Not Started</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="delayed">Delayed</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="projectValue" render={({ field }) => ( <FormItem><FormLabel>Project Value</FormLabel><FormControl><Input type="number" placeholder="e.g., 75000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="time">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Time Tracking</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                        <FormField control={form.control} name="employeeId" render={({ field }) => ( <FormItem><FormLabel>Employee ID</FormLabel><FormControl><Input placeholder="e.g., EMP-042" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="timeTrackingDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="billableHours" render={({ field }) => ( <FormItem><FormLabel>Billable Hours</FormLabel><FormControl><Input type="number" placeholder="e.g., 7.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="nonBillableHours" render={({ field }) => ( <FormItem><FormLabel>Non-Billable Hours</FormLabel><FormControl><Input type="number" placeholder="e.g., 0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="timeTrackingProjectId" render={({ field }) => ( <FormItem><FormLabel>Project ID</FormLabel><FormControl><Input placeholder="e.g., PROJ-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="service">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Service Delivery</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
                                        <FormField control={form.control} name="serviceId" render={({ field }) => ( <FormItem><FormLabel>Service ID</FormLabel><FormControl><Input placeholder="e.g., SVC-998" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="serviceCustomerId" render={({ field }) => ( <FormItem><FormLabel>Customer ID</FormLabel><FormControl><Input placeholder="e.g., CUST-088" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="startTime" render={({ field }) => ( <FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="endTime" render={({ field }) => ( <FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="deliveredOnTime" render={({ field }) => ( <FormItem className="flex flex-row items-end space-x-2 pb-1"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Delivered on Time?</FormLabel></div></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="headcount">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Headcount</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField control={form.control} name="headcountDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="department" render={({ field }) => ( <FormItem><FormLabel>Department</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl><SelectContent><SelectItem value="finance">Finance</SelectItem><SelectItem value="sales">Sales</SelectItem><SelectItem value="operations">Operations</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="employeeCount" render={({ field }) => ( <FormItem><FormLabel>Employee Count</FormLabel><FormControl><Input type="number" placeholder="e.g., 25" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                       </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-6">
                        <Button type="submit" size="lg">
                            <Save className="mr-2 h-4 w-4" />
                            Save Operations Entries
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
