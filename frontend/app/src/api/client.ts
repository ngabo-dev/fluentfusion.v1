// API Configuration for FluentFusion
// Backend URL - uses environment variable or defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

// Token & Session Configuration (matching backend)
const ACCESS_TOKEN_EXPIRE_MINUTES = 480;  // 8 hours
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;  // 1 hour of inactivity

// Session Management Functions
function getTokenExpiry(): number | null {
  const expiry = localStorage.getItem('ff_token_expiry');
  return expiry ? parseInt(expiry, 10) : null;
}

function setTokenExpiry(expiresInSeconds: number): void {
  const expiryTime = Date.now() + (expiresInSeconds * 1000);
  localStorage.setItem('ff_token_expiry', expiryTime.toString());
}

function isTokenExpired(): boolean {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  return Date.now() >= expiry;
}

// Inactivity tracking
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let lastActivityTime = Date.now();

function resetInactivityTimer(): void {
  lastActivityTime = Date.now();
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    // User has been inactive for 1 hour - logout
    console.log('Session timed out due to inactivity');
    authApi.logout();
    window.location.href = '/login?reason=inactivity';
  }, INACTIVITY_TIMEOUT_MS);
}

function setupInactivityListeners(): void {
  // Reset timer on user activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
  events.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();
}

// Check auth and redirect if needed
function checkAuthAndRedirect(): void {
  const token = localStorage.getItem('ff_access_token');
  const user = localStorage.getItem('ff_user');
  
  if (!token || !user || isTokenExpired()) {
    authApi.logout();
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login?reason=expired';
    }
  }
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('ff_access_token');
  
  // Check if token is expired before making any request
  if (token && isTokenExpired()) {
    console.log('Token expired, logging out...');
    authApi.logout();
    window.location.href = '/login?reason=expired';
    throw new Error('Session expired. Please login again.');
  }
  
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  const response = await fetch(url, config);

  // Parse response - handle both success and error cases
  let data;
  try {
    data = await response.json();
  } catch {
    data = { detail: response.statusText || 'An error occurred' };
  }

  if (!response.ok) {
    console.error('API Error:', response.status, options.method || 'GET', endpoint);
    
    // Handle validation errors specially - extract the actual message
    let errorMessage = data.detail || data.error || `HTTP error ${response.status}`;
    
    // If detail is an array, extract the first error message
    if (Array.isArray(data.detail)) {
      const firstError = data.detail[0];
      if (firstError && firstError.msg) {
        errorMessage = `${firstError.loc?.join('.') || 'field'}: ${firstError.msg}`;
      } else if (typeof firstError === 'string') {
        errorMessage = firstError;
      }
    }
    
    throw new Error(errorMessage);
  }

  return data;
}

