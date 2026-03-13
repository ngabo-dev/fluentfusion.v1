import { useState } from "react";
import { Link, useNavigate } from "react-router";

interface Level {
  id: string;
  name: string;
  emoji: string;
  description: string;
  dots: number[];
}

const LEVELS: Level[] = [
  {
    id: "beginner",
    name: "Beginner",
    emoji: "🌱",
    description: "I know very little or nothing. Start from scratch.",
    dots: [1, 0, 0],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    emoji: "🌿",
    description: "I know the basics and can handle simple conversations.",
    dots: [1, 1, 0],
  },
  {
    id: "advanced",
    name: "Advanced",
    emoji: "🌳",
    description: "I'm fluent and want to polish my skills further.",
    dots: [1, 1, 1],
  },
];

export default function Component09OnboardLevel() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleFinish = () => {
    if (selectedLevel) {
      localStorage.setItem("onboarding_level", selectedLevel);
      const token = localStorage.getItem("access_token");
      if (token) {
        navigate("/dashboard");
      } else {
        navigate("/signup");
      }
    }
  };

  const handleBack = () => {
    navigate("/onboard/goal");
  };

  const isSelected = (id: string) => selectedLevel === id;

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
            <div className="text-[#888] text-[13px]">
              Step 4 of 4 — Almost done!
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 p-[40px]">
        <div className="bg-[var(--bg-secondary)] w-full max-w-[560px] rounded-[20px] border border-[var(--border-subtle)] p-8">
          {/* Progress Dots */}
          <div className="flex gap-2 mb-6">
            <div className="bg-[#bfff00] h-[4px] rounded-[99px] w-[20px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)]" />
            <div className="bg-[#bfff00] h-[4px] rounded-[99px] w-[20px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)]" />
            <div className="bg-[#bfff00] h-[4px] rounded-[99px] w-[20px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)]" />
            <div className="bg-[var(--accent-primary)] h-[4px] rounded-[99px] w-[32px] shadow-[0px_0px_8px_0px_rgba(var(--accent-primary-rgb),0.4)]" />
          </div>

          {/* Badge */}
          <div className="bg-[rgba(var(--accent-primary-rgb),0.1)] inline-block px-[13px] py-[5px] rounded-[99px] mb-4">
            <span className="text-[var(--accent-primary)] text-[11px] font-semibold uppercase">Step 4 of 4</span>
          </div>

          {/* Title */}
          <h1 className="text-[28px] text-[var(--text-primary)] font-bold mb-2">
            What's your <span className="text-[var(--accent-primary)]">Current Level?</span>
          </h1>
          <p className="text-[var(--text-tertiary)] text-[14px] mb-8">
            Be honest — we'll create the perfect starting point for you.
          </p>

          {/* Level List */}
          <div className="flex flex-col gap-3 mb-8">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`
                  w-full p-[26px] rounded-[14px] text-left transition-all flex items-center justify-between
                  ${isSelected(level.id) 
                    ? "bg-[rgba(var(--accent-primary-rgb),0.1)] border-2 border-[var(--accent-primary)]" 
                    : "bg-[var(--bg-tertiary)] border-2 border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="text-[28px]">{level.emoji}</div>
                  <div>
                    <div className="text-[17px] font-bold text-white mb-1">
                      {level.name}
                    </div>
                    <div className="text-[#888] text-[13px]">
                      {level.description}
                    </div>
                  </div>
                </div>
                {/* Progress Dots */}
                <div className="flex gap-1">
                  {level.dots.map((filled, i) => (
                    <div
                      key={i}
                      className={`
                        w-[10px] h-[10px] rounded-[5px]
                        ${filled 
                          ? "bg-[var(--accent-primary)] shadow-[0px_0px_4px_0px_rgba(var(--accent-primary-rgb),0.5)]" 
                          : "bg-[var(--border-default)]"
                        }
                      `}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-[24px] py-[11px] rounded-[8px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleFinish}
              disabled={!selectedLevel}
              className={`
                px-[36px] py-[15px] rounded-[10px] font-semibold transition-all
                ${selectedLevel 
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-[0px_0px_12px_0px_rgba(var(--accent-primary-rgb),0.25)]" 
                  : "bg-[var(--border-subtle)] text-[var(--text-tertiary)] cursor-not-allowed"
                }
              `}
            >
              Finish Setup 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
