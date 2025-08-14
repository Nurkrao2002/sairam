
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { User } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("PinnSight@123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/users");
      const userList: User[] = await response.json();
      const user = userList.find(u => u.email === email);

      if (user) {
        const companyDomain = user.email.split('@')[1];
      const companySlug = companyDomain.split('.')[0];
      
      const searchParams = new URLSearchParams({
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      }).toString();
      
      const dashboardParams = new URLSearchParams({
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        period: "M",
      }).toString();
      
      const isAdminRole = ["Platform Super Admin", "Platform Manager"].includes(user.role);

      if (isAdminRole) {
         router.push(`/admin/dashboard?${searchParams}`);
         return;
      } 
      
      let path = '';
      let params = dashboardParams;

      switch(user.role) {
        case "CEO/Executive":
            path = `/${companySlug}/overview`;
            break;
        case "Finance Team":
            path = `/${companySlug}/financial-dashboard`;
            break;
        case "Sales & Marketing":
            path = `/${companySlug}/sales-marketing-dashboard`;
            break;
        case "Operations Team":
            path = `/${companySlug}/operations-dashboard`;
            break;
        case "Company Admin":
            path = `/admin/dashboard`;
            params = searchParams;
            break;
        case "Basic User":
            path = `/${companySlug}/my-dashboard`;
            params = searchParams;
            break;
        default:
            path = `/${companySlug}/dashboard`;
            break;
      }
      
      router.push(`${path}?${params}`);

      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">PinnSight</CardTitle>
          <CardDescription className="pt-2">Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ceo@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="pr-10"
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
