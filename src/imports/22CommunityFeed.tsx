import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
type BackgroundImage5Props = {
  additionalClassNames?: string;
};

function BackgroundImage5({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage5Props>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      {children}
    </div>
  );
}
type DivCardBackgroundImageProps = {
  additionalClassNames?: string;
};

function DivCardBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<DivCardBackgroundImageProps>) {
  return (
    <div className={clsx("bg-[#151515] relative rounded-[14px] shrink-0 w-full", additionalClassNames)}>
      <div className="overflow-clip relative rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}
type ComponentBackgroundImage1Props = {
  text: string;
};

function ComponentBackgroundImage1({ children, text }: React.PropsWithChildren<ComponentBackgroundImage1Props>) {
  return (
    <div className="mb-[-1.01px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
        <div style={{ fontVariationSettings: "'opsz' 14" }} className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap">
          <p className="leading-[20.8px]">{text}</p>
        </div>
      </div>
    </div>
  );
}
type BackgroundImage4Props = {
  additionalClassNames?: string;
};

function BackgroundImage4({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage4Props>) {
  return (
    <div className={clsx("content-stretch flex flex-col items-start relative w-full", additionalClassNames)}>
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[23.8px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.85)] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        {children}
      </div>
    </div>
  );
}
type DivActionItemMarginBackgroundImageProps = {
  text: string;
  additionalClassNames?: string;
};

function DivActionItemMarginBackgroundImage({ children, text, additionalClassNames = "" }: React.PropsWithChildren<DivActionItemMarginBackgroundImageProps>) {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-[47.970001220703125px] relative self-stretch">
      <div className="flex flex-col items-end justify-center min-w-[inherit] size-full">
        <div className={clsx("bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end justify-center min-w-[inherit] relative size-full", additionalClassNames)}>
          <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Component 1">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex h-full items-center pb-[1.8px] relative">
                <BackgroundImage1 additionalClassNames="text-[#888]">{text}</BackgroundImage1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type BackgroundImage3Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImage3({ children, text, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage3Props>) {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }} className={clsx("flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[14px] text-left whitespace-nowrap", additionalClassNames)}>
          <p className="leading-[22.4px]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start relative w-full">{children}</div>
    </div>
  );
}
type BackgroundImage1Props = {
  additionalClassNames?: string;
};

function BackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage1Props>) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className={clsx("flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[20.8px]">{children}</p>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center size-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">{children}</div>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }: { to: string; icon: string; label: string; active?: boolean }) {
  return (
    <Link to={to} className={`relative shrink-0 w-full block ${active ? 'bg-[rgba(191,255,0,0.1)]' : ''}`}>
      <div aria-hidden="true" className={`absolute border-l-2 border-solid inset-0 pointer-events-none ${active ? 'border-[#bfff00]' : 'border-[rgba(0,0,0,0)]'}`} />
      <BackgroundImage>
        <BackgroundImage3 text={icon} additionalClassNames={active ? "text-[#bfff00]" : "text-[#888]"} />
        <BackgroundImageAndText text={label} additionalClassNames={active ? "text-[#bfff00]" : "text-[#888]"} />
      </BackgroundImage>
    </Link>
  );
}

function ASidebarItemBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage5 additionalClassNames="w-full">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <BackgroundImage>{children}</BackgroundImage>
    </BackgroundImage5>
  );
}
type DivBackgroundImageAndText1Props = {
  text: string;
};

function DivBackgroundImageAndText1({ text }: DivBackgroundImageAndText1Props) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[20px]">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[12px] whitespace-nowrap">
        <p className="leading-[19.2px]">{text}</p>
      </div>
    </div>
  );
}
type ComponentBackgroundImageAndText1Props = {
  text: string;
};

function ComponentBackgroundImageAndText1({ text }: ComponentBackgroundImageAndText1Props) {
  return (
    <div className="mb-[-1.01px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start pb-[0.59px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[17.6px]">{text}</p>
        </div>
      </div>
    </div>
  );
}
type DivBackgroundImageAndTextProps = {
  text: string;
};

function DivBackgroundImageAndText({ text }: DivBackgroundImageAndTextProps) {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] pb-[0.8px] right-[25px] top-[24px]">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-white tracking-[0.65px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">{text}</p>
      </div>
    </div>
  );
}
type DivAvatarBackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function DivAvatarBackgroundImageAndText1({ text, additionalClassNames = "" }: DivAvatarBackgroundImageAndText1Props) {
  return (
    <div style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 128, 255) 0%, rgb(0, 207, 255) 100%)" }} className={clsx("content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]", additionalClassNames)}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">{text}</p>
      </div>
    </div>
  );
}

