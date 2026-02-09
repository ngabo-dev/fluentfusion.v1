import { Button } from './ui/button';
import { Card } from './ui/card';
import { BookOpen, Users, Award, Globe } from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            FluentFusion
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI-Driven Language Learning for Rwanda's Tourism Sector
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Bridge communication gaps • Empower communities • Enhance tourism experiences
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={onNavigateToRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Get Started
            </Button>
            <Button 
              onClick={onNavigateToLogin}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tourism-Focused Content</h3>
            <p className="text-gray-600 text-sm">
              Learn practical phrases for hotels, restaurants, transportation, and markets
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">For Everyone</h3>
            <p className="text-gray-600 text-sm">
              Designed for both tourists learning Kinyarwanda and tourism workers learning English
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Award className="w-12 h-12 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
            <p className="text-gray-600 text-sm">
              Earn badges, track scores, and see your improvement over time
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Globe className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered Learning</h3>
            <p className="text-gray-600 text-sm">
              Get personalized lesson recommendations based on your progress and goals
            </p>
          </Card>
        </div>

        {/* About Section */}
        <Card className="p-8 bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            About FluentFusion
          </h2>
          <p className="text-gray-700 mb-4">
            FluentFusion is designed to bridge communication gaps in Rwanda's thriving tourism sector.
            Whether you're a tourist wanting to connect with local communities or a tourism worker
            looking to serve international visitors better, FluentFusion provides practical,
            context-specific language learning.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-lg text-blue-800 mb-2">For Tourists</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Learn essential Kinyarwanda phrases</li>
                <li>Understand cultural context</li>
                <li>Navigate markets, hotels, and restaurants</li>
                <li>Connect with local communities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-800 mb-2">For Tourism Workers</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Master hospitality English</li>
                <li>Improve guest communication</li>
                <li>Enhance service quality</li>
                <li>Boost career opportunities</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join FluentFusion today and transform your language skills
          </p>
          <Button 
            onClick={onNavigateToRegister}
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg"
          >
            Create Free Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 FluentFusion - BSc Software Engineering Capstone Project</p>
          <p className="text-sm mt-2">Empowering Rwanda's Tourism Through Language</p>
        </div>
      </footer>
    </div>
  );
}
