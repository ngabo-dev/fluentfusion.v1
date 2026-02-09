// User Types
export type UserType = 'tourist' | 'tourism_worker';
export type TargetLanguage = 'kinyarwanda' | 'english' | 'french';
export type NativeLanguage = 'kinyarwanda' | 'english' | 'french' | 'swahili' | 'other';

export interface User {
  userId: string;
  username: string;
  email: string;
  userType: UserType;
  targetLanguage: TargetLanguage;
  nativeLanguage: NativeLanguage;
  profileImage?: string;
  joinedDate: string;
  isActive?: boolean;
  createdAt?: string;
}

// Auth Types
export interface AuthUser {
  user_id: string;
  username: string;
  email: string;
  user_type: UserType;
  target_language: TargetLanguage;
  native_language: NativeLanguage;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  user_type: UserType;
  target_language: TargetLanguage;
  native_language: NativeLanguage;
}

export interface UserLogin {
  username: string;
  password: string;
}

// Lesson Types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LessonCategory = 'greetings' | 'accommodation' | 'food' | 'transportation' | 'shopping' | 'emergency';

export interface Lesson {
  lessonId: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  category: LessonCategory;
  targetLanguage: TargetLanguage;
  duration: number; // in minutes
  vocabularyCount: number;
  thumbnail: string;
  content: LessonContent;
}

export interface LessonContent {
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  culturalNotes?: string[];
  exercises: Exercise[];
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation: string;
  audioUrl?: string;
  example?: string;
}

export interface PhraseItem {
  phrase: string;
  translation: string;
  pronunciation: string;
  context: string;
  audioUrl?: string;
}

// Exercise Types
export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'matching' | 'translation';

export interface Exercise {
  exerciseId: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

// Progress Types
export interface UserProgress {
  progressId: string;
  userId: string;
  lessonId: string;
  score: number;
  completedAt: string;
  timeSpent: number; // in seconds
  exercisesCompleted: number;
  totalExercises: number;
}

// Badge Types
export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
}

// Recommendation Types
export interface Recommendation {
  lessonId: string;
  reason: string;
  confidence: number;
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  translation?: string;
}
