import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { User } from '../types';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      // Call backend API
      const response = await api.login(username, password);

      // Transform backend response to frontend User type
      const user: User = {
        userId: response.user.user_id,
        username: response.user.username,
        email: response.user.email,
        userType: response.user.user_type,
        targetLanguage: response.user.target_language,
        nativeLanguage: response.user.native_language,
        joinedDate: response.user.created_at,
      };

      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-gray-700 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Username: tourist</p>
          <p className="text-xs text-gray-600">Password: demo123</p>
        </div>
      </Card>
    </div>
  );
}
