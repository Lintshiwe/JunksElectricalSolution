
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Service {
  id: string;
  title: string;
  description: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData: Service[] = [];
      snapshot.forEach(doc => servicesData.push({ id: doc.id, ...doc.data() } as Service));
      setServices(servicesData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!currentService.title || !currentService.description) {
      toast({ title: "Validation Error", description: "Title and description are required.", variant: 'destructive' });
      return;
    }
    
    try {
      if (currentService.id) {
        // Update
        const serviceRef = doc(db, 'services', currentService.id);
        await updateDoc(serviceRef, { title: currentService.title, description: currentService.description });
        toast({ title: "Success", description: "Service updated successfully." });
      } else {
        // Create
        await addDoc(collection(db, 'services'), { title: currentService.title, description: currentService.description });
        toast({ title: "Success", description: "Service added successfully." });
      }
      setIsDialogOpen(false);
      setCurrentService({});
    } catch (error) {
      console.error("Error saving service:", error);
      toast({ title: "Error", description: "Failed to save service.", variant: 'destructive' });
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      toast({ title: "Success", description: "Service deleted successfully." });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({ title: "Error", description: "Failed to delete service.", variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Manage Services</h3>
          <p className="text-sm text-muted-foreground">Add, edit, or delete your company's services.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentService({})}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentService.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              <DialogDescription>Fill in the details for the service.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Service Title"
                value={currentService.title || ''}
                onChange={(e) => setCurrentService(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Service Description"
                value={currentService.description || ''}
                onChange={(e) => setCurrentService(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-md truncate">{service.description}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={isDialogOpen && currentService.id === service.id} onOpenChange={(open) => { if (!open) setCurrentService({}); setIsDialogOpen(open); }}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => { setCurrentService(service); setIsDialogOpen(true); }}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">No services found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
