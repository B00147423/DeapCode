// src/app/api/auth/[...nextauth]/authOptions.ts
import type { NextAuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    access_token: string;
    refresh_token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

interface Credentials {
  email: string;
  password: string;
}

interface CustomUser extends User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  access_token: string;
  refresh_token: string;
}

// Use a consistent secret for development
const DEV_SECRET = 'supersecretkey123456789supersecretkey123456789';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials | undefined): Promise<CustomUser | null> {
        if (!credentials) {
          throw new Error('Credentials not provided');
        }

        try {
          const res = await fetch('http://127.0.0.1:8000/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Authentication failed');
          }
          
          const user = await res.json();
          return {
            id: user.id,
            name: user.username,
            email: user.email,
            image: user.image || null,
            access_token: user.access_token,
            refresh_token: user.refresh_token
          };
        } catch (e) {
          console.error('Auth error:', e);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          accessToken: user.access_token,
          refreshToken: user.refresh_token,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
      }
      
      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      
      // Access token has expired, try to refresh it silently
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/refresh', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            refresh_token: token.refreshToken
          })
        });
        
        if (!response.ok) {
          // If refresh fails, keep the existing token but mark it as needing refresh
          return {
            ...token,
            error: "RefreshAccessTokenError"
          };
        }
        
        const data = await response.json();
        
        return {
          ...token,
          accessToken: data.access_token,
          refreshToken: token.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
          error: undefined // Clear any previous errors
        };
      } catch (error) {
        // If refresh fails, keep the existing token but mark it as needing refresh
        return {
          ...token,
          error: "RefreshAccessTokenError"
        };
      }
    },
    async session({ session, token }) {
      // Only update session if we have a valid token
      if (token) {
        session.accessToken = token.accessToken;
        session.error = token.error;
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name || token.email?.split('@')[0],
          email: token.email,
          image: token.image,
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || DEV_SECRET,
  debug: process.env.NODE_ENV === 'development',
};