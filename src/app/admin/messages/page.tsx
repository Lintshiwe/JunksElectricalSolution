
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Archived';
  createdAt: Timestamp;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const messagesData: Message[] = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messagesData);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore error reading messages:", err);
        setError("You don't have permission to view messages. Please update your Firestore security rules to allow reads for authenticated users on the 'messages' collection.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "messages", messageId));
      toast({
        title: "Message Deleted",
        description: "The message was successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the message.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
      return (
          <div className="space-y-4">
              <Skeleton className="h-8 w-48"/>
              <Skeleton className="h-6 w-full"/>
              <div className="border rounded-md p-4 space-y-4">
                  <Skeleton className="h-10 w-full"/>
                  <Skeleton className="h-10 w-full"/>
                  <Skeleton className="h-10 w-full"/>
              </div>
          </div>
      )
  }

  if (error) {
    return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permission Denied</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contact Messages</h3>
        <p className="text-sm text-muted-foreground">
          View and delete messages from the contact form.
        </p>
      </div>
      
      {messages.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
            {messages.map((msg) => (
                <AccordionItem value={msg.id} key={msg.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4 items-center">
                            <div className='text-left'>
                                <div className="font-medium">{msg.name} - <span className="text-muted-foreground font-normal">{msg.subject}</span></div>
                                <div className="text-sm text-muted-foreground font-normal">{msg.email}</div>
                            </div>
                            <div className="text-sm text-muted-foreground font-normal">
                                {msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-md">
                        <p className="mb-4">{msg.message}</p>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(msg.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Message
                        </Button>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      ) : (
        <div className="h-24 flex items-center justify-center text-muted-foreground border rounded-md">
            No messages found.
        </div>
      )}
    </div>
  );
}
