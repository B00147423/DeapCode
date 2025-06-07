'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Home, Info, Layers } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export default function MobileMenu({ isOpen, isAuthenticated, isLoading }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle animation when opening/closing
  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        menuRef.current.style.maxHeight = `${menuRef.current.scrollHeight}px`;
      } else {
        menuRef.current.style.maxHeight = '0px';
      }
    }
  }, [isOpen]);

  return (
    <div 
      ref={menuRef}
      className={cn(
        "fixed md:hidden left-0 right-0 z-40 w-full overflow-hidden transition-all duration-300 ease-in-out max-h-0 border-t border-gray-100 dark:border-gray-800 shadow-lg",
        isOpen ? "bg-white dark:bg-gray-900" : "bg-transparent"
      )}
      style={{
        top: '64px', // Matches header height (h-16 = 64px)
      }}
    >
      <div className="px-4 py-2 space-y-2">
        {/* Navigation Links */}
        <div className="py-2 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
            <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Home
          </Link>

          
          <Link
            href="/features"
            className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
          >
            <Layers className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Features
          </Link>
          <Link
            href="/about"
            className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
          >
            <Info className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            About
          </Link>
        </div>
        
        {/* Only show auth buttons for non-authenticated users */}
        {!isAuthenticated && !isLoading && (
          <div className="space-y-2 p-2 md:hidden">
            <Button 
              asChild
              variant="outline"
              className="w-full justify-center font-medium border-gray-200 dark:border-gray-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button 
              asChild
              className="w-full justify-center bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-medium text-white"
            >
              <Link href="/auth?signup=true">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}