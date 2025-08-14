
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/icons";

const companies = [
  { name: "Srisys Inc.", slug: "srisys", description: "Pioneering the future of technology." },
  { name: "Pigeon-Tech", slug: "pigeon-tech", description: "AI-powered pigeon communication platform." },
  { name: "Synergy Solutions", slug: "synergy-solutions", description: "Integrating systems for optimal performance." },
];

export default function SelectCompanyPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  
  const createHref = (slug: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      return `/${slug}/dashboard?${sp.toString()}`;
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <Logo className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Welcome, CEO</h1>
        <p className="text-muted-foreground">Please select a company to view the dashboard.</p>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {companies.map((company) => (
          <Link href={createHref(company.slug)} key={company.slug} className="block">
            <Card className="group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-headline">
                  {company.name}
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </CardTitle>
                <CardDescription>{company.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
