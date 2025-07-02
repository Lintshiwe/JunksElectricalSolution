
'use client';

import { IKUpload } from 'imagekitio-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ImageUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ImageKitUploaderProps {
  onSuccess: (filePath: string) => void;
  folder?: string;
}

export function ImageKitUploader({ onSuccess, folder = "junks-electrical" }: ImageKitUploaderProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <IKUpload
      folder={folder}
      useUniqueFileName={true}
      onSuccess={(res) => {
        toast({ title: "Upload Successful", description: "Image was uploaded." });
        onSuccess(res.filePath);
        setIsUploading(false);
      }}
      onError={(err) => {
        console.error("ImageKit Upload Error:", err);
        toast({
          title: "Upload Failed",
          description: "Could not upload image. Check console and ImageKit setup.",
          variant: "destructive",
        });
        setIsUploading(false);
      }}
      onUploadStart={() => {
        setIsUploading(true);
        toast({ title: "Uploading...", description: "Please wait for the image to upload." });
      }}
      className="inline-block"
      validateFile={(file) => file.size < 5000000} // 5MB file size limit
    >
      <Button variant="outline" disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <ImageUp className="mr-2 h-4 w-4" />
            Upload Image
          </>
        )}
      </Button>
    </IKUpload>
  );
}
