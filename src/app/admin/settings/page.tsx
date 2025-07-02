
"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

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
  const [isSaving, setIsSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      toast({ title: 'Compressing image...', description: 'Please wait a moment.' });
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setHeroImageFile(compressedFile);
        toast({ title: 'Image ready', description: 'The compressed image is ready to be uploaded.' });
      } catch (error) {
        console.error('Error compressing image:', error);
        toast({ title: 'Compression Failed', description: 'Could not compress the image. Please try another file.', variant: 'destructive' });
        setHeroImageFile(null);
      }
    }
  };

  const handleSave = async () => {
    if (!storage) {
      toast({ title: 'Configuration Error', description: 'Firebase Storage is not properly configured. Check your environment variables.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    let updatedSettings = { ...settings };

    if (heroImageFile) {
      const storageRef = ref(storage, `site-assets/hero-image-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, heroImageFile);

      try {
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              updatedSettings.heroImageUrl = downloadURL;
              setHeroImageFile(null);
              setUploadProgress(0);
              resolve();
            }
          );
        });
      } catch (error) {
        toast({ title: 'Image Upload Failed', description: 'Could not upload the new hero image.', variant: 'destructive' });
        setIsSaving(false);
        return;
      }
    }

    try {
      const settingsRef = doc(db, 'settings', 'site');
      await setDoc(settingsRef, updatedSettings, { merge: true });
      toast({ title: 'Success', description: 'Settings saved successfully.' });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
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
        ...(prev?.socials ?? {}),
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
              <Input id="location" value={settings.location || ''} onChange={handleInputChange} disabled={isSaving}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={settings.phone || ''} onChange={handleInputChange} disabled={isSaving}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={settings.email || ''} onChange={handleInputChange} disabled={isSaving}/>
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
              <Input id="facebook" value={settings.socials?.facebook || ''} onChange={handleSocialChange} disabled={isSaving}/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X URL</Label>
              <Input id="twitter" value={settings.socials?.twitter || ''} onChange={handleSocialChange} disabled={isSaving}/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" value={settings.socials?.instagram || ''} onChange={handleSocialChange} disabled={isSaving}/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp URL (e.g., https://wa.me/123...)</Label>
              <Input id="whatsapp" value={settings.socials?.whatsapp || ''} onChange={handleSocialChange} disabled={isSaving}/>
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
              <Label htmlFor="heroImageUrl">Hero Image</Label>
              {heroImageFile ? (
                <div className="mt-2">
                    <Image src={URL.createObjectURL(heroImageFile)} alt="New Hero Image Preview" width={200} height={100} className="rounded-md object-cover" />
                </div>
              ) : settings.heroImageUrl && (
                <div className="mt-2">
                  <Image src={settings.heroImageUrl} alt="Hero Image Preview" width={200} height={100} className="rounded-md object-cover" />
                </div>
              )}
              <Input id="heroImageUrl" type="file" onChange={handleFileChange} accept="image/*" disabled={isSaving}/>
              <p className="text-sm text-muted-foreground">Select a new image to replace the current one. The new image will be uploaded when you save settings.</p>
              {isSaving && heroImageFile && <Progress value={uploadProgress} className="w-[60%] mt-2" />}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save All Settings'}
      </Button>
    </div>
  );
}
