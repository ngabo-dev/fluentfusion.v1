import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { API_BASE_URL } from "../app/api/config";

interface Language {
  code: string;
  name: string;
  flag: string;
  country: string;
}

// Default languages in case API fails
const DEFAULT_LANGUAGES: Language[] = [
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼", country: "Rwanda" },
  { code: "en", name: "English", flag: "🇬🇧", country: "Global" },
  { code: "fr", name: "French", flag: "🇫🇷", country: "France" },
  { code: "es", name: "Spanish", flag: "🇪🇸", country: "Spain" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", country: "Portugal" },
  { code: "zh", name: "Mandarin", flag: "🇨🇳", country: "China" },
  { code: "de", name: "German", flag: "🇩🇪", country: "Germany" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", country: "Japan" },
  { code: "ar", name: "Arabic", flag: "🇦🇪", country: "Arabic World" },
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
  'hi': '🇮🇳', 'hindi': '🇮🇳',
  'nl': '🇳🇱', 'dutch': '🇳🇱',
  'sv': '🇸🇪', 'swedish': '🇸🇪',
};

export default function Component06OnboardNativeLang() {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>(DEFAULT_LANGUAGES);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/api/v1/languages`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (response.ok) {
          const data = await response.json();
          if (data.languages && Array.isArray(data.languages)) {
            const mappedLanguages: Language[] = data.languages.map((lang: any) => ({
              code: lang.code || lang.name?.toLowerCase() || 'unknown',
              name: lang.name || 'Unknown',
              flag: LANGUAGE_FLAGS[lang.code?.toLowerCase()] || LANGUAGE_FLAGS[lang.name?.toLowerCase()] || '🌐',
              country: lang.country || 'Global'
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
      localStorage.setItem("onboarding_native_lang", selectedLang);
      navigate("/onboard/learn-language");
    }
  };

  const handleSkip = () => {
    navigate("/onboard/learn-language");
  };

  const isSelected = (code: string) => selectedLang === code;

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="text-[#888] text-[13px]">
              Step 1 of 4 — Setting up your profile
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 p-[40px]">
        <div className="bg-[#151515] w-full max-w-[640px] rounded-[20px] border border-[#2a2a2a] p-8">
          {/* Progress Dots */}
          <div className="flex gap-2 mb-6">
            <div className="bg-[#bfff00] h-[4px] rounded-[99px] w-[32px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)]" />
            <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] w-[20px]" />
            <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] w-[20px]" />
            <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] w-[20px]" />
          </div>

          {/* Badge */}
          <div className="bg-[rgba(191,255,0,0.1)] inline-block px-[13px] py-[5px] rounded-[99px] mb-4">
            <span className="text-[#bfff00] text-[11px] font-semibold uppercase">Step 1 of 4</span>
          </div>

          {/* Title */}
          <h1 className="text-[28px] text-white font-bold mb-2">
            What's your <span className="text-[#bfff00]">Native Language?</span>
          </h1>
          <p className="text-[#888] text-[14px] mb-8">
            We'll use this to translate and personalize your experience.
          </p>

          {/* Language Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-[#888]">Loading languages...</div>
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {languages.map((lang: Language) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`
                  p-4 rounded-[14px] text-left transition-all
                  ${isSelected(lang.code) 
                    ? "bg-[rgba(191,255,0,0.1)] border-2 border-[#bfff00]" 
                    : "bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#444]"
                  }
                `}
              >
                <div className="text-[28px] mb-2">{lang.flag}</div>
                <div className={`text-[13px] font-semibold ${isSelected(lang.code) ? "text-white" : "text-white"}`}>
                  {lang.name}
                </div>
                <div className="text-[#888] text-[11px]">{lang.country}</div>
              </button>
            ))}
          </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="px-[24px] py-[11px] rounded-[8px] text-[#888] hover:text-white transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedLang}
              className={`
                px-[24px] py-[11px] rounded-[8px] font-semibold transition-all
                ${selectedLang 
                  ? "bg-[#bfff00] text-[#0a0a0a] hover:opacity-90 shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)]" 
                  : "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
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
