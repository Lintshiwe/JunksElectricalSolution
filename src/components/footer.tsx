
"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Lightbulb, Facebook, Twitter, Instagram } from "lucide-react";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Settings {
  location: string;
  phone: string;
  email: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

export function Footer() {
  const [settings, setSettings] = useState<Partial<Settings>>({});

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'site');
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as Settings);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-4">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg font-headline">Junks Electrical Solutions</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Light up your life with The Junks. Providing safe, reliable, and high-quality electrical services for our community.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/booking" className="text-muted-foreground hover:text-primary transition-colors">Book Online</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>{settings.location || 'Makhwibidung Village Stand No 54, Tzaneen, Limpopo'}</p>
              <p>Email: {settings.email || 'junksmalati@gmail.com'}</p>
              <p>Phone: {settings.phone || '081 075 5476 / 082 738 8845'}</p>
              <div className="flex space-x-4 pt-2">
                {settings.socials?.facebook && <Link href={settings.socials.facebook} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></Link>}
                {settings.socials?.twitter && <Link href={settings.socials.twitter} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></Link>}
                {settings.socials?.instagram && <Link href={settings.socials.instagram} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></Link>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Junks (Pty) Ltd. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
