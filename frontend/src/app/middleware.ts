// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth',
      error: '/auth/error',
    },
  }
);

// Applies this middleware only to matching paths
export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    // Add other protected routes here
  ],
};