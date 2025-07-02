"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateServiceIcons } from '@/ai/flows/generate-service-icons';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface ServiceIconProps {
  serviceName: string;
}

const iconCache = new Map<string, string>();

export function ServiceIcon({ serviceName }: ServiceIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(iconCache.get(serviceName) || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (iconUrl) return;

    let isMounted = true;
    async function getIcon() {
      try {
        const result = await generateServiceIcons({
          serviceName,
          primaryColor: '#2E9AFE',
          accentColor: '#FFB347',
        });
        if (isMounted) {
          iconCache.set(serviceName, result.iconDataUri);
          setIconUrl(result.iconDataUri);
        }
      } catch (e) {
        console.error("Failed to generate icon for:", serviceName, e);
        if (isMounted) {
          setError("Icon Error");
        }
      }
    }

    getIcon();
    
    return () => {
      isMounted = false;
    };
  }, [serviceName, iconUrl]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full text-destructive" title={error}>
        <AlertCircle className="w-8 h-8" />
      </div>
    );
  }

  if (!iconUrl) {
    return <Skeleton className="w-16 h-16 rounded-full" />;
  }

  return (
    <div className="w-16 h-16 flex items-center justify-center">
        <Image
          src={iconUrl}
          alt={`${serviceName} icon`}
          width={64}
          height={64}
          className="object-cover rounded-md"
          unoptimized
        />
    </div>
  );
}
