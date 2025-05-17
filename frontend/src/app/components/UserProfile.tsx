'use client';
import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="animate-pulse p-4 bg-card rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-muted rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-4 bg-card rounded-lg text-center">
        <p className="text-foreground">Not logged in</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-card rounded-lg shadow-sm border border-border">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User avatar'}
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <User className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-foreground">
            {session.user.name || 'User'}
          </h3>
          <p className="text-sm text-foreground">{session.user.email}</p>
        </div>
      </div>
    </div>
  );
}