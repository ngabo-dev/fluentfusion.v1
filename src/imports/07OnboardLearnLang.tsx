import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { API_BASE_URL } from "../app/api/config";

interface Language {
  code: string;
  name: string;
  flag: string;
  subtitle: string;
  learners: string;
}

// Default languages in case API fails
const DEFAULT_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧", subtitle: "Most popular", learners: "↑ 2M learners" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼", subtitle: "Rwanda", learners: "↑ 340K learners" },
  { code: "fr", name: "French", flag: "🇫🇷", subtitle: "Global", learners: "↑ 1.2M learners" },
  { code: "es", name: "Spanish", flag: "🇪🇸", subtitle: "Global", learners: "↑ 1.5M learners" },
  { code: "de", name: "German", flag: "🇩🇪", subtitle: "Europe", learners: "↑ 580K learners" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", subtitle: "Japan", learners: "↑ 710K learners" },
  { code: "zh", name: "Mandarin", flag: "🇨🇳", subtitle: "China", learners: "↑ 450K learners" },
  { code: "ar", name: "Arabic", flag: "🇦🇪", subtitle: "Middle East", learners: "↑ 290K learners" },
  { code: "ko", name: "Korean", flag: "🇰🇷", subtitle: "Korea", learners: "↑ 380K learners" },
];

// Map backend language codes to flags
const LANGUAGE_FLAGS: { [key: string]: string } = {
  'rw': '🇷🇼', 'kinyarwanda': '🇷🇼',
  'en': '🇬🇧', 'english': '🇬🇧',
  'fr': '🇫🇷', 'french': '🇫🇷',
  'es': '🇪🇸', 'spanish': '🇪🇸',
  'pt': '🇵🇹', 'portuguese': '🇵🇹',
  'zh': '🇨🇳', 'chinese': '🇨🇳', 'mandarin': '🇨🇳',
  'de': '🇩🇪', 'german': '🇩🇪',
  'ja': '🇯🇵', 'japanese': '🇯🇵',
  'ar': '🇦🇪', 'arabic': '🇦🇪',
  'ko': '🇰🇷', 'korean': '🇰🇷',
  'it': '🇮🇹', 'italian': '🇮🇹',
  'ru': '🇷🇺', 'russian': '🇷🇺',
};

export default function Component07OnboardLearnLang() {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>(DEFAULT_LANGUAGES);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const token = localStorage.getItem('ff_access_token');
        const response = await fetch(`${API_BASE_URL}/languages`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (response.ok) {
          const data = await response.json();
          if (data.languages && Array.isArray(data.languages)) {
            const mappedLanguages: Language[] = data.languages.map((lang: any) => ({
              code: lang.code || lang.name?.toLowerCase() || 'unknown',
              name: lang.name || 'Unknown',
              flag: LANGUAGE_FLAGS[lang.code?.toLowerCase()] || LANGUAGE_FLAGS[lang.name?.toLowerCase()] || '🌐',
              subtitle: lang.country || 'Global',
              learners: lang.learner_count ? `↑ ${(lang.learner_count / 1000).toFixed(0)}K learners` : 'New'
            }));
            setLanguages(mappedLanguages);
          }
        }
      } catch (error) {
        console.log('Using default languages');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLanguages();
  }, []);

  const handleContinue = () => {
    if (selectedLang) {
      // Save to localStorage for onboarding flow
      localStorage.setItem("onboarding_learn_lang", selectedLang);
      navigate("/onboard/goal");
    }
  };

  const handleBack = () => {
    navigate("/onboard/native-lang");
  };

  const isSelected = (code: string) => selectedLang === code;

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen flex flex-col">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(var(--bg-primary-rgb),0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[var(--border-subtle)] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[var(--accent-primary)] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-[var(--text-primary)] font-bold">
                FLUENT<span className="text-[var(--accent-primary)]">FUSION</span>
              </span>
            </Link>
            <div className="text-[var(--text-tertiary)] text-[13px]">
              Step 2 of 4 — Setting up your profile
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 p-[40px]">
        <div className="bg-[var(--bg-secondary)] w-full max-w-[640px] rounded-[20px] border border-[var(--border-subtle)] p-8">
          {/* Progress Dots */}
          <div className="flex gap-2 mb-6">
            <div className="bg-[var(--accent-primary)] h-[4px] rounded-[99px] w-[20px] shadow-[0px_0px_8px_0px_rgba(var(--accent-primary-rgb),0.4)]" />
            <div className="bg-[var(--accent-primary)] h-[4px] rounded-[99px] w-[32px] shadow-[0px_0px_8px_0px_rgba(var(--accent-primary-rgb),0.4)]" />
            <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] w-[20px]" />
            <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] w-[20px]" />
          </div>

          {/* Badge */}
          <div className="bg-[rgba(var(--accent-primary-rgb),0.1)] inline-block px-[13px] py-[5px] rounded-[99px] mb-4">
            <span className="text-[var(--accent-primary)] text-[11px] font-semibold uppercase">Step 2 of 4</span>
          </div>

          {/* Title */}
          <h1 className="text-[28px] text-[var(--text-primary)] font-bold mb-2">
            What do you want to <span className="text-[var(--accent-primary)]">Learn?</span>
          </h1>
          <p className="text-[var(--text-tertiary)] text-[14px] mb-8">
            Pick the language you're most excited to master.
          </p>

          {/* Language Grid - 3 columns */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-[var(--text-tertiary)]">Loading languages...</div>
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {languages.map((lang: Language) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`
                  p-4 rounded-[14px] text-left transition-all h-[146px]
                  ${isSelected(lang.code) 
                    ? "bg-[rgba(var(--accent-primary-rgb),0.1)] border-2 border-[var(--accent-primary)]" 
                    : "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                  }
                `}
              >
                <div className="text-[28px] mb-2">{lang.flag}</div>
                <div className={`text-[13px] font-semibold ${isSelected(lang.code) ? "text-white" : "text-white"}`}>
                  {lang.name}
                </div>
                <div className="text-[var(--text-tertiary)] text-[11px]">{lang.subtitle}</div>
                <div className="text-[var(--accent-primary)] text-[11px] mt-1">{lang.learners}</div>
              </button>
            ))}
          </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-[24px] py-[11px] rounded-[8px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedLang}
              className={`
                px-[24px] py-[11px] rounded-[8px] font-semibold transition-all
                ${selectedLang 
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-[0px_0px_12px_0px_rgba(var(--accent-primary-rgb),0.25)]" 
                  : "bg-[var(--border-subtle)] text-[var(--text-tertiary)] cursor-not-allowed"
                }
              `}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
