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
import { Home, Info, Layers } from 'lucide-react';
export default function Header() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [storedUser, setStoredUserState] = useState<Session['user'] | null>(null);

  useEffect(() => {
    setMounted(true);
    const user = getStoredUser();
    setStoredUserState(user);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setStoredUser(session.user);
      setStoredUserState(session.user);
    } else if (status === 'unauthenticated' && !storedUser) {
      removeStoredUser();
      setStoredUserState(null);
    }
  }, [session, status]);

  const isAuthenticated = !!(storedUser || session?.user);
  const isLoading = status === 'loading' && !storedUser;

  if (!mounted) {
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
            <Link
              href="/dashboard"
              className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Home
            </Link>
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
              <div className="animate-pulse flex items-center space-x-2">
                <div className="h-9 w-20 bg-muted rounded-md" />
              </div>
            </div>
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
            <Link
              href="/dashboard"
              className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Home
            </Link>
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
                  href="/auth?mode=login"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=register"
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