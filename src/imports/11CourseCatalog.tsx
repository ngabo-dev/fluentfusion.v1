import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { coursesApi, authApi } from '../app/api/config';
import Sidebar from '../app/components/Sidebar';

// Language filter options with counts (for sidebar)
const SIDEBAR_LANGUAGE_FILTERS = [
  { id: 1, name: 'English', count: 142 },
  { id: 2, name: 'Kinyarwanda', count: 38 },
  { id: 3, name: 'French', count: 97 },
  { id: 4, name: 'Spanish', count: 111 },
  { id: 5, name: 'German', count: 54 },
];

// Language filter options with counts
const LANGUAGE_FILTERS = [
  { id: 'all', name: 'All Languages', flag: '', count: 500 },
  { id: 1, name: 'English', flag: '🇬🇧', count: 142 },
  { id: 2, name: 'Kinyarwanda', flag: '🇷🇼', count: 38 },
  { id: 3, name: 'French', flag: '🇫🇷', count: 97 },
  { id: 4, name: 'Spanish', flag: '🇪🇸', count: 111 },
  { id: 5, name: 'German', flag: '🇩🇪', count: 54 },
];

// Level filter options
const LEVEL_FILTERS = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

// Price filter options
const PRICE_FILTERS = [
  { id: 'free', name: 'Free' },
  { id: 'paid', name: 'Paid' },
  { id: 'subscription', name: 'Subscription' },
];

// Rating filter options
const RATING_FILTERS = [
  { id: '4.5', name: '4.5+ ⭐' },
  { id: '4.0', name: '4.0+ ⭐' },
  { id: 'any', name: 'Any' },
];

