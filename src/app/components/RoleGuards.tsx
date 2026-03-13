import { Navigate, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

// Get redirect path based on user role
export const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return '/admin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
      return '/instructor/dashboard';
    default:
      return '/dashboard';
  }
};

// Check if user has required role
const checkRole = (userRole: string, requiredRole: string): boolean => {
  if (requiredRole === 'super_admin') {
    return userRole === 'super_admin';
  }
  if (requiredRole === 'admin') {
    return userRole === 'admin' || userRole === 'super_admin';
  }
  if (requiredRole === 'instructor') {
    return userRole === 'instructor' || userRole === 'admin' || userRole === 'super_admin';
  }
  if (requiredRole === 'student') {
    return userRole === 'student' || userRole === 'instructor' || userRole === 'admin' || userRole === 'super_admin';
  }
  return false;
};

// Auth context for checking authentication
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = () => {
      const token = localStorage.getItem('ff_access_token');
      const userStr = localStorage.getItem('ff_user');
      
      if (!token || !userStr) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(userStr);
        if (userData && token) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem('ff_access_token');
        localStorage.removeItem('ff_refresh_token');
        localStorage.removeItem('ff_user');
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    validateAuth();
  }, []);

  return { isAuthenticated, user, loading };
}

// Admin Route Guard - Admin or Super Admin
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!loading && isAuthenticated && !['admin', 'super_admin'].includes(user?.role)) {
      navigate(getRoleBasedRedirect(user.role), { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !['admin', 'super_admin'].includes(user?.role)) {
    return null;
  }

  return <>{children}</>;
}

// Instructor Route Guard - Instructor, Admin, or Super Admin
export function InstructorRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!loading && isAuthenticated && !['instructor', 'admin', 'super_admin'].includes(user?.role)) {
      navigate(getRoleBasedRedirect(user.role), { replace: true });
    } else if (!loading && isAuthenticated && user?.role === 'instructor') {
      // Check cached application status — admins/super_admins bypass this check
      const instructorStatus = localStorage.getItem('ff_instructor_status');
      if (instructorStatus === 'pending' || instructorStatus === 'rejected') {
        navigate('/instructor/application-status', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !['instructor', 'admin', 'super_admin'].includes(user?.role)) {
    return null;
  }

  // Block instructors with pending/rejected status from accessing protected pages
  if (user?.role === 'instructor') {
    const instructorStatus = localStorage.getItem('ff_instructor_status');
    if (instructorStatus === 'pending' || instructorStatus === 'rejected') {
      return null;
    }
  }

  return <>{children}</>;
}

// Student Route Guard - Student only (excludes instructor, admin and super_admin)
export function StudentRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!loading && isAuthenticated && user?.role !== 'student') {
      navigate(getRoleBasedRedirect(user.role), { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'student') {
    return null;
  }

  return <>{children}</>;
}

// Super Admin Route Guard - Super Admin only
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!loading && isAuthenticated && user?.role !== 'super_admin') {
      navigate(getRoleBasedRedirect(user.role), { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'super_admin') {
    return null;
  }

  return <>{children}</>;
}

// Protected Route - Any authenticated user
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// Guest Route - Only for unauthenticated users (login, signup, etc.)
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate(getRoleBasedRedirect(user.role), { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
