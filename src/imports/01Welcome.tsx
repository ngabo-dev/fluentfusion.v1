import clsx from "clsx";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { usersApi } from "../app/api/config";

function LinkBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">{children}</div>
    </div>
  );
}

function ContainerBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative self-stretch shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-px h-full items-start relative">{children}</div>
    </div>
  );
}
type BackgroundImage1Props = {
  additionalClassNames?: string;
};

function BackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage1Props>) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className={clsx("flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[19.2px]">{children}</p>
    </div>
  );
}
type LinkBackgroundImageAndText1Props = {
  text: string;
};

function LinkBackgroundImageAndText1({ text }: LinkBackgroundImageAndText1Props) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">{text}</p>
      </div>
    </div>
  );
}
type ContainerBackgroundImageAndText4Props = {
  text: string;
};

function ContainerBackgroundImageAndText4({ text }: ContainerBackgroundImageAndText4Props) {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-center left-[18px] top-[calc(50%+0.2px)]">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[25.6px]">{text}</p>
      </div>
    </div>
  );
}
type BackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText1({ text, additionalClassNames = "" }: BackgroundImageAndText1Props) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className={clsx("-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] text-[13px] text-center top-[calc(50%-0.9px)]", additionalClassNames)}>
      <p className="leading-[20.8px] whitespace-pre-wrap">{text}</p>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className={clsx("flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-center whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[normal]">{text}</p>
    </div>
  );
}
type LinkBackgroundImageAndTextProps = {
  text: string;
};

function LinkBackgroundImageAndText({ text }: LinkBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">{text}</p>
      </div>
    </div>
  );
}
type BackgroundImageProps = {
  text: string;
  text1: string;
  additionalClassNames?: string;
};

function BackgroundImage({ text, text1, additionalClassNames = "" }: BackgroundImageProps) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className={clsx("flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#888] text-center whitespace-nowrap", additionalClassNames)}>
      <p className="mb-0">{text}</p>
      <p>{text1}</p>
    </div>
  );
}
type ContainerBackgroundImageProps = {
  text: string;
  text1: string;
};

function ContainerBackgroundImage({ text, text1 }: ContainerBackgroundImageProps) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[25px] right-[25px] top-[110.87px]">
      <BackgroundImage text={text} text1={text1} additionalClassNames="leading-[20.15px] text-[13px]" />
    </div>
  );
}
type ContainerBackgroundImageAndText3Props = {
  text: string;
};

function ContainerBackgroundImageAndText3({ text }: ContainerBackgroundImageAndText3Props) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[25px] right-[25px] top-[81.8px]">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px]">{text}</p>
      </div>
    </div>
  );
}
type ContainerBackgroundImageAndText2Props = {
  text: string;
};

function ContainerBackgroundImageAndText2({ text }: ContainerBackgroundImageAndText2Props) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[25px] pb-[0.8px] right-[25px] top-[24px]">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[28px] text-center text-white whitespace-nowrap">
        <p className="leading-[44.8px]">{text}</p>
      </div>
    </div>
  );
}
type ContainerBackgroundImageAndText1Props = {
  text: string;
};

function ContainerBackgroundImageAndText1({ text }: ContainerBackgroundImageAndText1Props) {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <BackgroundImage1 additionalClassNames="text-center">{text}</BackgroundImage1>
    </div>
  );
}
type ContainerBackgroundImageAndTextProps = {
  text: string;
};

function ContainerBackgroundImageAndText({ text }: ContainerBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[36px] text-center text-shadow-[0px_0px_24px_rgba(191,255,0,0.28),0px_0px_12px_rgba(191,255,0,0.55)] whitespace-nowrap">
        <p className="leading-[57.6px]">{text}</p>
      </div>
    </div>
  );
}

