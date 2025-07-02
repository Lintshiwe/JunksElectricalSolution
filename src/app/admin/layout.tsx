
"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarNav } from '@/components/admin-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { IKContext } from 'imagekitio-react';

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
  },
  {
    title: "Messages",
    href: "/admin/messages",
  },
  {
    title: "Services",
    href: "/admin/services",
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
  },
    {
    title: "Settings",
    href: "/admin/settings",
  },
];

const ikPublicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const ikUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

// The authenticator function is a client-side function that calls our backend
// to get the security parameters for uploading.
const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit/auth');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, token, expire } = data;
        return { signature, token, expire };
    } catch (error) {
        // We have to cast the error to access message property
        const message = (error as Error).message || 'Unknown error';
        throw new Error(`Authentication request failed: ${message}`);
    }
};


export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // You can render a loading spinner here
    return <div className='container py-20'>Loading...</div>;
  }
  
  if (!ikPublicKey || !ikUrlEndpoint) {
      return (
          <div className="container py-20 text-center">
              <h1 className="text-2xl font-bold text-destructive">Configuration Error</h1>
              <p className="text-muted-foreground">ImageKit is not configured. Please add `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` and `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` to your environment variables.</p>
          </div>
      )
  }

  return (
    <IKContext
      publicKey={ikPublicKey}
      urlEndpoint={ikUrlEndpoint}
      authenticator={authenticator}
    >
      <div className="container py-12 md:py-20">
        <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
            <p className="text-muted-foreground">
              Manage your website content and view activity.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-4xl">{children}</div>
          </div>
      </div>
    </IKContext>
  );
}
