
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

interface Service {
    id: string;
    title: string;
}

const timeSlots = ["9:00 AM - 11:00 AM", "11:00 AM - 1:00 PM", "1:00 PM - 3:00 PM", "3:00 PM - 5:00 PM"];

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  service: z.string({ required_error: "Please select a service." }),
  details: z.string().optional(),
  date: z.date({ required_error: "A date is required." }),
  time: z.string({ required_error: "Please select a time slot." }),
});

export function BookingForm() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      details: "",
    },
  });

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const servicesData: Service[] = [];
        snapshot.forEach(doc => servicesData.push({ id: doc.id, title: doc.data().title }));
        setServices(servicesData);
        setIsLoadingServices(false);
    });
    return () => unsubscribe();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addDoc(collection(db, "bookings"), {
        ...values,
        date: format(values.date, "yyyy-MM-dd"), // Store date as a string for consistency
        createdAt: serverTimestamp(),
        status: "Pending",
      });

      toast({
        title: "Appointment Booked!",
        description: `We've scheduled your service for ${format(values.date, "PPP")} at ${values.time}. We'll send a confirmation email to ${values.email}.`,
      });
      form.reset();
    } catch (error) {
       console.error("Error adding document: ", error);
       toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
       });
    }
  }

  return (
    <div className="bg-primary/5">
      <div className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Schedule Your Service</CardTitle>
              <CardDescription className="text-lg">Fill out the form below to book your appointment online.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline">1. Your Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                      <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="081 234 5678" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline">2. Service Details</h3>
                     <FormField control={form.control} name="service" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Required</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingServices}>
                            <FormControl><SelectTrigger><SelectValue placeholder={isLoadingServices ? "Loading services..." : "Select a service"} /></SelectTrigger></FormControl>
                            <SelectContent>
                              {services.map(s => <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>)}
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    <FormField control={form.control} name="details" render={({ field }) => (
                        <FormItem><FormLabel>Additional Details</FormLabel><FormControl><Textarea placeholder="Provide any additional information about your project..." {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold font-headline">3. Choose Date & Time</h3>
                     <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="date" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Appointment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date("1900-01-01")} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="time" render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Available Time Slots</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                                {timeSlots.map(slot => (
                                  <FormItem key={slot} className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value={slot} /></FormControl>
                                    <FormLabel className="font-normal">{slot}</FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                     </div>
                  </div>
                  
                  <Button type="submit" className="w-full text-lg p-6 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                     {form.formState.isSubmitting ? "Booking..." : "Confirm Appointment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
