import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import { toast } from "sonner";

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
      toast.success('Certificate revoked successfully');
      fetchData();
    } catch (error: any) {
      console.error('Failed to revoke:', error);
      toast.error(error.message || 'Failed to revoke certificate');
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
    <InstructorLayout title="Certificates" subtitle={`${certificates.length} certificate${certificates.length !== 1 ? 's' : ''} issued to students`}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#151515] border border-[#2a2a2a] text-white rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#bfff00] transition-colors flex-1"
        />
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="bg-[#151515] border border-[#2a2a2a] text-[#888] rounded-lg px-3 py-2 text-[13px] outline-none"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.title}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Certificates Table */}
      <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Student', 'Course', 'Certificate #', 'Grade', 'Issued', 'Status', ''].map(h => (
                <th key={h} className="text-left text-[#555] text-[11px] uppercase tracking-widest px-5 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center text-[#888] py-10">Loading certificates...</td></tr>
            ) : filteredCerts.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="text-center py-12">
                    <div className="text-[40px] mb-3">🏆</div>
                    <p className="text-[#888] text-[14px]">No certificates found</p>
                  </div>
                </td>
              </tr>
            ) : filteredCerts.map((cert) => (
              <tr key={cert.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                <td className="px-5 py-4">
                  <div className="text-white text-[13px] font-semibold">{cert.student_name}</div>
                  <div className="text-[#555] text-[11px]">{cert.student_email}</div>
                </td>
                <td className="px-5 py-4 text-[#888] text-[13px] max-w-[160px] truncate">{cert.course_title}</td>
                <td className="px-5 py-4">
                  <span className="text-[#bfff00] font-mono text-[11px]">{cert.certificate_number}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`font-bold text-[14px] ${getGradeColor(cert.grade)}`}>{cert.grade || '—'}</span>
                </td>
                <td className="px-5 py-4 text-[#888] text-[12px]">
                  {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-4">
                  {cert.is_revoked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400">Revoked</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Active</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {!cert.is_revoked && (
                    <button onClick={() => setRevokeModal({ cert, show: true })} className="text-[#555] hover:text-red-400 text-[12px] transition-colors">Revoke</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revoke Modal */}
      {revokeModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setRevokeModal({ cert: null!, show: false })}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-[480px] mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[18px] font-bold mb-2">Revoke Certificate</h2>
            <p className="text-[#888] text-[13px] mb-5">
              Revoke certificate for <span className="text-white font-medium">{revokeModal.cert?.student_name}</span>?
            </p>
            <div className="mb-5">
              <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Reason for revocation *</label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Explain why this certificate is being revoked..."
                rows={3}
                className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-red-500 transition-colors resize-none text-[13px]"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRevokeModal({ cert: null!, show: false })} className="flex-1 bg-[#0f0f0f] text-[#888] py-2.5 rounded-lg text-[13px] hover:text-white transition-colors">Cancel</button>
              <button onClick={handleRevoke} disabled={!revokeReason || revoking} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-[13px] font-semibold disabled:opacity-50 hover:bg-red-500 transition-colors">
                {revoking ? 'Revoking...' : 'Revoke Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
