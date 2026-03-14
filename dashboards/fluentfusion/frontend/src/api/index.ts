import axios from 'axios';

const BASE_URL = ((import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ff_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  register: (data: any) => api.post('/auth/register', data).then(r => r.data),
};

// ── Dashboard ─────────────────────────────────────────────────
export const dashboardApi = {
  adminStats: () => api.get('/dashboard/admin').then(r => r.data),
  instructorStats: () => api.get('/dashboard/instructor').then(r => r.data),
  revenueTrend: () => api.get('/dashboard/admin/revenue-trend').then(r => r.data),
  pulsePlatform: () => api.get('/dashboard/admin/pulse-platform').then(r => r.data),
};

// ── Users ─────────────────────────────────────────────────────
export const usersApi = {
  list: (params?: any) => api.get('/users', { params }).then(r => r.data),
  listInstructors: (params?: any) => api.get('/users/instructors', { params }).then(r => r.data),
  get: (id: number) => api.get(`/users/${id}`).then(r => r.data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data).then(r => r.data),
  ban: (id: number) => api.post(`/users/${id}/ban`).then(r => r.data),
  unban: (id: number) => api.post(`/users/${id}/unban`).then(r => r.data),
  verify: (id: number) => api.post(`/users/${id}/verify`).then(r => r.data),
  create: (data: any) => api.post('/users', data).then(r => r.data),
};

// ── Courses ───────────────────────────────────────────────────
export const coursesApi = {
  list: (params?: any) => api.get('/courses', { params }).then(r => r.data),
  get: (id: number) => api.get(`/courses/${id}`).then(r => r.data),
  create: (data: any) => api.post('/courses', data).then(r => r.data),
  update: (id: number, data: any) => api.patch(`/courses/${id}`, data).then(r => r.data),
  approve: (id: number) => api.post(`/courses/${id}/approve`).then(r => r.data),
  reject: (id: number, reason: string) =>
    api.post(`/courses/${id}/reject`, null, { params: { reason } }).then(r => r.data),
  submit: (id: number) => api.post(`/courses/${id}/submit`).then(r => r.data),
  getLessons: (id: number) => api.get(`/courses/${id}/lessons`).then(r => r.data),
  addLesson: (courseId: number, data: any) =>
    api.post(`/courses/${courseId}/lessons`, data).then(r => r.data),
  deleteLesson: (courseId: number, lessonId: number) =>
    api.delete(`/courses/${courseId}/lessons/${lessonId}`).then(r => r.data),
};

// ── Enrollments ───────────────────────────────────────────────
export const enrollmentsApi = {
  list: (params?: any) => api.get('/enrollments', { params }).then(r => r.data),
};

// ── Pulse ─────────────────────────────────────────────────────
export const pulseApi = {
  stats: (params?: any) => api.get('/pulse/stats', { params }).then(r => r.data),
};

// ── Quizzes ───────────────────────────────────────────────────
export const quizzesApi = {
  list: (params?: any) => api.get('/quizzes', { params }).then(r => r.data),
  create: (courseId: number, data: any) =>
    api.post('/quizzes', data, { params: { course_id: courseId } }).then(r => r.data),
  update: (id: number, data: any) => api.patch(`/quizzes/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/quizzes/${id}`).then(r => r.data),
};

// ── Messages ──────────────────────────────────────────────────
export const messagesApi = {
  list: () => api.get('/messages').then(r => r.data),
  send: (data: any) => api.post('/messages', data).then(r => r.data),
  markRead: (id: number) => api.post(`/messages/${id}/read`).then(r => r.data),
};

// ── Notifications ─────────────────────────────────────────────
export const notificationsApi = {
  list: () => api.get('/notifications').then(r => r.data),
  send: (data: any) => api.post('/notifications', data).then(r => r.data),
};

// ── Payouts ───────────────────────────────────────────────────
export const payoutsApi = {
  list: (params?: any) => api.get('/payouts', { params }).then(r => r.data),
  update: (id: number, data: any) => api.patch(`/payouts/${id}`, data).then(r => r.data),
};

// ── Audit ─────────────────────────────────────────────────────
export const auditApi = {
  list: (params?: any) => api.get('/audit', { params }).then(r => r.data),
};

// ── Settings ──────────────────────────────────────────────────
export const settingsApi = {
  list: (category?: string) =>
    api.get('/settings', { params: category ? { category } : {} }).then(r => r.data),
  update: (key: string, value: string) =>
    api.patch(`/settings/${key}`, { value }).then(r => r.data),
};

// ── Sessions ──────────────────────────────────────────────────
export const sessionsApi = {
  list: (params?: any) => api.get('/sessions', { params }).then(r => r.data),
  create: (data: any) => api.post('/sessions', data).then(r => r.data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/sessions/${id}/status`, null, { params: { status } }).then(r => r.data),
};