export default function Component01Welcome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    active_learners: 0,
    languages: 0,
    courses: 0,
    instructors: 0,
    success_rate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch platform stats on mount
    const fetchStats = async () => {
      try {
        const data = await usersApi.getPlatformStats();
        setStats({
          active_learners: data.active_learners || 0,
          languages: data.languages || 0,
          courses: data.courses || 0,
          instructors: data.instructors || 0,
          success_rate: data.success_rate || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Use fallback values on error
        setStats({
          active_learners: 0,
          languages: 0,
          courses: 0,
          instructors: 0,
          success_rate: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Helper to format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    return num.toString() + '+';
  };

  return (
    <div className="bg-[#0a0a0a] relative size-full" data-name="01-welcome">
      <div className="absolute bg-[#151515] bottom-[520.86px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px]" data-name="Background+Border">
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
          <p className="leading-[16px]">1.1 · Welcome Page</p>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.01)] content-stretch flex flex-wrap gap-[0px_40px] items-start justify-center left-0 px-[32px] py-[33px] right-0 top-[900px]" data-name="Overlay+Border">
        <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid border-t inset-0 pointer-events-none" />
        <ContainerBackgroundImage1>
          <ContainerBackgroundImageAndText text={formatNumber(stats.active_learners) || "2M+"} />
          <ContainerBackgroundImageAndText1 text="Active Learners" />
        </ContainerBackgroundImage1>
        <ContainerBackgroundImage1>
          <ContainerBackgroundImageAndText text={formatNumber(stats.languages) || "40+"} />
          <ContainerBackgroundImageAndText1 text="Languages" />
        </ContainerBackgroundImage1>
        <ContainerBackgroundImage1>
          <ContainerBackgroundImageAndText text={formatNumber(stats.courses) || "500+"} />
          <ContainerBackgroundImageAndText1 text="Courses" />
        </ContainerBackgroundImage1>
        <ContainerBackgroundImage1>
          <ContainerBackgroundImageAndText text={stats.success_rate + "%" || "98%"} />
          <ContainerBackgroundImageAndText1 text="Success Rate" />
        </ContainerBackgroundImage1>
        <ContainerBackgroundImage1>
          <ContainerBackgroundImageAndText text={formatNumber(stats.instructors) || "150+"} />
          <ContainerBackgroundImageAndText1 text="Expert Instructors" />
        </ContainerBackgroundImage1>
      </div>
      <div id="features" className="absolute content-stretch flex gap-[16px] items-start justify-center left-0 px-[40px] py-[48px] right-0 top-[1044.78px]" data-name="Container">
        <div className="bg-[#151515] flex-[1_0_0] h-[177.08px] min-h-px min-w-px relative rounded-[14px]" data-name="Background+Border">
          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
          <ContainerBackgroundImageAndText2 text="🤖" />
          <ContainerBackgroundImageAndText3 text="AI Personalization" />
          <ContainerBackgroundImage text="Adaptive lessons that adjust to your pace and" text1="learning style in real time." />
        </div>
        <div className="bg-[#151515] flex-[1_0_0] h-[177.08px] min-h-px min-w-px relative rounded-[14px]" data-name="Background+Border">
          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
          <ContainerBackgroundImageAndText2 text="🎥" />
          <ContainerBackgroundImageAndText3 text="Live Sessions" />
          <ContainerBackgroundImage text="Join real-time classes with certified native-" text1="speaker instructors." />
        </div>
        <div className="bg-[#151515] flex-[1_0_0] h-[177.08px] min-h-px min-w-px relative rounded-[14px]" data-name="Background+Border">
          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
          <ContainerBackgroundImageAndText2 text="🏆" />
          <ContainerBackgroundImageAndText3 text="Gamification" />
          <ContainerBackgroundImage text="Streaks, XP, badges, and leaderboards to keep" text1="you motivated daily." />
        </div>
        <div className="bg-[#151515] flex-[1_0_0] h-[177.08px] min-h-px min-w-px relative rounded-[14px]" data-name="Background+Border">
          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
          <ContainerBackgroundImageAndText2 text="🌍" />
          <ContainerBackgroundImageAndText3 text="Global Community" />
          <ContainerBackgroundImage text="Practice with millions of learners worldwide in" text1="discussion threads." />
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-between left-0 pb-[28px] pt-[29px] px-[40px] right-0 top-[1317.86px]" data-name="Footer">
        <div aria-hidden="true" className="absolute border-[#2a2a2a] border-solid border-t inset-0 pointer-events-none" />
        <LinkBackgroundImage>
          <div className="bg-[#bfff00] content-stretch flex items-center justify-center relative rounded-[10px] shrink-0 size-[30px]" data-name="Background">
            <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
              <p className="leading-[22.4px]">🧠</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
            <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[-0.28px] uppercase whitespace-nowrap">
              <p>
                <span className="leading-[22.4px]">FLUENT</span>
                <span className="leading-[22.4px] text-[#bfff00]">FUSION</span>
              </p>
            </div>
          </div>
        </LinkBackgroundImage>
        <div className="relative shrink-0" data-name="Container">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
            <BackgroundImage1>© 2026 FluentFusion AI · All rights reserved</BackgroundImage1>
          </div>
        </div>
        <div className="relative shrink-0" data-name="Container">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative">
            <LinkBackgroundImageAndText text="Privacy" />
            <LinkBackgroundImageAndText text="Terms" />
            <LinkBackgroundImageAndText text="Contact" />
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-0 min-h-[834px] overflow-clip pb-[88.51px] pt-[88.52px] px-[40px] right-0 top-[66px]" data-name="Section">
        <div className="absolute inset-0" data-name="Gradient" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1440 834\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(115.2 0 0 50.04 720 250.2)\\'><stop stop-color=\\'rgba(191,255,0,0.07)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />
        <div className="absolute inset-0" data-name="Grid" style={{ backgroundImage: "linear-gradient(rgba(42, 42, 42, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(42, 42, 42, 0.3) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)" }} />
        <div className="h-[656.97px] max-w-[760px] relative shrink-0 w-[760px]" data-name="Container">
          <div className="absolute h-[17.59px] left-0 right-0 top-0" data-name="Container">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#bfff00] h-px left-[calc(50%-149.2px)] opacity-50 top-[calc(50%-0.01px)] w-[32px]" data-name="Horizontal Divider" />
            <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal h-[18px] justify-center leading-[0] left-[calc(50%+0.2px)] text-[#bfff00] text-[11px] text-center top-[calc(50%-0.8px)] tracking-[2.2px] uppercase w-[246.802px]">
              <p className="leading-[17.6px] whitespace-pre-wrap">AI-Powered Language Learning</p>
            </div>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#bfff00] h-px left-[calc(50%+149.2px)] opacity-50 top-[calc(50%-0.01px)] w-[32px]" data-name="Horizontal Divider" />
          </div>
          <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[37.59px]" data-name="Heading 1">
            <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[76px] relative shrink-0 text-[76px] text-center text-white tracking-[-2.28px] uppercase whitespace-nowrap">
              <p className="mb-0">BREAKING</p>
              <p className="mb-0">LANGUAGE</p>
              <p className="text-[#bfff00]">BARRIERS</p>
            </div>
          </div>
          <div className="absolute content-stretch flex flex-col items-center left-[120px] max-w-[520px] pt-[3.295px] right-[120px] top-[285.59px]" data-name="Container">
            <BackgroundImage text="Master any language with AI-personalized lessons, live" text1="sessions, and a global community of learners." additionalClassNames="leading-[30.6px] text-[18px]" />
          </div>
          <div className="absolute content-start flex flex-wrap gap-[0px_14.01px] items-start justify-center left-0 pt-[20px] right-0 top-[370.78px]" data-name="Container">
            <button onClick={() => navigate('/signup')} className="bg-[#bfff00] content-stretch flex items-center justify-center px-[36px] py-[16px] relative rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 cursor-pointer hover:bg-[#a8e600] transition-colors" data-name="Button">
              <BackgroundImageAndText text="Get Started Free →" additionalClassNames="text-[#0a0a0a] text-[16px] tracking-[0.16px]" />
            </button>
            <button onClick={() => navigate('/login')} className="content-stretch flex items-center justify-center px-[37px] py-[16px] relative rounded-[10px] shrink-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors" data-name="Button">
              <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[10px]" />
              <BackgroundImageAndText text="Sign In" additionalClassNames="text-[16px] text-white tracking-[0.16px]" />
            </button>
          </div>
          <div className="absolute content-stretch flex flex-col items-center left-0 pt-[44px] right-0 top-[463.78px]" data-name="Container">
            <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center tracking-[1.5px] uppercase whitespace-nowrap">
              <p className="leading-[16px]">Select language to learn</p>
            </div>
          </div>
          <div className="absolute h-[97.19px] left-0 right-0 top-[539.78px]" data-name="Container">
            <div className="-translate-x-1/2 absolute bg-[rgba(191,255,0,0.1)] border border-[#bfff00] border-solid bottom-[53.6px] left-[calc(50%-243.35px)] rounded-[99px] top-0 w-[144.02px]" data-name="Overlay+Border">
              <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-center left-[18px] top-[calc(50%+0.2px)]" data-name="Container">
                <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bfff00] text-[16px] text-center whitespace-nowrap">
                  <p className="leading-[25.6px]">🇷🇼</p>
                </div>
              </div>
              <BackgroundImageAndText1 text="Kinyarwanda" additionalClassNames="left-[calc(50%+14.15px)] text-[#bfff00] w-[78.37px]" />
            </div>
            <div className="-translate-x-1/2 absolute bg-[#151515] border border-[#2a2a2a] border-solid bottom-[53.6px] left-[calc(50%-106.79px)] rounded-[99px] top-0 w-[109.09px]" data-name="Background+Border">
              <ContainerBackgroundImageAndText4 text="🇬🇧" />
              <BackgroundImageAndText1 text="English" additionalClassNames="left-[calc(50%+14.16px)] text-white w-[43.462px]" />
            </div>
            <div className="-translate-x-1/2 absolute bg-[#151515] border border-[#2a2a2a] border-solid bottom-[53.6px] left-[calc(50%+11.85px)] rounded-[99px] top-0 w-[108.19px]" data-name="Background+Border">
              <ContainerBackgroundImageAndText4 text="🇫🇷" />
              <BackgroundImageAndText1 text="French" additionalClassNames="left-[calc(50%+14.15px)] text-white w-[42.549px]" />
            </div>
            <div className="-translate-x-1/2 absolute bg-[#151515] border border-[#2a2a2a] border-solid bottom-[53.6px] left-[calc(50%+133.11px)] rounded-[99px] top-0 w-[114.33px]" data-name="Background+Border">
              <ContainerBackgroundImageAndText4 text="🇪🇸" />
              <BackgroundImageAndText1 text="Spanish" additionalClassNames="left-[calc(50%+14.16px)] text-white w-[48.708px]" />
            </div>
            <div className="-translate-x-1/2 absolute bg-[#151515] border border-[#2a2a2a] border-solid bottom-[53.6px] left-[calc(50%+257.81px)] rounded-[99px] top-0 w-[115.08px]" data-name="Background+Border">
              <ContainerBackgroundImageAndText4 text="🇩🇪" />
              <BackgroundImageAndText1 text="German" additionalClassNames="left-[calc(50%+14.15px)] text-white w-[49.46px]" />
            </div>
            <div className="-translate-x-1/2 absolute bg-[#151515] border border-[#2a2a2a] border-solid bottom-[0.01px] left-1/2 rounded-[99px] top-[53.59px] w-[124.73px]" data-name="Background+Border">
              <ContainerBackgroundImageAndText4 text="🇯🇵" />
              <BackgroundImageAndText1 text="Japanese" additionalClassNames="left-[calc(50%+14.17px)] text-white w-[59.151px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[1404.8599853515625px] inset-0 pointer-events-none">
        <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] content-stretch flex h-[66px] items-center justify-between pb-px pointer-events-auto px-[40px] sticky top-0" data-name="Nav">
          <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
          <LinkBackgroundImage>
            <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="Background">
              <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-center whitespace-nowrap">
                <p className="leading-[28.8px]">🧠</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
              <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[18px] text-white tracking-[-0.36px] uppercase whitespace-nowrap">
                <p>
                  <span className="leading-[28.8px]">FLUENT</span>
                  <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
                </p>
              </div>
            </div>
          </LinkBackgroundImage>
          <div className="relative shrink-0" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
              <button onClick={() => navigate('/features#features')} className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap cursor-pointer hover:text-white transition-colors">Features</button>
              <button onClick={() => navigate('/pricing')} className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap cursor-pointer hover:text-white transition-colors">Pricing</button>
              <button onClick={() => navigate('/community')} className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap cursor-pointer hover:text-white transition-colors">Community</button>
            </div>
          </div>
          <div className="relative shrink-0" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
              <button onClick={() => navigate('/login')} className="content-stretch flex items-center justify-center px-[24px] py-[11px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors" data-name="Button">
                <BackgroundImageAndText text="Login" additionalClassNames="text-[#888] text-[14px] tracking-[0.14px]" />
              </button>
              <button onClick={() => navigate('/signup')} className="bg-[#bfff00] content-stretch flex items-center justify-center px-[24px] py-[11px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 cursor-pointer hover:bg-[#a8e600] transition-colors" data-name="Button">
                <BackgroundImageAndText text="Get Started" additionalClassNames="text-[#0a0a0a] text-[14px] tracking-[0.14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}