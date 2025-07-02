
"use client";

import { useState, useEffect, createContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
