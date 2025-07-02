
"use client";

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import imageCompression from 'browser-image-compression';
import { Copy, Check } from 'lucide-react';

export function ImageUrlConverter() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneratedUrl(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        toast({ title: 'Image ready', description: 'The compressed image is ready for upload.' });
      } catch (error) {
        console.error('Error compressing image:', error);
        toast({ title: 'Compression Failed', description: 'Could not compress the image.', variant: 'destructive' });
        setImageFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast({ title: 'No image selected', variant: 'destructive' });
      return;
    }
    if (!storage) {
      toast({ title: 'Configuration Error', description: 'Firebase Storage is not properly configured.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setGeneratedUrl(null);

    const storageRef = ref(storage, `uploads/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    try {
      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
      setGeneratedUrl(downloadURL);
      toast({ title: 'Upload Successful', description: 'URL has been generated.' });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({ title: 'Upload Failed', description: 'Please check storage rules and configuration.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageFile">1. Select an Image</Label>
        <Input id="imageFile" type="file" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
      </div>
      
      <Button onClick={handleUpload} disabled={isLoading || !imageFile}>
        {isLoading ? 'Uploading...' : '2. Generate URL'}
      </Button>

      {isLoading && <Progress value={uploadProgress} className="w-full mt-2" />}

      {generatedUrl && (
        <div className="space-y-2 pt-4">
            <Label>3. Copy Your URL</Label>
            <div className="flex gap-2 items-center">
                <Input value={generatedUrl} readOnly className="bg-muted"/>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                    {hasCopied ? <Check className="text-green-500"/> : <Copy />}
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
