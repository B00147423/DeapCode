// src/app/auth/error/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Authentication Error
        </h1>
        <p className="mb-4">
          {error === 'CredentialsSignin' 
            ? 'Invalid credentials' 
            : 'Something went wrong during authentication'}
        </p>
        <a
          href="/auth"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Go back to login
        </a>
      </div>
    </div>
  );
}