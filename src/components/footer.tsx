
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
    whatsapp: string;
  };
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.316 1.906 6.034l-1.225 4.428 4.387-1.149zM9.266 8.39l.119-.088c.221-.157.488-.248.762-.249.232.001.446.074.637.205.189.132.332.316.416.529.09.227.098.472.024.701l-.221.732c-.105.349-.033.738.188.99.303.348.65.652.998.898.221.157.488.248.762-.249.232.001.446.074.637.205.189.132.332.316.416.529.09.227.098.472.024.701l-.221.732c-.105.349-.033.738.188.99.303.348.65.652.998.898.349.247.738.318.989.132l.221-.732c-.105-.349.332-.738.188-.99-.303-.348-.65-.652-.998-.898-.221-.157-.488-.248-.762-.249-.232-.001-.446-.074-.637-.205-.189-.132-.332-.316-.416-.529-.09-.227-.098-.472-.024-.701l.221-.732c.105-.349.033-.738-.188-.99-.303-.348-.65-.652-.998-.898-.349-.247-.738-.318-1.09.132l-.221.732c-.105.349-.033.738.188.99.303.348.65.652.998.898.349.247.738.318.989.132l.221-.732z" />
    </svg>
);

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
                {settings.socials?.whatsapp && <Link href={settings.socials.whatsapp} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><WhatsAppIcon className="h-6 w-6" /></Link>}
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
