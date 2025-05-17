'use client';

import UserProfile from '../components/UserProfile';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow p-6">
          <UserProfile />
        </div>
      </div>
    </div>
  );
} 