# Import all models so they're registered with SQLAlchemy
from .user import User, UserSettings, EmailVerification, PasswordReset, UserSocialLogin
from .language import Language, UserOnboarding, UserLanguage
from .course import Course, CourseUnit, Lesson, LessonTranscript, LessonTranscriptSegment, LessonVocabulary, CourseEditRequest
from .progress import Enrollment, LessonCompletion, SkillScore, WeeklyActivity
from .quiz import Quiz, QuizQuestion, QuizQuestionOption, QuizAttempt, QuizAnswer
from .practice import (
    FlashcardDeck, Flashcard, FlashcardProgress,
    VocabularyBank,
    SpeakingExercise, SpeakingAttempt,
    ListeningExercise, ListeningAttempt
)
from .live_session import LiveSession, LiveSessionRegistration, LiveSessionMessage
from .community import CommunityPost, CommunityPostTag, CommunityPostLike, CommunityComment, CommunityPostSave
from .course_review import CourseReview
from .gamification import (
    UserXP, XPTransaction, Streak, StreakDay,
    AchievementDefinition, UserAchievement,
    DailyChallenge, DailyChallengeTask, UserDailyChallengeProgress,
    Leaderboard
)
from .instructor import InstructorProfile, InstructorEarning, InstructorPayoutRequest
from .payment import SubscriptionPlan, UserSubscription, Payment, CoursePurchase
from .notification import Notification
from .admin import AdminAuditLog, ModerationReport, PlatformAnalyticsSnapshot
from .certificate import Certificate
from .message import Conversation, Message
from .announcement import Announcement, AnnouncementView
from .activity import UserActivity, UserSession
from .report import Report, ReportComment
from .pulse_prediction import PulsePrediction
from .assignment import Assignment, AssignmentSubmission
from .meeting import Meeting
from .extras import InstructorApplication, CourseWishlist, CourseDiscussion, CourseDiscussionReply, StudyGroup, StudyGroupMember
