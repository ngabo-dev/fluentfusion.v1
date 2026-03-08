import { Link, useNavigate, useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { authApi, lessonsApi } from '../app/api/config';

export default function Component13LessonView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lesson state - from API
  const [lesson, setLesson] = useState<any>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('Transcript');
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Check auth on mount and fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      const token = localStorage.getItem('ff_access_token');
      const userData = authApi.getCurrentUser();
      
      if (!token || !userData) {
        navigate('/login');
        return;
      }
      
      setUser(userData);
      
      // Fetch lesson from API
      if (id) {
        try {
          const data = await lessonsApi.getLesson(parseInt(id));
          
          // Transform API response to UI format
          const lessonData = data.lesson;
          const vocabList = data.vocabulary || [];
          const segments = data.transcript_segments || [];
          
          // Get course and unit info from lesson
          setCourseTitle(lessonData.course?.title || 'Course');
          setUnitTitle(lessonData.unit?.title || 'Unit');
          
          setLesson({
            id: lessonData.id,
            title: lessonData.title,
            subtitle: lessonData.description?.substring(0, 50) || 'Lesson',
            description: lessonData.description || '',
            vocabulary: vocabList.map((v: any) => v.word),
            progress: lessonData.progress || 0,
            duration: lessonData.video_duration_sec || 0,
            video_url: lessonData.video_url || '',
            transcript: segments.map((s: any) => ({
              time: formatTime(s.start_time_sec || 0),
              text: s.text || ''
            }))
          });
          
          setError(null);
        } catch (err: any) {
          console.error('Failed to load lesson:', err);
          setError(err.message || 'Failed to load lesson');
        }
      }
      
      setIsLoading(false);
    };
    
    fetchLesson();
  }, [id, navigate]);

  // Video event handlers
  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(100, percent * 100));
    setVolume(newVolume);
    videoRef.current.volume = newVolume / 100;
    setIsMuted(newVolume === 0);
  };

  const handleVolumeToggle = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSkipBack = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
  };

  const handleSkipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
  };

  const handlePractice = () => {
    navigate(`/quiz/${id || '1'}`);
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

  const handleLogoClick = () => {
    navigate(`/course/${id || '1'}`);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="animate-spin text-[32px]">🧠</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between h-full px-4 md:px-10">
          <div className="flex items-center gap-3">
            <button onClick={handleLogoClick} className="flex gap-3 items-center no-underline cursor-pointer">
              <div className="bg-[#bfff00] w-[38px] h-[38px] rounded-[10px] flex items-center justify-center">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold hidden md:block">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6 overflow-hidden">
            <div className="hidden lg:flex flex-col items-start text-[13px] text-[#888]">
              <span className="whitespace-nowrap">{courseTitle || lesson?.course_title} · {unitTitle || lesson?.unit_title}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[#888] text-[12px] hidden sm:block">Progress:</span>
              <div className="w-[60px] md:w-[100px] bg-[#2a2a2a] h-[6px] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#8fef00] to-[#bfff00] rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[#bfff00] text-[12px]">{Math.round(progressPercent)}%</span>
            </div>
            
            <Link to="/profile" className="shrink-0">
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Video/Lesson Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div ref={videoContainerRef} className="relative bg-black aspect-video flex items-center justify-center">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain"
              onLoadedMetadata={handleVideoLoaded}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onClick={handlePlayPause}
              poster=""
            >
              {lesson.video_url ? (
                <source src={lesson.video_url} type="video/mp4" />
              ) : null}
            </video>
            
            {/* Fallback gradient when no video */}
            {!lesson.video_url && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] to-black" />
            )}
            
            {/* Time Display */}
            <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-[#bfff00] text-[11px] font-mono" style={{ padding: '5px 10px' }}>
              {formatTime(currentTime)} / {formatTime(duration || lesson.duration)}
            </div>
            
            {/* Center Play Button (shown when paused) */}
            {!isPlaying && !videoError && (
              <button 
                onClick={handlePlayPause}
                className="absolute z-10 bg-[rgba(191,255,0,0.9)] w-[72px] h-[72px] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer text-black"
                style={{ fontSize: '28px' }}
              >
                <span>▶</span>
              </button>
            )}
            
            {/* Lesson Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-lg md:text-xl font-bold">{lesson?.title || 'Loading...'}</h2>
              <p className="text-[rgba(255,255,255,0.6)] text-[13px]" style={{ marginTop: '12px' }}>{lesson?.subtitle || ''}</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="relative z-10 bg-[#0d0d0d] px-5 py-3 flex items-center gap-4" style={{ borderBottom: '1px solid #2a2a2a' }}>
            {/* Skip Back */}
            <button 
              onClick={handleSkipBack}
              className="p-2 hover:bg-[#1f1f1f] rounded cursor-pointer shrink-0 text-[#888]"
              title="Skip back 10 seconds"
            >
              <span className="text-[18px]">⏮</span>
            </button>
            
            {/* Play/Pause */}
            <button 
              onClick={handlePlayPause} 
              className="p-2 hover:bg-[#1f1f1f] rounded cursor-pointer shrink-0"
              style={{ color: '#bfff00' }}
            >
              <span className="text-[18px]">{isPlaying ? '⏸' : '▶'}</span>
            </button>
            
            {/* Skip Forward */}
            <button 
              onClick={handleSkipForward}
              className="p-2 hover:bg-[#1f1f1f] rounded cursor-pointer shrink-0 text-[#888]"
              title="Skip forward 10 seconds"
            >
              <span className="text-[18px]">⏭</span>
            </button>
            
            {/* Progress Bar - Clickable */}
            <div 
              className="flex-1 h-[4px] bg-[#2a2a2a] rounded-full cursor-pointer relative"
              style={{ borderRadius: '99px', minWidth: '100px' }}
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-[#bfff00] rounded-full absolute left-0 top-0"
                style={{ width: `${progressPercent}%`, borderRadius: '99px' }}
              />
            </div>
            
            {/* Time Display */}
            <span className="text-[#888] text-[12px] font-mono shrink-0">
              {formatTime(currentTime)} / {formatTime(duration || lesson.duration)}
            </span>
            
            {/* Volume Bar - Clickable */}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleVolumeToggle}
                className="text-[#888] hover:text-white"
              >
                <span className="text-[16px]">{isMuted || volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}</span>
              </button>
              <div 
                className="h-[4px] w-[80px] bg-[#2a2a2a] rounded-full cursor-pointer relative"
                style={{ borderRadius: '99px' }}
                onClick={handleVolumeChange}
              >
                <div 
                  className="h-full bg-[#bfff00] rounded-full absolute left-0 top-0"
                  style={{ width: `${isMuted ? 0 : volume}%`, borderRadius: '99px' }}
                />
              </div>
            </div>
            
            {/* Settings */}
            <button className="p-2 hover:bg-[#1f1f1f] rounded cursor-pointer shrink-0 text-[#888]">
              <span className="text-[14px]">⚙️</span>
            </button>
            
            {/* Fullscreen */}
            <button 
              onClick={handleFullscreen}
              className="p-2 hover:bg-[#1f1f1f] rounded cursor-pointer shrink-0 text-[#888]"
            >
              <span className="text-[14px]">{isFullscreen ? '🜵' : '⛶'}</span>
            </button>
            
            {/* Toggle Transcript */}
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-[#1f1f1f] rounded cursor-pointer shrink-0 text-[#888]"
              title={showSidebar ? 'Hide Transcript' : 'Show Transcript'}
            >
              <span className="text-[14px]">📝</span>
            </button>
          </div>

          {/* Lesson Content */}
          <div className="p-7 md:p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="mb-5">
              <h1 className="text-[22px] font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif', textTransform: 'uppercase' }}>
                {lesson?.title || 'Loading...'} · {lesson?.subtitle || ''}
              </h1>
              <p className="text-[#888] text-[14px]">
                {lesson?.description || ''}
              </p>
            </div>

            {/* Key Vocabulary */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-[14px] uppercase tracking-wider mb-3" style={{ letterSpacing: '0.06em' }}>Key Vocabulary</h3>
              <div className="flex flex-wrap gap-[10px]">
                {(lesson?.vocabulary || []).map((word: string, idx: number) => (
                  <button 
                    key={idx}
                    className="bg-[#151515] border border-[#2a2a2a] px-3 py-2 rounded-lg text-white text-[13px] hover:border-[#bfff00] hover:text-[#bfff00] transition-colors cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={handlePractice}
                className="bg-[#bfff00] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Practice Exercise →
              </button>
              <button className="border border-[#333] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1f1f1f] transition-colors cursor-pointer">
                Download Notes
              </button>
              <button 
                onClick={handleMarkComplete}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                  isCompleted 
                    ? 'bg-[rgba(0,255,127,0.1)] border border-[rgba(0,255,127,0.3)] text-[#00ff7f]' 
                    : 'border border-[#333] text-white hover:bg-[#1f1f1f]'
                }`}
              >
                {isCompleted ? '✓ Completed' : 'Mark as Completed'}
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel - Toggleable */}
        {showSidebar && (
        <div className="w-full lg:w-[320px] bg-[#0f0f0f] border-t lg:border-t-0 lg:border-l border-[#2a2a2a] flex flex-col" style={{ height: 'calc(100vh - 66px)' }}>
          {/* Tabs */}
          <div className="flex border-b border-[#2a2a2a] shrink-0">
            {['Transcript', 'Vocabulary', 'Notes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-[14px] text-[13px] font-semibold transition-colors cursor-pointer ${
                  activeTab === tab 
                    ? 'text-[#bfff00] border-b-2 border-[#bfff00]' 
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'Transcript' && (
              <div className="space-y-[2px]">
                {(lesson?.transcript || []).map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded text-[13px] cursor-pointer ${
                      idx === 0 
                        ? 'bg-[rgba(191,255,255,0.1)] text-white border-l-2 border-[#bfff00]' 
                        : 'text-[#888] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                    }`}
                    style={{ lineHeight: 1.6 }}
                  >
                    <span className="text-[#bfff00] text-[10px] font-mono mr-2">{item.time}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Vocabulary' && (
              <div className="space-y-2">
                {(lesson?.vocabulary || []).map((word: string, idx: number) => (
                  <div key={idx} className="bg-[#151515] p-3 rounded-lg cursor-pointer hover:bg-[#1f1f1f]">
                    <p className="text-white text-[13px] font-medium">{word}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Notes' && (
              <div>
                <textarea 
                  placeholder="Take notes here..."
                  className="w-full h-[200px] bg-[#151515] border border-[#2a2a2a] rounded-lg p-3 text-[#888] text-[13px] resize-none focus:outline-none focus:border-[#bfff00]"
                />
                <button className="mt-2 bg-[#bfff00] text-black px-4 py-2 rounded-lg text-[13px] font-semibold">
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
