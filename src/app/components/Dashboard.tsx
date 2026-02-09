import { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { User, UserProgress, Lesson, Recommendation } from '../types';
import { mockLessons, getLessonsForUser } from '../data/mockData';
import { Trophy, BookOpen, Target, TrendingUp, Sparkles } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigateToLessons: () => void;
  onNavigateToProgress: () => void;
  onNavigateToProfile: () => void;
  onNavigateToChatbot: () => void;
  onViewLesson: (lessonId: string) => void;
  onLogout: () => void;
}

export function Dashboard({
  user,
  onNavigateToLessons,
  onNavigateToProgress,
  onNavigateToProfile,
  onNavigateToChatbot,
  onViewLesson,
  onLogout,
}: DashboardProps) {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('userProgress') || '[]';
    const allProgress: UserProgress[] = JSON.parse(savedProgress);
    const myProgress = allProgress.filter(p => p.userId === user.userId);
    setUserProgress(myProgress);

    // Generate recommendations using simple ML-like algorithm
    generateRecommendations(myProgress);
  }, [user.userId]);

  const generateRecommendations = (progress: UserProgress[]) => {
    const availableLessons = getLessonsForUser(user.userType, user.targetLanguage);
    const completedLessonIds = progress.map(p => p.lessonId);
    const incompleteLessons = availableLessons.filter(l => !completedLessonIds.includes(l.lessonId));

    // Simple recommendation algorithm
    const recs: Recommendation[] = [];

    if (progress.length === 0) {
      // New user - recommend beginner lessons
      const beginnerLessons = incompleteLessons.filter(l => l.difficulty === 'beginner');
      beginnerLessons.slice(0, 3).forEach((lesson, idx) => {
        recs.push({
          lessonId: lesson.lessonId,
          reason: idx === 0 ? 'Perfect for beginners' : 'Continue with basics',
          confidence: 0.9 - (idx * 0.1),
        });
      });
    } else {
      // Existing user - recommend based on performance and difficulty
      const avgScore = progress.reduce((sum, p) => sum + p.score, 0) / progress.length;
      const lastLesson = availableLessons.find(l => l.lessonId === progress[progress.length - 1].lessonId);

      if (avgScore >= 80) {
        // Good performance - suggest same or higher difficulty
        const nextDifficulty = lastLesson?.difficulty === 'beginner' ? 'intermediate' : 'advanced';
        const nextLessons = incompleteLessons.filter(l => 
          l.difficulty === lastLesson?.difficulty || l.difficulty === nextDifficulty
        );
        
        nextLessons.slice(0, 3).forEach((lesson, idx) => {
          recs.push({
            lessonId: lesson.lessonId,
            reason: idx === 0 ? 'Based on your excellent progress' : 'Recommended for you',
            confidence: 0.85 - (idx * 0.1),
          });
        });
      } else {
        // Lower performance - suggest similar difficulty
        const sameDifficulty = incompleteLessons.filter(l => l.difficulty === lastLesson?.difficulty);
        sameDifficulty.slice(0, 3).forEach((lesson, idx) => {
          recs.push({
            lessonId: lesson.lessonId,
            reason: 'Practice makes perfect',
            confidence: 0.75 - (idx * 0.1),
          });
        });
      }
    }

    setRecommendations(recs);
  };

  const completedLessons = userProgress.length;
  const availableLessons = getLessonsForUser(user.userType, user.targetLanguage);
  const totalLessons = availableLessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const averageScore = userProgress.length > 0
    ? userProgress.reduce((sum, p) => sum + p.score, 0) / userProgress.length
    : 0;

  const totalTimeSpent = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);
  const hoursSpent = Math.floor(totalTimeSpent / 3600);
  const minutesSpent = Math.floor((totalTimeSpent % 3600) / 60);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="dashboard"
        onNavigateToDashboard={onNavigateToLessons}
        onNavigateToLessons={onNavigateToLessons}
        onNavigateToProgress={onNavigateToProgress}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToChatbot={onNavigateToChatbot}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-gray-600">
            {user.userType === 'tourist' 
              ? `Continue your Kinyarwanda learning journey`
              : `Keep improving your ${user.targetLanguage} skills`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{completedLessons}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
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
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hoursSpent > 0 ? `${hoursSpent}h ` : ''}{minutesSpent}m
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{progressPercentage.toFixed(0)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Learning Journey</h2>
              <p className="text-sm text-gray-600">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </Card>

        {/* AI Recommendations */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Based on your progress and learning patterns, we recommend these lessons:
          </p>
          
          {recommendations.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map((rec) => {
                const lesson = mockLessons.find(l => l.lessonId === rec.lessonId);
                if (!lesson) return null;

                return (
                  <Card key={rec.lessonId} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {(rec.confidence * 100).toFixed(0)}% match
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>⏱️ {lesson.duration} min</span>
                      <span>📚 {lesson.vocabularyCount} words</span>
                    </div>
                    <Button
                      onClick={() => onViewLesson(lesson.lessonId)}
                      className="w-full"
                      size="sm"
                    >
                      Start Lesson
                    </Button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Start your first lesson to get personalized recommendations!</p>
              <Button onClick={onNavigateToLessons}>Browse Lessons</Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue Learning</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pick up where you left off or start a new lesson
            </p>
            <Button onClick={onNavigateToLessons} className="w-full">
              Browse All Lessons
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice with AI</h3>
            <p className="text-sm text-gray-600 mb-4">
              Have a conversation with our AI chatbot to practice your skills
            </p>
            <Button onClick={onNavigateToChatbot} variant="outline" className="w-full">
              Start Chatting
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