function ComponentBackgroundImage() {
  return (
    <div className="relative self-stretch shrink-0">
      <div className="flex flex-row items-center size-full">
        <BackgroundImageAndText4 text="↗ Share" />
      </div>
    </div>
  );
}
type BackgroundImageAndText5Props = {
  text: string;
};

function BackgroundImageAndText5({ text }: BackgroundImageAndText5Props) {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
      <BackgroundImage1 additionalClassNames="text-[#888]">{text}</BackgroundImage1>
    </div>
  );
}
type BackgroundImageAndText4Props = {
  text: string;
};

function BackgroundImageAndText4({ text }: BackgroundImageAndText4Props) {
  return (
    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center pb-[1.8px] relative">
      <BackgroundImage1 additionalClassNames="text-[#888]">{text}</BackgroundImage1>
    </div>
  );
}
type SpanPostTagBackgroundImageAndTextProps = {
  text: string;
};

function SpanPostTagBackgroundImageAndText({ text }: SpanPostTagBackgroundImageAndTextProps) {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-start pb-[2.19px] pt-px px-[8px] relative rounded-[4px] shrink-0">
      <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[19.2px]">{text}</p>
      </div>
    </div>
  );
}
type ComponentBackgroundImageAndTextProps = {
  text: string;
};

function ComponentBackgroundImageAndText({ text }: ComponentBackgroundImageAndTextProps) {
  return (
    <BackgroundImage2>
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">{text}</p>
      </div>
    </BackgroundImage2>
  );
}
type BackgroundImageAndText3Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText3({ text, additionalClassNames = "" }: BackgroundImageAndText3Props) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className={clsx("flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[11px] tracking-[0.55px] uppercase whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[17.6px]">{text}</p>
    </div>
  );
}
type BackgroundImageAndText2Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText2({ text, additionalClassNames = "" }: BackgroundImageAndText2Props) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className={clsx("flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-center tracking-[0.13px] whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[normal]">{text}</p>
    </div>
  );
}
type ButtonBtnBackgroundImageAndTextProps = {
  text: string;
};

function ButtonBtnBackgroundImageAndText({ text }: ButtonBtnBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[7px] relative rounded-[8px] shrink-0">
      <BackgroundImageAndText2 text={text} additionalClassNames="text-[#888]" />
    </div>
  );
}
type BackgroundImageAndText1Props = {
  text: string;
};

function BackgroundImageAndText1({ text }: BackgroundImageAndText1Props) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap">
      <p className="leading-[22.4px]">{text}</p>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className={clsx("flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-left whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[22.4px]">{text}</p>
    </div>
  );
}
type DivAvatarBackgroundImageAndTextProps = {
  text: string;
};

function DivAvatarBackgroundImageAndText({ text }: DivAvatarBackgroundImageAndTextProps) {
  return (
    <div style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }} className="content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative rounded-[16px] shrink-0 size-[32px]">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">{text}</p>
      </div>
    </div>
  );
}

