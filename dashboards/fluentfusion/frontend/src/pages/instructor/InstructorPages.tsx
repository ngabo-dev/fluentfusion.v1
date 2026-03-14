import React, { useEffect, useState } from 'react';
import { coursesApi, quizzesApi, sessionsApi, enrollmentsApi, pulseApi, messagesApi, payoutsApi, dashboardApi } from '../../api';
import {
  PageHeader, Card, Table, TR, TD, Avatar, Badge, StatusBadge, Btn, SearchBar,
  Select, Modal, Label, Input, FormGroup, Spinner, EmptyState, Textarea, PulseBar,
  StatCard, ProgressBar, Alert, Mono, PulseBadge, Tabs
} from '../../components/UI';
import { format, formatDistanceToNow } from 'date-fns';

// ── My Courses ────────────────────────────────────────────────
export function InstructorCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', language: '', level: '', price: 0, is_free: false });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    coursesApi.list({ per_page: 50 }).then(d => setCourses(d.items)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const create = async () => {
    setCreating(true);
    try { await coursesApi.create(newCourse); setShowCreate(false); setNewCourse({ title: '', description: '', language: '', level: '', price: 0, is_free: false }); load(); }
    finally { setCreating(false); }
  };

  const submit = async (id: number) => {
    await coursesApi.submit(id); load();
  };

  return (
    <div>
      <PageHeader title="My Courses" subtitle={`${courses.length} courses`}
        actions={<Btn onClick={() => setShowCreate(true)}>+ New Course</Btn>} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." />
      </div>
      {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState icon="📚" message="No courses yet" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {filtered.map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 800, flex: 1 }}>{c.title}</div>
                <StatusBadge status={c.status} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 12 }}>{c.language} {c.level} · {c.total_lessons} lessons</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--neon)' }}>{c.total_enrollments}</div>
                  <div style={{ fontSize: 8, color: 'var(--mu)' }}>STUDENTS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--ok)' }}>{c.rating.toFixed(1)}</div>
                  <div style={{ fontSize: 8, color: 'var(--mu)' }}>RATING</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--in)' }}>{c.is_free ? 'FREE' : `$${c.price}`}</div>
                  <div style={{ fontSize: 8, color: 'var(--mu)' }}>PRICE</div>
                </div>
              </div>
              <div style={{ height: 4, background: 'var(--bdr)', borderRadius: 99, marginBottom: 12 }}>
                <div style={{ width: `${Math.min(100, c.total_enrollments / 10)}%`, height: '100%', background: 'linear-gradient(90deg, var(--neon2), var(--neon))', borderRadius: 99 }} />
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {c.status === 'draft' && <Btn size="sm" variant="primary" onClick={() => submit(c.id)}>Submit for Review</Btn>}
                <Btn size="sm" variant="outline">✏️ Edit</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Course">
        <FormGroup><Label>Title</Label><Input value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="French B2 Advanced..." /></FormGroup>
        <FormGroup><Label>Description</Label><Textarea value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} rows={3} /></FormGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup><Label>Language</Label><Input value={newCourse.language} onChange={e => setNewCourse({ ...newCourse, language: e.target.value })} placeholder="French" /></FormGroup>
          <FormGroup><Label>Level</Label>
            <Select value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}>
              <option value="">Select level...</option>
              {['A1','A2','B1','B2','C1','C2','IELTS','N5','N4','N3'].map(l => <option key={l} value={l}>{l}</option>)}
            </Select>
          </FormGroup>
        </div>
        <FormGroup><Label>Price ($)</Label><Input type="number" value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })} /></FormGroup>
        <Btn loading={creating} onClick={create} style={{ width: '100%' }}>Create Course</Btn>
      </Modal>
    </div>
  );
}

