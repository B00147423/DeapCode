'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Code2 } from 'lucide-react';
import { Session } from 'next-auth';
import { cn } from '@/lib/utils';
import { getStoredUser, setStoredUser, removeStoredUser } from '@/utils/cookies';
import UserProfileDropdown from './UserProfileDropdown';
import { ModeToggle } from './ui/mode-toggle';

export default function Header() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [storedUser, setStoredUserState] = useState<Session['user'] | null>(null);

  useEffect(() => {
    setMounted(true);
    setStoredUserState(getStoredUser());
  }, []);

  useEffect(() => {
    if (session?.user) {
      setStoredUser(session.user);
      setStoredUserState(session.user);
    } else if (status === 'unauthenticated') {
      removeStoredUser();
      setStoredUserState(null);
    }
  }, [session, status]);

  const isAuthenticated = !!(session?.user || storedUser);
  const isLoading = status === 'loading' && !storedUser;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-2 sm:px-4 md:container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Code2 className="h-6 w-6" />
              <span className="font-bold text-xl">CodeQuest</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold text-xl">CodeQuest</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/problems" className="text-sm font-medium transition-colors hover:text-primary">
              Problems
            </Link>
            <Link href="/explore" className="text-sm font-medium transition-colors hover:text-primary">
              Explore
            </Link>
            <Link href="/discuss" className="text-sm font-medium transition-colors hover:text-primary">
              Discuss
            </Link>
            <Link href="/contest" className="text-sm font-medium transition-colors hover:text-primary">
              Contest
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            {isLoading ? (
              <div className="animate-pulse flex items-center space-x-2">
                <div className="h-9 w-20 bg-muted rounded-md" />
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center min-w-0">
                <UserProfileDropdown />
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/auth"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?signup=true"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}