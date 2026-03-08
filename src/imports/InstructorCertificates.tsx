import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";

interface Certificate {
  id: number;
  certificate_number: string;
  verification_code: string;
  student_name: string;
  student_email: string;
  course_title: string;
  final_score: number | null;
  grade: string | null;
  issued_at: string | null;
  is_revoked: boolean;
}

export default function InstructorCertificates() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [search, setSearch] = useState("");
  const [revokeModal, setRevokeModal] = useState<{ cert: Certificate; show: boolean }>({ cert: null!, show: false });
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking] = useState(false);

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
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certsRes, coursesRes] = await Promise.all([
        instructorApi.getCertificates({}),
        instructorApi.getMyCourses()
      ]);
      setCertificates(certsRes.certificates || []);
      setCourses(coursesRes.courses || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeModal.cert || !revokeReason) return;
    setRevoking(true);
    try {
      await instructorApi.revokeCertificate(revokeModal.cert.id, revokeReason);
      setRevokeModal({ cert: null!, show: false });
      setRevokeReason("");
      fetchData();
    } catch (error) {
      console.error('Failed to revoke:', error);
      alert('Failed to revoke certificate');
    } finally {
      setRevoking(false);
    }
  };

  const filteredCerts = certificates.filter(cert => {
    if (selectedCourse && !cert.course_title.toLowerCase().includes(selectedCourse.toLowerCase())) return false;
    if (search && !cert.student_name.toLowerCase().includes(search.toLowerCase()) && 
        !cert.student_email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case 'A': return 'text-[#bfff00]';
      case 'B': return 'text-[#00ff7f]';
      case 'C': return 'text-[#ffc800]';
      case 'D': return 'text-[#ff8800]';
      default: return 'text-[#888]';
    }
  };

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
            
            <Link to="/instructor/certificates" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[#bfff00]">🎓</span>
              <span className="text-[#bfff00] text-[14px]">Certificates</span>
            </Link>
            
            <Link to="/instructor/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📢</span>
              <span className="text-[14px]">Announcements</span>
            </Link>
            
            <Link to="/instructor/messages" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>💬</span>
              <span className="text-[14px]">Messages</span>
            </Link>
            
            <Link to="/live-sessions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎥</span>
              <span className="text-[14px]">Live Sessions</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
            
            <Link to="/profile" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👤</span>
              <span className="text-[14px]">Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold">
                <span className="text-[#bfff00]">Certificates</span> Management
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                {certificates.length} certificates issued
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] flex-1"
            />
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] min-w-[180px]"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.title}>{course.title}</option>
              ))}
            </select>
          </div>

          {/* Certificates Table */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Student</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Course</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Certificate #</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Grade</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Issued</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Status</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center text-[#888] py-8">Loading...</td>
                  </tr>
                ) : filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-[#888] py-8">No certificates found</td>
                  </tr>
                ) : (
                  filteredCerts.map((cert) => (
                    <tr key={cert.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a]">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{cert.student_name}</div>
                        <div className="text-[#555] text-[12px]">{cert.student_email}</div>
                      </td>
                      <td className="px-6 py-4 text-[#888]">{cert.course_title}</td>
                      <td className="px-6 py-4">
                        <span className="text-[#bfff00] font-mono text-[12px]">{cert.certificate_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${getGradeColor(cert.grade)}`}>{cert.grade || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-[#888] text-[12px]">
                        {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {cert.is_revoked ? (
                          <span className="px-3 py-1 rounded-[99px] text-[12px] bg-[rgba(255,68,68,0.1)] text-[#f44]">Revoked</span>
                        ) : (
                          <span className="px-3 py-1 rounded-[99px] text-[12px] bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!cert.is_revoked && (
                          <button 
                            onClick={() => setRevokeModal({ cert, show: true })}
                            className="px-4 py-1.5 rounded-[8px] text-[#888] hover:text-red-500 bg-transparent border border-[#2a2a2a] text-[12px]"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revoke Modal */}
      {revokeModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setRevokeModal({ cert: null!, show: false })}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[500px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-4">Revoke Certificate</h2>
            <p className="text-[#888] mb-4">
              Are you sure you want to revoke the certificate for <span className="text-white">{revokeModal.cert?.student_name}</span>?
            </p>
            <div className="mb-4">
              <label className="text-[#888] text-[12px] uppercase block mb-2">Reason for revocation</label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Enter reason..."
                rows={3}
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setRevokeModal({ cert: null!, show: false })}
                className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleRevoke}
                disabled={!revokeReason || revoking}
                className="flex-1 bg-red-500 text-white py-3 rounded-[8px] disabled:opacity-50"
              >
                {revoking ? 'Revoking...' : 'Revoke Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
