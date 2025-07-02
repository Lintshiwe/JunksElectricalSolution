
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: Timestamp;
}

const statusOptions: Booking['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const statusColors: { [key in Booking['status']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Pending: 'outline',
  Confirmed: 'secondary',
  Completed: 'default',
  Cancelled: 'destructive',
};


export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [quoteContent, setQuoteContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const bookingsData: Booking[] = [];
        querySnapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
        });
        setBookings(bookingsData);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore error reading bookings:", err);
        setError("You don't have permission to view bookings. Please update your Firestore security rules to allow reads for authenticated users on the 'bookings' collection.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    try {
      await updateDoc(bookingRef, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Booking status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update booking status.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenQuoteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setQuoteContent(`Hi ${booking.name},\n\nThank you for your inquiry about our ${booking.service} service.\n\nPlease find the quotation below:\n\n- \n\nTotal: \n\nBest regards,\nThe Junks Electrical Solutions Team`);
    setIsQuoteDialogOpen(true);
  };
  
  const handleSendQuote = () => {
    if (!selectedBooking || !quoteContent) return;

    const subject = `Quotation for your inquiry: ${selectedBooking.service}`;
    const body = encodeURIComponent(quoteContent);
    const mailtoLink = `mailto:${selectedBooking.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    setIsQuoteDialogOpen(false);
    setSelectedBooking(null);
    setQuoteContent("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Manage Bookings</h3>
        <p className="text-sm text-muted-foreground">
          View and manage all service appointments.
        </p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permission Denied</AlertTitle>
          <AlertDescription>
           {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                   <TableCell>
                    <div>{booking.email}</div>
                    <div className="text-sm text-muted-foreground">{booking.phone}</div>
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{`${booking.date} at ${booking.time}`}</TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(newStatus: Booking['status']) => handleStatusChange(booking.id, newStatus)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue>
                           <Badge variant={statusColors[booking.status]}>{booking.status}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenQuoteDialog(booking)}>
                        <FileText className="mr-2 h-4 w-4"/>
                        Quote
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {error ? "Could not load data due to permission errors." : "No bookings found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create Quotation</DialogTitle>
              <DialogDescription>
                Draft a quotation for {selectedBooking?.name} for the service: {selectedBooking?.service}. This will open in your default email client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="quote-content">Quotation Details</Label>
                <Textarea 
                    id="quote-content"
                    value={quoteContent}
                    onChange={(e) => setQuoteContent(e.target.value)}
                    rows={15}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendQuote}>Send Quote via Email</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
