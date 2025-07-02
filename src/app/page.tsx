
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, limit, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Award, Leaf, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceIcon } from '@/components/service-icon';
import { useAuth } from '@/hooks/use-auth';
import { HeroImageEditor } from '@/components/hero-image-editor';


const features = [
  {
    icon: <Zap className="w-10 h-10 text-accent" />,
    title: "Reliability",
    description: "We are available 24/7 for emergencies and provide dependable, regular maintenance.",
  },
  {
    icon: <Award className="w-10 h-10 text-accent" />,
    title: "Expertise",
    description: "Our team leverages top-quality skills with a cutting-edge approach to every project.",
  },
  {
    icon: <Leaf className="w-10 h-10 text-accent" />,
    title: "Sustainability",
    description: "We are committed to sustainable energy, specializing in solar and efficiency audits.",
  },
];

interface Service {
  id: string;
  title: string;
  description: string;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatarUrl?: string;
}

interface Settings {
  heroImageUrl?: string;
}


export default function Home() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

  useEffect(() => {
    const servicesQuery = query(collection(db, "services"), limit(4));
    const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
      const servicesData: Service[] = [];
      snapshot.forEach((doc) => servicesData.push({ id: doc.id, ...doc.data() } as Service));
      setServices(servicesData);
      setIsLoadingServices(false);
    }, () => setIsLoadingServices(false));

    const testimonialsQuery = query(collection(db, "testimonials"), orderBy("name"), limit(10));
    const unsubscribeTestimonials = onSnapshot(testimonialsQuery, (snapshot) => {
      const testimonialsData: Testimonial[] = [];
      snapshot.forEach((doc) => testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(testimonialsData);
      setIsLoadingTestimonials(false);
    }, (error) => {
        console.error("Failed to load testimonials:", error);
        setIsLoadingTestimonials(false);
    });
    
    const settingsDoc = doc(db, "settings", "site");
    const unsubscribeSettings = onSnapshot(settingsDoc, (doc) => {
        if(doc.exists()) {
            setSettings(doc.data() as Settings);
        }
    });

    return () => {
      unsubscribeServices();
      unsubscribeTestimonials();
      unsubscribeSettings();
    };
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  return (
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Light up your life with Junks Electrical Solutions
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Your trusted partner for electrical services in Tzaneen, Limpopo. We offer reliable, efficient, and innovative solutions for residential, commercial, and industrial needs.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/booking">Book a Service</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">View Services</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto lg:order-last">
              {isLoadingServices && !settings.heroImageUrl ? (
                <Skeleton className="aspect-video w-full max-w-[600px] rounded-xl" />
              ) : (
                <Image
                  src={settings.heroImageUrl || "https://placehold.co/600x400.png"}
                  width="600"
                  height="400"
                  alt="Hero"
                  data-ai-hint="electrician work"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                  priority
                />
              )}
              {user && <HeroImageEditor />}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Services</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">What We Can Do For You</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We offer a comprehensive range of electrical services to meet all your needs.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
            {isLoadingServices ? (
                Array.from({length: 4}).map((_, i) => (
                    <Card key={i} className="text-center items-center p-6">
                        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                        <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-5/6 mx-auto mt-2" />
                    </Card>
                ))
            ) : services.length > 0 ? (
                services.map((service) => (
                    <Card key={service.id} className="flex flex-col text-center items-center hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="items-center">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <ServiceIcon serviceName={service.title} />
                            </div>
                            <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{service.description}</p>
                        </CardContent>
                    </Card>
                ))
            ) : <p className="col-span-full text-center text-muted-foreground">No services found. Please add services in the admin panel.</p>}
          </div>
           <div className="text-center mt-12">
              <Button asChild>
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
        </div>
      </section>

      <section id="why-us" className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why Choose Us?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We are committed to providing excellent service and peace of mind.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-md items-start gap-8 sm:max-w-4xl sm:grid-cols-3 sm:gap-12 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-2">
                {feature.icon}
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl font-headline">What Our Customers Say</h2>
            {isLoadingTestimonials ? (
                <div className="w-full max-w-4xl mx-auto mt-12"><Skeleton className="h-64 w-full" /></div>
            ) : testimonials.length > 0 ? (
                <Carousel className="w-full max-w-4xl mx-auto mt-12" opts={{ loop: true }}>
                <CarouselContent>
                    {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.id}>
                        <div className="p-1">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                            <Avatar className="w-24 h-24 text-3xl">
                                <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                            </Avatar>
                            <p className="text-lg italic text-muted-foreground">"{testimonial.text}"</p>
                            <p className="font-semibold">- {testimonial.name}</p>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                </Carousel>
            ) : (
                <p className="text-center text-muted-foreground mt-8">No customer testimonials yet. Add one in the admin panel!</p>
            )
          }
        </div>
      </section>

      <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Power Up Your Project?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't wait for electrical problems to get worse. Contact us today for a free, no-obligation quote or book a service online.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/booking">Book a Service Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
