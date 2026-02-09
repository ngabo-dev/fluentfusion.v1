import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, UserType, TargetLanguage, NativeLanguage } from '../types';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

interface RegisterPageProps {
  onRegister: (user: User) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

export function RegisterPage({ onRegister, onNavigateToLogin, onBack }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '' as UserType,
    targetLanguage: '' as TargetLanguage,
    nativeLanguage: '' as NativeLanguage,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.userType || !formData.targetLanguage || !formData.nativeLanguage) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      // Call backend API
      const response = await api.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_type: formData.userType,
        target_language: formData.targetLanguage,
        native_language: formData.nativeLanguage,
      });

      // Transform backend response to frontend User type
      const newUser: User = {
        userId: response.user_id,
        username: response.username,
        email: response.email,
        userType: response.user_type,
        targetLanguage: response.target_language,
        nativeLanguage: response.native_language,
        joinedDate: response.created_at,
      };

      onRegister(newUser);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Start your language learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="johndoe"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="userType">I am a...</Label>
            <Select
              value={formData.userType}
              onValueChange={(value) => setFormData({ ...formData, userType: value as UserType })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tourist">Tourist (visiting Rwanda)</SelectItem>
                <SelectItem value="tourism_worker">Tourism Worker (in Rwanda)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetLanguage">I want to learn...</Label>
            <Select
              value={formData.targetLanguage}
              onValueChange={(value) => setFormData({ ...formData, targetLanguage: value as TargetLanguage })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select target language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nativeLanguage">My native language...</Label>
            <Select
              value={formData.nativeLanguage}
              onValueChange={(value) => setFormData({ ...formData, nativeLanguage: value as NativeLanguage })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select native language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="swahili">Swahili</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min. 8 characters"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
