import clsx from "clsx";
import { useNavigate } from "react-router";
import { useState } from "react";
import { authApi } from "../app/api/config";

function BackgroundBorderBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">{children}</div>
    </div>
  );
}

function ContainerBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">{children}</div>
    </div>
  );
}
type BackgroundImageProps = {
  additionalClassNames?: string;
};

function BackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImageProps>) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className={clsx("flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[19.2px]">{children}</p>
    </div>
  );
}
type InputBackgroundImageProps = {
  text: string;
  value: string;
  type?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

function InputBackgroundImage({ text, value, type = "text", onChange, placeholder }: InputBackgroundImageProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[45px] pr-[17px] py-[13px] relative w-full">
          <div className="flex-[1_0_0] min-h-px min-w-px relative">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
              <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder || text}
                className="bg-transparent w-full outline-none text-[#fff] text-[15px] placeholder-[#555]"
                style={{ fontFamily: "'DM_Sans:9pt_Regular',sans-serif" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border ${isFocused ? 'border-[#bfff00]' : 'border-[#2a2a2a]'} border-solid inset-0 pointer-events-none rounded-[8px]`} />
    </div>
  );
}
type ContainerBackgroundImageAndText4Props = {
  text: string;
};

function ContainerBackgroundImageAndText4({ text }: ContainerBackgroundImageAndText4Props) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] right-[19px] top-[89.79px]">
      <BackgroundImage additionalClassNames="text-center">{text}</BackgroundImage>
    </div>
  );
}
type ContainerBackgroundImageAndText3Props = {
  text: string;
};

function ContainerBackgroundImageAndText3({ text }: ContainerBackgroundImageAndText3Props) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] right-[19px] top-[18px]">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-center text-white whitespace-nowrap">
        <p className="leading-[38.4px]">{text}</p>
      </div>
    </div>
  );
}
type ContainerBackgroundImageAndText2Props = {
  text: string;
};

function ContainerBackgroundImageAndText2({ text }: ContainerBackgroundImageAndText2Props) {
  return (
    <div className="absolute bottom-[22.17%] content-stretch flex flex-col items-start left-[14px] top-[22.2%]">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888] text-[16px] whitespace-nowrap">
        <p className="leading-[25.6px]">{text}</p>
      </div>
    </div>
  );
}
type LabelBackgroundImageAndTextProps = {
  text: string;
};

function LabelBackgroundImageAndText({ text }: LabelBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
type ContainerBackgroundImageAndText1Props = {
  text: string;
};

function ContainerBackgroundImageAndText1({ text }: ContainerBackgroundImageAndText1Props) {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0 w-full">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">{text}</p>
      </div>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className={clsx("flex flex-col justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[22.4px]">{text}</p>
    </div>
  );
}
type ContainerBackgroundImageAndTextProps = {
  text: string;
};

function ContainerBackgroundImageAndText({ text }: ContainerBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <BackgroundImageAndText text={text} additionalClassNames="font-['DM_Sans:SemiBold',sans-serif] font-semibold" />
    </div>
  );
}
type OverlayBackgroundImageAndTextProps = {
  text: string;
};

function OverlayBackgroundImageAndText({ text }: OverlayBackgroundImageAndTextProps) {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center justify-center pb-[5.3px] pt-[4.7px] relative rounded-[9px] shrink-0 size-[36px]">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[25.6px]">{text}</p>
      </div>
    </div>
  );
}

export default function Component02Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const signupData = {
        email,
        password,
        full_name: fullName,
        role,
      };
      console.log("Sending signup request:", signupData);
      
      await authApi.register(signupData);
      setSuccess("Account created! Please check your email to verify your account.");
      // Store email for verification page and navigate to verify
      localStorage.setItem('verification_email', email);
      // Navigate to email verification after a short delay
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);
    } catch (err: any) {
      // Show user-friendly error message
      console.error("Signup error:", err);
      const errorMessage = err.message || "";
      if (errorMessage.includes("Email already registered")) {
        setError("This email is already registered. Please sign in or use a different email.");
      } else if (errorMessage.includes("400")) {
        setError("Registration failed. Please check your input and try again.");
      } else if (errorMessage.includes("422")) {
        setError("Validation error. Please check your input: " + errorMessage);
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="02-signup">
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="Nav">
        <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
            <div className="relative shrink-0" data-name="Link">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
                <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="Background">
                  <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-center whitespace-nowrap">
                    <p className="leading-[28.8px]">🧠</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
                  <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[18px] text-white tracking-px] uppercase whitespace[-0.36-nowrap">
                    <p>
                      <span className="leading-[28.8px]">FLUENT</span>
                      <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ContainerBackgroundImage>
              <button onClick={() => navigate('/login')} className="cursor-pointer">
                <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                  <p>
                    <span className="leading-[22.4px]">{`Already have an account? `}</span>
                    <span className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[22.4px] text-[#bfff00] hover:underline" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Sign In
                    </span>
                  </p>
                </div>
              </button>
            </ContainerBackgroundImage>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-start justify-center min-h-[834px] relative shrink-0 w-full z-[1]" data-name="Container">
        <div className="hidden lg:flex bg-[#0f0f0f] flex-1 min-h-px relative self-stretch" data-name="LEFT PANEL">
          <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex items-center justify-center pl-[60px] pr-[61px] py-[60px] relative size-full">
              <div className="absolute inset-[0_1px_0.04px_0]" data-name="Gradient" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 719 967.11\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(64.71 0 0 67.698 143.8 483.55)\\'><stop stop-color=\\'rgba(191,255,0,0.06)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />
              <div className="max-w-[380px] relative shrink-0" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[15.4px] items-start max-w-[inherit] pb-[19.99px] relative">
                  <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center px-[13px] py-[5px] relative rounded-[99px] shrink-0" data-name="Overlay+Border">
                    <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[99px]" />
                    <div className="flex flex-col font-['DM_Sans:SemiBold','Noto_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                      <p className="leading-[17.6px]">✦ Start for Free</p>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                    <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[39.6px] relative shrink-0 text-[36px] text-white tracking-[-0.72px] uppercase whitespace-nowrap">
                      <p className="mb-0">JOIN 2</p>
                      <p className="mb-0">MILLION</p>
                      <p className="mb-0 text-[#bfff00]">LEARNERS</p>
                      <p>WORLDWIDE</p>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-start pb-[0.75px] pt-[7.84px] relative shrink-0 w-full" data-name="Container">
                    <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[25.5px] relative shrink-0 text-[#888] text-[15px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                      <p className="mb-0">Create your free account and start your language</p>
                      <p>learning journey today.</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start pt-[20.6px] relative shrink-0 w-full" data-name="Container">
                    <OverlayBackgroundImageAndText text="🎯" />
                    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0" data-name="Container">
                      <ContainerBackgroundImageAndText text="Personalized AI Learning" />
                      <ContainerBackgroundImageAndText1 text="Adapts to your skill level automatically" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start pt-[4.6px] relative shrink-0 w-full" data-name="Container">
                    <OverlayBackgroundImageAndText text="🔥" />
                    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0" data-name="Container">
                      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                          <p className="leading-[22.4px]">{`Daily Streaks & Gamification`}</p>
                        </div>
                      </div>
                      <ContainerBackgroundImageAndText1 text="Stay motivated with XP and achievements" />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start pt-[4.6px] relative shrink-0 w-full" data-name="Container">
                    <OverlayBackgroundImageAndText text="🎥" />
                    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0" data-name="Container">
                      <ContainerBackgroundImageAndText text="Live Instructor Sessions" />
                      <ContainerBackgroundImageAndText1 text="Practice with native speakers in real time" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-[#2a2a2a] border-r border-solid inset-0 pointer-events-none" />
        </div>
        <div className="flex-1 min-h-px relative self-stretch" data-name="RIGHT PANEL">
          <div className="flex flex-row items-center justify-center overflow-auto size-full">
            <div className="content-stretch flex items-center justify-center pb-[60px] pt-[59.4px] px-[40px] relative size-full">
              <div className="content-stretch flex flex-col gap-[6px] items-start max-w-[440px] relative shrink-0 w-[440px]" data-name="Container">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                  <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[44.8px] relative shrink-0 text-[28px] text-white tracking-[-0.56px] uppercase w-full whitespace-pre-wrap">
                    <p className="mb-0">Create</p>
                    <p>Account</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                  <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
                    <p className="leading-[22.4px] whitespace-pre-wrap">Start your language learning journey</p>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-[rgba(255,0,0,0.1)] border border-red-500 border-solid px-[12px] py-[8px] rounded-[8px] w-full">
                    <p className="text-red-500 text-[13px] leading-[20px]">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="bg-[rgba(0,255,0,0.1)] border border-green-500 border-solid px-[12px] py-[8px] rounded-[8px] w-full">
                    <p className="text-green-500 text-[13px] leading-[20px]">{success}</p>
                  </div>
                )}

                <div className="content-stretch flex flex-col gap-[7px] items-start pt-[26px] relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Full Name" />
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                    <InputBackgroundImage text="Jean Pierre Habimana" value={fullName} onChange={setFullName} placeholder="Enter your full name" />
                    <ContainerBackgroundImageAndText2 text="👤" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[7px] items-start pt-[12px] relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Email Address" />
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                    <InputBackgroundImage text="jean@example.com" value={email} type="email" onChange={setEmail} placeholder="Enter your email" />
                    <ContainerBackgroundImageAndText2 text="✉️" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[7px] items-start pt-[12px] relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Password" />
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                    <InputBackgroundImage text="Min. 8 characters" value={password} type="password" onChange={setPassword} placeholder="Min. 8 characters" />
                    <ContainerBackgroundImageAndText2 text="🔒" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[7px] items-start pb-[22px] pt-[12px] relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="I Am A..." />
                  <div className="flex gap-[12px] items-start justify-center relative shrink-0 w-full" data-name="Container">
                    {/* Student Option */}
                    <div 
                      className={`flex-1 h-[120px] min-h-[120px] relative rounded-[14px] cursor-pointer flex flex-col items-center justify-center ${role === 'student' ? 'bg-[rgba(191,255,0,0.1)] border-2 border-[#bfff00]' : 'bg-[#1f1f1f] border border-[#2a2a2a]'}`}
                      data-name="Overlay+Border"
                      onClick={() => setRole("student")}
                    >
                      {role === 'student' && (
                        <div aria-hidden="true" className="absolute border border-[#bfff00] border-solid inset-0 pointer-events-none rounded-[14px]" />
                      )}
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-[24px]">🎓</div>
                        <div className="text-[14px] font-semibold text-white">Student</div>
                        <div className="text-[12px] text-[#888]">I want to learn</div>
                      </div>
                    </div>
                    {/* Instructor Option */}
                    <div 
                      className={`flex-1 h-[120px] min-h-[120px] relative rounded-[14px] cursor-pointer flex flex-col items-center justify-center ${role === 'instructor' ? 'bg-[rgba(191,255,0,0.1)] border-2 border-[#bfff00]' : 'bg-[#1f1f1f] border border-[#2a2a2a]'}`}
                      data-name="Background+Border"
                      onClick={() => setRole("instructor")}
                    >
                      {role === 'instructor' && (
                        <div aria-hidden="true" className="absolute border border-[#bfff00] border-solid inset-0 pointer-events-none rounded-[14px]" />
                      )}
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-[24px]">📋</div>
                        <div className="text-[14px] font-semibold text-white">Instructor</div>
                        <div className="text-[12px] text-[#888]">I want to teach</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  className={`bg-[#bfff00] relative rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 w-full cursor-pointer ${isLoading ? 'opacity-50' : ''}`} 
                  data-name="Button"
                  onClick={handleSignup}
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex items-center justify-center px-[36px] py-[15px] relative w-full">
                      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] text-center tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                        <p className="leading-[normal]">{isLoading ? 'Creating Account...' : 'Create Free Account →'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center pb-[14px] pt-[13px] relative shrink-0 w-full" data-name="Container">
                  <div className="bg-[#2a2a2a] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Horizontal Divider" />
                  <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
                    <BackgroundImage>or continue with</BackgroundImage>
                  </div>
                  <div className="bg-[#2a2a2a] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Horizontal Divider" />
                </div>
                <BackgroundBorderBackgroundImage>
                  <div className="content-stretch flex gap-[10px] items-center justify-center pb-[12.89px] pt-[12.5px] px-[21px] relative w-full">
                    <ContainerBackgroundImage>
                      <BackgroundImageAndText text="🇬" additionalClassNames="font-['DM_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium" />
                    </ContainerBackgroundImage>
                    <BackgroundImageAndText text="Continue with Google" additionalClassNames="font-['DM_Sans:Medium',sans-serif] font-medium text-center" />
                  </div>
                </BackgroundBorderBackgroundImage>
                <BackgroundBorderBackgroundImage>
                  <div className="content-stretch flex gap-[10px] items-center justify-center pb-[12.89px] pt-[16.5px] px-[21px] relative w-full">
                    <ContainerBackgroundImage>
                      <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
                        <p className="leading-[22.4px]">🍎</p>
                      </div>
                    </ContainerBackgroundImage>
                    <BackgroundImageAndText text="Continue with Apple" additionalClassNames="font-['DM_Sans:Medium',sans-serif] font-medium text-center" />
                  </div>
                </BackgroundBorderBackgroundImage>
                <div className="content-stretch flex flex-col items-center pt-[13px] relative shrink-0 w-full" data-name="Container">
                  <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                    <p>
                      <span className="leading-[19.2px]">{`By signing up you agree to our `}</span>
                      <span className="leading-[19.2px] text-[#bfff00]">Terms</span>
                      <span className="leading-[19.2px]">{` and `}</span>
                      <span className="leading-[19.2px] text-[#bfff00]">Privacy Policy</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