// ── Lessons ───────────────────────────────────────────────────
export function InstructorLessons() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', description: '', duration_minutes: 30, order_index: 1 });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    coursesApi.list({ per_page: 50 }).then(d => {
      setCourses(d.items);
      if (d.items.length > 0) {
        setSelectedCourse(d.items[0]);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      coursesApi.getLessons(selectedCourse.id).then(setLessons);
    }
  }, [selectedCourse]);

  const addLesson = async () => {
    if (!selectedCourse) return;
    setAdding(true);
    try { await coursesApi.addLesson(selectedCourse.id, newLesson); setShowAdd(false); coursesApi.getLessons(selectedCourse.id).then(setLessons); }
    finally { setAdding(false); }
  };

  const deleteLesson = async (lessonId: number) => {
    if (!selectedCourse) return;
    await coursesApi.deleteLesson(selectedCourse.id, lessonId);
    coursesApi.getLessons(selectedCourse.id).then(setLessons);
  };

  return (
    <div>
      <PageHeader title="Lessons" subtitle="Manage lessons across your courses"
        actions={<Btn onClick={() => setShowAdd(true)} disabled={!selectedCourse}>+ Add Lesson</Btn>} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Select value={selectedCourse?.id || ''} onChange={e => {
          const c = courses.find(c => c.id === parseInt(e.target.value));
          setSelectedCourse(c);
        }} style={{ width: 'auto' }}>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </Select>
      </div>
      <Card>
        {loading ? <Spinner /> : lessons.length === 0 ? <EmptyState icon="📹" message="No lessons yet. Add your first lesson!" /> : (
          <Table headers={['#', 'Title', 'Duration', 'Attendees', 'Recorded', 'Actions']}>
            {lessons.map(l => (
              <TR key={l.id}>
                <TD><Mono color="var(--mu)">{l.order_index}</Mono></TD>
                <TD><div style={{ fontWeight: 500 }}>{l.title}</div><div style={{ fontSize: 10, color: 'var(--mu)' }}>{l.description}</div></TD>
                <TD><Mono>{l.duration_minutes}m</Mono></TD>
                <TD><Mono color="var(--in)">{l.attendees}</Mono></TD>
                <TD style={{ color: 'var(--mu)', fontSize: 10 }}>{l.recorded_at ? format(new Date(l.recorded_at), 'MMM d') : '—'}</TD>
                <TD>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Btn size="sm" variant="ghost">✏️</Btn>
                    <Btn size="sm" variant="danger" onClick={() => deleteLesson(l.id)}>🗑️</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Lesson">
        <FormGroup><Label>Title</Label><Input value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} placeholder="Introduction & Overview" /></FormGroup>
        <FormGroup><Label>Description</Label><Textarea value={newLesson.description} onChange={e => setNewLesson({ ...newLesson, description: e.target.value })} rows={2} /></FormGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup><Label>Duration (minutes)</Label><Input type="number" value={newLesson.duration_minutes} onChange={e => setNewLesson({ ...newLesson, duration_minutes: parseInt(e.target.value) || 30 })} /></FormGroup>
          <FormGroup><Label>Order</Label><Input type="number" value={newLesson.order_index} onChange={e => setNewLesson({ ...newLesson, order_index: parseInt(e.target.value) || 1 })} /></FormGroup>
        </div>
        <Btn loading={adding} onClick={addLesson} style={{ width: '100%' }}>Add Lesson</Btn>
      </Modal>
    </div>
  );
}

// ── Quizzes ───────────────────────────────────────────────────
export function InstructorQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', course_id: 0, questions: [] as any[] });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      quizzesApi.list({ course_id: courseFilter || undefined }),
      coursesApi.list({ per_page: 50 }),
    ]).then(([q, c]) => { setQuizzes(q); setCourses(c.items); if (c.items.length && !newQuiz.course_id) setNewQuiz(prev => ({ ...prev, course_id: c.items[0].id })); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [courseFilter]);

  const deleteQuiz = async (id: number) => {
    await quizzesApi.delete(id); load();
  };

  const create = async () => {
    setCreating(true);
    try { await quizzesApi.create(newQuiz.course_id, { title: newQuiz.title, questions: newQuiz.questions }); setShowCreate(false); load(); }
    finally { setCreating(false); }
  };

  return (
    <div>
      <PageHeader title="Quizzes & Assessments" subtitle="Manage assessments for all your courses"
        actions={<Btn onClick={() => setShowCreate(true)}>+ Create Quiz</Btn>} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </Select>
      </div>
      {loading ? <Spinner /> : quizzes.length === 0 ? <EmptyState icon="📝" message="No quizzes yet" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {quizzes.map(q => {
            const course = courses.find(c => c.id === q.course_id);
            return (
              <Card key={q.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800 }}>{q.title}</div>
                </div>
                {course && <Badge variant="info" >{course.title}</Badge>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, margin: '12px 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--neon)' }}>{q.total_questions}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>QUESTIONS</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--ok)' }}>{q.avg_score.toFixed(0)}%</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>AVG SCORE</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--in)' }}>{q.total_attempts}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>ATTEMPTS</div>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--bdr)', borderRadius: 99, marginBottom: 10 }}>
                  <div style={{ width: `${q.avg_score}%`, height: '100%', background: 'linear-gradient(90deg,var(--neon2),var(--neon))', borderRadius: 99 }} />
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <Btn size="sm" variant="outline">✏️ Edit</Btn>
                  <Btn size="sm" variant="ghost">👁️</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteQuiz(q.id)}>🗑️</Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Quiz">
        <FormGroup><Label>Quiz Title</Label><Input value={newQuiz.title} onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })} placeholder="Subjunctive Quiz #1" /></FormGroup>
        <FormGroup>
          <Label>Course</Label>
          <Select value={newQuiz.course_id} onChange={e => setNewQuiz({ ...newQuiz, course_id: parseInt(e.target.value) })}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </FormGroup>
        <Alert type="info">Questions can be added after creating the quiz.</Alert>
        <Btn loading={creating} onClick={create} style={{ width: '100%' }}>Create Quiz</Btn>
      </Modal>
    </div>
  );
}

