import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { instructorApi, API_BASE_URL } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import { toast } from "sonner";

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
  language?: string;
  level?: string;
  is_published: boolean;
}

export default function InstructorCurriculumEditor() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<number | null>(null);
  const [newUnit, setNewUnit] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState({
    title: '',
    lesson_type: 'video' as 'video' | 'audio' | 'text' | 'exercise',
    video_url: '',
    video_duration_sec: 0,
    is_free_preview: false
  });

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) { navigate('/login'); return; }
    try {
      const parsed = JSON.parse(userData);
      if (!['instructor', 'admin', 'super_admin'].includes(parsed.role)) { navigate('/dashboard'); return; }
    } catch { navigate('/login'); return; }
    if (courseId) fetchCourseData();
  }, [navigate, courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const cid = Number(courseId);
      const [courseRes, unitsRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/courses/${cid}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('ff_access_token')}` }
        }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
        instructorApi.getCourseUnits(cid)
      ]);

      if (courseRes.status === 'fulfilled') {
        const data = courseRes.value;
        if (!data || data.detail) throw new Error('Course not found');
        const c = data.course || data;
        setCourse({ id: cid, title: c.title || `Course ${cid}`, description: c.description || '', language: c.language, level: c.level, is_published: c.is_published || false });
      } else {
        setCourse({ id: cid, title: `Course ${cid}`, description: '', is_published: false });
      }

      if (unitsRes.status === 'fulfilled') {
        setUnits(unitsRes.value.units || []);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async () => {
    if (!newUnit.title || !courseId) return;
    setSaving(true);
    try {
      const res = await instructorApi.createUnit(Number(courseId), { title: newUnit.title, description: newUnit.description, order_index: units.length });
      setUnits([...units, { id: res.unit_id, title: newUnit.title, description: newUnit.description, order_index: units.length, lessons: [] }]);
      setNewUnit({ title: '', description: '' });
      setShowAddUnit(false);
      toast.success('Unit added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add unit');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async (unitId: number) => {
    if (!newLesson.title) return;
    setSaving(true);
    try {
      const unit = units.find(u => u.id === unitId);
      const res = await instructorApi.createLesson(unitId, {
        title: newLesson.title,
        lesson_type: newLesson.lesson_type,
        video_url: newLesson.video_url || undefined,
        video_duration_sec: newLesson.video_duration_sec || undefined,
        is_free_preview: newLesson.is_free_preview,
        order_index: unit?.lessons.length || 0
      });
      setUnits(units.map(u => u.id === unitId ? {
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
      } : u));
      setNewLesson({ title: '', lesson_type: 'video', video_url: '', video_duration_sec: 0, is_free_preview: false });
      setShowAddLesson(null);
      toast.success('Lesson added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (!window.confirm('Delete this unit and all its lessons?')) return;
    try {
      setUnits(units.filter(u => u.id !== unitId));
      toast.success('Unit deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete unit');
    }
  };

  const handleDeleteLesson = async (unitId: number, lessonId: number) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      setUnits(units.map(u => u.id === unitId ? { ...u, lessons: u.lessons.filter(l => l.id !== lessonId) } : u));
      toast.success('Lesson deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete lesson');
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

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video Lesson';
      case 'audio': return 'Audio Lesson';
      case 'text': return 'Text Lesson';
      case 'exercise': return 'Exercise';
      default: return 'Lesson';
    }
  };

  const totalLessons = units.reduce((sum, u) => sum + u.lessons.length, 0);

  const headerAction = (
    <div className="flex items-center gap-3">
      <Link to="/instructor/my-courses" className="bg-[#1a1a1a] text-[#888] px-4 py-2.5 rounded-lg border border-[#2a2a2a] text-[13px] no-underline hover:text-white transition-colors">
        ← Back to Courses
      </Link>
      {course && (
        <Link to={`/course/${course.id}`} className="bg-[#1a1a1a] text-white px-4 py-2.5 rounded-lg border border-[#2a2a2a] text-[13px] no-underline hover:border-[#bfff00] transition-colors">
          Preview Course
        </Link>
      )}
    </div>
  );

  return (
    <InstructorLayout
      title={loading ? 'Curriculum Editor' : `${course?.title || 'Course'} — Curriculum`}
      subtitle={loading ? '' : `${course?.language || ''} · ${course?.level?.toUpperCase() || ''} · ${units.length} sections · ${totalLessons} lessons`}
      headerAction={headerAction}
    >
      {loading ? (
        <div className="text-center py-16 text-[#bfff00]">Loading curriculum...</div>
      ) : (
        <div className="space-y-4">
          {units.map((unit, unitIndex) => (
            <div key={unit.id} className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden">
              {/* Unit Header */}
              <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#555] text-[12px] font-mono bg-[#0f0f0f] px-2 py-0.5 rounded">§{unitIndex + 1}</span>
                  <div>
                    <h3 className="text-white font-semibold text-[14px]">{unit.title}</h3>
                    {unit.description && <p className="text-[#555] text-[11px] mt-0.5">{unit.description}</p>}
                  </div>
                  <span className="text-[#555] text-[11px] ml-2">{unit.lessons.length} lesson{unit.lessons.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowAddLesson(unit.id)} className="text-[#bfff00] text-[13px] hover:underline">+ Add Lesson</button>
                  <button onClick={() => handleDeleteUnit(unit.id)} className="text-red-500 text-[13px] hover:underline">Delete</button>
                </div>
              </div>

              {/* Lessons */}
              <div className="p-4">
                {unit.lessons.length === 0 ? (
                  <div className="text-center py-8 text-[#555] text-[13px]">
                    No lessons yet. Click "+ Add Lesson" to add content to this section.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {unit.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center gap-4 p-3 bg-[#0f0f0f] rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                        <span className="text-[#555] text-[12px] w-5 flex-shrink-0">{lessonIndex + 1}.</span>
                        <span className="text-[18px]">{getLessonTypeIcon(lesson.lesson_type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-[13px] font-medium truncate">{lesson.title}</div>
                          <div className="text-[#555] text-[11px]">{getLessonTypeLabel(lesson.lesson_type)}{lesson.video_duration_sec ? ` · ${Math.floor(lesson.video_duration_sec / 60)}m ${lesson.video_duration_sec % 60}s` : ''}</div>
                        </div>
                        {lesson.is_free_preview && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(191,255,0,0.1)] text-[#bfff00] flex-shrink-0">Free Preview</span>
                        )}
                        <button onClick={() => handleDeleteLesson(unit.id, lesson.id)} className="text-[#555] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-[16px]">🗑️</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Lesson Form */}
              {showAddLesson === unit.id && (
                <div className="border-t border-[#2a2a2a] p-6 bg-[#0f0f0f]">
                  <h4 className="text-white font-semibold text-[14px] mb-4">Add New Lesson to "{unit.title}"</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Lesson Title *</label>
                      <input
                        type="text"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        placeholder="e.g. Introduction to Grammar..."
                        className="w-full bg-[#151515] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Content Type</label>
                        <select
                          value={newLesson.lesson_type}
                          onChange={(e) => setNewLesson({ ...newLesson, lesson_type: e.target.value as any })}
                          className="w-full bg-[#151515] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] text-[13px]"
                        >
                          <option value="video">🎥 Video</option>
                          <option value="audio">🎧 Audio</option>
                          <option value="text">📄 Text / Article</option>
                          <option value="exercise">✏️ Exercise</option>
                        </select>
                      </div>
                      {(newLesson.lesson_type === 'video' || newLesson.lesson_type === 'audio') && (
                        <div>
                          <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Duration (seconds)</label>
                          <input
                            type="number"
                            min={0}
                            value={newLesson.video_duration_sec}
                            onChange={(e) => setNewLesson({ ...newLesson, video_duration_sec: Number(e.target.value) })}
                            className="w-full bg-[#151515] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] text-[13px]"
                          />
                        </div>
                      )}
                    </div>
                    {(newLesson.lesson_type === 'video' || newLesson.lesson_type === 'audio') && (
                      <div>
                        <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Media URL</label>
                        <input
                          type="text"
                          value={newLesson.video_url}
                          onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-[#151515] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`freePreview-${unit.id}`}
                        checked={newLesson.is_free_preview}
                        onChange={(e) => setNewLesson({ ...newLesson, is_free_preview: e.target.checked })}
                        className="w-4 h-4 accent-[#bfff00]"
                      />
                      <label htmlFor={`freePreview-${unit.id}`} className="text-white text-[13px]">Free preview (accessible without enrollment)</label>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowAddLesson(null)} className="flex-1 bg-[#151515] text-[#888] py-2.5 rounded-lg text-[13px] hover:text-white transition-colors">Cancel</button>
                      <button onClick={() => handleAddLesson(unit.id)} disabled={saving || !newLesson.title} className="flex-1 bg-[#bfff00] text-black py-2.5 rounded-lg font-semibold text-[13px] disabled:opacity-50">
                        {saving ? 'Adding...' : 'Add Lesson'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Unit Section */}
          {showAddUnit ? (
            <div className="bg-[#151515] border border-[#bfff00]/30 rounded-xl p-6">
              <h4 className="text-white font-semibold text-[14px] mb-4">Add New Section</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Section Title *</label>
                  <input
                    type="text"
                    value={newUnit.title}
                    onChange={(e) => setNewUnit({ ...newUnit, title: e.target.value })}
                    placeholder="e.g. Getting Started, Module 1..."
                    className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Description (optional)</label>
                  <textarea
                    value={newUnit.description}
                    onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
                    placeholder="Brief overview of what's covered in this section..."
                    rows={2}
                    className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors resize-none text-[13px]"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setShowAddUnit(false); setNewUnit({ title: '', description: '' }); }} className="flex-1 bg-[#0f0f0f] text-[#888] py-2.5 rounded-lg text-[13px] hover:text-white transition-colors">Cancel</button>
                  <button onClick={handleAddUnit} disabled={saving || !newUnit.title} className="flex-1 bg-[#bfff00] text-black py-2.5 rounded-lg font-semibold text-[13px] disabled:opacity-50">
                    {saving ? 'Adding...' : 'Add Section'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddUnit(true)}
              className="w-full bg-[#151515] border border-dashed border-[#2a2a2a] rounded-xl py-6 text-[#888] hover:text-white hover:border-[#bfff00] transition-colors text-[13px]"
            >
              + Add New Section
            </button>
          )}

          {/* Course Stats Summary */}
          {units.length > 0 && (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-[#bfff00] font-bold text-[20px]">{units.length}</div>
                  <div className="text-[#555] text-[11px]">Sections</div>
                </div>
                <div>
                  <div className="text-[#bfff00] font-bold text-[20px]">{totalLessons}</div>
                  <div className="text-[#555] text-[11px]">Lessons</div>
                </div>
                <div>
                  <div className="text-[#bfff00] font-bold text-[20px]">{units.reduce((s, u) => s + u.lessons.filter(l => l.is_free_preview).length, 0)}</div>
                  <div className="text-[#555] text-[11px]">Free Previews</div>
                </div>
              </div>
              <Link to={`/instructor/quiz/new/${courseId}`} className="bg-[#1a1a1a] text-[#bfff00] px-4 py-2 rounded-lg text-[13px] no-underline border border-[#2a2a2a] hover:border-[#bfff00] transition-colors">
                + Add Quiz
              </Link>
            </div>
          )}
        </div>
      )}
    </InstructorLayout>
  );
}
