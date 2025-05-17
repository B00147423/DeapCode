'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell,
  CreditCard,
  Home,
  Layers,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserProfileDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const user = session?.user;
  // const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Notification bell */}
      <button 
        className="p-1.5 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 mr-2 relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-900" />
      </button>
      
      {/* User dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 py-1 px-1.5 rounded-full transition-all duration-200",
          isOpen ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user?.image ? (
          <div className="relative h-7 w-7 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={user.image}
              alt={user.name || 'User avatar'}
              fill
              className="object-cover"
              sizes="28px"
            />
          </div>
        ) : (
          <div className="h-7 w-7 rounded-full dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
        )}
        <span className="text-sm text-black dark:text-white font-medium max-w-[80px] truncate">{user?.name || user?.email?.split('@')[0]}</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-black dark:text-white transition-transform duration-200 flex-shrink-0",
            isOpen && "transform rotate-180"
          )} 
        />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-2 mb-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
            <p className="text-sm font-medium text-black dark:text-white truncate">{user?.email}</p>
          </div>
          
          {/* Navigation Links - visible on mobile only */}
          <div className="md:hidden border-b border-gray-100 dark:border-gray-800">
            <Link 
              href="/problems"
              className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Layers className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Problems
            </Link>
            <Link 
              href="/explore"
              className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Home className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Explore
            </Link>
            <Link 
              href="/discuss"
              className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Info className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Discuss
            </Link>
            <Link 
              href="/contest"
              className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Contest
            </Link>
          </div>
          
          <Link 
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            onClick={() => setIsOpen(false)}
          >
            <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Your Profile
          </Link>
          
          <Link 
            href="/settings"
            className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Settings
          </Link>
          
          <Link 
            href="/billing"
            className="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            onClick={() => setIsOpen(false)}
          >
            <CreditCard className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Billing
          </Link>
          
          <div className="border-t border-gray-100 dark:border-gray-800 mt-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <LogOut className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}