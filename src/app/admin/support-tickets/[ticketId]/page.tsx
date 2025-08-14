
"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportTicket } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Tag, User, Users, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const ticketConversation = [
    {
        user: "Robert Williams",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        type: "comment",
        content: "Hi team, we're seeing repeated 500 errors when trying to connect our Salesforce account. This is blocking our financial reporting.",
        timestamp: new Date("2025-07-25T10:00:00Z"),
    },
    {
        user: "Platform Support",
        avatar: "/placeholder.svg",
        type: "status_change",
        content: "Changed status from Open to In Progress.",
        timestamp: new Date("2025-07-25T10:05:00Z"),
    },
    {
        user: "Helen Turner",
        avatar: "https://i.pravatar.cc/150?u=manager",
        type: "comment",
        content: "Thanks for the report, Robert. We're investigating the issue with the integration service. I've escalated this to high priority.",
        timestamp: new Date("2025-07-25T10:15:00Z"),
    },
    {
        user: "Helen Turner",
        avatar: "https://i.pravatar.cc/150?u=manager",
        type: "status_change",
        content: "Changed priority from Medium to High.",
        timestamp: new Date("2025-07-25T10:15:20Z"),
    },
];


const priorityVariantMap: Record<any, "destructive" | "default" | "secondary"> = {
    High: "destructive",
    Medium: "default",
    Low: "secondary"
}

const statusVariantMap: Record<any, "secondary" | "default" | "destructive"> = {
    Open: "secondary",
    "In Progress": "default",
    Resolved: "secondary",
    Closed: "destructive",
}

export default function TicketDetailsPage() {
    const params = useParams();
    const ticketId = params.ticketId as string;
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await fetch(`/api/support-tickets/${ticketId}`);
                if (!response.ok) {
                    notFound();
                    return;
                }
                const data = await response.json();
                setTicket({
                    ...data,
                    created: new Date(data.created_at),
                    lastUpdated: new Date(data.last_updated_at),
                });
            } catch (error) {
                console.error("Failed to fetch ticket", error);
                notFound();
            } finally {
                setIsLoading(false);
            }
        };

        if (ticketId) {
            fetchTicket();
        }
    }, [ticketId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!ticket) {
        return notFound();
    }

    return (
        <>
            <DashboardHeader title={`Ticket: ${ticket.id}`} description={ticket.subject}>
                 <Button variant="outline" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Tickets
                </Button>
            </DashboardHeader>
            <main className="flex-1 p-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Conversation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {ticketConversation.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarImage src={item.avatar} alt={item.user} />
                                            <AvatarFallback>{item.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">{item.user}</p>
                                                <p className="text-xs text-muted-foreground">{format(item.timestamp, "PPP p")}</p>
                                            </div>
                                            <Card className={`p-4 mt-1 ${item.type === 'comment' ? '' : 'bg-secondary'}`}>
                                               <p className="text-sm">{item.content}</p>
                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6"/>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Add a reply</h3>
                                <Textarea placeholder="Type your response here..." rows={4} />
                                <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="outline">Add Internal Note</Button>
                                    <Button>Post Public Reply</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Ticket Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="font-semibold">Status</span>
                                <Badge variant={statusVariantMap[ticket.status]}>{ticket.status}</Badge>
                            </div>
                             <div className="flex justify-between">
                                <span className="font-semibold">Priority</span>
                                <Badge variant={priorityVariantMap[ticket.priority]}>{ticket.priority}</Badge>
                            </div>
                             <Separator />
                             <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Tenant</p>
                                    <p className="font-medium">{ticket.tenant}</p>
                                </div>
                             </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Submitted by</p>
                                    <p className="font-medium">{ticket.user}</p>
                                </div>
                             </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Created</p>
                                    <p className="font-medium">{format(ticket.created, "PPP")}</p>
                                </div>
                             </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">{format(ticket.lastUpdated, "PPP")}</p>
                                </div>
                             </div>
                             <Separator />
                             <Button className="w-full">Change Status</Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
