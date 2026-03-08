import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { instructorApi } from "../app/api/config";

interface Lesson {
  id: number;
  title: string;
  lesson_type: "video" | "audio" | "text" | "exercise";
  order_index: number;
  is_free_preview: boolean;
  video_url?: string;
  video_duration_sec?: number;
}

interface Unit {
  id: number;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  language: string;
  level: string;
  is_published: boolean;
}

export default function InstructorCurriculumEditor() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<number | null>(null);
  const [newUnit, setNewUnit] = useState({ title: "", description: "" });
  const [newLesson, setNewLesson] = useState({
    title: "",
    lesson_type: "video" as "video" | "audio" | "text" | "exercise",
    video_url: "",
    video_duration_sec: 0,
    is_free_preview: false
  });

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role && !['instructor', 'admin'].includes(parsed.role)) {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    if (courseId) {
      fetchCourseData();
    }
  }, [navigate, courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseRes, unitsRes] = await Promise.all([
        // TODO: Replace with actual API
        Promise.resolve({
          id: Number(courseId),
          title: "Kinyarwanda for Beginners",
          description: "Learn the basics of Kinyarwanda language",
          language: "Kinyarwanda",
          level: "A1",
          is_published: true
        }),
        instructorApi.getCourseUnits(Number(courseId))
      ]);
      setCourse(courseRes);
      setUnits(unitsRes.units || []);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async () => {
    if (!newUnit.title || !courseId) return;
    setSaving(true);
    try {
      const res = await instructorApi.createUnit(Number(courseId), {
        title: newUnit.title,
        description: newUnit.description,
        order_index: units.length
      });
      setUnits([...units, {
        id: res.unit_id,
        title: newUnit.title,
        description: newUnit.description,
        order_index: units.length,
        lessons: []
      }]);
      setNewUnit({ title: "", description: "" });
      setShowAddUnit(false);
    } catch (error) {
      console.error('Failed to add unit:', error);
      alert('Failed to add unit');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async (unitId: number) => {
    if (!newLesson.title) return;
    setSaving(true);
    try {
      const res = await instructorApi.createLesson(unitId, {
        title: newLesson.title,
        lesson_type: newLesson.lesson_type,
        video_url: newLesson.video_url,
        video_duration_sec: newLesson.video_duration_sec,
        is_free_preview: newLesson.is_free_preview,
        order_index: units.find(u => u.id === unitId)?.lessons.length || 0
      });
      
      setUnits(units.map(u => {
        if (u.id === unitId) {
          return {
            ...u,
            lessons: [...u.lessons, {
              id: res.lesson_id,
              title: newLesson.title,
              lesson_type: newLesson.lesson_type,
              order_index: u.lessons.length,
              is_free_preview: newLesson.is_free_preview,
              video_url: newLesson.video_url,
              video_duration_sec: newLesson.video_duration_sec
            }]
          };
        }
        return u;
      }));
      
      setNewLesson({
        title: "",
        lesson_type: "video",
        video_url: "",
        video_duration_sec: 0,
        is_free_preview: false
      });
      setShowAddLesson(null);
    } catch (error) {
      console.error('Failed to add lesson:', error);
      alert('Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (!confirm("Are you sure you want to delete this unit and all its lessons?")) return;
    try {
      // TODO: Add delete unit API
      setUnits(units.filter(u => u.id !== unitId));
    } catch (error) {
      console.error('Failed to delete unit:', error);
    }
  };

  const handleDeleteLesson = async (unitId: number, lessonId: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      // TODO: Add delete lesson API
      setUnits(units.map(u => {
        if (u.id === unitId) {
          return {
            ...u,
            lessons: u.lessons.filter(l => l.id !== lessonId)
          };
        }
        return u;
      }));
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎧';
      case 'text': return '📄';
      case 'exercise': return '✏️';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/instructor/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(191,255,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#bfff00] text-[11px] font-semibold">📋 Instructor</span>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('ff_access_token');
                  localStorage.removeItem('ff_refresh_token');
                  localStorage.removeItem('ff_user');
                  navigate('/login');
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Instructor</div>
            
            <Link to="/instructor/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Overview</span>
            </Link>
            
            <Link to="/instructor/create-course" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Create Course</span>
            </Link>
            
            <Link to="/instructor/students" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Students</span>
            </Link>
            
            <Link to="/instructor/certificates" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎓</span>
              <span className="text-[14px]">Certificates</span>
            </Link>
            
            <Link to="/instructor/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📢</span>
              <span className="text-[14px]">Announcements</span>
            </Link>
            
            <Link to="/instructor/messages" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>💬</span>
              <span className="text-[14px]">Messages</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link to="/instructor/dashboard" className="text-[#888] hover:text-white">← Back</Link>
              </div>
              <h1 className="text-[32px] text-white font-bold">
                <span className="text-[#bfff00]">Curriculum Editor</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                {course?.title} • {course?.language} • {course?.level}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#1f1f1f] text-white px-4 py-2 rounded-[8px] border border-[#2a2a2a]">
                Preview
              </button>
              <button className="bg-[#bfff00] text-black px-4 py-2 rounded-[8px] font-semibold">
                Save Changes
              </button>
            </div>
          </div>

          {/* Units & Lessons */}
          <div className="space-y-4">
            {units.map((unit, unitIndex) => (
              <div key={unit.id} className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
                <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[#555] text-sm">Unit {unitIndex + 1}</span>
                    <h3 className="text-white font-bold">{unit.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowAddLesson(unit.id)}
                      className="text-[#bfff00] text-sm hover:underline"
                    >
                      + Add Lesson
                    </button>
                    <button 
                      onClick={() => handleDeleteUnit(unit.id)}
                      className="text-red-500 text-sm hover:underline ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {unit.lessons.length === 0 ? (
                    <div className="text-center py-8 text-[#555]">
                      No lessons yet. Click "+ Add Lesson" to add content.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {unit.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lesson.id} 
                          className="flex items-center gap-4 p-3 bg-[#1f1f1f] rounded-[8px] hover:bg-[#252525] transition-colors"
                        >
                          <span className="text-[#555] text-sm w-6">{lessonIndex + 1}.</span>
                          <span className="text-xl">{getLessonTypeIcon(lesson.lesson_type)}</span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{lesson.title}</div>
                            <div className="text-[#555] text-xs capitalize">{lesson.lesson_type}</div>
                          </div>
                          {lesson.is_free_preview && (
                            <span className="px-2 py-1 rounded-[4px] text-xs bg-[rgba(191,255,0,0.1)] text-[#bfff00]">
                              Free Preview
                            </span>
                          )}
                          <button 
                            onClick={() => handleDeleteLesson(unit.id, lesson.id)}
                            className="text-[#555] hover:text-red-500"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Lesson Modal */}
                {showAddLesson === unit.id && (
                  <div className="border-t border-[#2a2a2a] p-6 bg-[#151515]">
                    <h4 className="text-white font-bold mb-4">Add New Lesson</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[#888] text-xs uppercase block mb-2">Lesson Title</label>
                        <input
                          type="text"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                          placeholder="Enter lesson title..."
                          className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                        />
                      </div>
                      <div>
                        <label className="text-[#888] text-xs uppercase block mb-2">Lesson Type</label>
                        <select
                          value={newLesson.lesson_type}
                          onChange={(e) => setNewLesson({ ...newLesson, lesson_type: e.target.value as any })}
                          className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                        >
                          <option value="video">Video</option>
                          <option value="audio">Audio</option>
                          <option value="text">Text</option>
                          <option value="exercise">Exercise</option>
                        </select>
                      </div>
                      {newLesson.lesson_type === 'video' && (
                        <>
                          <div>
                            <label className="text-[#888] text-xs uppercase block mb-2">Video URL</label>
                            <input
                              type="text"
                              value={newLesson.video_url}
                              onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
                              placeholder="Enter video URL..."
                              className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                            />
                          </div>
                          <div>
                            <label className="text-[#888] text-xs uppercase block mb-2">Duration (seconds)</label>
                            <input
                              type="number"
                              value={newLesson.video_duration_sec}
                              onChange={(e) => setNewLesson({ ...newLesson, video_duration_sec: Number(e.target.value) })}
                              placeholder="Enter video duration..."
                              className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                            />
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="freePreview"
                          checked={newLesson.is_free_preview}
                          onChange={(e) => setNewLesson({ ...newLesson, is_free_preview: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label htmlFor="freePreview" className="text-white text-sm">Free preview (available without enrollment)</label>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setShowAddLesson(null)}
                          className="flex-1 bg-[#1f1f1f] text-[#888] py-2 rounded-[8px]"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleAddLesson(unit.id)}
                          disabled={saving || !newLesson.title}
                          className="flex-1 bg-[#bfff00] text-black py-2 rounded-[8px] font-semibold disabled:opacity-50"
                        >
                          {saving ? 'Adding...' : 'Add Lesson'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Unit Button */}
            {showAddUnit ? (
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
                <h4 className="text-white font-bold mb-4">Add New Unit</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#888] text-xs uppercase block mb-2">Unit Title</label>
                    <input
                      type="text"
                      value={newUnit.title}
                      onChange={(e) => setNewUnit({ ...newUnit, title: e.target.value })}
                      placeholder="Enter unit title..."
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                    />
                  </div>
                  <div>
                    <label className="text-[#888] text-xs uppercase block mb-2">Description (optional)</label>
                    <textarea
                      value={newUnit.description}
                      onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
                      placeholder="Enter unit description..."
                      rows={2}
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowAddUnit(false)}
                      className="flex-1 bg-[#1f1f1f] text-[#888] py-2 rounded-[8px]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddUnit}
                      disabled={saving || !newUnit.title}
                      className="flex-1 bg-[#bfff00] text-black py-2 rounded-[8px] font-semibold disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add Unit'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowAddUnit(true)}
                className="w-full bg-[#1f1f1f] border border-dashed border-[#2a2a2a] rounded-[14px] py-6 text-[#888] hover:text-white hover:border-[#bfff00] transition-colors"
              >
                + Add New Unit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
