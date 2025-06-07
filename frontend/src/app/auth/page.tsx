// src/app/auth/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession, signOut } from 'next-auth/react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    // Set initial mode based on URL parameter
    useEffect(() => {
        const mode = searchParams.get('mode');
        setIsLogin(mode !== 'register');
    }, [searchParams]);

    // Handle session errors and redirects
    useEffect(() => {
        if (status === 'authenticated') {
            if (session?.error === 'RefreshAccessTokenError') {
                // If there's a refresh token error, sign out the user
                signOut({ redirect: false });
                setError('Your session has expired. Please log in again.');
            } else {
                router.push('/dashboard');
            }
        }
    }, [status, session, router]);

    // Don't render the page content if still checking auth status
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    // Don't render the page if authenticated and no errors
    if (status === 'authenticated' && !session?.error) {
        return null;
    }

    // Username validation function
    const validateUsername = (value: string) => {
        if (value.length < 3) {
            return 'Username must be at least 3 characters long';
        }
        if (value.length > 30) {
            return 'Username must be less than 30 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
    };

    // Handle username change with validation
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        setUsernameError(validateUsername(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate username before submission
        const usernameValidationError = validateUsername(username);
        if (!isLogin && usernameValidationError) {
            setUsernameError(usernameValidationError);
            setIsLoading(false);
            return;
        }
    
        if (!isLogin && password !== repeatPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }
    
        try {
            if (isLogin) {
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });
                
                if (result?.error) {
                    throw new Error(result.error);
                }
                
                router.push('/dashboard');
            } else {
                const response = await fetch('http://127.0.0.1:8000/auth/signup', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        repeat_password: repeatPassword
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Signup failed');
                }
                
                const loginResult = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });
                
                if (loginResult?.error) {
                    throw new Error(loginResult.error);
                }
                
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication error');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </h1>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`w-full p-2 border rounded ${
                    usernameError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  disabled={isLoading}
                  placeholder="Enter username (letters, numbers, underscores only)"
                />
                {usernameError && (
                  <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Repeat Password</label>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                if (isLogin) {
                  router.replace('/auth?mode=register');
                } else {
                  router.replace('/auth?mode=login');
                }
              }}
              className="text-blue-500 hover:text-blue-700 text-sm disabled:text-gray-400"
              disabled={isLoading}
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
}