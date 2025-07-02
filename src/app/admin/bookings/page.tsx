
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
              <TableHead className="text-right">Status</TableHead>
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
                  <TableCell className="text-right"><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
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
                  <TableCell className="text-right">
                    <Select
                      value={booking.status}
                      onValueChange={(newStatus: Booking['status']) => handleStatusChange(booking.id, newStatus)}
                    >
                      <SelectTrigger className="w-[120px] ml-auto">
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {error ? "Could not load data due to permission errors." : "No bookings found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
