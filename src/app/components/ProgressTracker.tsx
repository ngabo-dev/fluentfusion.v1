import { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { User, UserProgress, Badge } from '../types';
import { mockLessons, mockBadges } from '../data/mockData';
import { Trophy, Calendar, Clock, Target, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ProgressTrackerProps {
  user: User;
  onNavigateToDashboard: () => void;
  onNavigateToLessons: () => void;
  onNavigateToProfile: () => void;
  onNavigateToChatbot: () => void;
  onLogout: () => void;
}

export function ProgressTracker({
  user,
  onNavigateToDashboard,
  onNavigateToLessons,
  onNavigateToProfile,
  onNavigateToChatbot,
  onLogout,
}: ProgressTrackerProps) {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // Load user progress
    const savedProgress = localStorage.getItem('userProgress') || '[]';
    const allProgress: UserProgress[] = JSON.parse(savedProgress);
    const myProgress = allProgress.filter(p => p.userId === user.userId);
    setUserProgress(myProgress);

    // Calculate earned badges
    calculateBadges(myProgress);
  }, [user.userId]);

  const calculateBadges = (progress: UserProgress[]) => {
    const earned: Badge[] = [];

    // First Steps - Complete first lesson
    if (progress.length >= 1) {
      const badge = mockBadges.find(b => b.badgeId === 'B001');
      if (badge) earned.push({ ...badge, earnedDate: progress[0].completedAt });
    }

    // Conversationalist - Complete 5 lessons
    if (progress.length >= 5) {
      const badge = mockBadges.find(b => b.badgeId === 'B002');
      if (badge) earned.push({ ...badge, earnedDate: progress[4].completedAt });
    }

    // Language Enthusiast - Complete 10 lessons
    if (progress.length >= 10) {
      const badge = mockBadges.find(b => b.badgeId === 'B003');
      if (badge) earned.push({ ...badge, earnedDate: progress[9].completedAt });
    }

    // Perfect Score - Score 100% on any lesson
    const perfectScore = progress.find(p => p.score === 100);
    if (perfectScore) {
      const badge = mockBadges.find(b => b.badgeId === 'B004');
      if (badge) earned.push({ ...badge, earnedDate: perfectScore.completedAt });
    }

    // Quick Learner - Complete lesson in under 10 minutes
    const quickLesson = progress.find(p => p.timeSpent < 600);
    if (quickLesson) {
      const badge = mockBadges.find(b => b.badgeId === 'B005');
      if (badge) earned.push({ ...badge, earnedDate: quickLesson.completedAt });
    }

    setEarnedBadges(earned);
  };

  // Calculate statistics
  const totalLessons = userProgress.length;
  const averageScore = totalLessons > 0
    ? userProgress.reduce((sum, p) => sum + p.score, 0) / totalLessons
    : 0;
  const totalTime = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);
  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);

  // Prepare chart data
  const scoreData = userProgress.map((p, index) => {
    const lesson = mockLessons.find(l => l.lessonId === p.lessonId);
    return {
      name: `L${index + 1}`,
      score: p.score,
      lessonTitle: lesson?.title || 'Unknown',
    };
  });

  const categoryData = userProgress.reduce((acc, p) => {
    const lesson = mockLessons.find(l => l.lessonId === p.lessonId);
    if (lesson) {
      const category = lesson.category;
      if (!acc[category]) {
        acc[category] = { category, count: 0, avgScore: 0, totalScore: 0 };
      }
      acc[category].count++;
      acc[category].totalScore += p.score;
      acc[category].avgScore = acc[category].totalScore / acc[category].count;
    }
    return acc;
  }, {} as Record<string, { category: string; count: number; avgScore: number; totalScore: number }>);

  const categoryChartData = Object.values(categoryData).map(d => ({
    category: d.category.charAt(0).toUpperCase() + d.category.slice(1),
    lessons: d.count,
    avgScore: d.avgScore.toFixed(0),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="progress"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToLessons={onNavigateToLessons}
        onNavigateToProgress={() => {}}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToChatbot={onNavigateToChatbot}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(0)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Invested</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hours > 0 ? `${hours}h ` : ''}{minutes}m
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900">{earnedBadges.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements & Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockBadges.map(badge => {
              const earned = earnedBadges.find(b => b.badgeId === badge.badgeId);
              return (
                <div
                  key={badge.badgeId}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    earned
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                  {earned && earned.earnedDate && (
                    <p className="text-xs text-green-600 font-semibold">
                      ✓ Earned
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Charts */}
        {userProgress.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Score Progression</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-semibold">{payload[0].payload.lessonTitle}</p>
                              <p className="text-blue-600">Score: {payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Lessons by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="lessons" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {userProgress.slice(-10).reverse().map((progress, index) => {
                  const lesson = mockLessons.find(l => l.lessonId === progress.lessonId);
                  if (!lesson) return null;

                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          progress.score >= 80 ? 'bg-green-500' :
                          progress.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-semibold text-gray-900">{lesson.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(progress.completedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{progress.score.toFixed(0)}%</p>
                        <p className="text-sm text-gray-600">
                          {Math.floor(progress.timeSpent / 60)}m {progress.timeSpent % 60}s
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {userProgress.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Progress Yet</h3>
            <p className="text-gray-600 mb-6">Start learning to see your progress here</p>
            <button
              onClick={onNavigateToLessons}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Lessons
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
