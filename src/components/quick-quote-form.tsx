
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

interface Service {
    id: string;
    title: string;
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  service: z.string({ required_error: "Please select a service." }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

interface QuickQuoteFormProps {
  onSuccess: () => void;
}

export function QuickQuoteForm({ onSuccess }: QuickQuoteFormProps) {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
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
      await addDoc(collection(db, "messages"), {
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: `Quote Request: ${values.service}`,
        message: values.message,
        createdAt: serverTimestamp(),
        status: "New",
      });
      toast({
        title: "Quote Request Sent!",
        description: "Thank you for your interest. We'll get back to you with a quote shortly.",
      });
      form.reset();
      onSuccess(); // Close the dialog
    } catch (error) {
       console.error("Error sending quote request: ", error);
       toast({
        title: "Request Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
       });
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Junks Malatji" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="junksmalati@gmail.com" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="081 234 5678" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="service" render={({ field }) => (
                <FormItem>
                    <FormLabel>Service of Interest</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingServices}>
                    <FormControl><SelectTrigger><SelectValue placeholder={isLoadingServices ? "Loading services..." : "Select a service"} /></SelectTrigger></FormControl>
                    <SelectContent>
                        {services.map(s => <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>)}
                        <SelectItem value="Other Inquiry">Other Inquiry</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem>
                    <FormLabel>Describe Your Needs</FormLabel>
                    <FormControl><Textarea placeholder="Please provide some details about the work you need done..." className="min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending..." : "Request Quote"}
            </Button>
        </form>
    </Form>
  );
}
