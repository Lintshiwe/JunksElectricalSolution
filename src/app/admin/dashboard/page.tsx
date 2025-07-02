
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BookMarked, MessageSquare } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Booking {
  id: string;
  name: string;
  service: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

interface Message {
  id: string;
  name: string;
  subject: string;
  createdAt: Timestamp;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ bookings: 0, messages: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bookings listener
    const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5));
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      setStats(prev => ({...prev, bookings: snapshot.size}));
      
      const recent: Booking[] = [];
      snapshot.docs.forEach(doc => recent.push({ id: doc.id, ...doc.data() } as Booking));
      setRecentBookings(recent);
      
      setIsLoading(false);
    });

    // Messages listener
    const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(5));
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
       const messagesData: Message[] = [];
       snapshot.forEach((doc) => {
         messagesData.push({ id: doc.id, ...doc.data() } as Message);
       });
      setRecentMessages(messagesData);

      // Get total count for stats
      const allMessagesQuery = query(collection(db, 'messages'));
      onSnapshot(allMessagesQuery, (allMessagesSnapshot) => {
        setStats(prev => ({...prev, messages: allMessagesSnapshot.size}));
      });

      setIsLoading(false);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeMessages();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Overview</h3>
        <p className="text-sm text-muted-foreground">
          A summary of your website's recent activity.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.bookings}</div>}
            <p className="text-xs text-muted-foreground">Latest bookings.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.messages}</div>}
            <p className="text-xs text-muted-foreground">Total messages in inbox.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently logged in.</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-40 w-full" /> : (
              recentBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell><Badge variant={booking.status === 'Completed' ? 'default' : 'secondary'}>{booking.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <p className="text-muted-foreground">No bookings yet.</p>
            )}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-40 w-full" /> : (
              recentMessages.length > 0 ? (
                <div className="space-y-4">
                  {recentMessages.map(msg => (
                    <div key={msg.id} className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{msg.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{msg.subject}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted-foreground">No messages yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
