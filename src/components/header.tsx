
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Lightbulb, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { QuickQuoteForm } from './quick-quote-form';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/booking', label: 'Book Online' },
  { href: '/contact', label: 'Contact Us' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out successfully" });
      router.push('/');
    } catch (error) {
      toast({ title: "Logout failed", description: "Please try again.", variant: "destructive"});
    }
  };

  const openQuoteDialog = () => {
    setIsMobileMenuOpen(false);
    setIsQuoteDialogOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">Junks Electrical</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link 
                href="/admin/dashboard" 
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname.startsWith('/admin') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button onClick={openQuoteDialog} className="hidden md:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground">
                Get a Quote
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="mr-6 flex items-center space-x-2 mb-6">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  <span className="font-bold inline-block font-headline">Junks Electrical</span>
                </Link>
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-lg transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary font-semibold" : ""
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-lg transition-colors hover:text-primary",
                          pathname.startsWith('/admin') ? "text-primary font-semibold" : ""
                        )}
                      >
                        Dashboard
                      </Link>
                    )}
                </div>
                {!user && (
                  <Button onClick={openQuoteDialog} className="w-full mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                    Get a Quote
                  </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Request a Quick Quote</DialogTitle>
                <DialogDescription>
                    Fill out this quick form and we'll get back to you shortly.
                </DialogDescription>
            </DialogHeader>
            <QuickQuoteForm onSuccess={() => setIsQuoteDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