export default function Component22CommunityFeed() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      navigate('/login');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const getUserInitials = () => {
    if (!user) return '';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] flex items-center justify-center min-h-screen">
        <div className="text-[#bfff00] text-[18px]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="22-community-feed">
      <div className="absolute bg-[#151515] bottom-[115.48px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
          <p className="leading-[16px]">7.1 · Community Feed</p>
        </div>
      </div>
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
        <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
            <Link to="/dashboard" className="cursor-pointer">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
                <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="div.logo-mark">
                  <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
                    <p className="leading-[28.8px]">🧠</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div.logo-name">
                  <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-left text-white tracking-[-0.36px] uppercase whitespace-nowrap">
                    <p className="text-[18px]">
                      <span className="leading-[28.8px] text-white">FLUENT</span>
                      <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="relative shrink-0" data-name="div.flex">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
                <Link to="/notifications" className="content-stretch flex flex-col items-start relative shrink-0">
                  <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[20px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
                    <p className="leading-[32px]">🔔</p>
                  </div>
                </Link>
                <Link to="/profile" className="content-stretch flex items-center relative">
                  <DivAvatarBackgroundImageAndText text={getUserInitials()} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[834px] relative shrink-0 w-full z-[1]" data-name="div.app-wrap">
        <div className="flex flex-row justify-center min-h-[inherit] size-full">
          <div className="content-stretch flex items-start justify-center min-h-[inherit] pl-[240px] relative w-full">
            <div className="absolute bg-[#0f0f0f] h-[834px] left-0 top-0 w-[240px]" data-name="aside.sidebar">
              <div className="content-stretch cursor-pointer flex flex-col items-start overflow-auto pr-px py-[20px] relative size-full">
                <SidebarLink to="/dashboard" icon="⚡" label="Dashboard" />
                <SidebarLink to="/courses" icon="📚" label="My Courses" />
                <SidebarLink to="/practice/flashcards" icon="🎯" label="Practice" />
                <SidebarLink to="/live-sessions" icon="🎥" label="Live Sessions" />
                <SidebarLink to="/community" icon="🌍" label="Community" active />
                <SidebarLink to="/profile" icon="👤" label="Profile" />
              </div>
              <div aria-hidden="true" className="absolute border-[#2a2a2a] border-r border-solid inset-0 pointer-events-none" />
            </div>
            <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="main.main">
              <div className="overflow-x-clip overflow-y-auto size-full">
                <div className="content-stretch flex flex-col gap-[28px] items-start px-[40px] py-[36px] relative size-full">
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="div.page-hdr">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
                      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-white tracking-[-0.64px] uppercase w-full">
                        <p className="text-[32px] whitespace-pre-wrap">
                          <span className="leading-[51.2px] text-white">{`Community `}</span>
                          <span className="leading-[51.2px] text-[#bfff00]">Feed</span>
                        </p>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
                      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
                        <p className="leading-[22.4px] whitespace-pre-wrap">Ask questions, share insights, connect with learners worldwide</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[28px] items-start justify-center min-h-[755.9099731445312px] relative shrink-0 w-full" data-name="div.feed-layout">
                    <div className="relative self-stretch shrink-0 w-[792px]" data-name="div">
                      <div className="absolute bg-[#151515] content-stretch flex flex-col items-start left-0 p-[19px] right-0 rounded-[14px] top-0" data-name="Compose">
                        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
                        <div className="relative shrink-0 w-full" data-name="div.flex">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative w-full">
                            <DivAvatarBackgroundImageAndText text={getUserInitials()} />
                            <div className="relative shrink-0" data-name="Component 1">
                              <div className="content-stretch flex flex-col items-start relative">
                                <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                                  <p className="leading-[22.4px]">Share a question or insight...</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#1f1f1f] min-h-[80px] relative rounded-[8px] shrink-0 w-full" data-name="textarea.compose-input">
                          <div className="flex flex-row justify-center min-h-[inherit] overflow-auto size-full">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center min-h-[inherit] pb-[49px] pt-[13px] px-[17px] relative w-full">
                              <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Component 1">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
                                  <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#757575] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
                                    <p className="leading-[normal] whitespace-pre-wrap">{`What's on your mind? Ask a question, share a tip, or start a discussion...`}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
                        </div>
                        <div className="relative shrink-0 w-full" data-name="div.flex">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-[19px] relative w-full">
                            <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="div.flex">
                              <ButtonBtnBackgroundImageAndText text="📷 Photo" />
                              <ButtonBtnBackgroundImageAndText text="🏷️ Tag" />
                            </div>
                            <div className="bg-[#bfff00] content-stretch flex items-center justify-center px-[16px] py-[7px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0" data-name="button.btn">
                              <BackgroundImageAndText2 text="Post →" additionalClassNames="text-[#0a0a0a]" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute content-stretch flex gap-[8px] items-start left-0 right-0 top-[220px]" data-name="Filter">
                        <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center pb-[7.59px] pt-[6px] px-[15px] relative rounded-[99px] self-stretch shrink-0" data-name="div.badge">
                          <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[99px]" />
                          <BackgroundImageAndText3 text="Latest" additionalClassNames="text-[#bfff00]" />
                        </div>
                        <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[7.59px] pt-[6px] px-[15px] relative rounded-[99px] self-stretch shrink-0" data-name="div.badge">
                          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
                          <BackgroundImageAndText3 text="Popular" additionalClassNames="text-[#888]" />
                        </div>
                        <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[7.59px] pt-[6px] px-[15px] relative rounded-[99px] self-stretch shrink-0" data-name="div.badge">
                          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
                          <BackgroundImageAndText3 text="Questions" additionalClassNames="text-[#888]" />
                        </div>
                        <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[7.59px] pt-[6px] px-[15px] relative rounded-[99px] self-stretch shrink-0" data-name="div.badge">
                          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
                          <BackgroundImageAndText3 text="Tips" additionalClassNames="text-[#888]" />
                        </div>
                      </div>
                      <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[228.16px] left-0 right-0 rounded-[14px] top-[267.59px]" data-name="Posts">
                        <div className="absolute content-stretch flex gap-[12px] items-start left-[20px] right-[20px] top-[20px]" data-name="div.post-header">
                          <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.4px)] w-[35.938px]">
                              <p className="leading-[20.8px] whitespace-pre-wrap">AM</p>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col gap-px items-start relative shrink-0" data-name="div">
                            <BackgroundImage2>
                              <BackgroundImageAndText1 text="Amina M." />
                            </BackgroundImage2>
                            <ComponentBackgroundImageAndText text="2 hours ago · Learning English" />
                          </div>
                          <div className="flex-[1_0_0] min-h-px min-w-[102.58999633789062px] relative" data-name="span.badge:margin">
                            <div className="flex flex-col items-end min-w-[inherit] size-full">
                              <div className="content-stretch flex flex-col items-end min-w-[inherit] pl-[428.641px] relative w-full">
                                <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center px-[13px] py-[5px] relative rounded-[99px] shrink-0" data-name="span.badge">
                                  <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
                                  <BackgroundImageAndText3 text="❓ Question" additionalClassNames="text-[#888]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-[20px] right-[20px] top-[76.48px]" data-name="Component 1">
                          <BackgroundImage4 additionalClassNames="pb-[0.69px]">
                            <p className="mb-0">{`What's the difference between "Could you" and "Would you" when making polite requests in English? I always get`}</p>
                            <p>confused when speaking to hotel guests!</p>
                          </BackgroundImage4>
                        </div>
                        <div className="absolute content-stretch flex gap-[6px] items-start left-[20px] pb-[8px] pt-[3.1px] right-[20px] top-[138.07px]" data-name="div">
                          <SpanPostTagBackgroundImageAndText text="#English" />
                          <SpanPostTagBackgroundImageAndText text="#Grammar" />
                          <SpanPostTagBackgroundImageAndText text="#Hospitality" />
                        </div>
                        <div className="absolute content-stretch flex gap-[16px] items-start left-[20px] pt-[13px] right-[20px] top-[172.36px]" data-name="div.post-actions">
                          <div aria-hidden="true" className="absolute border-[#2a2a2a] border-solid border-t inset-0 pointer-events-none" />
                          <div className="relative self-stretch shrink-0" data-name="Component 1">
                            <div className="flex flex-row items-center size-full">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center pb-[1.8px] relative">
                                <BackgroundImage1 additionalClassNames="text-[#f44]">❤️ 24</BackgroundImage1>
                              </div>
                            </div>
                          </div>
                          <div className="relative self-stretch shrink-0" data-name="Component 1">
                            <div className="flex flex-row items-center size-full">
                              <BackgroundImageAndText4 text="💬 8 Comments" />
                            </div>
                          </div>
                          <ComponentBackgroundImage />
                          <DivActionItemMarginBackgroundImage text="🔖 Save" additionalClassNames="pl-[475.938px]" />
                        </div>
                      </div>
                      <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[228.16px] left-0 right-0 rounded-[14px] top-[511.75px]" data-name="div.post-card">
                        <div className="absolute content-stretch flex gap-[12px] items-start left-[20px] right-[20px] top-[20px]" data-name="div.post-header">
                          <DivAvatarBackgroundImageAndText1 text="KR" additionalClassNames="pb-[5.91px] pt-[5.09px]" />
                          <div className="content-stretch flex flex-col gap-px items-start relative shrink-0" data-name="div">
                            <BackgroundImage2>
                              <BackgroundImageAndText1 text="Kagiso R." />
                            </BackgroundImage2>
                            <ComponentBackgroundImageAndText text="5 hours ago · Learning Kinyarwanda" />
                          </div>
                          <div className="flex-[1_0_0] min-h-px min-w-[59.15999984741211px] relative" data-name="span.badge:margin">
                            <div className="flex flex-col items-end min-w-[inherit] size-full">
                              <div className="content-stretch flex flex-col items-end min-w-[inherit] pl-[440.25px] relative w-full">
                                <div className="bg-[rgba(0,255,127,0.1)] content-stretch flex items-center px-[12px] py-[4px] relative rounded-[99px] shrink-0" data-name="span.badge">
                                  <BackgroundImageAndText3 text="💡 Tip" additionalClassNames="text-[#00ff7f]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-[20px] right-[20px] top-[76.47px]" data-name="Component 1">
                          <BackgroundImage4 additionalClassNames="pb-[0.695px]">
                            <p className="mb-0">{`Pro tip: When learning Kinyarwanda greetings, remember that "Muraho" is used any time of day, while "Mwiriwe" is`}</p>
                            <p>specifically for afternoon/evening. This simple distinction helped me a lot!</p>
                          </BackgroundImage4>
                        </div>
                        <div className="absolute content-stretch flex gap-[6px] items-start left-[20px] pb-[8px] pt-[3.1px] right-[20px] top-[138.07px]" data-name="div">
                          <SpanPostTagBackgroundImageAndText text="#Kinyarwanda" />
                          <SpanPostTagBackgroundImageAndText text="#Greetings" />
                          <SpanPostTagBackgroundImageAndText text="#Tips" />
                        </div>
                        <div className="absolute content-stretch flex gap-[16px] items-start left-[20px] pt-[13px] right-[20px] top-[172.36px]" data-name="div.post-actions">
                          <div aria-hidden="true" className="absolute border-[#2a2a2a] border-solid border-t inset-0 pointer-events-none" />
                          <div className="relative self-stretch shrink-0" data-name="Component 1">
                            <div className="flex flex-row items-center size-full">
                              <BackgroundImageAndText4 text="❤️ 47" />
                            </div>
                          </div>
                          <div className="relative self-stretch shrink-0" data-name="Component 1">
                            <div className="flex flex-row items-center size-full">
                              <BackgroundImageAndText4 text="💬 12 Comments" />
                            </div>
                          </div>
                          <ComponentBackgroundImage />
                          <DivActionItemMarginBackgroundImage text="🔖 Save" additionalClassNames="pl-[472.625px]" />
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[16px] items-start relative self-stretch shrink-0 w-[300px]" data-name="Right panel">
                      <DivCardBackgroundImage additionalClassNames="h-[199.97px]">
                        <DivBackgroundImageAndText text="Top Contributors" />
                        <div className="absolute content-stretch flex items-center left-[25px] right-[25px] top-[58.8px]" data-name="div.flex">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-[20px]" data-name="div">
                            <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] whitespace-nowrap">
                              <p className="leading-[19.2px]">1</p>
                            </div>
                          </div>
                          <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.4px)] w-[36.65px]">
                              <p className="leading-[20.8px] whitespace-pre-wrap">MK</p>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col items-start pb-[1.01px] relative shrink-0" data-name="div">
                            <ComponentBackgroundImage1 text="Dr. Mary K." />
                            <ComponentBackgroundImageAndText1 text="342 helpful answers" />
                          </div>
                        </div>
                        <div className="absolute content-stretch flex items-center left-[25px] right-[25px] top-[97.19px]" data-name="div.flex">
                          <DivBackgroundImageAndText1 text="2" />
                          <DivAvatarBackgroundImageAndText1 text="KR" additionalClassNames="pb-[5.9px] pt-[5.1px]" />
                          <div className="content-stretch flex flex-col items-start pb-[1.01px] relative shrink-0" data-name="div">
                            <ComponentBackgroundImage1 text="Kagiso R." />
                            <ComponentBackgroundImageAndText1 text="218 helpful answers" />
                          </div>
                        </div>
                        <div className="absolute content-stretch flex items-center left-[25px] right-[25px] top-[135.58px]" data-name="div.flex">
                          <DivBackgroundImageAndText1 text="3" />
                          <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 184, 0) 0%, rgb(255, 204, 0) 100%)" }}>
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.4px)] w-[35.938px]">
                              <p className="leading-[20.8px] whitespace-pre-wrap">AM</p>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col items-start pb-[1.01px] relative shrink-0" data-name="div">
                            <ComponentBackgroundImage1 text="Amina M." />
                            <ComponentBackgroundImageAndText1 text="156 helpful answers" />
                          </div>
                        </div>
                      </DivCardBackgroundImage>
                      <DivCardBackgroundImage additionalClassNames="h-[191.98px]">
                        <DivBackgroundImageAndText text="Trending Topics" />
                        <div className="absolute left-[25px] right-[25px] top-[58.79px]" data-name="Component 1">
                          <div className="content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
                            <BackgroundImage1 additionalClassNames="text-[#bfff00]">#KinyarwandaTips</BackgroundImage1>
                          </div>
                        </div>
                        <div className="absolute left-[25px] right-[25px] top-[87.59px]" data-name="Component 1">
                          <BackgroundImageAndText5 text="#EnglishGrammar" />
                        </div>
                        <div className="absolute left-[25px] right-[25px] top-[116.39px]" data-name="Component 1">
                          <BackgroundImageAndText5 text="#FrenchPronunciation" />
                        </div>
                        <div className="absolute left-[25px] right-[25px] top-[145.18px]" data-name="Component 1">
                          <BackgroundImageAndText5 text="#TourismEnglish" />
                        </div>
                      </DivCardBackgroundImage>
                    </div>
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
