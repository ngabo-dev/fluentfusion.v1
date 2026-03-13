import { Link, useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { coursesApi, authApi } from '../app/api/config';
import Sidebar from '../app/components/Sidebar';

// Language flags mapping
const languageFlags: { [key: string]: string } = {
  'English': '🇬🇧',
  'Kinyarwanda': '🇷🇼',
  'French': '🇫🇷',
  'Spanish': '🇪🇸',
  'German': '🇩🇪',
  'Japanese': '🇯🇵',
  'Chinese': '🇨🇳',
  'Portuguese': '🇵🇹',
  'Arabic': '🇸🇦',
};

function NavNav({ user, onBackClick }: { user: any; onBackClick: () => void }) {
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="backdrop-blur-[8px] bg-[var(--bg-elevated)] h-[66px] shrink-0 sticky top-0 w-full z-50 border-b border-[var(--border-default)]">
      <div className="flex flex-row items-center h-full px-10">
        <Link to="/dashboard" className="flex gap-3 items-center no-underline">
          <div className="bg-[var(--accent-primary)] w-[38px] h-[38px] rounded-[10px] flex items-center justify-center">
            <span className="text-[18px]">🧠</span>
          </div>
          <span className="text-[18px] text-[var(--text-primary)] font-bold">
            FLUENT<span className="text-[var(--accent-primary)]">FUSION</span>
          </span>
        </Link>
        <div className="ml-auto flex gap-16 items-center">
          <button
            onClick={onBackClick}
            className="text-[var(--text-secondary)] text-[13px] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            ← Back to Catalog
          </button>
          <Link to="/profile">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-[var(--text-primary)]"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)' }}
            >
              {user ? getInitials(user.full_name) : 'U'}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function CourseHero({ course }: { course: any }) {
  const flag = course?.language?.flag_emoji || languageFlags[course?.language_name] || '📚';
  const levelColors: { [key: string]: string } = {
    'beginner': 'bg-[var(--accent-primary-muted)] text-[var(--accent-primary)]',
    'intermediate': 'bg-[var(--accent-warning-muted)] text-[var(--accent-warning)]',
    'advanced': 'bg-[var(--color-danger-muted)] text-[var(--color-danger)]',
  };
  const level = course?.level?.toLowerCase() || 'beginner';
  const instructorInitials = course?.instructor_name 
    ? course.instructor_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'I';

  return (
    <div className="w-full" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 60%)' }}>
      <div className="border-b border-[var(--border-default)]" />
      <div className="px-10 py-12 max-w-[700px]">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${course?.is_bestseller ? 'bg-[var(--accent-warning-muted)] text-[var(--accent-warning)]' : 'bg-[var(--accent-primary-muted)] text-[var(--accent-primary)]'}`}>
            {flag} {course?.language?.name || course?.language_name || 'Language'}
          </span>
          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${levelColors[level]}`}>
            {course?.level || 'Beginner'}
          </span>
          {course?.is_bestseller && (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[var(--accent-warning-muted)] text-[var(--accent-warning)]">
              ⭐ Bestseller
            </span>
          )}
        </div>
        
        {/* Title */}
        <h1 className="text-[32px] font-extrabold text-[var(--text-primary)] uppercase tracking-tight mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          {course?.title || 'Course Title'}
        </h1>
        
        {/* Description */}
        <p className="text-[var(--text-tertiary)] text-[15px] leading-relaxed mb-5">
          {course?.description || 'Course description...'}
        </p>
        
        {/* Instructor & Stats */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-[var(--text-primary)]"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)' }}
            >
              {instructorInitials}
            </div>
            <span className="text-[var(--text-primary)] text-[14px] font-medium">{course?.instructor_name || 'Instructor'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-primary)]">{'★'.repeat(5)}</span>
            <span className="text-[var(--text-primary)] font-bold">{course?.rating?.toFixed(1) || '4.9'}</span>
            <span className="text-[var(--text-tertiary)]">({course?.review_count?.toLocaleString() || '2,147'} reviews)</span>
          </div>
          <span className="text-[var(--text-tertiary)] text-[13px]">
            {course?.student_count?.toLocaleString() || '12,500'} students · {course?.unit_count || 8} units · {course?.lesson_count || 48} lessons
          </span>
        </div>
      </div>
    </div>
  );
}

function Tabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const tabs = ['Overview', 'Curriculum', 'Instructor', 'Reviews'];
   
  return (
    <div className="flex border-b border-[var(--border-default)] mb-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-3 text-[14px] font-medium transition-colors cursor-pointer relative ${
            activeTab === tab ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)]" />
          )}
        </button>
      ))}
    </div>
  );
}

function OverviewTab({ course }: { course: any }) {
  return (
    <div className="max-w-[720px]">
      <h2 className="text-white text-[16px] font-bold mb-3">About This Course</h2>
      <p className="text-[#888] text-[15px] leading-relaxed">
        {course?.full_description || course?.description || 'This comprehensive course is designed for learners who want to communicate professionally.'}
      </p>
    </div>
  );
}

function CurriculumTab({ course }: { course: any }) {
  const units = course?.units || [
    { id: 1, title: 'Greetings & First Impressions', lessons: 6, completed: 2 },
    { id: 2, title: 'Hotel Check-in', lessons: 8, completed: 0 },
    { id: 3, title: 'Room Service', lessons: 6, completed: 0 },
    { id: 4, title: 'Handling Complaints', lessons: 7, completed: 0 },
    { id: 5, title: 'Restaurant Vocabulary', lessons: 8, completed: 0 },
    { id: 6, title: 'Tourism Activities', lessons: 5, completed: 0 },
    { id: 7, title: 'Cultural Etiquette', lessons: 4, completed: 0 },
    { id: 8, title: 'Final Assessment', lessons: 4, completed: 0 },
  ];

  return (
    <div className="max-w-[720px]">
      <h2 className="text-[var(--text-primary)] text-[16px] font-bold mb-4">
        Curriculum · {units.length} Units · {units.reduce((sum: number, u: any) => sum + u.lessons, 0)} Lessons
      </h2>
      
      <div className="bg-[var(--bg-secondary)] rounded-[14px] border border-[var(--border-default)] overflow-hidden">
        {units.map((unit: any, idx: number) => (
          <div key={unit.id}>
            {/* Unit Header */}
            <div className={`bg-[var(--accent-primary-muted)] px-5 py-4 font-bold text-[var(--accent-primary)] border-b border-[var(--border-default)] flex justify-between items-center`}>
              <span>Unit {unit.id} · {unit.title}</span>
              <span className="text-[var(--text-tertiary)] font-normal text-[13px]">{unit.lessons} lessons</span>
            </div>
            
            {/* Lessons */}
            {Array.from({ length: Math.min(unit.lessons, 3) }).map((_, lIdx) => (
              <div 
                key={lIdx} 
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[11px] ${lIdx < unit.completed ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                    {(lIdx + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[var(--text-primary)] text-[14px]">
                    {lIdx === 0 ? 'Introduction' : lIdx === 1 ? 'Core Vocabulary' : 'Practice Session'}
                  </span>
                </div>
                <span className={`text-[12px] ${lIdx < unit.completed ? 'text-[var(--color-success)]' : 'text-[var(--text-tertiary)]'}`}>
                  {lIdx < unit.completed ? '✓ Done' : `${15 + lIdx * 5} min`}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function InstructorTab({ course }: { course: any }) {
  const instructor = course?.instructor || {
    name: course?.instructor_name || 'Dr. Mary K.',
    title: 'Language Expert & Hospitality Trainer',
    bio: 'With over 15 years of experience in language education and hospitality training, Dr. Mary K. has helped thousands of tourism professionals improve their English communication skills.',
    students: 45000,
    courses: 12,
    rating: 4.9,
  };

  return (
    <div className="max-w-[720px]">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-[14px] border border-[var(--border-default)]">
        <div className="flex gap-4">
          <div 
            className="w-20 h-20 rounded-[16px] flex items-center justify-center text-2xl font-bold text-[var(--text-primary)] shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)' }}
          >
            {instructor.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-[var(--text-primary)] text-lg font-bold">{instructor.name}</h3>
            <p className="text-[var(--text-tertiary)] text-sm mb-2">{instructor.title}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-[var(--accent-primary)]">{instructor.students?.toLocaleString() || '45,000'} students</span>
              <span className="text-[var(--accent-primary)]">{instructor.courses || 12} courses</span>
              <span className="text-[var(--accent-primary)]">★ {instructor.rating || 4.9}</span>
            </div>
          </div>
        </div>
        <p className="text-[var(--text-tertiary)] mt-4 text-[15px] leading-relaxed">{instructor.bio}</p>
      </div>
    </div>
  );
}

function ReviewsTab({ course }: { course: any }) {
  const reviews = course?.reviews || [
    { id: 1, name: 'Amina M.', initials: 'AM', rating: 5, date: '2 days ago', comment: 'This course completely transformed how I communicate with hotel guests. The pronunciation exercises are incredible!' },
    { id: 2, name: 'Kagiso R.', initials: 'KR', rating: 5, date: '1 week ago', comment: 'Very practical. I use phrases from this course every single day at work. Highly recommend!' },
    { id: 3, name: 'John D.', initials: 'JD', rating: 4, date: '2 weeks ago', comment: 'Great course content and structure. Would love to see more advanced lessons added.' },
  ];

  return (
    <div className="max-w-[720px]">
      <h2 className="text-[var(--text-primary)] text-[16px] font-bold mb-4">Student Reviews</h2>
      
      {reviews.map((review: any) => (
        <div key={review.id} className="border-b border-[var(--border-default)] py-4">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-8 h-8 rounded-[12px] flex items-center justify-center text-xs font-bold text-[var(--text-primary)] shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)' }}
            >
              {review.initials}
            </div>
            <div>
              <p className="text-[var(--text-primary)] text-sm font-semibold">{review.name}</p>
              <p className="text-[var(--text-tertiary)] text-xs">{review.date}</p>
            </div>
            <div className="ml-auto text-[var(--accent-primary)] text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
          </div>
          <p className="text-[var(--text-tertiary)] text-[14px] leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

function EnrollCard({ course, isEnrolled, onEnroll, onPreview, isEnrolling, isInstructor }: { 
  course: any; 
  isEnrolled: boolean; 
  onEnroll: () => void;
  onPreview: () => void;
  isEnrolling: boolean;
  isInstructor?: boolean;
}) {
  const flag = course?.language?.flag_emoji || languageFlags[course?.language_name] || '📚';
  const priceDisplay = course?.is_free ? 'FREE' : (course?.price ? `${course.price}` : 'Contact');
  const priceColor = course?.is_free ? 'text-[#bfff00]' : 'text-[#ffc800]';

  return (
    <div className="bg-[#151515] rounded-[20px] border border-[#2a2a2a] overflow-hidden w-[360px] sticky top-20">
      {/* Thumbnail */}
      <div 
        className="h-[200px] flex items-center justify-center text-[64px]"
        style={{ background: 'linear-gradient(135deg, #1a2a1a, #252525)' }}
      >
        {flag}
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className={`text-[28px] font-extrabold ${priceColor} mb-1`} style={{ fontFamily: "'Syne', sans-serif" }}>
          {priceDisplay}
        </div>
        <p className="text-[#888] text-[12px] mb-5">
          {course?.is_free ? 'Full access · No credit card needed' : 'Full access to all materials'}
        </p>
        
        {/* Instructor: Edit Course Button */}
        {isInstructor ? (
          <button 
            onClick={() => window.location.href = `/instructor/course/${course?.id}/edit`}
            className="w-full py-3 rounded-[10px] font-semibold text-[16px] text-center transition-all cursor-pointer bg-[var(--accent-primary)] text-black"
          >
            Edit Course →
          </button>
        ) : (
          <>
            {/* Enroll Button */}
            <button 
              onClick={isEnrolled ? onPreview : onEnroll}
              disabled={isEnrolling}
              className={`w-full py-3 rounded-[10px] font-semibold text-[16px] text-center transition-all cursor-pointer ${
                isEnrolling ? 'opacity-50 cursor-not-allowed' : 
                isEnrolled ? 'bg-[#333] text-white' : 
                'bg-[#bfff00] text-black shadow-[0_0_12px_rgba(191,255,0,0.25)] hover:shadow-[0_0_20px_rgba(191,255,0,0.4)]'
              }`}
            >
              {isEnrolling ? 'Enrolling...' : isEnrolled ? 'Continue Learning →' : (course?.is_free ? 'Enroll Now — Free →' : 'Enroll Now →')}
            </button>
          </>
        )}
        
        {/* Preview Button */}
        <button 
          onClick={onPreview}
          className="w-full py-2 rounded-[8px] border border-[#333] text-white text-[13px] font-semibold mt-3 hover:bg-[#1f1f1f] transition-colors cursor-pointer"
        >
          {isInstructor ? 'Preview as Student' : 'Preview Course'}
        </button>
        
        {/* Features */}
        <div className="mt-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-white">📚</span>
            <span className="text-[#888]">{course?.lesson_count || 48} lessons · {course?.unit_count || 8} units</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-white">⏱</span>
            <span className="text-[#888]">~12 hours total</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-white">🏆</span>
            <span className="text-[#888]">Certificate on completion</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-white">♾️</span>
            <span className="text-[#888]">Lifetime access</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-white">📱</span>
            <span className="text-[#888]">Mobile & desktop</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px]">
      <div className="animate-spin text-[32px] mb-4 text-[var(--accent-primary)]">🧠</div>
      <p className="text-[var(--text-tertiary)]">Loading course...</p>
    </div>
  );
}

export default function Component12CourseDetails() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Course data
  const [course, setCourse] = useState<any>(null);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('Overview');

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = authApi.getCurrentUser();
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    setIsLoading(false);
  }, [navigate]);

  // Fetch course data
  useEffect(() => {
    if (!isLoading) {
      fetchCourse();
    }
  }, [courseId, isLoading]);

  const fetchCourse = async () => {
    if (!courseId) {
      setCourseError('No course ID provided');
      setIsLoading(false);
      return;
    }
    try {
      setCourseError(null);
      const id = parseInt(courseId);
      if (isNaN(id)) {
        setCourseError('Invalid course ID');
        return;
      }
      const response = await coursesApi.getCourse(id);
      setCourse(response.course || response);
      setIsEnrolled(response.is_enrolled || false);
    } catch (error: any) {
      console.error('Failed to fetch course:', error);
      setCourseError(error.message || 'Failed to load course');
    }
  };

  const handleEnroll = async () => {
    if (isEnrolled) {
      navigate(`/lesson/${courseId || '1'}`);
      return;
    }
    
    try {
      setIsEnrolling(true);
      const id = parseInt(courseId || '1');
      console.log('Enrolling in course:', id);
      const result = await coursesApi.enrollCourse(id);
      console.log('Enrollment result:', result);
      setIsEnrolled(true);
      // Navigate to first lesson after successful enrollment
      navigate(`/lesson/${courseId || '1'}`);
    } catch (error: any) {
      console.error('Failed to enroll:', error);
      // Still mark as enrolled and navigate for demo
      setIsEnrolled(true);
      navigate(`/lesson/${courseId || '1'}`);
    } finally {
      setIsEnrolling(false);
    }
  };

  // Check if current user is the course instructor (compare both object and direct ID)
  const isInstructor = user && (
    course?.instructor?.id === user.id || 
    course?.instructor_id === user.id ||
    course?.instructor_id === user.id?.toString()
  );

  const handlePreview = () => {
    // Navigate to first lesson using course ID
    navigate(`/lesson/${courseId || '1'}`);
  };

  const handleBack = () => {
    navigate('/courses');
  };

  if (isLoading) {
     return (
       <div className="bg-[var(--bg-primary)] min-h-screen flex flex-col">
         <NavNav user={null} onBackClick={handleBack} />
         <div className="flex flex-1">
           <Sidebar />
           <div className="flex-1 ml-[240px] flex items-center justify-center">
             <LoadingState />
           </div>
         </div>
       </div>
     );
   }
   
   return (
     <div className="bg-[var(--bg-primary)] min-h-screen flex flex-col">
       <NavNav user={user} onBackClick={handleBack} />
       <div className="flex flex-1">
         <Sidebar />
         <main className="flex-1 ml-[240px] overflow-auto">
           <CourseHero course={course} />
           
           {/* Content */}
           <div className="px-10 py-10">
             <div className="flex gap-10">
               {/* Left: Details */}
               <div className="flex-1">
                 <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
                 
                 {activeTab === 'Overview' && <OverviewTab course={course} />}
                 {activeTab === 'Curriculum' && <CurriculumTab course={course} />}
                 {activeTab === 'Instructor' && <InstructorTab course={course} />}
                 {activeTab === 'Reviews' && <ReviewsTab course={course} />}
               </div>
               
               {/* Right: Enroll Card */}
               <EnrollCard 
                 course={course} 
                 isEnrolled={isEnrolled} 
                 onEnroll={handleEnroll} 
                 onPreview={handlePreview}
                 isEnrolling={isEnrolling}
                 isInstructor={isInstructor}
               />
             </div>
           </div>
         </main>
       </div>
     </div>
   );
}