// Auth API
export const authApi = {
  // Register new user — matches backend: { name, email, password, role }
  register: async (data: {
    email: string;
    password: string;
    full_name: string;
    role?: string;
  }) => {
    const response = await apiCall<{
      access_token: string;
      token_type: string;
      role: string;
      name: string;
      id: number;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: data.full_name, email: data.email, password: data.password, role: data.role || 'student' }),
    });
    // Normalise to unified user shape and store
    const user = { id: response.id, name: response.name, email: data.email, role: response.role };
    localStorage.setItem('ff_access_token', response.access_token);
    localStorage.setItem('ff_user', JSON.stringify(user));
    setTokenExpiry(ACCESS_TOKEN_EXPIRE_MINUTES * 60);
    setupInactivityListeners();
    return { access_token: response.access_token, user };
  },

  // Login user — backend uses OAuth2 form (username/password form-encoded)
  login: async (data: { email: string; password: string; remember?: boolean }) => {
    const form = new URLSearchParams();
    form.append('username', data.email);
    form.append('password', data.password);
    const url = `${API_BASE_URL}/auth/login`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    let json: any;
    try { json = await res.json(); } catch { json = {}; }
    if (!res.ok) throw new Error(json.detail || `HTTP ${res.status}`);
    const user = { id: json.id, name: json.name, email: data.email, role: json.role };
    if (data.remember === false) {
      sessionStorage.setItem('ff_access_token', json.access_token);
      sessionStorage.setItem('ff_user', JSON.stringify(user));
      localStorage.removeItem('ff_access_token');
      localStorage.removeItem('ff_user');
    } else {
      localStorage.setItem('ff_access_token', json.access_token);
      localStorage.setItem('ff_user', JSON.stringify(user));
    }
    setTokenExpiry(ACCESS_TOKEN_EXPIRE_MINUTES * 60);
    setupInactivityListeners();
    return { access_token: json.access_token, user, is_first_login: !!json.is_first_login };
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('ff_access_token');
    localStorage.removeItem('ff_refresh_token');
    localStorage.removeItem('ff_user');
    localStorage.removeItem('ff_token_expiry');
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('ff_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get current user role
  getUserRole: () => {
    const user = authApi.getCurrentUser();
    return user?.role || null;
  },

  // Check if user is admin
  isAdmin: () => {
    const role = authApi.getUserRole();
    return role === 'admin';
  },

  // Check if user is super_admin
  isSuperAdmin: () => {
    const role = authApi.getUserRole();
    return role === 'super_admin';
  },

  // Check if user is admin or super_admin
  isAdminOrSuperAdmin: () => {
    const role = authApi.getUserRole();
    return role === 'admin' || role === 'super_admin';
  },

  // Check if user is instructor
  isInstructor: () => {
    const role = authApi.getUserRole();
    return role === 'instructor';
  },

  // Check if user can create courses (instructor, admin, or super_admin)
  canCreateCourse: () => {
    const role = authApi.getUserRole();
    return role === 'instructor' || role === 'admin' || role === 'super_admin';
  },

  // Verify email
  verifyEmail: async (data: { email: string; code: string }) => {
    return apiCall<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Resend verification code
  resendVerification: async (data: { email: string }) => {
    return apiCall<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Change email (before verification)
  changeEmail: async (data: { old_email: string; new_email: string }) => {
    return apiCall<{ message: string; email: string }>('/auth/change-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Forgot password
  forgotPassword: async (data: { email: string }) => {
    return apiCall<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reset password
  resetPassword: async (data: { token: string; new_password: string }) => {
    return apiCall<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Courses API
export const coursesApi = {
  // Get all courses
  getCourses: async (params?: {
    page?: number;
    limit?: number;
    language_id?: number;
    level?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.language_id) queryParams.set('language_id', params.language_id.toString());
    if (params?.level) queryParams.set('level', params.level);
    if (params?.search) queryParams.set('search', params.search);
    
    const query = queryParams.toString();
    return apiCall<{ courses: any[]; total: number; page: number; limit: number; total_pages: number }>(
      `/courses${query ? `?${query}` : ''}`
    );
  },

  // Get featured courses
  getFeaturedCourses: async (limit: number = 6) => {
    return apiCall<{ courses: any[] }>(`/courses/featured?limit=${limit}`);
  },

  // Get course by ID
  getCourse: async (courseId: number) => {
    return apiCall<{ course: any; units: any[]; is_enrolled: boolean }>(`/courses/${courseId}`);
  },

  // Enroll in course
  enrollCourse: async (courseId: number) => {
    return apiCall<{ message: string; enrollment_id: number }>(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  },

  // Get enrolled courses for the current user
  getEnrolledCourses: async () => {
    return apiCall<{ courses: any[]; total: number }>('/courses/enrolled');
  },
};

// Users API
export const usersApi = {
  // Get current user profile
  getProfile: async () => {
    return apiCall<any>('/users/me');
  },

  // Update user profile
  updateProfile: async (data: {
    full_name?: string;
    bio?: string;
    location?: string;
    avatar_url?: string;
  }) => {
    return apiCall<any>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    return apiCall<{
      xp_points: number;
      xp_today: number;
      current_streak: number;
      best_streak: number;
      lessons_completed: number;
      lessons_this_month: number;
      fluency_score: number;
      time_spent_today: number;
      achievements_unlocked: number;
      next_level_xp: number;
      level: number;
    }>('/users/me/dashboard');
  },

  // Get platform stats (public) — hits /api/stats directly (no auth)
  getPlatformStats: async () => {
    const base = API_BASE_URL.replace('/api', '');
    const res = await fetch(`${base}/api/stats`);
    if (!res.ok) throw new Error('stats failed');
    return res.json() as Promise<{
      active_learners: number;
      total_users: number;
      languages: number;
      courses: number;
      instructors: number;
      success_rate: number;
    }>;
  },

  // Get available languages
  getLanguages: async () => {
    return apiCall<{ languages: any[] }>('/users/languages');
  },
};

// Admin API
export const adminApi = {
  // Get all users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    is_active?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.role) queryParams.set('role', params.role);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.is_active !== undefined) queryParams.set('is_active', params.is_active.toString());
    
    const query = queryParams.toString();
    return apiCall<{ users: any[]; total: number; page: number; limit: number }>(
      `/admin/users${query ? `?${query}` : ''}`
    );
  },

  // Create user
  createUser: async (data: {
    email: string;
    password: string;
    full_name: string;
    role: string;
  }) => {
    return apiCall<{ user_id: number; message: string }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update user
  updateUser: async (userId: number, data: {
    full_name?: string;
    email?: string;
    role?: string;
    bio?: string;
    location?: string;
  }) => {
    return apiCall<{ message: string }>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete user
  deleteUser: async (userId: number) => {
    return apiCall<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Activate user
  activateUser: async (userId: number) => {
    return apiCall<{ message: string }>(`/admin/users/${userId}/activate`, {
      method: 'POST',
    });
  },

  // Deactivate user
  deactivateUser: async (userId: number) => {
    return apiCall<{ message: string }>(`/admin/users/${userId}/deactivate`, {
      method: 'POST',
    });
  },

  // Get dashboard stats
  getDashboard: async () => {
    return apiCall<{
      total_users: number;
      total_students: number;
      total_instructors: number;
      total_courses: number;
      total_enrollments: number;
      recent_users: any[];
      active_users_today: number;
    }>('/admin/dashboard');
  },

  // Get analytics
  getAnalytics: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.set('start_date', params.start_date);
    if (params?.end_date) queryParams.set('end_date', params.end_date);
    
    const query = queryParams.toString();
    return apiCall<{
      enrollment_stats: any[];
      revenue_stats: any[];
      course_popularity: any[];
      user_growth: any[];
    }>(`/admin/analytics${query ? `?${query}` : ''}`);
  },

  // Get student progress
  getStudentProgress: async (studentId: number) => {
    return apiCall<{
      student: any;
      enrollments: any[];
      total_courses_completed: number;
      total_courses_in_progress: number;
      average_progress: number;
    }>(`/admin/students/${studentId}/progress`);
  },

  // Create moderation report
  createReport: async (data: {
    reported_user_id: number;
    reason: string;
    description: string;
  }) => {
    return apiCall<{ message: string }>('/admin/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all reports
  getReports: async () => {
    return apiCall<{ reports: any[] }>('/admin/reports');
  },

  // Get extended analytics
  getExtendedAnalytics: async (days: number = 30) => {
    return apiCall<{
      period_days: number;
      users: any;
      courses: any;
      enrollments: any;
      certificates: any;
      reports: any;
      charts: any;
    }>(`/admin/analytics/extended?days=${days}`);
  },

  // Get activity logs
  getActivityLogs: async (params?: {
    page?: number;
    limit?: number;
    user_id?: number;
    activity_type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.user_id) queryParams.set('user_id', params.user_id.toString());
    if (params?.activity_type) queryParams.set('activity_type', params.activity_type);
    
    const query = queryParams.toString();
    return apiCall<{ activities: any[]; total: number; page: number; total_pages: number }>(
      `/admin/activity${query ? `?${query}` : ''}`
    );
  },

  // Get all courses
  getCourses: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    level?: string;
    instructor_id?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.level) queryParams.set('level', params.level);
    if (params?.instructor_id) queryParams.set('instructor_id', params.instructor_id.toString());
    if (params?.search) queryParams.set('search', params.search);
    
    const query = queryParams.toString();
    return apiCall<{ courses: any[]; total: number; page: number; total_pages: number }>(
      `/admin/courses${query ? `?${query}` : ''}`
    );
  },

  // Get course details
  getCourseDetails: async (courseId: number) => {
    return apiCall<{ course: any; instructor: any; enrollments: any }>(`/admin/courses/${courseId}`);
  },

  // Publish course
  publishCourse: async (courseId: number) => {
    return apiCall<{ message: string }>(`/admin/courses/${courseId}/publish`, {
      method: 'POST',
    });
  },

  // Unpublish course
  unpublishCourse: async (courseId: number) => {
    return apiCall<{ message: string }>(`/admin/courses/${courseId}/unpublish`, {
      method: 'POST',
    });
  },

  // Approve course
  approveCourse: async (courseId: number) => {
    return apiCall<{ message: string }>(`/admin/courses/${courseId}/approve`, {
      method: 'POST',
    });
  },

  // Reject course
  rejectCourse: async (courseId: number, reason: string) => {
    return apiCall<{ message: string }>(`/admin/courses/${courseId}/reject?reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
    });
  },

  // Get all enrollments
  getEnrollments: async (params?: {
    page?: number;
    limit?: number;
    course_id?: number;
    user_id?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.course_id) queryParams.set('course_id', params.course_id.toString());
    if (params?.user_id) queryParams.set('user_id', params.user_id.toString());
    if (params?.status) queryParams.set('status', params.status);
    
    const query = queryParams.toString();
    return apiCall<{ enrollments: any[]; total: number; page: number; total_pages: number }>(
      `/admin/enrollments${query ? `?${query}` : ''}`
    );
  },

  // Get announcements
  getAnnouncements: async (params?: {
    page?: number;
    limit?: number;
    target_role?: string;
    is_published?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.target_role) queryParams.set('target_role', params.target_role);
    if (params?.is_published !== undefined) queryParams.set('is_published', params.is_published.toString());
    
    const query = queryParams.toString();
    return apiCall<{ announcements: any[]; total: number; page: number; total_pages: number }>(
      `/admin/announcements${query ? `?${query}` : ''}`
    );
  },

  // Create announcement
  createAnnouncement: async (data: {
    title: string;
    content: string;
    summary?: string;
    announcement_type?: string;
    priority?: string;
    target_role?: string;
    image_url?: string;
    action_url?: string;
  }) => {
    return apiCall<{ message: string; announcement_id: number }>('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update announcement
  updateAnnouncement: async (announcementId: number, data: {
    title?: string;
    content?: string;
    summary?: string;
    priority?: string;
    is_published?: boolean;
  }) => {
    return apiCall<{ message: string }>(`/admin/announcements/${announcementId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete announcement
  deleteAnnouncement: async (announcementId: number) => {
    return apiCall<{ message: string }>(`/admin/announcements/${announcementId}`, {
      method: 'DELETE',
    });
  },

  // Get notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    user_id?: number;
    is_read?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.user_id) queryParams.set('user_id', params.user_id.toString());
    if (params?.is_read !== undefined) queryParams.set('is_read', params.is_read.toString());
    
    const query = queryParams.toString();
    return apiCall<{ notifications: any[]; total: number; page: number; total_pages: number }>(
      `/admin/notifications${query ? `?${query}` : ''}`
    );
  },

  // Broadcast notification
  broadcastNotification: async (data: {
    user_ids: number[];
    type: string;
    title: string;
    body: string;
    action_url?: string;
  }) => {
    return apiCall<{ message: string; count: number }>('/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get admin reports
  getAdminReports: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    report_type?: string;
    priority?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.report_type) queryParams.set('report_type', params.report_type);
    if (params?.priority) queryParams.set('priority', params.priority);
    
    const query = queryParams.toString();
    return apiCall<{ reports: any[]; total: number; page: number; total_pages: number }>(
      `/admin/reports${query ? `?${query}` : ''}`
    );
  },

  // Get report details
  getReportDetails: async (reportId: number) => {
    return apiCall<{ report: any; comments: any[] }>(`/admin/reports/${reportId}`);
  },

  // Assign report
  assignReport: async (reportId: number, assigneeId: number) => {
    return apiCall<{ message: string }>(`/admin/reports/${reportId}/assign?assignee_id=${assigneeId}`, {
      method: 'POST',
    });
  },

  // Update report status
  updateReportStatus: async (reportId: number, status: string, resolution?: string) => {
    return apiCall<{ message: string }>(`/admin/reports/${reportId}/status?status=${status}${resolution ? `&resolution=${encodeURIComponent(resolution)}` : ''}`, {
      method: 'POST',
    });
  },

  // Add report comment
  addReportComment: async (reportId: number, content: string, isInternal: boolean = false) => {
    return apiCall<{ message: string; comment_id: number }>(`/admin/reports/${reportId}/comments?content=${encodeURIComponent(content)}&is_internal=${isInternal}`, {
      method: 'POST',
    });
  },

  // Get audit logs
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    target_type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.action) queryParams.set('action', params.action);
    if (params?.target_type) queryParams.set('target_type', params.target_type);
    
    const query = queryParams.toString();
    return apiCall<{ logs: any[]; total: number; page: number; total_pages: number }>(
      `/admin/audit-log${query ? `?${query}` : ''}`
    );
  },

  // Instructor Applications
  getInstructorApplications: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    
    const query = queryParams.toString();
    return apiCall<{ applications: any[]; total: number; page: number; total_pages: number }>(
      `/admin/instructor-applications${query ? `?${query}` : ''}`
    );
  },

  // Approve instructor application
  approveInstructorApplication: async (applicationId: number) => {
    return apiCall<{ message: string }>(`/admin/instructor-applications/${applicationId}/approve`, {
      method: 'POST',
    });
  },

  // Reject instructor application
  rejectInstructorApplication: async (applicationId: number, reason: string) => {
    return apiCall<{ message: string }>(`/admin/instructor-applications/${applicationId}/reject?reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
    });
  },

  // === Course Approval Workflow ===
  
  // Get all course edit/delete requests
  getCourseRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    request_type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.request_type) queryParams.set('request_type', params.request_type);
    
    const query = queryParams.toString();
    return apiCall<{ requests: any[]; total: number; page: number; total_pages: number }>(
      `/admin/course-requests${query ? `?${query}` : ''}`
    );
  },

  // Get course request details
  getCourseRequestDetails: async (requestId: number) => {
    return apiCall<{ request: any }>(`/admin/course-requests/${requestId}`);
  },

  // Approve course request
  approveCourseRequest: async (requestId: number, comment?: string) => {
    return apiCall<{ message: string }>(`/admin/course-requests/${requestId}/approve${comment ? `?comment=${encodeURIComponent(comment)}` : ''}`, {
      method: 'POST',
    });
  },

  // Reject course request
  rejectCourseRequest: async (requestId: number, reason: string) => {
    return apiCall<{ message: string }>(`/admin/course-requests/${requestId}/reject?reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
    });
  },

  // === Admin Dashboard Endpoints ===

  // Get KPI data
  getKpis: async () => {
    return apiCall<{
      total_users: number;
      total_users_delta: number;
      platform_revenue_mtd: number;
      revenue_delta_pct: number;
      active_courses: number;
      courses_new_this_week: number;
      retention_rate: number;
      retention_delta: number;
      pending_course_reviews: number;
      pending_reports: number;
    }>('/admin/kpis');
  },

  // Get active alerts
  getActiveAlerts: async () => {
    return apiCall<{
      alerts: Array<{
        id: number;
        level: 'critical' | 'warning' | 'info';
        title: string;
        description: string;
        action_label: string;
        created_at: string;
      }>;
    }>('/admin/alerts/active');
  },

  // Get system health status
  getSystemHealth: async () => {
    return apiCall<{
      api: string;
      db: string;
      redis_latency_ms: number;
      pulse: string;
      cdn: string;
    }>('/admin/system/health');
  },

  // Get system logs
  getSystemLogs: async (params?: { limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{
      logs: Array<{
        timestamp: string;
        level: 'INFO' | 'WARN' | 'ERROR';
        message: string;
        highlights: Array<{ text: string; is_highlight: boolean }>;
      }>;
    }>(`/admin/system/logs${query ? `?${query}` : ''}`);
  },

  // Get daily revenue data
  getRevenueDaily: async (month: string) => {
    return apiCall<{
      data: Array<{
        date: string;
        gross: number;
        fees: number;
      }>;
    }>(`/admin/revenue/daily?month=${month}`);
  },

  // Get PULSE distribution
  getPulseDistribution: async () => {
    return apiCall<{
      total_learners: number;
      thriving: number;
      coasting: number;
      struggling: number;
      burning_out: number;
      disengaged: number;
      at_risk_count: number;
    }>('/admin/pulse/distribution');
  },

  // Get top languages
  getTopLanguages: async (params?: { limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{
      languages: Array<{
        language: string;
        flag_emoji: string;
        learner_count: number;
        bar_pct: number;
        color_start: string;
        color_end: string;
      }>;
    }>(`/admin/analytics/languages${query ? `?${query}` : ''}`);
  },

  // Get geographic distribution
  getGeography: async (params?: { limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{
      countries: Array<{
        country: string;
        flag_emoji: string;
        user_count: number;
        bar_pct: number;
      }>;
    }>(`/admin/analytics/geography${query ? `?${query}` : ''}`);
  },

  // Get platform health metrics
  getHealthMetrics: async () => {
    return apiCall<{
      dau: number;
      mau: number;
      avg_session_minutes: number;
      course_completion_pct: number;
      premium_conversion_pct: number;
      churn_rate_pct: number;
      api_uptime_pct: number;
      avg_api_latency_ms: number;
    }>('/admin/platform/health-metrics');
  },

  // Get moderation queue
  getModerationQueue: async (params?: { limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{
      items: Array<{
        id: number;
        type: 'course' | 'report' | 'payout' | 'verify';
        subject: string;
        description: string;
        created_at: string;
        action_data: any;
      }>;
    }>(`/admin/moderation/queue${query ? `?${query}` : ''}`);
  },

  // Approve moderation item
  approveModeration: async (itemId: number) => {
    return apiCall<{ message: string }>(`/admin/moderation/${itemId}/approve`, {
      method: 'POST',
    });
  },

  // Reject moderation item
  rejectModeration: async (itemId: number) => {
    return apiCall<{ message: string }>(`/admin/moderation/${itemId}/reject`, {
      method: 'POST',
    });
  },

  // Ban user
  banUser: async (userId: number) => {
    return apiCall<{ message: string }>(`/admin/users/${userId}/ban`, {
      method: 'PATCH',
    });
  },

  // Unban user
  unbanUser: async (userId: number) => {
    return apiCall<{ message: string }>(`/admin/users/${userId}/unban`, {
      method: 'PATCH',
    });
  },

  // Approve user (for pending users)
  approveUser: async (userId: number) => {
    return apiCall<{ message: string }>(`/admin/users/${userId}/approve`, {
      method: 'PATCH',
    });
  },
};

// Instructor API
export const instructorApi = {
  // Get instructor's courses
  getMyCourses: async () => {
    return apiCall<{ courses: any[] }>('/courses/instructor/my-courses');
  },

  // Get students in a specific course
  getCourseStudents: async (courseId: number) => {
    return apiCall<{
      course: { id: number; title: string };
      students: any[];
      total_students: number;
    }>(`/courses/instructor/${courseId}/students`);
  },

  // Get all students across all courses
  getAllStudents: async () => {
    return apiCall<{
      students: any[];
      total_students: number;
    }>('/courses/instructor/students');
  },

  // Create course
  createCourse: async (data: {
    title: string;
    description: string;
    language_id: number;
    level: string;
    thumbnail_url?: string;
    price_usd?: number;
    is_free?: boolean;
  }) => {
    return apiCall<{ course_id: number; message: string }>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update course
  updateCourse: async (courseId: number, data: {
    title?: string;
    description?: string;
    thumbnail_url?: string;
    price_usd?: number;
    is_free?: boolean;
    is_published?: boolean;
  }) => {
    return apiCall<{ message: string }>(`/courses/${courseId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete course
  deleteCourse: async (courseId: number) => {
    return apiCall<{ message: string }>(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Publish course
  publishCourse: async (courseId: number) => {
    return apiCall<{ message: string; is_published: boolean; status: string }>(`/courses/${courseId}/publish`, {
      method: 'POST',
    });
  },

  // Unpublish course
  unpublishCourse: async (courseId: number) => {
    return apiCall<{ message: string; is_published: boolean; status: string }>(`/courses/${courseId}/unpublish`, {
      method: 'POST',
    });
  },

  // Get instructor dashboard
  getDashboard: async () => {
    return apiCall<{
      total_courses: number;
      total_students: number;
      total_enrollments: number;
      recent_enrollments: any[];
      courses: any[];
    }>('/instructor/dashboard');
  },

  // Get students
  getStudents: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    course_id?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.course_id) queryParams.set('course_id', params.course_id.toString());
    
    const query = queryParams.toString();
    return apiCall<{ students: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/students${query ? `?${query}` : ''}`
    );
  },

  // Get student details
  getStudentDetails: async (studentId: number) => {
    return apiCall<{
      student: any;
      courses: any[];
      recent_activity: any[];
    }>(`/instructor/students/${studentId}`);
  },

  // Get enrollments
  getEnrollments: async (params?: {
    page?: number;
    limit?: number;
    course_id?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.course_id) queryParams.set('course_id', params.course_id.toString());
    if (params?.status) queryParams.set('status', params.status);
    
    const query = queryParams.toString();
    return apiCall<{ enrollments: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/enrollments${query ? `?${query}` : ''}`
    );
  },

  // Get certificates
  getCertificates: async (params?: {
    page?: number;
    limit?: number;
    course_id?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.course_id) queryParams.set('course_id', params.course_id.toString());
    
    const query = queryParams.toString();
    return apiCall<{ certificates: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/certificates${query ? `?${query}` : ''}`
    );
  },

  // Issue certificate
  issueCertificate: async (enrollmentId: number, finalScore?: number) => {
    return apiCall<{ message: string; certificate: any }>(`/instructor/certificates/issue?enrollment_id=${enrollmentId}${finalScore ? `&final_score=${finalScore}` : ''}`, {
      method: 'POST',
    });
  },

  // Get conversations
  getConversations: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiCall<{ conversations: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/conversations${query ? `?${query}` : ''}`
    );
  },

  // Get messages
  getMessages: async (conversationId: number, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiCall<{ messages: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/conversations/${conversationId}/messages${query ? `?${query}` : ''}`
    );
  },

  // Send message
  sendMessage: async (data: {
    student_id: number;
    content: string;
    message_type?: string;
    attachment_url?: string;
  }) => {
    return apiCall<{ message: string; message_id: number; conversation_id: number }>('/instructor/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Send message to any user (no enrollment required)
  sendMessageToAnyUser: async (data: {
    recipient_id: number;
    content: string;
    message_type?: string;
    attachment_url?: string;
  }) => {
    return apiCall<{ message: string; message_id: number; conversation_id: number; recipient: any }>('/instructor/messages/to-user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all users on platform (for messaging)
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.role) queryParams.set('role', params.role);
    if (params?.search) queryParams.set('search', params.search);
    
    const query = queryParams.toString();
    return apiCall<{ users: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/users${query ? `?${query}` : ''}`
    );
  },

  // Get reports
  getReports: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    report_type?: string;
    priority?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.report_type) queryParams.set('report_type', params.report_type);
    if (params?.priority) queryParams.set('priority', params.priority);
    
    const query = queryParams.toString();
    return apiCall<{ reports: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/reports${query ? `?${query}` : ''}`
    );
  },

  // Get course performance
  getCoursePerformance: async (courseId: number) => {
    return apiCall<{
      course: any;
      lessons: any[];
      total_enrollments: number;
    }>(`/instructor/courses/${courseId}/performance`);
  },

  // Get struggling students
  getStrugglingStudents: async (courseId: number, threshold: number = 30) => {
    return apiCall<{ students: any[]; total: number }>(`/instructor/courses/${courseId}/students/struggling?threshold=${threshold}`);
  },

  // === Course Content Management ===
  
  // Create unit
  createUnit: async (courseId: number, data: { title: string; description?: string; order_index?: number }) => {
    return apiCall<{ message: string; unit_id: number }>(`/courses/${courseId}/units`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get course units
  getCourseUnits: async (courseId: number) => {
    return apiCall<{ units: any[] }>(`/courses/${courseId}/units`);
  },

  // Create quiz
  createQuiz: async (courseId: number, data: {
    title: string;
    description?: string;
    unit_id?: number;
    lesson_id?: number;
    passing_score?: number;
    order_index?: number;
  }) => {
    return apiCall<{ message: string; quiz_id: number }>(`/courses/${courseId}/quizzes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Add quiz question
  addQuizQuestion: async (quizId: number, data: {
    question_text: string;
    question_type?: string;
    options?: { text: string; is_correct: boolean; order?: number }[];
    correct_answer?: string;
    points?: number;
    order_index?: number;
  }) => {
    return apiCall<{ message: string; question_id: number }>(`/courses/quizzes/${quizId}/questions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get quiz
  getQuiz: async (quizId: number) => {
    return apiCall<{ quiz: any; questions: any[] }>(`/courses/quizzes/${quizId}`);
  },

  // Update quiz settings
  updateQuiz: async (quizId: number, data: {
    title?: string;
    description?: string;
    passing_score?: number;
    time_limit?: number;
    allow_retakes?: boolean;
  }) => {
    return apiCall<{ message: string; quiz_id: number }>(`/courses/quizzes/${quizId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Submit quiz
  submitQuiz: async (quizId: number, answers: { question_id: number; answer?: string; selected_option_id?: number }[]) => {
    return apiCall<{
      message: string;
      score: number;
      passed: boolean;
      passing_score: number;
      total_points: number;
      earned_points: number;
    }>(`/courses/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  },

  // Upload video
  uploadVideo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('ff_access_token');
    const response = await fetch(`${API_BASE_URL}/courses/upload/video`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Upload failed');
    }
    
    return response.json();
  },

  // Create lesson
  createLesson: async (unitId: number, data: {
    title: string;
    description?: string;
    lesson_type?: string;
    video_url?: string;
    video_duration_sec?: number;
    order_index?: number;
    is_free_preview?: boolean;
  }) => {
    return apiCall<{ message: string; lesson_id: number }>(`/lessons/units/${unitId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get lesson
  getLesson: async (lessonId: number) => {
    return apiCall<{
      lesson: any;
      vocabulary: any[];
      transcript: any;
      transcript_segments: any[];
    }>(`/lessons/${lessonId}`);
  },

  // Instructor Announcements
  getAnnouncements: async (params?: {
    page?: number;
    limit?: number;
    course_id?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.course_id) queryParams.set('course_id', params.course_id.toString());
    
    const query = queryParams.toString();
    return apiCall<{ announcements: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/announcements${query ? `?${query}` : ''}`
    );
  },

  // Create announcement
  createAnnouncement: async (data: {
    title: string;
    content: string;
    course_id: number;
    is_published?: boolean;
    scheduled_for?: string;
    target_type?: 'course' | 'students' | 'all_students';
    target_student_ids?: number[];
  }) => {
    return apiCall<{ message: string; announcement_id: number }>('/instructor/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Delete announcement
  deleteAnnouncement: async (announcementId: number) => {
    return apiCall<{ message: string }>(`/instructor/announcements/${announcementId}`, {
      method: 'DELETE',
    });
  },

  // Revoke certificate
  revokeCertificate: async (certificateId: number, reason: string) => {
    return apiCall<{ message: string }>(`/instructor/certificates/${certificateId}/revoke?reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
    });
  },

  // Verify certificate
  verifyCertificate: async (code: string) => {
    return apiCall<{ valid: boolean; certificate: any }>(`/instructor/certificates/verify/${code}`);
  },

  // === Course Edit/Delete Request Workflow ===
  
  // Request course edit (sends to admin for approval)
  requestCourseEdit: async (courseId: number, data: {
    title?: string;
    description?: string;
    thumbnail_url?: string;
    price_usd?: number;
    is_free?: boolean;
    level?: string;
  }, reason: string) => {
    return apiCall<{ message: string; request_id: number }>(`/courses/${courseId}/request-edit`, {
      method: 'POST',
      body: JSON.stringify({ ...data, reason }),
    });
  },

  // Request course deletion (sends to admin for approval)
  requestCourseDelete: async (courseId: number, reason: string) => {
    return apiCall<{ message: string; request_id: number }>(`/courses/${courseId}/request-delete`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Get my pending requests
  getMyRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    
    const query = queryParams.toString();
    return apiCall<{ requests: any[]; total: number; page: number; total_pages: number }>(
      `/courses/instructor/my-requests${query ? `?${query}` : ''}`
    );
  },

  // Cancel pending request
  cancelRequest: async (requestId: number) => {
    return apiCall<{ message: string }>(`/courses/instructor/requests/${requestId}/cancel`, {
      method: 'POST',
    });
  },

  // === Assignments ===

  // Get assignments
  getAssignments: async (courseId?: number, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (courseId) queryParams.set('course_id', courseId.toString());
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{ assignments: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/assignments${query ? `?${query}` : ''}`
    );
  },

  // Create assignment
  createAssignment: async (courseId: number, data: {
    title: string;
    assignment_type?: string;
    prompt: string;
    rubric?: string;
    due_date?: string;
    unit_id?: number;
  }) => {
    return apiCall<{ message: string; assignment_id: number }>(
      `/instructor/assignments?course_id=${courseId}`,
      { method: 'POST', body: JSON.stringify(data) }
    );
  },

  // Delete assignment
  deleteAssignment: async (assignmentId: number) => {
    return apiCall<{ message: string }>(`/instructor/assignments/${assignmentId}`, {
      method: 'DELETE',
    });
  },

  // Get submissions for an assignment
  getAssignmentSubmissions: async (assignmentId: number) => {
    return apiCall<{ submissions: any[]; total: number }>(
      `/instructor/assignments/${assignmentId}/submissions`
    );
  },

  // Grade a submission
  gradeSubmission: async (assignmentId: number, submissionId: number, data: { grade: number; feedback?: string }) => {
    return apiCall<{ message: string }>(
      `/instructor/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      { method: 'POST', body: JSON.stringify(data) }
    );
  },

  // === Meetings / Live Sessions ===

  // Get instructor's meetings
  getMeetings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    
    const query = queryParams.toString();
    return apiCall<{ meetings: any[]; total: number; page: number; total_pages: number }>(
      `/instructor/meetings${query ? `?${query}` : ''}`
    );
  },

  // Create a new meeting
  createMeeting: async (data: {
    title: string;
    description?: string;
    meeting_type: string;
    scheduled_at: string;
    duration_minutes?: number;
    timezone?: string;
    meeting_link?: string;
    meeting_platform?: string;
    reason?: string;
    invitee_ids?: number[];
  }) => {
    return apiCall<{ message: string; meeting_id: number; title: string; scheduled_at: string; invitee_count: number; status: string }>(
      '/instructor/meetings',
      { method: 'POST', body: JSON.stringify(data) }
    );
  },

  // Cancel a meeting
  cancelMeeting: async (meetingId: number) => {
    return apiCall<{ message: string }>(
      `/instructor/meetings/${meetingId}`,
      { method: 'DELETE' }
    );
  },

  // Update a meeting
  updateMeeting: async (meetingId: number, data: {
    title?: string;
    description?: string;
    meeting_type?: string;
    scheduled_at?: string;
    duration_minutes?: number;
    timezone?: string;
    meeting_link?: string;
    meeting_platform?: string;
    reason?: string;
    invitee_ids?: number[];
  }) => {
    return apiCall<{ message: string; meeting_id: number }>(
      `/instructor/meetings/${meetingId}`,
      { method: 'PATCH', body: JSON.stringify(data) }
    );
  },

  // Get instructor application status
  getApplicationStatus: async () => {
    return apiCall<{
      status: 'pending' | 'rejected' | 'no_application' | 'approved';
      bio?: string;
      expertise?: string[];
      rejection_reason?: string;
    }>('/instructor/application/status');
  },

  // Submit instructor application
  submitApplication: async (data: { bio: string; expertise: string[] }) => {
    return apiCall<{ message: string }>('/instructor/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // === Dashboard Endpoints ===

  // Get dashboard stats (students, revenue, rating, completion)
  getDashboardStats: async () => {
    return apiCall<{
      total_students: number;
      students_delta: number;
      revenue_mtd: number;
      revenue_delta: number;
      avg_rating: number;
      rating_delta: number;
      completion_rate: number;
      completion_delta: number;
    }>('/instructor/dashboard/stats');
  },

  // Get monthly revenue data for chart
  getRevenueMonthly: async (year: number) => {
    return apiCall<{ months: Array<{ month: number; gross: number; net: number }> }>(
      `/instructor/revenue/monthly?year=${year}`
    );
  },

  // Get live/upcoming sessions
  getSessions: async (params?: { upcoming?: boolean; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.upcoming) queryParams.set('upcoming', 'true');
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{
      sessions: Array<{
        id: number;
        title: string;
        language: string;
        start_time: string;
        enrolled_count: number;
        status: string;
        day_label: string;
      }>;
    }>(`/instructor/sessions${query ? `?${query}` : ''}`);
  },

  // Get activity feed / notifications
  getNotifications: async (params?: { limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{
      notifications: Array<{
        id: number;
        type: string;
        message: string;
        read: boolean;
        created_at: string;
      }>;
    }>(`/instructor/notifications${query ? `?${query}` : ''}`);
  },

  // Mark all notifications as read
  markNotificationsRead: async () => {
    return apiCall<{ message: string }>('/instructor/notifications/read-all', {
      method: 'POST',
    });
  },

  // Get courses with stats (completion_rate, avg_rating, revenue)
  getCoursesWithStats: async () => {
    return apiCall<{
      courses: Array<{
        id: number;
        title: string;
        language_flag: string;
        level: string;
        lesson_count: number;
        status: string;
        student_count: number;
        completion_rate: number;
        avg_rating: number;
        revenue_mtd: number;
      }>;
    }>('/instructor/courses?include_stats=true');
  },

  // Get PULSE heatmap data
  getPulseHeatmap: async () => {
    return apiCall<{
      students: Array<{
        student_id: number;
        student_name: string;
        pulse_state: 'thriving' | 'coasting' | 'struggling' | 'burning_out' | 'disengaged';
      }>;
    }>('/instructor/pulse/heatmap');
  },

  // Get student leaderboard
  getLeaderboard: async (limit: number = 5) => {
    return apiCall<{
      students: Array<{
        rank: number;
        user_id: number;
        name: string;
        course_title: string;
        xp_total: number;
        avatar_color_start: string;
        avatar_color_end: string;
      }>;
    }>(`/instructor/students/leaderboard?limit=${limit}`);
  },

  // Get earnings summary
  getEarningsSummary: async () => {
    return apiCall<{
      mtd_gross: number;
      mtd_net: number;
      pending_payout: number;
      all_time_net: number;
      platform_fee_rate: number;
      by_course: Array<{
        course_id: number;
        title: string;
        revenue: number;
        percentage: number;
      }>;
    }>('/instructor/earnings/summary');
  },
};

// Practice/Flashcards API
export const practiceApi = {
  // Get flashcard decks
  getFlashcardDecks: async (languageId?: number) => {
    const params = languageId ? `?language_id=${languageId}` : '';
    return apiCall<{ decks: any[] }>(`/practice/flashcards/decks${params}`);
  },

  // Get deck with flashcards
  getFlashcardDeck: async (deckId: number) => {
    return apiCall<{
      deck: any;
      flashcards: any[];
      progress: Record<number, any>;
    }>(`/practice/flashcards/decks/${deckId}`);
  },

  // Review flashcard (update progress)
  reviewFlashcard: async (flashcardId: number, status: 'new' | 'learning' | 'known') => {
    return apiCall<{ message: string }>(`/practice/flashcards/${flashcardId}/review?status=${status}`, {
      method: 'POST',
    });
  },
};

// Lessons API
export const lessonsApi = {
  // Get lesson by ID
  getLesson: async (lessonId: number) => {
    return apiCall<{
      lesson: any;
      vocabulary: any[];
      transcript: any;
      transcript_segments: any[];
    }>(`/lessons/${lessonId}`);
  },

  // Get lesson vocabulary
  getLessonVocabulary: async (lessonId: number) => {
    return apiCall<{ vocabulary: any[] }>(`/lessons/${lessonId}/vocabulary`);
  },

  // Get lesson transcript
  getLessonTranscript: async (lessonId: number) => {
    return apiCall<{
      transcript: any;
      segments: any[];
    }>(`/lessons/${lessonId}/transcript`);
  },

  // Get unit with lessons
  getUnit: async (unitId: number) => {
    return apiCall<{
      unit: any;
      lessons: any[];
    }>(`/lessons/units/${unitId}`);
  },

  // Update lesson progress
  updateProgress: async (lessonId: number, data: {
    watched_seconds: number;
    is_completed: boolean;
  }) => {
    return apiCall<{ message: string }>(`/lessons/${lessonId}/progress`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Quiz API
export const quizApi = {
  // Get quiz by ID
  getQuiz: async (quizId: number) => {
    return apiCall<{
      quiz: any;
      questions: any[];
    }>(`/courses/quizzes/${quizId}`);
  },

  // Submit quiz answers
  submitQuiz: async (quizId: number, answers: { question_id: number; answer?: string; selected_option_id?: number }[]) => {
    return apiCall<{
      message: string;
      score: number;
      passed: boolean;
      passing_score: number;
      total_points: number;
      earned_points: number;
    }>(`/courses/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  },
};

// LiveKit Session API
export const sessionApi = {
  // Get LiveKit token for joining a room
  getToken: async (roomName: string, role: string = 'student') => {
    const user = authApi.getCurrentUser();
    return apiCall<{
      token: string;
      livekit_url: string;
      room_name: string;
      identity: string;
      role: string;
    }>(`/session/token?room_name=${encodeURIComponent(roomName)}&username=${encodeURIComponent(user?.full_name || user?.email || 'user')}&role=${role}`);
  },

  // Create a new live session with LiveKit room
  createSession: async (data: {
    title: string;
    description?: string;
    language_id: number;
    level?: string;
    scheduled_at: string;
    duration_minutes?: number;
    max_participants?: number;
  }) => {
    return apiCall<{ message: string; session: any }>('/session/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // List available sessions
  listSessions: async (params?: {
    language_id?: number;
    level?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.language_id) queryParams.set('language_id', params.language_id.toString());
    if (params?.level) queryParams.set('level', params.level);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiCall<{ sessions: any[]; total: number; page: number; total_pages: number }>(
      `/session/list${query ? `?${query}` : ''}`
    );
  },

  // Start recording
  startRecording: async (sessionId: number) => {
    return apiCall<{ message: string; egress_id: string; recording_url: string }>('/session/record/start', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  },

  // Stop recording
  stopRecording: async (sessionId: number) => {
    return apiCall<{ message: string; recording_url: string }>('/session/record/stop', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  },
};

// Live Sessions API
export const liveSessionsApi = {
  // Get upcoming sessions
  getUpcomingSessions: async (limit: number = 6) => {
    return apiCall<{ sessions: any[] }>(`/live/sessions/upcoming?limit=${limit}`);
  },

  // Get all sessions
  getSessions: async (params?: {
    page?: number;
    limit?: number;
    language_id?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.language_id) queryParams.set('language_id', params.language_id.toString());
    if (params?.status) queryParams.set('status', params.status);
    
    const query = queryParams.toString();
    return apiCall<{ sessions: any[]; total: number; page: number }>(
      `/live/sessions${query ? `?${query}` : ''}`
    );
  },

  // Register for session
  registerSession: async (sessionId: number) => {
    return apiCall<{ message: string }>(`/live/sessions/${sessionId}/register`, {
      method: 'POST',
    });
  },
};

// Gamification API (Daily Challenge)
export const gamificationApi = {
  getDailyChallenge: async () => {
    return apiCall<{ challenge: any; tasks: any[]; user_progress: any[]; completed_count: number; total_tasks: number }>('/gamification/daily-challenge/today');
  },
  completeChallengeTask: async (taskId: number) => {
    return apiCall<{ message: string; xp_earned: number; is_completed: boolean }>(`/gamification/daily-challenge/${taskId}/complete`, { method: 'POST' });
  },
  getXP: async () => {
    return apiCall<{ total_xp: number; current_level: number; xp_to_next_level: number }>('/gamification/xp');
  },
  getXPTransactions: async (page = 1, limit = 20) => {
    return apiCall<{ transactions: any[]; total: number; page: number }>(`/gamification/xp/transactions?page=${page}&limit=${limit}`);
  },
  getStreak: async () => {
    return apiCall<{ current_streak: number; longest_streak: number; last_activity_date: string | null; total_active_days: number }>('/gamification/streak');
  },
  recordActivity: async () => {
    return apiCall<{ message: string; current_streak: number; longest_streak: number }>('/gamification/streak/record', { method: 'POST' });
  },
  getAllAchievements: async () => {
    return apiCall<{ achievements: any[] }>('/gamification/achievements');
  },
  getMyAchievements: async () => {
    return apiCall<{ earned: any[]; available: any[]; earned_ids: number[] }>('/gamification/achievements/mine');
  },
  getLeaderboard: async (period = 'weekly', limit = 50) => {
    return apiCall<{ leaderboard: any[]; period: string }>(`/gamification/leaderboard?period=${period}&limit=${limit}`);
  },
  getMyRank: async (period = 'weekly') => {
    return apiCall<{ rank: number | null; xp: number }>(`/gamification/leaderboard/my-rank?period=${period}`);
  },
  getStats: async () => {
    return apiCall<any>('/gamification/stats');
  },
};

export const communityApi = {
  getPosts: async (params?: { page?: number; limit?: number; language_id?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.language_id) q.set('language_id', String(params.language_id));
    const qs = q.toString() ? `?${q}` : '';
    return apiCall<{ posts: any[]; total: number; page: number }>(`/community/posts${qs}`);
  },
  createPost: async (data: { body: string; post_type?: string; language_id?: number }) => {
    return apiCall<any>('/community/posts', { method: 'POST', body: JSON.stringify(data) });
  },
  likePost: async (postId: number) => {
    return apiCall<{ liked: boolean; like_count: number }>(`/community/posts/${postId}/like`, { method: 'POST' });
  },
  savePost: async (postId: number) => {
    return apiCall<{ saved: boolean }>(`/community/posts/${postId}/save`, { method: 'POST' });
  },
  getComments: async (postId: number) => {
    return apiCall<{ comments: any[] }>(`/community/posts/${postId}/comments`);
  },
  addComment: async (postId: number, body: string) => {
    return apiCall<any>(`/community/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ body }) });
  },
  getMyPosts: async () => {
    return apiCall<{ posts: any[] }>('/community/my-posts');
  },
};

// Student API (assignments + messaging for enrolled students)
export const studentApi = {
  // ── Assignments ──────────────────────────────────────────────────────────
  getAssignments: async (courseId?: number, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (courseId) query.set('course_id', String(courseId));
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiCall<{
      assignments: Array<{
        id: number;
        title: string;
        assignment_type: 'speaking' | 'writing';
        prompt: string;
        rubric: string | null;
        course_id: number;
        course_title: string;
        due_date: string | null;
        status: 'pending' | 'submitted' | 'graded';
        submission_id: number | null;
        grade: number | null;
        feedback: string | null;
      }>;
      total: number;
      page: number;
      total_pages: number;
    }>(`/student/assignments${qs}`);
  },

  submitAssignment: async (
    assignmentId: number,
    data: { content?: string; audio_url?: string }
  ) => {
    return apiCall<{ message: string; submission_id: number }>(
      `/student/assignments/${assignmentId}/submit`,
      { method: 'POST', body: JSON.stringify(data) }
    );
  },

  // ── Messaging ─────────────────────────────────────────────────────────────
  getConversations: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiCall<{
      conversations: Array<{
        id: number;
        instructor_id: number;
        instructor_name: string;
        instructor_avatar: string | null;
        last_message_preview: string | null;
        last_message_at: string | null;
        unread_count: number;
      }>;
      total: number;
    }>(`/student/conversations${qs}`);
  },

  getMessages: async (conversationId: number, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiCall<{
      messages: Array<{
        id: number;
        sender_id: number;
        sender_name: string;
        sender_avatar: string | null;
        content: string;
        message_type: string;
        is_read: boolean;
        created_at: string | null;
      }>;
      total: number;
    }>(`/student/conversations/${conversationId}/messages${qs}`);
  },

  sendMessage: async (data: { instructor_id: number; content: string; message_type?: string }) => {
    return apiCall<{ message: string; message_id: number; conversation_id: number }>(
      '/student/messages',
      { method: 'POST', body: JSON.stringify(data) }
    );
  },

  // ── Meetings ─────────────────────────────────────────────────────────────
  // Get meetings where the student is invited
  getMeetings: async (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiCall<{
      meetings: Array<{
        id: number;
        title: string;
        description: string | null;
        meeting_type: string;
        scheduled_at: string | null;
        duration_minutes: number;
        timezone: string;
        meeting_link: string | null;
        meeting_platform: string | null;
        status: string;
        reason: string | null;
        response: string | null;
        organizer_id: number;
        organizer_name: string;
        organizer_avatar: string | null;
        created_at: string | null;
      }>;
      total: number;
      page: number;
      total_pages: number;
    }>(`/student/meetings${qs}`);
  },

  // Respond to a meeting invitation (accept/decline)
  respondToMeeting: async (meetingId: number, data: { response: string; response_note?: string }) => {
    return apiCall<{ message: string; meeting_id: number; response: string; status: string }>(
      `/student/meetings/${meetingId}/respond`,
      { method: 'POST', body: JSON.stringify(data) }
    );
  },

  // ── Announcements ───────────────────────────────────────────────────────────
  // Get announcements for student's enrolled courses
  getAnnouncements: async (params?: { course_id?: number; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.course_id) query.set('course_id', String(params.course_id));
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiCall<{
      announcements: Array<{
        id: number;
        title: string;
        content: string;
        summary: string | null;
        course_id: number;
        course_title: string;
        author_name: string;
        author_avatar: string | null;
        announcement_type: string;
        priority: string;
        image_url: string | null;
        action_url: string | null;
        published_at: string | null;
        created_at: string | null;
      }>;
      total: number;
      page: number;
      total_pages: number;
    }>(`/student/announcements${qs}`);
  },
};

// Messages API (unified — all roles)
export const messagesApi = {
  getThreads: () => apiCall<any[]>('/messages/threads'),
  getThread: (peerId: number) => apiCall<any[]>(`/messages/thread/${peerId}`),
  getContacts: (params?: { search?: string; role?: string; course_id?: number }) => {
    const q = new URLSearchParams()
    if (params?.search) q.set('search', params.search)
    if (params?.role) q.set('role', params.role)
    if (params?.course_id) q.set('course_id', String(params.course_id))
    const qs = q.toString()
    return apiCall<any[]>(`/messages/contacts${qs ? `?${qs}` : ''}`)
  },
  getCoursesList: () => apiCall<any[]>('/messages/courses-list'),
  send: (content: string, recipient_ids: number[], attachment?: { url: string; type: string; name: string }) =>
    apiCall<{ ok: boolean; sent_to: number }>('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ content, recipient_ids, attachment_url: attachment?.url, attachment_type: attachment?.type, attachment_name: attachment?.name }),
    }),
  upload: async (file: File) => {
    const token = localStorage.getItem('ff_access_token')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${API_BASE_URL}/messages/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    const data = await res.json().catch(() => ({ ok: false }))
    if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed')
    return data as { ok: boolean; url: string; attachment_type: string; attachment_name: string }
  },
}

// ── Axios-compatible shim for legacy pages ──────────────────────────────────
const _legacyBase = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:8000';

async function _legacyCall(method: string, url: string, options?: { params?: Record<string, any>; data?: any }) {
  const token = localStorage.getItem('ff_access_token');
  let fullUrl = url.startsWith('http') ? url : `${_legacyBase}${url}`;
  if (options?.params) {
    const q = new URLSearchParams();
    Object.entries(options.params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    const qs = q.toString();
    if (qs) fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
  }
  const res = await fetch(fullUrl, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(options?.data ? { body: JSON.stringify(options.data) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);
  return { data };
}

const api = {
  get: (url: string, options?: { params?: Record<string, any> }) => _legacyCall('GET', url, options),
  post: (url: string, data?: any) => _legacyCall('POST', url, { data }),
  put: (url: string, data?: any) => _legacyCall('PUT', url, { data }),
  patch: (url: string, data?: any) => _legacyCall('PATCH', url, { data }),
  delete: (url: string) => _legacyCall('DELETE', url),
};

export default api;
