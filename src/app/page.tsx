import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Lightbulb, Wrench, Home as HomeIcon, ShieldCheck, Zap, Star, Building2, Sun, Siren, Smartphone, Leaf, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: <Sun className="w-8 h-8 text-primary" />,
    title: "Solar Systems",
    description: "Sustainable solar power solutions for homes and businesses.",
  },
  {
    icon: <HomeIcon className="w-8 h-8 text-primary" />,
    title: "House Wiring",
    description: "Safe, professional wiring for new constructions and renovations.",
  },
  {
    icon: <Siren className="w-8 h-8 text-primary" />,
    title: "Emergency Services",
    description: "24/7 rapid response for all your urgent electrical needs.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: "Home Automation",
    description: "Integrate smart technology for a more connected home.",
  },
];

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

const testimonials = [
  {
    name: "Sarah L.",
    avatar: "SL",
    image: "https://placehold.co/100x100.png",
    text: "The Junks were a lifesaver! They fixed my power outage in the middle of the night. Professional, fast, and reasonably priced. Highly recommend!",
  },
  {
    name: "Mike R.",
    avatar: "MR",
    image: "https://placehold.co/100x100.png",
    text: "The team installed new lighting in our retail store. The difference is night and day! The project was completed on time and on budget. Fantastic work.",
  },
  {
    name: "Jennifer Chen",
    avatar: "JC",
    image: "https://placehold.co/100x100.png",
    text: "I hired them to install an EV charger. The process was seamless from the initial quote to the final installation. Very knowledgeable and friendly staff.",
  },
];

export default function Home() {
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
            <Image
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
              alt="Hero"
              data-ai-hint="electrician work"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
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
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {service.icon}
                  </div>
                  <CardTitle className="mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
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
          <Carousel className="w-full max-w-4xl mx-auto mt-12" opts={{ loop: true }}>
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                        <Avatar>
                           <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
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
