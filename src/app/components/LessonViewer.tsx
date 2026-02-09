import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { User, UserProgress, Exercise } from '../types';
import { mockLessons } from '../data/mockData';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, Volume2 } from 'lucide-react';

interface LessonViewerProps {
  lessonId: string;
  user: User;
  onComplete: (progress: UserProgress) => void;
  onBack: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToLessons: () => void;
  onNavigateToProgress: () => void;
  onNavigateToProfile: () => void;
  onNavigateToChatbot: () => void;
  onLogout: () => void;
}

type LessonStage = 'vocabulary' | 'phrases' | 'cultural' | 'exercises' | 'complete';

export function LessonViewer({
  lessonId,
  user,
  onComplete,
  onBack,
  onNavigateToDashboard,
  onNavigateToLessons,
  onNavigateToProgress,
  onNavigateToProfile,
  onNavigateToChatbot,
  onLogout,
}: LessonViewerProps) {
  const [currentStage, setCurrentStage] = useState<LessonStage>('vocabulary');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string | string[]>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [startTime] = useState(Date.now());
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  const lesson = mockLessons.find(l => l.lessonId === lessonId);

  useEffect(() => {
    if (lesson) {
      const total = lesson.content.exercises.reduce((sum, ex) => sum + ex.points, 0);
      setMaxScore(total);
    }
  }, [lesson]);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const handleExerciseAnswer = (exerciseId: string, answer: string | string[]) => {
    setExerciseAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  const checkAnswer = (exerciseId: string) => {
    const exercise = lesson.content.exercises.find(e => e.exerciseId === exerciseId);
    if (!exercise) return;

    const userAnswer = exerciseAnswers[exerciseId];
    let isCorrect = false;

    if (exercise.type === 'matching') {
      // For matching, compare arrays
      if (Array.isArray(userAnswer) && Array.isArray(exercise.correctAnswer)) {
        isCorrect = JSON.stringify(userAnswer) === JSON.stringify(exercise.correctAnswer);
      }
    } else {
      // For other types, compare strings (case-insensitive)
      const correctAnswer = Array.isArray(exercise.correctAnswer) 
        ? exercise.correctAnswer[0] 
        : exercise.correctAnswer;
      isCorrect = userAnswer?.toString().toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    setShowFeedback(prev => ({ ...prev, [exerciseId]: true }));

    if (isCorrect) {
      setTotalScore(prev => prev + exercise.points);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < lesson.content.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setCurrentStage('complete');
      saveProgress();
    }
  };

  const saveProgress = () => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // in seconds
    
    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    const progress: UserProgress = {
      progressId: `P${Date.now()}`,
      userId: user.userId,
      lessonId: lesson.lessonId,
      score: scorePercentage,
      completedAt: new Date().toISOString(),
      timeSpent,
      exercisesCompleted: lesson.content.exercises.length,
      totalExercises: lesson.content.exercises.length,
    };

    onComplete(progress);
  };

  const renderVocabularyStage = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vocabulary</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {lesson.content.vocabulary.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-blue-900">{item.word}</h3>
                <p className="text-sm text-gray-600 italic">{item.pronunciation}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="text-gray-900 mb-2">{item.translation}</p>
            {item.example && (
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Example:</strong> {item.example}
              </p>
            )}
          </Card>
        ))}
      </div>
      <Button onClick={() => setCurrentStage('phrases')} className="w-full">
        Continue to Phrases
      </Button>
    </div>
  );

  const renderPhrasesStage = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Phrases</h2>
      <div className="space-y-4 mb-8">
        {lesson.content.phrases.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-blue-900">{item.phrase}</h3>
                <p className="text-sm text-gray-600 italic">{item.pronunciation}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="text-gray-900 mb-2">{item.translation}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {item.context}
            </span>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setCurrentStage('vocabulary')} variant="outline" className="flex-1">
          Back to Vocabulary
        </Button>
        <Button onClick={() => setCurrentStage('cultural')} className="flex-1">
          Continue to Cultural Notes
        </Button>
      </div>
    </div>
  );

  const renderCulturalStage = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cultural Notes</h2>
      <Card className="p-6 mb-8 bg-purple-50 border-purple-200">
        <div className="space-y-4">
          {lesson.content.culturalNotes?.map((note, index) => (
            <div key={index} className="flex gap-3">
              <div className="text-purple-600 font-bold">💡</div>
              <p className="text-gray-800">{note}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="flex gap-4">
        <Button onClick={() => setCurrentStage('phrases')} variant="outline" className="flex-1">
          Back to Phrases
        </Button>
        <Button onClick={() => setCurrentStage('exercises')} className="flex-1">
          Start Exercises
        </Button>
      </div>
    </div>
  );

  const renderExercise = (exercise: Exercise, index: number) => {
    const userAnswer = exerciseAnswers[exercise.exerciseId];
    const feedback = showFeedback[exercise.exerciseId];
    
    let isCorrect = false;
    if (feedback) {
      if (exercise.type === 'matching') {
        isCorrect = JSON.stringify(userAnswer) === JSON.stringify(exercise.correctAnswer);
      } else {
        const correctAnswer = Array.isArray(exercise.correctAnswer) 
          ? exercise.correctAnswer[0] 
          : exercise.correctAnswer;
        isCorrect = userAnswer?.toString().toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      }
    }

    return (
      <div key={exercise.exerciseId}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Exercise {index + 1} of {lesson.content.exercises.length}
        </h2>
        <Progress value={((index + 1) / lesson.content.exercises.length) * 100} className="mb-6" />

        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{exercise.prompt}</h3>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {exercise.points} points
            </span>
          </div>

          {exercise.type === 'multiple_choice' && (
            <RadioGroup
              value={userAnswer as string}
              onValueChange={(value) => handleExerciseAnswer(exercise.exerciseId, value)}
              disabled={feedback}
            >
              <div className="space-y-3">
                {exercise.options?.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${exercise.exerciseId}-${i}`} />
                    <Label htmlFor={`${exercise.exerciseId}-${i}`} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {exercise.type === 'fill_blank' && (
            <Input
              value={userAnswer as string || ''}
              onChange={(e) => handleExerciseAnswer(exercise.exerciseId, e.target.value)}
              placeholder="Type your answer..."
              disabled={feedback}
              className="mt-4"
            />
          )}

          {exercise.type === 'matching' && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">Match items by dragging or typing the matching letter</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  {exercise.options?.map((option, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded mb-2">
                      <span className="font-semibold text-blue-600">{String.fromCharCode(65 + i)}.</span> {option}
                    </div>
                  ))}
                </div>
                <div>
                  {Array.isArray(exercise.correctAnswer) && exercise.correctAnswer.map((answer, i) => (
                    <div key={i} className="mb-2">
                      <Input
                        value={(userAnswer as string[])?.[i] || ''}
                        onChange={(e) => {
                          const newAnswers = [...((userAnswer as string[]) || [])];
                          newAnswers[i] = e.target.value;
                          handleExerciseAnswer(exercise.exerciseId, newAnswers);
                        }}
                        placeholder={`${i + 1}. ${answer}`}
                        disabled={feedback}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {feedback && (
            <div className={`mt-4 p-4 rounded ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-900">Incorrect</span>
                  </>
                )}
              </div>
              {exercise.explanation && (
                <p className="text-sm text-gray-700">{exercise.explanation}</p>
              )}
              {!isCorrect && (
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Correct answer:</strong> {Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.join(', ') : exercise.correctAnswer}
                </p>
              )}
            </div>
          )}
        </Card>

        <div className="flex gap-4">
          {!feedback ? (
            <Button 
              onClick={() => checkAnswer(exercise.exerciseId)} 
              className="flex-1"
              disabled={!userAnswer}
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextExercise} className="flex-1">
              {index < lesson.content.exercises.length - 1 ? 'Next Exercise' : 'Complete Lesson'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCompleteStage = () => {
    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
          <p className="text-gray-600">Great job completing this lesson</p>
        </div>

        <Card className="p-8 mb-8 max-w-md mx-auto">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Score</p>
            <p className="text-5xl font-bold text-blue-600 mb-2">{scorePercentage.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">{totalScore} out of {maxScore} points</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Exercises Completed</span>
              <span className="font-semibold">{lesson.content.exercises.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vocabulary Learned</span>
              <span className="font-semibold">{lesson.content.vocabulary.length} words</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phrases Learned</span>
              <span className="font-semibold">{lesson.content.phrases.length} phrases</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 max-w-md mx-auto">
          <Button onClick={onNavigateToLessons} variant="outline" className="flex-1">
            Browse Lessons
          </Button>
          <Button onClick={onNavigateToDashboard} className="flex-1">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="lessons"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToLessons={onNavigateToLessons}
        onNavigateToProgress={onNavigateToProgress}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToChatbot={onNavigateToChatbot}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStage !== 'complete' && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </button>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-600">{lesson.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
          <p className="text-gray-600">{lesson.description}</p>
        </div>

        {currentStage === 'vocabulary' && renderVocabularyStage()}
        {currentStage === 'phrases' && renderPhrasesStage()}
        {currentStage === 'cultural' && renderCulturalStage()}
        {currentStage === 'exercises' && renderExercise(lesson.content.exercises[currentExerciseIndex], currentExerciseIndex)}
        {currentStage === 'complete' && renderCompleteStage()}
      </div>
    </div>
  );
}
