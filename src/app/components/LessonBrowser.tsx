import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Lesson, LessonCategory, DifficultyLevel } from '../types';
import { getLessonsForUser } from '../data/mockData';
import { Search, Clock, BookOpen, CheckCircle } from 'lucide-react';

interface LessonBrowserProps {
  user: User;
  onViewLesson: (lessonId: string) => void;
  onNavigateToDashboard: () => void;
  onNavigateToProgress: () => void;
  onNavigateToProfile: () => void;
  onNavigateToChatbot: () => void;
  onLogout: () => void;
}

export function LessonBrowser({
  user,
  onViewLesson,
  onNavigateToDashboard,
  onNavigateToProgress,
  onNavigateToProfile,
  onNavigateToChatbot,
  onLogout,
}: LessonBrowserProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    // Load lessons for user
    const userLessons = getLessonsForUser(user.userType, user.targetLanguage);
    setLessons(userLessons);
    setFilteredLessons(userLessons);

    // Load completed lessons
    const savedProgress = localStorage.getItem('userProgress') || '[]';
    const allProgress = JSON.parse(savedProgress);
    const myProgress = allProgress.filter((p: any) => p.userId === user.userId);
    setCompletedLessonIds(myProgress.map((p: any) => p.lessonId));
  }, [user]);

  useEffect(() => {
    // Apply filters
    let filtered = lessons;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.difficulty === difficultyFilter);
    }

    setFilteredLessons(filtered);
  }, [searchQuery, categoryFilter, difficultyFilter, lessons]);

  const getCategoryIcon = (category: LessonCategory) => {
    const icons: Record<LessonCategory, string> = {
      greetings: '👋',
      accommodation: '🏨',
      food: '🍽️',
      transportation: '🚕',
      shopping: '🛍️',
      emergency: '🚨',
    };
    return icons[category] || '📚';
  };

  const getCategoryLabel = (category: LessonCategory) => {
    const labels: Record<LessonCategory, string> = {
      greetings: 'Greetings',
      accommodation: 'Accommodation',
      food: 'Food & Dining',
      transportation: 'Transportation',
      shopping: 'Shopping',
      emergency: 'Emergency',
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="lessons"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToLessons={() => {}}
        onNavigateToProgress={onNavigateToProgress}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToChatbot={onNavigateToChatbot}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Lessons</h1>
          <p className="text-gray-600">
            {user.targetLanguage === 'kinyarwanda' 
              ? 'Learn Kinyarwanda for your Rwanda adventure'
              : `Improve your ${user.targetLanguage} for tourism work`}
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="greetings">Greetings</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Lessons Grid */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredLessons.length} of {lessons.length} lessons
          </p>
        </div>

        {filteredLessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const isCompleted = completedLessonIds.includes(lesson.lessonId);

              return (
                <Card key={lesson.lessonId} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{getCategoryIcon(lesson.category)}</div>
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lesson.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {getCategoryLabel(lesson.category)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{lesson.vocabularyCount} words</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onViewLesson(lesson.lessonId)}
                    className="w-full"
                    variant={isCompleted ? 'outline' : 'default'}
                  >
                    {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No lessons found matching your criteria</p>
            <Button onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setDifficultyFilter('all');
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