// ── Live Sessions ─────────────────────────────────────────────
export function InstructorSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', course_id: 0, duration_minutes: 60, max_participants: 100, scheduled_at: '' });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([sessionsApi.list(), coursesApi.list({ per_page: 50 })])
      .then(([s, c]) => { setSessions(s); setCourses(c.items); if (c.items.length && !newSession.course_id) setNewSession(prev => ({ ...prev, course_id: c.items[0].id })); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    setCreating(true);
    try {
      await sessionsApi.create({ ...newSession, scheduled_at: newSession.scheduled_at || null });
      setShowCreate(false); load();
    } finally { setCreating(false); }
  };

  const statusColor: Record<string, string> = { scheduled: 'var(--in)', live: 'var(--ok)', ended: 'var(--mu)' };

  return (
    <div>
      <PageHeader title="Live Sessions" subtitle="Schedule and manage live teaching sessions"
        actions={<Btn onClick={() => setShowCreate(true)}>+ Schedule Session</Btn>} />
      {loading ? <Spinner /> : sessions.length === 0 ? <EmptyState icon="🎥" message="No sessions yet" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map(s => (
            <Card key={s.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[s.status] || 'var(--mu)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.course_title} · {s.duration_minutes}min · max {s.max_participants}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--neon)', marginBottom: 4 }}>
                    {s.scheduled_at ? format(new Date(s.scheduled_at), 'MMM d, yyyy HH:mm') : 'Unscheduled'}
                  </div>
                  <Badge variant={s.status === 'live' ? 'ok' : s.status === 'scheduled' ? 'info' : 'muted'}>{s.status}</Badge>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {s.status === 'scheduled' && <Btn size="sm" variant="primary" onClick={() => sessionsApi.updateStatus(s.id, 'live').then(load)}>Go Live 🔴</Btn>}
                  {s.status === 'live' && <Btn size="sm" variant="danger" onClick={() => sessionsApi.updateStatus(s.id, 'ended').then(load)}>End Session</Btn>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Schedule Live Session">
        <FormGroup><Label>Session Title</Label><Input value={newSession.title} onChange={e => setNewSession({ ...newSession, title: e.target.value })} placeholder="Live Q&A — French B2" /></FormGroup>
        <FormGroup>
          <Label>Course</Label>
          <Select value={newSession.course_id} onChange={e => setNewSession({ ...newSession, course_id: parseInt(e.target.value) })}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </FormGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormGroup><Label>Duration (min)</Label><Input type="number" value={newSession.duration_minutes} onChange={e => setNewSession({ ...newSession, duration_minutes: parseInt(e.target.value) || 60 })} /></FormGroup>
          <FormGroup><Label>Max Participants</Label><Input type="number" value={newSession.max_participants} onChange={e => setNewSession({ ...newSession, max_participants: parseInt(e.target.value) || 100 })} /></FormGroup>
        </div>
        <FormGroup><Label>Scheduled At</Label><Input type="datetime-local" value={newSession.scheduled_at} onChange={e => setNewSession({ ...newSession, scheduled_at: e.target.value })} /></FormGroup>
        <Btn loading={creating} onClick={create} style={{ width: '100%' }}>Schedule Session</Btn>
      </Modal>
    </div>
  );
}

// ── Student Roster ────────────────────────────────────────────
export function InstructorRoster() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pulseFilter, setPulseFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    enrollmentsApi.list({ per_page: 50 }).then(setEnrollments).finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(e => {
    const name = (e.student_name || '').toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    const matchPulse = !pulseFilter || e.pulse_state === pulseFilter;
    return matchSearch && matchPulse;
  });

  return (
    <div>
      <PageHeader title="Student Roster" subtitle={`${enrollments.length} students enrolled across your courses`} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search students..." />
        <Select value={pulseFilter} onChange={e => setPulseFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All PULSE States</option>
          <option value="thriving">🚀 Thriving</option>
          <option value="coasting">😐 Coasting</option>
          <option value="struggling">😓 Struggling</option>
          <option value="burning_out">🔥 Burning Out</option>
          <option value="disengaged">💤 Disengaged</option>
        </Select>
      </div>
      <Card>
        {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState icon="👥" message="No students found" /> : (
          <Table headers={['Student', 'Course', 'PULSE', 'XP', 'Completion', 'Last Active', '']}>
            {filtered.map(e => (
              <TR key={e.id}>
                <TD>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Avatar initials={(e.student_name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="sm" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{e.student_name}</div>
                      <div style={{ fontSize: 10, color: 'var(--mu)' }}>{e.student_email}</div>
                    </div>
                  </div>
                </TD>
                <TD style={{ color: 'var(--mu)' }}>{e.course_title}</TD>
                <TD>{e.pulse_state ? <PulseBadge state={e.pulse_state} /> : <Badge>—</Badge>}</TD>
                <TD><Mono color="var(--neon)">{(e.xp || 0).toLocaleString()}</Mono></TD>
                <TD style={{ minWidth: 140 }}><ProgressBar value={e.progress_percent} /></TD>
                <TD style={{ color: e.last_active_at ? 'var(--mu)' : 'var(--er)', fontSize: 10 }}>
                  {e.last_active_at ? formatDistanceToNow(new Date(e.last_active_at), { addSuffix: true }) : 'Never'}
                </TD>
                <TD>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Btn size="sm" variant="ghost">👁️</Btn>
                    <Btn size="sm" variant={['burning_out', 'disengaged'].includes(e.pulse_state || '') ? 'primary' : 'ghost'}>💬</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

// ── PULSE Insights ────────────────────────────────────────────
export function InstructorPulse() {
  const [pulse, setPulse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { pulseApi.stats().then(setPulse).finally(() => setLoading(false)); }, []);

  if (loading) return <Spinner />;
  const total = pulse?.total || 1;

  return (
    <div>
      <PageHeader title="PULSE Insights" subtitle={`AI-powered learner state analysis · ${total} students`}
        actions={<span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--mu)' }}>Last run: 2h ago</span>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { key: 'thriving', label: '🚀 Thriving', color: 'ok' },
          { key: 'coasting', label: '😐 Coasting', color: 'info' },
          { key: 'struggling', label: '😓 Struggling', color: 'warn' },
          { key: 'burning_out', label: '🔥 Burning Out', color: 'warn' },
          { key: 'disengaged', label: '💤 Disengaged', color: 'error' },
        ].map(item => (
          <StatCard key={item.key} label={item.label} value={pulse?.[item.key] || 0}
            sub={`${Math.round((pulse?.[item.key] || 0) / total * 100)}%`}
            color={item.color} accent={item.color} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <Card><div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 14 }}>State Distribution</div><PulseBar {...pulse} /></Card>
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>At-Risk Students</div>
          <div style={{ padding: 12, background: 'rgba(255,68,68,.06)', border: '1px solid rgba(255,68,68,.15)', borderRadius: 'var(--r)', marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--mu)' }}>AT-RISK</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--er)' }}>
              {(pulse?.burning_out || 0) + (pulse?.disengaged || 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--mu)' }}>Need intervention</div>
          </div>
          <Btn size="sm" variant="primary" style={{ width: '100%' }}>Message At-Risk Students</Btn>
        </Card>
      </div>
    </div>
  );
}

// ── Messages ──────────────────────────────────────────────────
export function InstructorMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ recipient_id: 0, subject: '', body: '' });
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    messagesApi.list().then(setMessages).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await messagesApi.markRead(id); load();
  };

  const send = async () => {
    setSending(true);
    try { await messagesApi.send(compose); setShowCompose(false); setCompose({ recipient_id: 0, subject: '', body: '' }); load(); }
    finally { setSending(false); }
  };

  const unread = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${unread} unread messages`}
        actions={<Btn onClick={() => setShowCompose(true)}>✉️ Compose</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
        <Card style={{ padding: 0 }}>
          {loading ? <div style={{ padding: 20 }}><Spinner /></div> : messages.length === 0 ? <EmptyState icon="📭" message="No messages" /> : (
            <div>
              {messages.map(m => (
                <div key={m.id} onClick={() => { setSelected(m); if (!m.is_read) markRead(m.id); }}
                  style={{
                    padding: '12px 16px', borderBottom: '1px solid var(--bdr)', cursor: 'pointer',
                    background: selected?.id === m.id ? 'var(--ndim)' : m.is_read ? 'transparent' : 'rgba(191,255,0,.03)',
                    borderLeft: `2px solid ${selected?.id === m.id ? 'var(--neon)' : 'transparent'}`,
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <div style={{ fontWeight: m.is_read ? 400 : 600, fontSize: 12 }}>{m.sender_name}</div>
                    <div style={{ fontSize: 9, color: 'var(--mu)' }}>{formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject || m.body}</div>
                  {!m.is_read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', marginTop: 4 }} />}
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          {selected ? (
            <div>
              <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--bdr)' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{selected.subject || 'No subject'}</div>
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>From {selected.sender_name} · {format(new Date(selected.created_at), 'MMM d, yyyy HH:mm')}</div>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--fg)' }}>{selected.body}</div>
            </div>
          ) : (
            <EmptyState icon="💬" message="Select a message to read" />
          )}
        </Card>
      </div>
      <Modal open={showCompose} onClose={() => setShowCompose(false)} title="Compose Message">
        <FormGroup><Label>Recipient ID</Label><Input type="number" value={compose.recipient_id} onChange={e => setCompose({ ...compose, recipient_id: parseInt(e.target.value) || 0 })} placeholder="User ID..." /></FormGroup>
        <FormGroup><Label>Subject</Label><Input value={compose.subject} onChange={e => setCompose({ ...compose, subject: e.target.value })} placeholder="Subject..." /></FormGroup>
        <FormGroup><Label>Message</Label><Textarea value={compose.body} onChange={e => setCompose({ ...compose, body: e.target.value })} rows={5} placeholder="Write your message..." /></FormGroup>
        <Btn loading={sending} onClick={send} style={{ width: '100%' }}>Send Message</Btn>
      </Modal>
    </div>
  );
}

// ── Earnings ──────────────────────────────────────────────────
export function InstructorEarnings() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([payoutsApi.list(), dashboardApi.instructorStats()])
      .then(([p, s]) => { setPayouts(p); setStats(s); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const total = payouts.reduce((s, p) => s + p.amount, 0);
  const approved = payouts.filter(p => p.status === 'approved').reduce((s, p) => s + p.amount, 0);
  const pending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader title="Earnings" subtitle="Your instructor revenue and payout history" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        <StatCard label="Total Earned" value={`$${total.toFixed(2)}`} sub="All time" color="neon" />
        <StatCard label="Approved" value={`$${approved.toFixed(2)}`} sub="Paid out" color="ok" accent="ok" />
        <StatCard label="Pending" value={`$${pending.toFixed(2)}`} sub="Awaiting processing" color="warn" accent="warn" />
      </div>
      <Card>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Payout History</div>
        {payouts.length === 0 ? <EmptyState icon="💸" message="No payouts yet" /> : (
          <Table headers={['Period', 'Amount', 'Status', 'Processed']}>
            {payouts.map(p => (
              <TR key={p.id}>
                <TD style={{ color: 'var(--mu)', fontSize: 10 }}>
                  {p.period_start ? format(new Date(p.period_start), 'MMM d') : '—'} – {p.period_end ? format(new Date(p.period_end), 'MMM d, yyyy') : '—'}
                </TD>
                <TD><Mono color="var(--neon)">${p.amount.toFixed(2)}</Mono></TD>
                <TD><StatusBadge status={p.status} /></TD>
                <TD style={{ color: 'var(--mu)', fontSize: 10 }}>
                  {p.processed_at ? format(new Date(p.processed_at), 'MMM d, yyyy') : '—'}
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
