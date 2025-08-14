
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
import { Textarea } from "../ui/textarea";


const membershipFormSchema = z.object({
    // Membership Changes
    membershipDate: z.date(),
    newMembers: z.coerce.number().int(),
    lostMembers: z.coerce.number().int(),
    reasonForLoss: z.string().optional(),

    // Customer Feedback
    surveyDate: z.date().optional(),
    customerId: z.string().optional(),
    csatScore: z.coerce.number().min(1).max(5).optional(),
    npsScore: z.coerce.number().min(0).max(10).optional(),
    comments: z.string().optional(),
});

type MembershipFormValues = z.infer<typeof membershipFormSchema>;

export function MembershipForm() {
    const { toast } = useToast();
    const form = useForm<MembershipFormValues>({
        resolver: zodResolver(membershipFormSchema),
        defaultValues: {
            membershipDate: new Date(),
        }
    });

    function onSubmit(data: MembershipFormValues) {
        console.log(data);
        toast({
            title: "Membership Data Submitted",
            description: "Your membership data has been recorded.",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Membership & Customer Data Entry</CardTitle>
                <CardDescription>
                    Enter customer growth and feedback data.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <Accordion type="multiple" defaultValue={['changes']} className="w-full">
                            <AccordionItem value="changes">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Membership Changes</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <FormField control={form.control} name="membershipDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="newMembers" render={({ field }) => ( <FormItem><FormLabel>New Members</FormLabel><FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="lostMembers" render={({ field }) => ( <FormItem><FormLabel>Lost Members</FormLabel><FormControl><Input type="number" placeholder="e.g., 25" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="reasonForLoss" render={({ field }) => ( <FormItem><FormLabel>Reason for Loss</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger></FormControl><SelectContent><SelectItem value="price">Price</SelectItem><SelectItem value="service">Service</SelectItem><SelectItem value="competition">Competition</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="feedback">
                                <AccordionTrigger className="text-lg font-semibold font-headline">Customer Feedback</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <FormField control={form.control} name="surveyDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Survey Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="customerId" render={({ field }) => ( <FormItem><FormLabel>Customer ID</FormLabel><FormControl><Input placeholder="e.g., CUST-00123" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="csatScore" render={({ field }) => ( <FormItem><FormLabel>CSAT Score (1-5)</FormLabel><FormControl><Input type="number" min="1" max="5" placeholder="e.g., 4" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="npsScore" render={({ field }) => ( <FormItem><FormLabel>NPS Score (0-10)</FormLabel><FormControl><Input type="number" min="0" max="10" placeholder="e.g., 8" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                     <FormField control={form.control} name="comments" render={({ field }) => ( <FormItem><FormLabel>Comments</FormLabel><FormControl><Textarea placeholder="Customer feedback..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-6">
                        <Button type="submit" size="lg">
                            <Save className="mr-2 h-4 w-4" />
                            Save Membership Entries
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
