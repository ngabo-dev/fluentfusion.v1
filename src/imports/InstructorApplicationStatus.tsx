import { useState, useEffect, KeyboardEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { instructorApi } from '../app/api/config';

type ApplicationStatus = 'loading' | 'pending' | 'rejected' | 'no_application' | 'approved';

interface ApplicationData {
  status: ApplicationStatus;
  bio?: string;
  expertise?: string[];
  rejection_reason?: string;
}

export default function InstructorApplicationStatus() {
  const navigate = useNavigate();
  const [appData, setAppData] = useState<ApplicationData>({ status: 'loading' });
  const [showApplyForm, setShowApplyForm] = useState(false);

  // Apply form state
  const [bio, setBio] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertiseTags, setExpertiseTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await apiCall<ApplicationData>('/instructor/application/status');
        setAppData(data);
        // Cache status in localStorage for InstructorRoute guard
        if (data.status && data.status !== 'loading') {
          localStorage.setItem('ff_instructor_status', data.status);
        }
        // If approved, redirect to dashboard
        if (data.status === 'approved') {
          navigate('/instructor/dashboard', { replace: true });
        }
        // Show apply form immediately if no application
        if (data.status === 'no_application') {
          setShowApplyForm(true);
        }
      } catch (err) {
        console.error('Failed to fetch application status:', err);
        setAppData({ status: 'no_application' });
        setShowApplyForm(true);
      }
    };

    fetchStatus();
  }, [navigate]);

  const addExpertiseTag = (value: string) => {
    const trimmed = value.trim().replace(/,+$/, '').trim();
    if (trimmed && !expertiseTags.includes(trimmed)) {
      setExpertiseTags(prev => [...prev, trimmed]);
    }
    setExpertiseInput('');
  };

  const handleExpertiseKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addExpertiseTag(expertiseInput);
    } else if (e.key === 'Backspace' && expertiseInput === '' && expertiseTags.length > 0) {
      setExpertiseTags(prev => prev.slice(0, -1));
    }
  };

  const handleExpertiseChange = (value: string) => {
    if (value.endsWith(',')) {
      addExpertiseTag(value);
    } else {
      setExpertiseInput(value);
    }
  };

  const removeTag = (tag: string) => {
    setExpertiseTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmitApplication = async () => {
    setSubmitError('');
    if (bio.length < 100) {
      setSubmitError('Bio must be at least 100 characters.');
      return;
    }
    if (expertiseTags.length === 0) {
      setSubmitError('Please add at least one area of expertise.');
      return;
    }

    setSubmitting(true);
    try {
      await apiCall('/instructor/apply', {
        method: 'POST',
        body: JSON.stringify({ bio, expertise: expertiseTags }),
      });
      // Success — show pending state
      const newData: ApplicationData = { status: 'pending', bio, expertise: expertiseTags };
      setAppData(newData);
      localStorage.setItem('ff_instructor_status', 'pending');
      setShowApplyForm(false);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Shared header ──────────────────────────────────────────────────────────
  const Header = () => (
    <div className="flex items-center gap-3 mb-10">
      <span className="text-3xl">🧠</span>
      <span className="text-white font-extrabold text-xl tracking-widest uppercase">
        FluentFusion
      </span>
    </div>
  );

  // ── Loading spinner ────────────────────────────────────────────────────────
  if (appData.status === 'loading') {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#888] text-sm">Checking application status…</p>
        </div>
      </div>
    );
  }

  // ── Apply form card ────────────────────────────────────────────────────────
  const ApplyFormCard = () => (
    <div className="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-xl shadow-xl">
      <div className="text-4xl mb-4 text-center">📋</div>
      <h1 className="text-white text-2xl font-bold text-center mb-1">Become an Instructor</h1>
      <p className="text-[#888] text-sm text-center mb-8">
        Share your expertise and help students around the world learn new languages.
      </p>

      {/* Bio */}
      <div className="mb-5">
        <label className="block text-[#ccc] text-sm font-medium mb-2">
          Bio <span className="text-[#888] font-normal">(min 100 chars)</span>
        </label>
        <textarea
          rows={5}
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Tell us about your teaching experience..."
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#bfff00] resize-none transition-colors"
        />
        <p className={`text-xs mt-1 ${bio.length < 100 ? 'text-[#888]' : 'text-[#bfff00]'}`}>
          {bio.length} / 100 characters minimum
        </p>
      </div>

      {/* Expertise tags */}
      <div className="mb-6">
        <label className="block text-[#ccc] text-sm font-medium mb-2">
          Areas of Expertise
        </label>
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 focus-within:border-[#bfff00] transition-colors min-h-[48px] flex flex-wrap gap-2 items-center">
          {expertiseTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-[#bfff00]/10 text-[#bfff00] border border-[#bfff00]/30 rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-[#bfff00]/60 hover:text-[#bfff00] ml-0.5 leading-none"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={expertiseInput}
            onChange={e => handleExpertiseChange(e.target.value)}
            onKeyDown={handleExpertiseKeyDown}
            placeholder={expertiseTags.length === 0 ? 'e.g. Spanish, Grammar, IELTS… press Enter or , to add' : 'Add more…'}
            className="flex-1 min-w-[160px] bg-transparent text-white text-sm placeholder-[#444] focus:outline-none"
          />
        </div>
        <p className="text-[#555] text-xs mt-1">Press Enter or comma to add a tag.</p>
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmitApplication}
        disabled={submitting}
        className="w-full bg-[#bfff00] text-black font-bold py-3 rounded-lg hover:bg-[#d4ff33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting…' : 'Submit Application'}
      </button>

      <div className="text-center mt-6">
        <Link to="/" className="text-[#888] text-sm hover:text-[#bfff00] transition-colors">
          ← Return to Home
        </Link>
      </div>
    </div>
  );

  // ── Pending card ───────────────────────────────────────────────────────────
  const PendingCard = () => (
    <div className="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-xl shadow-xl">
      <div className="text-5xl text-center mb-4">⏳</div>
      <h1 className="text-white text-2xl font-bold text-center mb-2">Application Under Review</h1>
      <p className="text-[#888] text-sm text-center mb-8">
        We're reviewing your application. This usually takes 2–3 business days.
      </p>

      {(appData.bio || (appData.expertise && appData.expertise.length > 0)) && (
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-5 mb-6">
          <h2 className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-3">
            Your Submission
          </h2>
          {appData.bio && (
            <p className="text-[#ccc] text-sm leading-relaxed mb-4">{appData.bio}</p>
          )}
          {appData.expertise && appData.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {appData.expertise.map(tag => (
                <span
                  key={tag}
                  className="bg-[#bfff00]/10 text-[#bfff00] border border-[#bfff00]/30 rounded-full px-3 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-8">
        <p className="text-yellow-400/80 text-sm">
          You will receive an email notification once your application has been reviewed.
        </p>
      </div>

      <div className="text-center">
        <Link to="/" className="text-[#888] text-sm hover:text-[#bfff00] transition-colors">
          ← Return to Home
        </Link>
      </div>
    </div>
  );

  // ── Rejected card ──────────────────────────────────────────────────────────
  const RejectedCard = () => (
    <div className="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-xl shadow-xl">
      <div className="text-5xl text-center mb-4">❌</div>
      <h1 className="text-white text-2xl font-bold text-center mb-2">Application Not Approved</h1>
      <p className="text-[#888] text-sm text-center mb-6">
        Unfortunately, your instructor application was not approved at this time.
      </p>

      {appData.rejection_reason && (
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-5 mb-8">
          <h2 className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-2">
            Reason
          </h2>
          <p className="text-[#ccc] text-sm leading-relaxed">{appData.rejection_reason}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setBio('');
          setExpertiseTags([]);
          setExpertiseInput('');
          setSubmitError('');
          setShowApplyForm(true);
        }}
        className="w-full bg-[#bfff00] text-black font-bold py-3 rounded-lg hover:bg-[#d4ff33] transition-colors mb-4"
      >
        Apply Again
      </button>

      <div className="text-center">
        <Link to="/" className="text-[#888] text-sm hover:text-[#bfff00] transition-colors">
          ← Return to Home
        </Link>
      </div>
    </div>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  const renderCard = () => {
    if (showApplyForm) return <ApplyFormCard />;
    if (appData.status === 'pending') return <PendingCard />;
    if (appData.status === 'rejected') return <RejectedCard />;
    // Fallback (no_application without showApplyForm, shouldn't happen normally)
    return <ApplyFormCard />;
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Header />
      {renderCard()}
    </div>
  );
}
