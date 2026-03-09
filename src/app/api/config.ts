// API Configuration for FluentFusion
// Backend URL - uses environment variable or defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

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
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
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
    // Log the full error for debugging
    console.error('API Error:', response.status, data);
    
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
  // Register new user
  register: async (data: {
    email: string;
    password: string;
    full_name: string;
    role?: string;
  }) => {
    return apiCall<{ user_id: number; email: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Login user
  login: async (data: { email: string; password: string }) => {
    const response = await apiCall<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      user: {
        id: number;
        email: string;
        full_name: string;
        role: string;
        avatar_url: string | null;
        bio: string | null;
        location: string | null;
        is_email_verified: boolean;
        is_active: boolean;
        created_at: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store tokens
    localStorage.setItem('ff_access_token', response.access_token);
    localStorage.setItem('ff_refresh_token', response.refresh_token);
    localStorage.setItem('ff_user', JSON.stringify(response.user));
    
    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('ff_access_token');
    localStorage.removeItem('ff_refresh_token');
    localStorage.removeItem('ff_user');
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

  // Get platform stats (public)
  getPlatformStats: async () => {
    return apiCall<{
      active_learners: number;
      total_users: number;
      languages: number;
      courses: number;
      instructors: number;
      success_rate: number;
    }>('/users/stats');
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
  }) => {
    return apiCall<{ message: string; announcement_id: number }>(
      `/instructor/announcements?title=${encodeURIComponent(data.title)}&content=${encodeURIComponent(data.content)}&course_id=${data.course_id}&is_published=${data.is_published ?? true}${data.scheduled_for ? `&scheduled_for=${data.scheduled_for}` : ''}`,
      { method: 'POST' }
    );
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
    return apiCall<{ message: string; request_id: number }>(`/instructor/courses/${courseId}/request-edit`, {
      method: 'POST',
      body: JSON.stringify({ ...data, reason }),
    });
  },

  // Request course deletion (sends to admin for approval)
  requestCourseDelete: async (courseId: number, reason: string) => {
    return apiCall<{ message: string; request_id: number }>(`/instructor/courses/${courseId}/request-delete`, {
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
      `/instructor/courses/my-requests${query ? `?${query}` : ''}`
    );
  },

  // Cancel pending request
  cancelRequest: async (requestId: number) => {
    return apiCall<{ message: string }>(`/instructor/courses/requests/${requestId}/cancel`, {
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
  // Get today's daily challenge
  getDailyChallenge: async () => {
    return apiCall<{
      challenge: any;
      tasks: any[];
      progress: Record<number, any>;
      completed_count: number;
      total_tasks: number;
    }>('/gamification/daily-challenge/today');
  },

  // Complete a challenge task
  completeChallengeTask: async (taskId: number) => {
    return apiCall<{ message: string; xp_earned: number }>(`/gamification/daily-challenge/${taskId}/complete`, {
      method: 'POST',
    });
  },
};
