

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Check, Upload, Palette, Rocket, Users, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const plans = [
    { name: "Standard", price: "$49/mo", features: ["10 Users", "Basic Reporting", "Email Support"] },
    { name: "Pro", price: "$99/mo", features: ["50 Users", "Advanced Reporting", "Priority Support"], recommended: true },
    { name: "Enterprise", price: "Contact Us", features: ["Unlimited Users", "Custom Integrations", "Dedicated Support"] },
]

const colors = [
    { name: "Indigo", value: "231, 48%, 48%" },
    { name: "Cyan", value: "180, 82%, 35%" },
    { name: "Amber", value: "45, 93%, 47%" },
    { name: "Rose", value: "346, 84%, 61%" },
]

export function CompanyAdminSettings() {
    const [selectedPlan, setSelectedPlan] = useState("Pro");
    const [primaryColor, setPrimaryColor] = useState("231, 48%, 48%");

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Subscription</CardTitle>
                     <CardDescription>Current plan details and options.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-start p-4 border rounded-lg">
                        <div>
                            <Badge variant="default">Enterprise Plan</Badge>
                            <p className="text-sm text-muted-foreground mt-2">Your plan renews on August 1, 2025.</p>
                        </div>
                         <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="outline" size="sm">
                                    <Rocket className="h-4 w-4 mr-2" />
                                    Change Plan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>Choose Your Plan</DialogTitle>
                                    <DialogDescription>Select the best plan for your company's needs.</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                    {plans.map(plan => (
                                        <Card 
                                            key={plan.name} 
                                            className={cn(
                                                "flex flex-col cursor-pointer",
                                                selectedPlan === plan.name && "border-primary ring-2 ring-primary"
                                            )}
                                            onClick={() => setSelectedPlan(plan.name)}
                                        >
                                            <CardHeader>
                                                <CardTitle className="flex justify-between items-center">
                                                    {plan.name}
                                                    {plan.recommended && <span className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">Recommended</span>}
                                                </CardTitle>
                                                <p className="text-2xl font-bold">{plan.price}</p>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <ul className="space-y-2 text-sm">
                                                    {plan.features.map(feature => (
                                                        <li key={feature} className="flex items-center gap-2">
                                                            <Check className="h-4 w-4 text-green-500"/>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                            <div className="p-6 pt-0">
                                                <Button className="w-full" disabled={selectedPlan !== plan.name}>Choose Plan</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4"/><span><span className="font-semibold text-foreground">18 / 25</span> seats used</span></div>
                        <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4"/><span>Billed monthly</span></div>
                        <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className="h-4 w-4"/><span>$2,475 / month</span></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Customization Hub</CardTitle>
                    <CardDescription>Manage your company's branding.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Logo
                            </Button>
                        </DialogTrigger>
                         <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload Company Logo</DialogTitle>
                                <DialogDescription>Select an image file to use as your company's logo.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div> 
                            </div>
                             <DialogFooter>
                                <Button type="submit">Upload</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Palette className="h-4 w-4 mr-2" />
                                Select Color Palette
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select Primary Color</DialogTitle>
                                <DialogDescription>Choose a primary color for your company's dashboard theme.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <RadioGroup defaultValue={primaryColor} onValueChange={setPrimaryColor} className="grid grid-cols-2 gap-4">
                                    {colors.map(color => (
                                        <div key={color.name}>
                                            <RadioGroupItem value={color.value} id={color.name} className="sr-only" />
                                            <Label htmlFor={color.name} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                                 <div className="w-full h-16 rounded-lg" style={{backgroundColor: `hsl(${color.value})`}}></div>
                                                 <span className="font-semibold mt-2">{color.name}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Theme Preview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="p-2 rounded-lg" style={{backgroundColor: `hsl(${primaryColor})`}}>
                                            <h3 className="text-sm font-semibold text-primary-foreground">Primary Button</h3>
                                        </div>
                                         <div className="p-2 rounded-lg" style={{backgroundColor: `hsl(${primaryColor} / 0.1)`}}>
                                            <h3 className="text-sm font-semibold" style={{color: `hsl(${primaryColor})`}}>Active Item</h3>
                                        </div>
                                         <div className="p-2 rounded-lg bg-secondary">
                                            <h3 className="text-sm font-semibold text-secondary-foreground">Secondary Item</h3>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                             <DialogFooter>
                                <Button type="submit">Save Palette</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </>
    )
}
