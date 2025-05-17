"use client";
import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {session?.user ? (
          <>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Welcome, {session.user.name || session.user.email || 'User'}!
            </h1>
            <p className="mt-4 text-black dark:text-white">
              This is your dashboard. You can add your content here.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Welcome to the Dashboard
            </h1>
            <p className="mt-4 text-black dark:text-white">
              Sign in to access your personalized dashboard and features.
            </p>
          </>
        )}
      </main>
    </div>
  );
}