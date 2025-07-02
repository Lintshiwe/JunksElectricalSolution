
"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Settings {
  location: string;
  phone: string;
  email: string;
  heroImageUrl: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    whatsapp: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'site');
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Firestore error reading settings:", error);
        toast({
            title: "Permission Denied",
            description: "Could not load site settings due to Firestore permissions. Please update your security rules.",
            variant: "destructive"
        });
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const handleSave = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'site');
      await setDoc(settingsRef, settings, { merge: true });
      toast({ title: 'Success', description: 'Settings saved successfully.' });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({
      ...prev,
      socials: {
        ...prev?.socials,
        [id]: value,
      },
    }));
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Site Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your website's global information.</p>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>This information appears in the footer and on the contact page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Address</Label>
              <Input id="location" value={settings.location || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={settings.phone || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={settings.email || ''} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
             <CardDescription>Full URLs for your social media profiles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" value={settings.socials?.facebook || ''} onChange={handleSocialChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X URL</Label>
              <Input id="twitter" value={settings.socials?.twitter || ''} onChange={handleSocialChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" value={settings.socials?.instagram || ''} onChange={handleSocialChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp URL (e.g., https://wa.me/123...)</Label>
              <Input id="whatsapp" value={settings.socials?.whatsapp || ''} onChange={handleSocialChange} />
            </div>
          </CardContent>
        </Card>
        
         <Card>
          <CardHeader>
            <CardTitle>Homepage Settings</CardTitle>
             <CardDescription>Manage content on the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroImageUrl">Hero Image URL</Label>
              <Input id="heroImageUrl" value={settings.heroImageUrl || ''} onChange={handleInputChange} placeholder="https://example.com/image.png" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
