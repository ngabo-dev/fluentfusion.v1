import { useState } from "react";
import { Link, useNavigate } from "react-router";

interface Goal {
  id: string;
  title: string;
  icon: string;
  bgColor: string;
  descriptions: string[];
}

const GOALS: Goal[] = [
  {
    id: "travel",
    title: "Travel",
    icon: "✈️",
    bgColor: "bg-[rgba(var(--accent-primary-rgb),0.12)]",
    descriptions: ["Navigate new countries", "and connect with locals", "while travelling."],
  },
  {
    id: "academic",
    title: "Academic",
    icon: "🎓",
    bgColor: "bg-[rgba(255,255,255,0.05)]",
    descriptions: ["Study abroad or pursue", "academic opportunities", "in a new language."],
  },
  {
    id: "business",
    title: "Business",
    icon: "💼",
    bgColor: "bg-[rgba(255,255,255,0.05)]",
    descriptions: ["Expand your", "professional network", "and career globally."],
  },
  {
    id: "conversation",
    title: "Conversation",
    icon: "💬",
    bgColor: "bg-[rgba(255,255,255,0.05)]",
    descriptions: ["Make new friends and", "communicate with", "people from different", "cultures."],
  },
];

export default function Component08OnboardGoal() {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedGoal) {
      localStorage.setItem("onboarding_goal", selectedGoal);
      navigate("/onboard/level");
    }
  };

  const handleBack = () => {
    navigate("/onboard/learn-language");
  };

  const isSelected = (id: string) => selectedGoal === id;

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
              Step 3 of 4 — Setting up your profile
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 p-[40px]">
        <div className="bg-[var(--bg-secondary)] w-full max-w-[600px] rounded-[20px] border border-[var(--border-subtle)] p-8">
          {/* Progress Dots */}
          <div className="flex gap-2 mb-6">
            <div className="bg-[#bfff00] h-[4px] rounded-[99px] w-[20px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)]" />
            <div className="bg-[#bfff00] h-[4px] rounded-[99px] w-[20px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)]" />
            <div className="bg-[var(--accent-primary)] h-[4px] rounded-[99px] w-[32px] shadow-[0px_0px_8px_0px_rgba(var(--accent-primary-rgb),0.4)]" />
            <div className="bg-[var(--border-subtle)] h-[4px] rounded-[99px] w-[20px]" />
          </div>

          {/* Badge */}
          <div className="bg-[rgba(var(--accent-primary-rgb),0.1)] inline-block px-[13px] py-[5px] rounded-[99px] mb-4">
            <span className="text-[var(--accent-primary)] text-[11px] font-semibold uppercase">Step 3 of 4</span>
          </div>

          {/* Title */}
          <h1 className="text-[28px] text-[var(--text-primary)] font-bold mb-2">
            What's your <span className="text-[var(--accent-primary)]">Learning Goal?</span>
          </h1>
          <p className="text-[var(--text-tertiary)] text-[14px] mb-8">
            This helps us curate the best content for you.
          </p>

          {/* Goal Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`
                  p-[23px] rounded-[14px] text-left transition-all flex gap-[14px] items-start
                  ${isSelected(goal.id) 
                    ? "bg-[rgba(var(--accent-primary-rgb),0.1)] border-2 border-[var(--accent-primary)]" 
                    : "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                  }
                `}
              >
                <div className={`${goal.bgColor} rounded-[12px] w-[48px] h-[48px] flex items-center justify-center shrink-0 text-[22px]`}>
                  {goal.icon}
                </div>
                <div>
                  <div className="text-[15px] font-bold text-white mb-1">
                    {goal.title}
                  </div>
                  {goal.descriptions.map((desc, i) => (
                    <div key={i} className="text-[#888] text-[12px]">
                      {desc}
                    </div>
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
              onClick={handleContinue}
              disabled={!selectedGoal}
              className={`
                px-[24px] py-[11px] rounded-[8px] font-semibold transition-all
                ${selectedGoal 
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
