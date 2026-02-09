import { useState } from 'react';
import { Navigation } from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, UserType, TargetLanguage } from '../types';
import { UserCircle, Edit2, Save, X } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigateToDashboard: () => void;
  onNavigateToLessons: () => void;
  onNavigateToProgress: () => void;
  onNavigateToChatbot: () => void;
  onLogout: () => void;
}

export function ProfilePage({
  user,
  onUpdateUser,
  onNavigateToDashboard,
  onNavigateToLessons,
  onNavigateToProgress,
  onNavigateToChatbot,
  onLogout,
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    userType: user.userType,
    targetLanguage: user.targetLanguage,
  });

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      username: formData.username,
      email: formData.email,
      userType: formData.userType,
      targetLanguage: formData.targetLanguage,
    };

    // Update in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    // Update users list
    const usersJson = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersJson);
    const userIndex = users.findIndex((u: User) => u.userId === user.userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem('users', JSON.stringify(users));
    }

    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      userType: user.userType,
      targetLanguage: user.targetLanguage,
    });
    setIsEditing(false);
  };

  const memberSince = new Date(user.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="profile"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToLessons={onNavigateToLessons}
        onNavigateToProgress={onNavigateToProgress}
        onNavigateToProfile={() => {}}
        onNavigateToChatbot={onNavigateToChatbot}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCircle className="w-16 h-16 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.username}</h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {memberSince}</p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>

          <div className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-2"
                />
              ) : (
                <p className="mt-2 text-gray-900">{user.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                />
              ) : (
                <p className="mt-2 text-gray-900">{user.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="userType">User Type</Label>
              {isEditing ? (
                <Select
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value as UserType })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourist">Tourist</SelectItem>
                    <SelectItem value="tourism_worker">Tourism Worker</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2 text-gray-900 capitalize">
                  {user.userType === 'tourism_worker' ? 'Tourism Worker' : 'Tourist'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="targetLanguage">Target Language</Label>
              {isEditing ? (
                <Select
                  value={formData.targetLanguage}
                  onValueChange={(value) => setFormData({ ...formData, targetLanguage: value as TargetLanguage })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2 text-gray-900 capitalize">{user.targetLanguage}</p>
              )}
            </div>

            <div>
              <Label>User ID</Label>
              <p className="mt-2 text-gray-600 text-sm font-mono">{user.userId}</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </Card>

        {/* Additional Settings */}
        <Card className="p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Daily Reminder</p>
                <p className="text-sm text-gray-600">Get notified to practice daily</p>
              </div>
              <div className="text-sm text-gray-500">Coming soon</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Audio Pronunciation</p>
                <p className="text-sm text-gray-600">Enable voice playback for words</p>
              </div>
              <div className="text-sm text-gray-500">Coming soon</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Offline Mode</p>
                <p className="text-sm text-gray-600">Download lessons for offline access</p>
              </div>
              <div className="text-sm text-gray-500">Coming soon</div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-8 mt-8 border-red-200">
          <h3 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Reset Progress</p>
                <p className="text-sm text-gray-600">Clear all your learning data</p>
              </div>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                Reset
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-600">Permanently delete your account</p>
              </div>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
