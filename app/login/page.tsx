'use client';

// Learning: Google OAuth with Supabase
// This replaces the mock authentication with real OAuth flow

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Error logging in:', error.message);
        alert('Failed to login with Google. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Fastbreak Event Dashboard</CardTitle>
          <CardDescription>
            Sign in with your Google account to access the sports event management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </span>
            )}
          </Button>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Secure authentication powered by Supabase</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
