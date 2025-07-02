
'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { ImagePlus } from 'lucide-react';

export function HeroImageEditor() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

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
    if (!heroImageFile) {
        toast({ title: 'No Image Selected', description: 'Please select an image file to upload.', variant: 'destructive' });
        return;
    }

    if (!storage) {
      toast({ title: 'Configuration Error', description: 'Firebase Storage is not properly configured.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    const storageRef = ref(storage, `site-assets/hero-image-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, heroImageFile);

    try {
      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload failed:', error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
      
      const settingsRef = doc(db, 'settings', 'site');
      await setDoc(settingsRef, { heroImageUrl: downloadURL }, { merge: true });
      
      toast({ title: 'Success', description: 'Hero image updated successfully.' });
      setHeroImageFile(null);
      setUploadProgress(0);
      setIsDialogOpen(false);

    } catch (error) {
      toast({ title: 'Image Upload Failed', description: 'Could not upload the new hero image.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetDialog = () => {
      setHeroImageFile(null);
      setUploadProgress(0);
      setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="absolute top-4 right-4 z-10 opacity-80 hover:opacity-100"
        >
          <ImagePlus className="mr-2" />
          Edit Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Hero Image</DialogTitle>
          <DialogDescription>
            Select a new image from your device to update the homepage hero section.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="heroImageFile">New Hero Image</Label>
            {heroImageFile && (
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(heroImageFile)}
                  alt="New Hero Image Preview"
                  width={200}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <Input id="heroImageFile" type="file" onChange={handleFileChange} accept="image/*" disabled={isSaving} />
            {isSaving && <Progress value={uploadProgress} className="w-full mt-2" />}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetDialog} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !heroImageFile}>
            {isSaving ? 'Uploading...' : 'Save & Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
