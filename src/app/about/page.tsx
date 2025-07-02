import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target, Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Junks Electrical Solutions, our mission, vision, and commitment to providing top-quality electrical services in Limpopo.',
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container py-12 md:py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">About Junks Electrical Solutions</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            "Light up your life with the Junks"
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p>To provide reliable, safe, and innovative electrical solutions that empower our communities. We are dedicated to delivering top-quality workmanship and exceptional customer service, ensuring every project is completed to the highest standards of excellence and sustainability.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Eye className="w-10 h-10 text-primary" />
              </div>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
             <p>To be the leading and most trusted electrical services provider in Limpopo and beyond. We aim to light up the future by pioneering sustainable energy solutions and fostering long-lasting relationships with our clients based on trust, integrity, and performance.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-2xl mx-auto mt-12">
          <Card>
            <CardHeader className="items-center text-center">
               <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Info className="w-10 h-10 text-primary" />
               </div>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2 text-muted-foreground">
               <p><span className="font-semibold text-foreground">Company Name:</span> The Junks (Pty) Ltd</p>
               <p><span className="font-semibold text-foreground">Registration Number:</span> 2025/205488/07</p>
               <p><span className="font-semibold text-foreground">Location:</span> Makhwibidung Village Stand No 54, Tzaneen, Limpopo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
