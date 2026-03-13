import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi, API_BASE_URL } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";

interface Unit {
  id: number;
  title: string;
  description?: string;
  order_index: number;
  lessons: Lesson[];
  quizzes?: any[];
}

interface Lesson {
  id: number;
  title: string;
  description?: string;
  video_url?: string;
  video_duration_sec?: number;
  order_index: number;
}

export default function Component24CreateCourse() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Course data
  const [courseId, setCourseId] = useState<number | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [languageId, setLanguageId] = useState(1);
  const [level, setLevel] = useState("beginner");
  const [price, setPrice] = useState(0);
  const [pricingOption, setPricingOption] = useState<'free' | 'paid'>('free');
  
  // Units and lessons
  const [units, setUnits] = useState<Unit[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  // New lesson form
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDesc, setNewLessonDesc] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Quiz form
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [selectedUnitForQuiz, setSelectedUnitForQuiz] = useState<number | null>(null);
  
  // Video preview
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  
  // Languages
  const [languages, setLanguages] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role && !['instructor', 'admin', 'super_admin'].includes(parsed.role)) {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
      fetchLanguages();
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchLanguages = async () => {
    try {
      const token = localStorage.getItem('ff_access_token');
      const response = await fetch(`${API_BASE_URL}/users/languages`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setLanguages(data.languages || []);
    } catch (e) {
      console.error('Failed to fetch languages', e);
    } finally {
      setLoading(false);
    }
  };

  // Load course data (units, lessons, quizzes) when courseId changes
  const loadCourseData = useCallback(async () => {
    if (!courseId) return;
    try {
      const token = localStorage.getItem('ff_access_token');
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/units`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setUnits(data.units || []);
      
      // Also get quizzes
      const quizList: any[] = [];
      for (const unit of data.units || []) {
        if (unit.quizzes && unit.quizzes.length > 0) {
          quizList.push(...unit.quizzes);
        }
      }
      setQuizzes(quizList);
    } catch (e) {
      console.error('Failed to load course data', e);
    }
  }, [courseId]);

  // Load course data when courseId changes
  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const createCourse = async () => {
    if (!courseTitle || !courseDescription) {
      setError("Please fill in course title and description");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      console.log("Creating course with:", { title: courseTitle, description: courseDescription, language_id: languageId, level, price_usd: price });
      
      const result = await instructorApi.createCourse({
        title: courseTitle,
        description: courseDescription,
        language_id: languageId,
        level: level,
        price_usd: price
      });
      
      console.log("Course created:", result);
      setCourseId(result.course_id);
      setCurrentStep(2); // Move to step 2
      
      // Create first unit by default
      const unitResult = await instructorApi.createUnit(result.course_id, {
        title: "Unit 1",
        description: "First unit",
        order_index: 0
      });
      
      console.log("Unit created:", unitResult);
      setUnits([{
        id: unitResult.unit_id,
        title: "Unit 1",
        description: "First unit",
        order_index: 0,
        lessons: []
      }]);
    } catch (e: any) {
      console.error("Failed to create course", e);
      setError("Failed to create course: " + (e.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const addLesson = async (unitId: number) => {
    if (!newLessonTitle) {
      alert("Please enter a lesson title");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let videoUrl = "";
      let videoDuration = 0;
      
      // Upload video if selected
      if (videoFile) {
        setUploading(true);
        try {
          console.log("Uploading video file:", videoFile.name, videoFile.size, videoFile.type);
          const uploadResult = await instructorApi.uploadVideo(videoFile);
          console.log("Video upload result:", uploadResult);
          videoUrl = uploadResult.video_url;
        } catch (uploadError: any) {
          console.error("Video upload failed:", uploadError);
          // Show the specific error message
          const errorMsg = uploadError.message || "Video upload failed";
          setError(`Video upload failed: ${errorMsg}. You can still add the lesson without a video.`);
          // Continue without video - user can add video later
        } finally {
          setUploading(false);
        }
      }
      
      // Create lesson in the database
      const lessonResult = await instructorApi.createLesson(unitId, {
        title: newLessonTitle,
        description: newLessonDesc,
        video_url: videoUrl,
        video_duration_sec: videoDuration,
        order_index: units.find(u => u.id === unitId)?.lessons.length || 0
      });
      
      // Reload course data to get fresh data
      await loadCourseData();
      
      setNewLessonTitle("");
      setNewLessonDesc("");
      setVideoFile(null);
      setError(null); // Clear any previous errors
      setSuccess("Lesson added successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      console.error("Failed to add lesson", e);
      setError("Failed to add lesson: " + (e.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const addNewUnit = async () => {
    if (!courseId) return;
    setSaving(true);
    try {
      const unitResult = await instructorApi.createUnit(courseId, {
        title: `Unit ${units.length + 1}`,
        description: "New unit",
        order_index: units.length
      });
      
      // Reload course data
      await loadCourseData();
      setSuccess("Unit added!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      console.error("Failed to add unit", e);
      setError("Failed to add unit: " + (e.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const publishCourse = async () => {
    if (!courseId) {
      alert("Please create a course first");
      return;
    }
    setSaving(true);
    try {
      // First save pricing
      await instructorApi.updateCourse(courseId, {
        price_usd: pricingOption === 'free' ? 0 : price,
        is_free: pricingOption === 'free'
      });
      
      // Then publish
      const result = await instructorApi.publishCourse(courseId);
      alert("Course published successfully!");
      navigate('/instructor/dashboard');
    } catch (e: any) {
      console.error("Failed to publish", e);
      // Check if it's a validation error
      const errorMsg = e.message || "Unknown error";
      if (errorMsg.includes && errorMsg.includes("errors")) {
        try {
          // Try to extract validation errors
          alert("Cannot publish course. Please ensure:\n- Course has a title\n- Course has a description\n- At least one section exists\n- At least one lesson exists");
        } catch (parseErr) {
          alert("Failed to publish: " + errorMsg);
        }
      } else {
        alert("Failed to publish: " + errorMsg);
      }
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    if (!courseId) {
      alert("Please create a course first");
      return;
    }
    setSaving(true);
    try {
      await instructorApi.updateCourse(courseId, {
        price_usd: pricingOption === 'free' ? 0 : price,
        is_free: pricingOption === 'free'
      });
      alert("Draft saved successfully!");
    } catch (e: any) {
      console.error("Failed to save", e);
      alert("Failed to save: " + (e.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const createQuiz = async () => {
    if (!newQuizTitle || !selectedUnitForQuiz) {
      setError("Please enter a quiz title and select a unit");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      console.log("Creating quiz with:", { courseId: courseId, title: newQuizTitle, unit_id: selectedUnitForQuiz });
      
      const result = await instructorApi.createQuiz(courseId!, {
        title: newQuizTitle,
        unit_id: selectedUnitForQuiz,
        passing_score: 70,
        order_index: quizzes.length
      });
      
      console.log("Quiz created successfully:", result);
      
      // Reload course data to get the updated quizzes list
      await loadCourseData();
      
      setNewQuizTitle("");
      setSelectedUnitForQuiz(null);
      setSuccess("Quiz created! Now add questions...");
      
      // Navigate to quiz builder to add questions
      console.log("Navigating to quiz builder:", `/instructor/quiz/${result.quiz_id}`);
      navigate(`/instructor/quiz/${result.quiz_id}`);
    } catch (e: any) {
      console.error("Failed to create quiz", e);
      setError("Failed to create quiz: " + (e.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <InstructorLayout title="Create Course">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#bfff00] text-xl">Loading...</div>
        </div>
      </InstructorLayout>
    );
  }

  const steps = [
    { num: 1, label: 'Basic Info', desc: 'Title, language, level' },
    { num: 2, label: 'Add Lessons', desc: 'Upload videos & content' },
    { num: 3, label: 'Add Quizzes', desc: 'Create practice tests' },
    { num: 4, label: 'Pricing', desc: 'Free or paid' },
  ];

  return (
    <InstructorLayout title="Create Course" subtitle="Set up your new course step by step">
      {/* Step Progress Indicator */}
      <div className="flex gap-2 mb-8">
        {steps.map((step) => (
          <button
            key={step.num}
            type="button"
            disabled={step.num > 1 && !courseId}
            onClick={() => { if (step.num === 1 || courseId) setCurrentStep(step.num); }}
            className={`flex-1 px-4 py-3 rounded-[8px] text-left transition-colors cursor-pointer ${
              currentStep >= step.num ? 'bg-[rgba(191,255,0,0.1)] border border-[#bfff00]' : 'bg-[#1a1a1a] border border-[#2a2a2a]'
            } ${step.num > 1 && !courseId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep > step.num ? 'bg-[#bfff00] text-black' : currentStep === step.num ? 'bg-[#bfff00] text-black' : 'bg-[#2a2a2a] text-[#888]'
              }`}>
                {currentStep > step.num ? '✓' : step.num}
              </span>
              <div>
                <div className={`text-[13px] font-medium ${currentStep >= step.num ? 'text-white' : 'text-[#555]'}`}>{step.label}</div>
                <div className="text-[#555] text-[11px] hidden sm:block">{step.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div>
          {/* Step 1: Create Course */}
          {currentStep === 1 && (
            <div>
              <h1 className="text-[32px] text-white font-bold">
                Create <span className="text-[#bfff00]">New Course</span>
              </h1>
              <p className="text-[#888] mt-2 mb-8">Set up the basics for your course</p>
              
              <div className="max-w-2xl space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-[8px]">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Course Title</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., English for Tourism"
                    className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                  />
                </div>
                
                <div>
                  <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Description</label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="What will students learn?"
                    rows={4}
                    className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Language</label>
                    <select
                      title="Select course language"
                      value={languageId}
                      onChange={(e) => setLanguageId(Number(e.target.value))}
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                    >
                      {languages.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Level</label>
                    <select
                      title="Select course level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Price (USD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                    step={0.01}
                    placeholder="0 for free course"
                    className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                  />
                </div>
                
                <button
                  onClick={() => createCourse()}
                  disabled={saving}
                  className="w-full bg-[#bfff00] text-black font-semibold py-3 rounded-[8px] mt-4 disabled:opacity-50 cursor-pointer hover:bg-[#aeff00]"
                >
                  {saving ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Add Lessons */}
          {currentStep === 2 && courseId && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-[32px] text-white font-bold">
                    Add <span className="text-[#bfff00]">Lessons</span>
                  </h1>
                  <p className="text-[#888] mt-2">Build your curriculum — upload videos and add content</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveDraft} disabled={saving} className="bg-[#1f1f1f] text-white px-4 py-2 rounded-[8px] border border-[#333] hover:bg-[#2a2a2a]">
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button className="bg-[#bfff00] text-black px-4 py-2 rounded-[8px] font-semibold" onClick={publishCourse}>
                    Publish →
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-[8px] mb-6">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-[8px] mb-6">
                  {success}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-8">
                {/* Upload Section */}
                <div>
                  <h2 className="text-white text-[18px] font-bold mb-4">Upload Video Lesson</h2>
                  
                  <div className="border-2 border-dashed border-[#2a2a2a] rounded-[14px] p-8 text-center mb-4">
                    {uploading ? (
                      <div className="text-[#bfff00]">Uploading...</div>
                    ) : (
                      <>
                        <div className="text-[40px] mb-4">📹</div>
                        <div className="text-white mb-2">Drop video here or click to browse</div>
                        <div className="text-[#555] text-sm">MP4, MOV · Max 2GB per video</div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="inline-block mt-4 bg-[#2a2a2a] text-white px-4 py-2 rounded-[8px] cursor-pointer">
                          Browse Files
                        </label>
                        {videoFile && <div className="text-[#bfff00] mt-2">{videoFile.name}</div>}
                      </>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Lesson Title</label>
                    <input
                      type="text"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      placeholder="e.g., Lesson 1 · Welcome & Greetings"
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Description</label>
                    <textarea
                      value={newLessonDesc}
                      onChange={(e) => setNewLessonDesc(e.target.value)}
                      placeholder="What will students learn?"
                      rows={3}
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={() => units[0] && addLesson(units[0].id)}
                    disabled={saving || !units[0]}
                    className="w-full bg-[#bfff00] text-black font-semibold py-3 rounded-[8px] disabled:opacity-50"
                  >
                    {saving ? 'Adding...' : '+ Add Lesson'}
                  </button>
                </div>
                
                {/* Curriculum Section */}
                <div>
                  <h2 className="text-white text-[18px] font-bold mb-4">
                    Curriculum · {units.reduce((sum, u) => sum + u.lessons.length, 0)} Lessons
                  </h2>
                  
                  <button
                    onClick={addNewUnit}
                    disabled={saving}
                    className="mb-4 text-[#bfff00] text-sm hover:underline"
                  >
                    + Add New Unit
                  </button>
                  
                  {units.map((unit) => (
                    <div key={unit.id} className="bg-[#1a1a1a] rounded-[8px] overflow-hidden mb-4">
                      <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
                        <span className="text-white font-medium">{unit.title}</span>
                        <span className="text-[#555] text-sm">📹 {unit.lessons.length}</span>
                      </div>
                      
                      {unit.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {lesson.video_url ? (
                              <button 
                                onClick={() => setPreviewLesson(lesson)}
                                className="w-10 h-10 rounded-full bg-[#bfff00] flex items-center justify-center text-black hover:opacity-80"
                              >
                                ▶
                              </button>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#555]">
                                📹
                              </div>
                            )}
                            <div>
                              <div className="text-white text-[14px]">{lesson.title}</div>
                              {lesson.video_duration_sec && (
                                <div className="text-[#555] text-xs">
                                  {Math.floor(lesson.video_duration_sec / 60)}:{String(lesson.video_duration_sec % 60).padStart(2, '0')}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-[#555] hover:text-white">✏️</button>
                            <button className="text-[#555] hover:text-red-500">🗑</button>
                          </div>
                        </div>
                      ))}
                      
                      {unit.lessons.length === 0 && (
                        <div className="px-4 py-8 text-center text-[#555]">
                          No lessons yet. Add your first lesson!
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-[#bfff00] text-black font-semibold py-3 rounded-[8px]"
                    >
                      Next: Add Quizzes →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add Quizzes */}
          {currentStep === 3 && courseId && (
            <div>
              <h1 className="text-[32px] text-white font-bold">
                Add <span className="text-[#bfff00]">Quizzes</span>
              </h1>
              <p className="text-[#888] mt-2 mb-8">Create practice tests for your students</p>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-[8px] mb-6">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-[8px] mb-6">
                  {success}
                </div>
              )}
              
              {/* Create Quiz Form */}
              <div className="bg-[#1a1a1a] rounded-[14px] p-6 mb-8">
                <h3 className="text-white text-[18px] font-semibold mb-4">Create New Quiz</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Quiz Title</label>
                    <input
                      type="text"
                      value={newQuizTitle}
                      onChange={(e) => setNewQuizTitle(e.target.value)}
                      placeholder="e.g., Unit 1 Assessment"
                      className="w-full bg-[#2a2a2a] text-white rounded-[8px] px-4 py-3 outline-none border border-[#3a3a3a]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">Select Unit</label>
                    <select
                      title="Select unit for quiz"
                      value={selectedUnitForQuiz || ''}
                      onChange={(e) => setSelectedUnitForQuiz(Number(e.target.value))}
                      className="w-full bg-[#2a2a2a] text-white rounded-[8px] px-4 py-3 outline-none border border-[#3a3a3a]"
                    >
                      <option value="">Select a unit</option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={createQuiz}
                  disabled={saving || !newQuizTitle || !selectedUnitForQuiz}
                  className="bg-[#bfff00] text-black font-semibold px-6 py-3 rounded-[8px] disabled:opacity-50"
                >
                  {saving ? 'Creating...' : '+ Create Quiz'}
                </button>
              </div>
              
              {/* Quiz List */}
              <div className="mb-8">
                <h3 className="text-white text-[18px] font-semibold mb-4">
                  Your Quizzes ({quizzes.length})
                </h3>
                
                {quizzes.length === 0 ? (
                  <div className="bg-[#1a1a1a] rounded-[14px] p-8 text-center">
                    <div className="text-[40px] mb-4">📝</div>
                    <div className="text-[#555]">No quizzes yet. Create your first quiz above!</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quizzes.map(quiz => (
                      <div key={quiz.id} className="bg-[#1a1a1a] rounded-[8px] p-4 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{quiz.title}</div>
                          <div className="text-[#555] text-sm">
                            {quiz.questions_count || 0} questions
                          </div>
                        </div>
                        <Link 
                          to={`/instructor/quiz/${quiz.id}`}
                          className="text-[#bfff00] hover:text-white"
                        >
                          + Add Questions
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
                >
                  ← Back to Lessons
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 bg-[#bfff00] text-black font-semibold py-3 rounded-[8px]"
                >
                  Next: Pricing →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && courseId && (
            <div>
              <h1 className="text-[32px] text-white font-bold">
                Set <span className="text-[#bfff00]">Pricing</span>
              </h1>
              <p className="text-[#888] mt-2 mb-8">Choose how to monetize your course</p>
              
              <div className="grid grid-cols-2 gap-6 max-w-3xl">
                {/* Free Option */}
                <div 
                  className={`bg-[#1a1a1a] border-2 rounded-[14px] p-6 cursor-pointer transition-colors ${
                    pricingOption === 'free' ? 'border-[#bfff00]' : 'border-[#2a2a2a]'
                  } hover:border-[#bfff00]`}
                  onClick={() => setPricingOption('free')}
                >
                  <div className="text-[40px] mb-4">🎯</div>
                  <div className="text-white text-[18px] font-semibold mb-2">Free Course</div>
                  <div className="text-[#555] text-sm mb-4">Reach more students with a free course</div>
                  <div className="text-[#bfff00] text-2xl font-bold">$0</div>
                  {pricingOption === 'free' && (
                    <div className="mt-4 bg-[#bfff00] text-black text-center py-2 rounded-[8px] text-sm font-semibold">Selected</div>
                  )}
                </div>
                
                {/* Paid Option */}
                <div 
                  className={`bg-[#1a1a1a] border-2 rounded-[14px] p-6 cursor-pointer transition-colors ${
                    pricingOption === 'paid' ? 'border-[#bfff00]' : 'border-[#2a2a2a]'
                  } hover:border-[#bfff00]`}
                  onClick={() => setPricingOption('paid')}
                >
                  <div className="text-[40px] mb-4">💰</div>
                  <div className="text-white text-[18px] font-semibold mb-2">Paid Course</div>
                  <div className="text-[#555] text-sm mb-4">Earn revenue from your expertise</div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[#555] text-xl">$</span>
                    <input
                      type="number"
                      value={price || ''}
                      onChange={(e) => { setPricingOption('paid'); setPrice(Number(e.target.value)); }}
                      placeholder="19.99"
                      min={1}
                      className="bg-[#2a2a2a] text-white text-2xl font-bold rounded-[8px] px-3 py-2 w-32 outline-none border border-[#3a3a3a]"
                    />
                  </div>
                  {pricingOption === 'paid' && price > 0 && (
                    <div className="mt-4 bg-[#bfff00] text-black text-center py-2 rounded-[8px] text-sm font-semibold">Selected</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
                >
                  ← Back
                </button>
                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="flex-1 bg-[#1f1f1f] text-white font-semibold py-3 rounded-[8px]"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={publishCourse}
                  disabled={saving || (pricingOption === 'paid' && price <= 0)}
                  className="flex-1 bg-[#bfff00] text-black font-semibold py-3 rounded-[8px] disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Publish Course →'}
                </button>
              </div>
            </div>
          )}
          
          {/* Video Preview Modal */}
          {previewLesson && (
            <VideoPreviewModal 
              lesson={previewLesson} 
              onClose={() => setPreviewLesson(null)} 
            />
          )}
        </div>
    </InstructorLayout>
  );
}

// Video Preview Modal
function VideoPreviewModal({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  // Get the base URL for videos
  const videoSrc = lesson.video_url?.startsWith('http') 
    ? lesson.video_url 
    : `http://localhost:8000${lesson.video_url}`;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="bg-[#1a1a1a] rounded-xl p-4 w-full max-w-4xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{lesson.title}</h3>
          <button onClick={onClose} className="text-[#888] hover:text-white text-xl">✕</button>
        </div>
        <video 
          controls 
          autoPlay 
          className="w-full rounded-lg"
          src={videoSrc}
        >
          Your browser does not support video playback.
        </video>
        {lesson.description && (
          <p className="text-[#888] mt-4">{lesson.description}</p>
        )}
      </div>
    </div>
  );
}