function NavNav({ user }: { user: any }) {
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50 border-b border-[#2a2a2a]">
      <div className="flex flex-row items-center h-full px-10">
        <Link to="/dashboard" className="flex gap-3 items-center no-underline">
          <div className="bg-[#bfff00] w-[38px] h-[38px] rounded-[10px] flex items-center justify-center">
            <span className="text-[18px]">🧠</span>
          </div>
          <span className="text-[18px] text-white font-bold">
            FLUENT<span className="text-[#bfff00]">FUSION</span>
          </span>
        </Link>
        <div className="ml-auto flex gap-4 items-center">
          <button className="relative text-[20px] hover:text-white transition-colors">
            🔔
          </button>
          <Link to="/profile">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-black"
              style={{ background: 'linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)' }}
            >
              {user ? getInitials(user.full_name) : 'U'}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function PageHeader({ courseCount }: { courseCount: number }) {
  return (
    <div className="mb-6">
      <h1 className="text-[32px] text-white font-bold">
        Course <span className="text-[#bfff00]">Catalog</span>
      </h1>
      <p className="text-[#888] text-[14px] mt-1">Explore {courseCount}+ expert-led language courses</p>
    </div>
  );
}

function SearchSection({ 
  searchValue, 
  onSearchChange, 
  sortBy, 
  onSortChange 
}: { 
  searchValue: string; 
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}) {
  const sortOptions = [
    { value: 'popular', label: 'Sort: Most Popular' },
    { value: 'newest', label: 'Sort: Newest' },
    { value: 'rating', label: 'Sort: Highest Rated' },
    { value: 'price_low', label: 'Sort: Price: Low to High' },
    { value: 'price_high', label: 'Sort: Price: High to Low' },
  ];

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1 max-w-[480px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888] text-[16px]">🔍</span>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search courses, instructors, topics..."
          className="bg-[#1f1f1f] w-full rounded-[8px] pl-12 pr-4 py-3 text-[#fff] text-[15px] outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors"
        />
      </div>
      <select
        title="Sort courses"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-[#1f1f1f] text-[#fff] text-[15px] px-4 py-3 rounded-[8px] border border-[#2a2a2a] outline-none cursor-pointer min-w-[160px] hover:border-[#444] transition-colors"
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function FilterChips({ 
  selectedLanguage, 
  onLanguageSelect,
  selectedLevel,
  onLevelSelect
}: { 
  selectedLanguage: string | number | null;
  onLanguageSelect: (id: string | number | null) => void;
  selectedLevel: string | null;
  onLevelSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-[10px] mb-6">
      {/* Language chips */}
      {LANGUAGE_FILTERS.map(lang => (
        <button 
          key={lang.id}
          onClick={() => onLanguageSelect(lang.id === 'all' ? null : lang.id)}
          className={`px-4 py-2 rounded-[99px] text-[13px] font-medium transition-all cursor-pointer ${
            (lang.id === 'all' && !selectedLanguage) || selectedLanguage === lang.id
              ? 'bg-[#bfff00] text-black border border-[#bfff00]' 
              : 'bg-[rgba(255,255,255,0.06)] text-[#888] border border-[#2a2a2a] hover:border-[#444]'
          }`}
        >
          {lang.flag} {lang.name}
        </button>
      ))}
      
      <div className="w-px bg-[#2a2a2a] mx-2" />
      
      {/* Level chips */}
      {LEVEL_FILTERS.map(level => (
        <button 
          key={level.id}
          onClick={() => onLevelSelect(selectedLevel === level.id ? null : level.id)}
          className={`px-4 py-2 rounded-[99px] text-[13px] font-medium transition-all cursor-pointer ${
            selectedLevel === level.id
              ? 'bg-[#bfff00] text-black border border-[#bfff00]' 
              : 'bg-[rgba(255,255,255,0.06)] text-[#888] border border-[#2a2a2a] hover:border-[#444]'
          }`}
        >
          {level.name}
        </button>
      ))}
    </div>
  );
}

function FilterSidebar({ 
  languages,
  selectedLanguages,
  onLanguageToggle,
  levels,
  selectedLevels,
  onLevelToggle,
  prices,
  selectedPrices,
  onPriceToggle,
  ratings,
  selectedRating,
  onRatingSelect,
  onClearFilters
}: { 
  languages: { id: number; name: string; flag?: string; count: number }[];
  selectedLanguages: number[];
  onLanguageToggle: (id: number) => void;
  levels: { id: string; name: string }[];
  selectedLevels: string[];
  onLevelToggle: (id: string) => void;
  prices: { id: string; name: string }[];
  selectedPrices: string[];
  onPriceToggle: (id: string) => void;
  ratings: { id: string; name: string }[];
  selectedRating: string | null;
  onRatingSelect: (id: string | null) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="w-[220px] shrink-0">
      {/* Language Filter */}
      <div className="mb-6">
        <div className="text-[#888] text-[10px] tracking-[1.2px] uppercase mb-3 font-mono">Language</div>
        {languages.map(lang => (
          <div 
            key={lang.id}
            onClick={() => onLanguageToggle(lang.id)}
            className={`flex items-center gap-[10px] py-[7px] cursor-pointer text-[13px] transition-colors ${
              selectedLanguages.includes(lang.id) ? 'text-[#bfff00]' : 'text-[#888] hover:text-white'
            }`}
          >
            <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center text-[10px] ${
              selectedLanguages.includes(lang.id) 
                ? 'bg-[#bfff00] text-black' 
                : 'bg-[#1f1f1f] border border-[#333]'
            }`}>
              {selectedLanguages.includes(lang.id) && '✓'}
            </div>
            {lang.name}
            <span className="ml-auto text-[#555] text-[11px]">{lang.count}</span>
          </div>
        ))}
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <div className="text-[#888] text-[10px] tracking-[1.2px] uppercase mb-3 font-mono">Level</div>
        {levels.map(level => (
          <div 
            key={level.id}
            onClick={() => onLevelToggle(level.id)}
            className={`flex items-center gap-[10px] py-[7px] cursor-pointer text-[13px] transition-colors ${
              selectedLevels.includes(level.id) ? 'text-[#bfff00]' : 'text-[#888] hover:text-white'
            }`}
          >
            <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center text-[10px] ${
              selectedLevels.includes(level.id) 
                ? 'bg-[#bfff00] text-black' 
                : 'bg-[#1f1f1f] border border-[#333]'
            }`}>
              {selectedLevels.includes(level.id) && '✓'}
            </div>
            {level.name}
          </div>
        ))}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <div className="text-[#888] text-[10px] tracking-[1.2px] uppercase mb-3 font-mono">Price</div>
        {prices.map(price => (
          <div 
            key={price.id}
            onClick={() => onPriceToggle(price.id)}
            className={`flex items-center gap-[10px] py-[7px] cursor-pointer text-[13px] transition-colors ${
              selectedPrices.includes(price.id) ? 'text-[#bfff00]' : 'text-[#888] hover:text-white'
            }`}
          >
            <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center text-[10px] ${
              selectedPrices.includes(price.id) 
                ? 'bg-[#bfff00] text-black' 
                : 'bg-[#1f1f1f] border border-[#333]'
            }`}>
              {selectedPrices.includes(price.id) && '✓'}
            </div>
            {price.name}
          </div>
        ))}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <div className="text-[#888] text-[10px] tracking-[1.2px] uppercase mb-3 font-mono">Rating</div>
        {ratings.map(rating => (
          <div 
            key={rating.id}
            onClick={() => onRatingSelect(selectedRating === rating.id ? null : rating.id)}
            className={`flex items-center gap-[10px] py-[7px] cursor-pointer text-[13px] transition-colors ${
              selectedRating === rating.id ? 'text-[#bfff00]' : 'text-[#888] hover:text-white'
            }`}
          >
            <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center text-[10px] ${
              selectedRating === rating.id 
                ? 'bg-[#bfff00] text-black' 
                : 'bg-[#1f1f1f] border border-[#333]'
            }`}>
              {selectedRating === rating.id && '✓'}
            </div>
            {rating.name}
          </div>
        ))}
      </div>

      {/* Clear Filters Button */}
      <button 
        onClick={onClearFilters}
        className="w-full py-2 rounded-[8px] border border-[#333] text-[#888] text-[13px] hover:bg-[#1f1f1f] hover:text-white transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );
}

function CourseCard({ course, onClick }: { course: any; onClick: () => void }) {
  const languageFlags: { [key: string]: string } = {
    'English': '🇬🇧',
    'Kinyarwanda': '🇷🇼',
    'French': '🇫🇷',
    'Spanish': '🇪🇸',
    'German': '🇩🇪',
    'Japanese': '🇯🇵',
  };

  const levelColors: { [key: string]: string } = {
    'beginner': 'bg-[rgba(0,255,100,0.1)] text-[#00FF64]',
    'intermediate': 'bg-[rgba(255,200,0,0.1)] text-[#ffc800]',
    'advanced': 'bg-[rgba(255,68,68,0.1)] text-[#f44]',
  };

  const level = course.level?.toLowerCase() || 'beginner';
  const flag = course.language_flag || languageFlags[course.language_name] || '📚';
  const levelColor = levelColors[level] || levelColors['beginner'];
  const priceDisplay = course.is_free ? 'FREE' : (course.price_usd ? `$${course.price_usd}/mo` : 'Contact');
  const priceColor = course.is_free ? 'text-[#bfff00]' : 'text-[#ffc800]';
  
  const instructorName = course.instructor_name || 'Instructor';
  const instructorInitials = instructorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  
  const rating = course.rating || course.avg_rating || 4.5;
  const reviews = course.review_count || 0;

  return (
    <div 
      onClick={onClick}
      className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] overflow-hidden cursor-pointer hover:border-[#bfff00] transition-all hover:shadow-[0_0_20px_rgba(191,255,0,0.1)]"
    >
      {/* Course Thumbnail */}
      <div className="h-[160px] bg-gradient-to-br from-[#1a2a1a] to-[#0d1f0d] flex items-center justify-center text-[48px]">
        {flag}
      </div>
      
      {/* Course Body */}
      <div className="p-4">
        {/* Level & Price badges */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase ${levelColor}`}>
            {level}
          </span>
          <span className={`font-semibold text-[12px] ${priceColor}`}>
            {priceDisplay}
          </span>
        </div>
        
        {/* Course Title */}
        <h3 className="text-white font-bold text-[15px] mb-3 truncate">{course.title}</h3>
        
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#bfff00] to-[#8fef00] flex items-center justify-center text-[10px] font-bold text-black">
            {instructorInitials}
          </div>
          <span className="text-[#888] text-[12px]">{instructorName}</span>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#ffc800] text-[12px]">
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          </span>
          <span className="text-white text-[12px] font-semibold">{rating.toFixed(1)}</span>
          <span className="text-[#888] text-[12px]">({reviews > 1000 ? `${(reviews/1000).toFixed(1)}k` : reviews} reviews)</span>
        </div>
        
        {/* Enroll Button */}
        <button className={`w-full py-2 rounded-[8px] font-semibold text-[13px] text-center transition-all cursor-pointer ${
          course.is_enrolled 
            ? 'bg-[#333] text-[#888]' 
            : course.is_free 
              ? 'bg-[#bfff00] text-black hover:shadow-[0_0_12px_rgba(191,255,0,0.25)]'
              : 'border border-[#bfff00] text-[#bfff00] hover:bg-[rgba(191,255,0,0.1)]'
        }`}>
          {course.is_enrolled ? 'Continue →' : (course.is_free ? 'Enroll Free →' : 'Enroll →')}
        </button>
      </div>
    </div>
  );
}

function CourseGrid({ courses, onCourseClick, total }: { courses: any[]; onCourseClick: (courseId: number) => void; total: number }) {
  if (courses.length === 0) {
    return (
      <div className="flex-1">
        <div className="text-[#888] text-[13px] mb-4">Showing 0 courses</div>
        <div className="flex flex-col items-center justify-center h-[300px] bg-[#151515] rounded-[14px] border border-[#2a2a2a]">
          <div className="text-[48px] mb-4">📚</div>
          <p className="text-[#888] text-[16px]">No courses available</p>
          <p className="text-[#555] text-[13px] mt-2">Check back later for new courses</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1">
      <div className="text-[#888] text-[13px] mb-4">Showing {total} courses</div>
      <div className="grid grid-cols-3 gap-[18px]">
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onClick={() => onCourseClick(course.id)} 
          />
        ))}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#2a2a2a]">
      <div className="text-[#888] text-[13px]">Page {page} of {totalPages}</div>
      <div className="flex gap-2">
        <button 
          onClick={() => page > 1 && onPageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-[8px] text-[13px] transition-colors cursor-pointer ${
            page === 1 
              ? 'text-[#555] cursor-not-allowed' 
              : 'text-[#888] hover:bg-[#1f1f1f] hover:text-white'
          }`}
        >
          ← Prev
        </button>
        {getVisiblePages().map(p => (
          <button 
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-4 py-2 rounded-[8px] text-[13px] transition-colors cursor-pointer ${
              p === page 
                ? 'border border-[#bfff00] text-[#bfff00]' 
                : 'text-[#888] hover:bg-[#1f1f1f] hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}
        <button 
          onClick={() => page < totalPages && onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-[8px] text-[13px] transition-colors cursor-pointer ${
            page === totalPages 
              ? 'text-[#555] cursor-not-allowed' 
              : 'text-[#888] hover:bg-[#1f1f1f] hover:text-white'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-[400px]">
      <div className="animate-spin text-[32px]">🧠</div>
      <p className="text-[#888] text-[14px]">Loading courses...</p>
    </div>
  );
}

export default function Component11CourseCatalog() {
  const navigate = useNavigate();
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Course data
  const [courses, setCourses] = useState<any[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedLanguage, setSelectedLanguage] = useState<string | number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;
  const totalPages = Math.ceil(totalCourses / limit) || 1;

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = authApi.getCurrentUser();
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    setIsLoading(false);
  }, [navigate]);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [searchQuery, sortBy, selectedLanguage, selectedLevel, page, selectedLanguages, selectedLevels, selectedPrices, selectedRating]);

  const fetchCourses = async () => {
    try {
      setCoursesError(null);
      
      // Build query params
      const params: any = {
        page,
        limit,
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (selectedLanguage) {
        params.language_id = selectedLanguage;
      }
      
      if (selectedLevel) {
        params.level = selectedLevel;
      }
      
      console.log('Fetching courses with params:', params);
      const response = await coursesApi.getCourses(params);
      console.log('Courses response:', response);
      
      if (response.courses && response.courses.length > 0) {
        setCourses(response.courses);
        setTotalCourses(response.total || 0);
      } else {
        // No courses available - show empty state
        console.log('No courses from API');
        setCourses([]);
        setTotalCourses(0);
      }
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);
      setCoursesError(error.message || 'Failed to load courses');
      // Show empty state instead of mock data
      setCourses([]);
      setTotalCourses(0);
    }
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const handleLanguageSelect = (langId: string | number | null) => {
    setSelectedLanguage(langId);
    setPage(1);
  };

  const handleLevelSelect = (levelId: string | null) => {
    setSelectedLevel(levelId);
    setPage(1);
  };

  const handleLanguageToggle = (langId: number) => {
    setSelectedLanguages(prev => 
      prev.includes(langId) 
        ? prev.filter(id => id !== langId)
        : [...prev, langId]
    );
    setPage(1);
  };

  const handleLevelToggle = (levelId: string) => {
    setSelectedLevels(prev =>
      prev.includes(levelId)
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    );
    setPage(1);
  };

  const handlePriceToggle = (priceId: string) => {
    setSelectedPrices(prev =>
      prev.includes(priceId)
        ? prev.filter(id => id !== priceId)
        : [...prev, priceId]
    );
    setPage(1);
  };

  const handleRatingSelect = (ratingId: string | null) => {
    setSelectedRating(ratingId);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedLanguage(null);
    setSelectedLevel(null);
    setSelectedLanguages([]);
    setSelectedLevels([]);
    setSelectedPrices([]);
    setSelectedRating(null);
    setSearchQuery('');
    setSortBy('popular');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
        <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
          <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
          <div className="flex flex-row items-center size-full">
            <div className="flex items-center justify-between px-[40px] w-full">
              <Link to="/dashboard" className="flex gap-[11px] items-center no-underline">
                <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                  <span className="text-[18px]">🧠</span>
                </div>
                <span className="text-[18px] text-white font-bold">
                  FLUENT<span className="text-[#bfff00]">FUSION</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col" data-name="11-course-catalog">
      <NavNav user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 pt-6 ml-[240px] overflow-auto">
          <PageHeader courseCount={totalCourses} />
          <SearchSection 
            searchValue={searchQuery} 
            onSearchChange={setSearchQuery} 
            sortBy={sortBy} 
            onSortChange={setSortBy} 
          />
          <FilterChips 
            selectedLanguage={selectedLanguage} 
            onLanguageSelect={handleLanguageSelect}
            selectedLevel={selectedLevel}
            onLevelSelect={handleLevelSelect}
          />
          
          <div className="flex gap-7">
            <FilterSidebar 
              languages={SIDEBAR_LANGUAGE_FILTERS}
              selectedLanguages={selectedLanguages}
              onLanguageToggle={handleLanguageToggle}
              levels={LEVEL_FILTERS}
              selectedLevels={selectedLevels}
              onLevelToggle={handleLevelToggle}
              prices={PRICE_FILTERS}
              selectedPrices={selectedPrices}
              onPriceToggle={handlePriceToggle}
              ratings={RATING_FILTERS}
              selectedRating={selectedRating}
              onRatingSelect={handleRatingSelect}
              onClearFilters={handleClearFilters}
            />
            <div className="flex-1">
              <CourseGrid 
                courses={courses} 
                onCourseClick={handleCourseClick}
                total={totalCourses}
              />
              <Pagination 
                page={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
