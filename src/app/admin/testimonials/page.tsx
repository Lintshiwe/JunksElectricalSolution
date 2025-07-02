
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatarUrl?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const testimonialsData: Testimonial[] = [];
      snapshot.forEach(doc => testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(testimonialsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Firestore error reading testimonials:", error);
        toast({
            title: "Permission Denied",
            description: "Could not load testimonials. Please update your Firestore security rules to allow reads for the 'testimonials' collection.",
            variant: "destructive"
        });
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);
  
  const resetDialog = () => {
    setIsDialogOpen(false);
    setCurrentTestimonial({});
  }

  const handleSave = async () => {
    if (!currentTestimonial.name || !currentTestimonial.text) {
      toast({ title: "Validation Error", description: "Name and testimonial text are required.", variant: 'destructive' });
      return;
    }
    
    let testimonialData: Partial<Testimonial> = { 
        name: currentTestimonial.name,
        text: currentTestimonial.text,
        avatarUrl: currentTestimonial.avatarUrl
    };

    try {
      if (currentTestimonial.id) {
        const testimonialRef = doc(db, 'testimonials', currentTestimonial.id);
        await updateDoc(testimonialRef, testimonialData);
        toast({ title: "Success", description: "Testimonial updated successfully." });
      } else {
        await addDoc(collection(db, 'testimonials'), testimonialData);
        toast({ title: "Success", description: "Testimonial added successfully." });
      }
      resetDialog();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast({ title: "Error", description: "Failed to save testimonial.", variant: 'destructive' });
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      await deleteDoc(doc(db, 'testimonials', testimonialId));
      toast({ title: "Success", description: "Testimonial deleted successfully." });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({ title: "Error", description: "Failed to delete testimonial.", variant: 'destructive' });
    }
  };
  
  const openDialog = (testimonial?: Testimonial) => {
      setCurrentTestimonial(testimonial || {});
      setIsDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Manage Testimonials</h3>
          <p className="text-sm text-muted-foreground">Add, edit, or delete customer testimonials.</p>
        </div>
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetDialog() }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
              <DialogDescription>Fill in the details for the customer testimonial.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  placeholder="Junks Malatji"
                  value={currentTestimonial.name || ''}
                  onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="text">Testimonial Text</Label>
                <Textarea
                  id="text"
                  placeholder="Their service was amazing..."
                  value={currentTestimonial.text || ''}
                  onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, text: e.target.value }))}
                />
               </div>
               <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar Image URL</Label>
                 {currentTestimonial.avatarUrl && (
                    <div className="mt-2">
                        <Image src={currentTestimonial.avatarUrl} alt="Avatar Preview" width={64} height={64} className="rounded-full object-cover" />
                    </div>
                )}
                <Input 
                    id="avatarUrl"
                    placeholder="https://example.com/image.png"
                    value={currentTestimonial.avatarUrl || ''}
                    onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, avatarUrl: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Testimonial</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <Image 
                        src={testimonial.avatarUrl || `https://placehold.co/100x100.png`} 
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full h-10 w-10 object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{testimonial.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-md truncate">{testimonial.text}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(testimonial)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">No testimonials found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
