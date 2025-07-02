import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Our Electrical Services',
  description: 'Explore the wide range of professional electrical services we offer, from residential wiring to commercial installations and emergency repairs.',
};

const serviceList = [
  { title: "House Wiring", description: "Professional installation, repair, and maintenance of electrical wiring systems in homes to ensure safety and efficiency." },
  { title: "Motor Test", description: "Comprehensive testing and diagnostics of electrical motors to ensure optimal performance and safety." },
  { title: "Motor Wiring", description: "Expert wiring and rewiring of motors for various applications, tailored to your specific needs." },
  { title: "Motor Gate", description: "Installation, repair, and automation of motorized gates for enhanced security and convenience." },
  { title: "Fault Finding", description: "Skilled troubleshooting and repair of electrical faults in systems and appliances." },
  { title: "Solar System", description: "Design, installation, and maintenance of solar power systems for sustainable energy solutions." },
  { title: "Geyser System", description: "Installation, repair, and maintenance of geysers and water heating systems for efficient hot water supply." },
  { title: "Electrical Maintenance", description: "Regular maintenance and inspection of electrical systems to prevent failures." },
  { title: "Lighting Installation", description: "Design and installation of indoor and outdoor lighting systems to enhance your space." },
  { title: "Electrical Repairs", description: "Prompt repair of electrical appliances, systems, and equipment for uninterrupted use." },
  { title: "Generator Installation", description: "Installation and maintenance of generators for backup power during outages." },
  { title: "Electrical Panel Upgrades", description: "Upgrading of electrical panels for increased capacity and safety." },
  { title: "Home Automation", description: "Installation of smart home systems for enhanced convenience and security." },
  { title: "Emergency Electrical Services", description: "24/7 emergency response for electrical issues, available as of today, July 02, 2025." },
  { title: "Energy Efficiency Audits", description: "Assessment and recommendations for improving energy efficiency in homes and businesses." },
];

export default function ServicesPage() {
  return (
    <div className="bg-primary/5">
      <div className="container py-12 md:py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Services</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Welcome to Junks Electrical Solutions, your trusted partner in electrical solutions since 2025! Based in Makhwibidung Village, Tzaneen, Limpopo, we are committed to “Lighting up your life with the Junks” through reliable, efficient, and innovative services. Explore our comprehensive range of services below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service) => (
            <Card key={service.title} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ServiceIcon serviceName={service.title} />
                </div>
                <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
              <CardFooter className="w-full">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
