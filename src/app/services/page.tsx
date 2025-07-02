
"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';

// Metadata is now static since the page is a client component
// For dynamic metadata on a client page, you would typically use a different approach
// such as setting document.title in a useEffect hook.
/*
export const metadata: Metadata = {
  title: 'Our Electrical Services',
  description: 'Explore the wide range of professional electrical services we offer, from residential wiring to commercial installations and emergency repairs.',
};
*/

interface Service {
    id: string;
    title: string;
    description: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Our Services | Junks Electrical Solutions';
    const q = query(collection(db, "services"), orderBy("title"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const servicesData: Service[] = [];
        snapshot.forEach(doc => {
            servicesData.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(servicesData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching services:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
          {isLoading ? (
            Array.from({length: 6}).map((_, i) => (
                <Card key={i} className="flex flex-col text-center items-center p-6">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Skeleton className="h-6 w-1/2 mt-4" />
                    <Skeleton className="h-4 w-full mt-4" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                    <Skeleton className="h-10 w-full mt-6" />
                </Card>
            ))
          ) : services.length > 0 ? (
            services.map((service) => (
              <Card key={service.id} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300">
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
            ))
          ) : (
             <p className="col-span-full text-center text-muted-foreground">No services are available at the moment. Please check back later.</p>
          )}
        </div>
      </div>
    </div>
  );
}
