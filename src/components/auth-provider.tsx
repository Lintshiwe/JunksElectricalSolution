
"use client";

import { useState, useEffect, createContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only set up the auth state listener if Firebase was successfully configured.
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      // If Firebase isn't configured, we're not loading a user.
      setIsLoading(false);
    }
  }, []);
  
  // If Firebase is not configured, show a prominent error message instead of crashing.
  if (!isFirebaseConfigured) {
      return (
          <div className="bg-background text-foreground h-screen flex items-center justify-center">
              <div className="container max-w-2xl">
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Firebase Configuration Error</AlertTitle>
                      <AlertDescription>
                          <div className="space-y-2">
                            <p>Your application is not connected to Firebase because the required environment variables are missing or incorrect.</p>
                            <p>Please ensure that all <code>NEXT_PUBLIC_FIREBASE_*</code> variables in your <code>.env</code> file are correct.</p>
                            <p className="pt-2">You can find these keys in your Firebase project settings.</p>
                            <div className="pt-2">
                                <Button onClick={() => window.location.reload()}>Refresh After Updating .env</Button>
                            </div>
                          </div>
                      </AlertDescription>
                  </Alert>
              </div>
          </div>
      )
  }

  // This shows a loading skeleton while we're checking for a logged-in user.
  if (isLoading) {
    return (
        <div className="flex flex-col h-screen">
          <header className="border-b h-16 flex items-center">
            <div className="container flex justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-48" />
            </div>
          </header>
          <main className="flex-grow container py-8">
            <Skeleton className="h-96 w-full" />
          </main>
        </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
