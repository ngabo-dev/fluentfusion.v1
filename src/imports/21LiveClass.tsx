import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
type BackgroundImage4Props = {
  additionalClassNames?: string;
};

function BackgroundImage4({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage4Props>) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className={clsx("flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[11px] whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[17.6px]">{children}</p>
    </div>
  );
}
type DivChatMsgBubbleBackgroundImageProps = {
  additionalClassNames?: string;
};

function DivChatMsgBubbleBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<DivChatMsgBubbleBackgroundImageProps>) {
  return (
    <div className={clsx("bg-[#1a1a1a] content-stretch flex flex-col items-start max-w-[197.60000610351562px] pl-[15px] py-[11px] relative rounded-[10px] shrink-0", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[19.5px] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        {children}
      </div>
    </div>
  );
}

function DivBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">{children}</div>
    </div>
  );
}
type BackgroundImage3Props = {
  additionalClassNames?: string;
};

function BackgroundImage3({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage3Props>) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className={clsx("flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[20.8px]">{children}</p>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap">
      <p className="leading-[19.2px]">{children}</p>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[24px] shrink-0 size-[48px]">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[9.91px] pt-[9.09px] px-px relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImageProps = {
  text: string;
  text1: string;
};

function BackgroundImage({ text, text1 }: BackgroundImageProps) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 9" }} className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[19.5px] relative shrink-0 text-[13px] text-white whitespace-nowrap">
      <p className="mb-0">{text}</p>
      <p>{text1}</p>
    </div>
  );
}
type DivCtrlBtnBackgroundImageAndTextProps = {
  text: string;
};

function DivCtrlBtnBackgroundImageAndText({ text }: DivCtrlBtnBackgroundImageAndTextProps) {
  return (
    <BackgroundImage1>
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[28.8px]">{text}</p>
      </div>
    </BackgroundImage1>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div style={{ fontVariationSettings: "'opsz' 14" }} className={clsx("flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[11px] whitespace-nowrap", additionalClassNames)}>
      <p className="leading-[17.6px]">{text}</p>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }: { to: string; icon: string; label: string; active?: boolean }) {
  return (
    <Link to={to} className={`relative shrink-0 w-full block ${active ? 'bg-[rgba(191,255,0,0.1)]' : ''}`}>
      <div aria-hidden="true" className={`absolute border-l-2 border-solid inset-0 pointer-events-none ${active ? 'border-[#bfff00]' : 'border-[rgba(0,0,0,0)]'}`} />
      <div className="flex flex-row items-center gap-[12px] py-[12px] px-[16px] relative">
        <span className="text-[20px]">{icon}</span>
        <span className={`text-[14px] font-medium ${active ? 'text-[#bfff00]' : 'text-white'}`}>{label}</span>
      </div>
    </Link>
  );
}

export default function Component21LiveClass() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
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
    <div className="bg-[#0a0a0a] content-stretch flex flex-row items-start relative size-full" data-name="21-live-class">
      {/* Sidebar */}
      <div className="bg-[#0f0f0f] h-[900px] relative shrink-0 w-[240px]" data-name="Sidebar">
        <div className="flex flex-col h-full items-start relative shrink-0 w-full">
          {/* Logo */}
          <Link to="/dashboard" className="flex flex-row items-center gap-[10px] px-[16px] py-[20px] w-full">
            <div className="bg-[#bfff00] h-[32px] relative rounded-[8px] shrink-0 w-[32px]">
              <div className="flex items-center justify-center size-full">
                <span className="text-[18px]">🌍</span>
              </div>
            </div>
            <span className="text-[#bfff00] text-[18px] font-bold">FluentFusion</span>
          </Link>
          
          <div className="flex flex-col w-full">
            <SidebarLink to="/dashboard" icon="🏠" label="Dashboard" />
            <SidebarLink to="/courses" icon="📚" label="Courses" />
            <SidebarLink to="/progress" icon="📊" label="Progress" />
            <SidebarLink to="/vocabulary" icon="📝" label="Vocabulary" />
            <SidebarLink to="/live-sessions" icon="🎥" label="Live Sessions" active />
            <SidebarLink to="/community" icon="💬" label="Community" />
            <SidebarLink to="/achievements" icon="🏆" label="Achievements" />
            <SidebarLink to="/leaderboard" icon="🥇" label="Leaderboard" />
            <SidebarLink to="/pricing" icon="💰" label="Pricing" />
          </div>
          
          {/* User Profile */}
          <div className="absolute bottom-0 left-0 px-[16px] py-[16px] w-full">
            <div className="flex flex-row items-center gap-[12px] w-full">
              <div className="bg-gradient-to-br from-[#bfff00] to-[#8fef00] h-[40px] relative rounded-full shrink-0 w-[40px]">
                <div className="flex items-center justify-center size-full">
                  <span className="text-black text-[14px] font-bold">{getUserInitials()}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[14px] font-medium">{user?.first_name} {user?.last_name}</span>
                <span className="text-[#888] text-[12px]">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px]" data-name="div.screen-id">
          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
          <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
            <p className="leading-[16px]">6.2 · Live Class Screen</p>
          </div>
        </div>
        <div className="bg-black content-stretch flex h-[900px] items-start justify-center relative shrink-0 w-full" data-name="div.live-layout">
          <div className="content-stretch flex flex-col gap-[12px] h-full items-start overflow-clip p-[16px] relative shrink-0 w-[1120px]" data-name="Video Area">
            <div className="bg-[#0d1a0d] content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px overflow-clip pb-[326.81px] pt-[325.8px] relative rounded-[12px] w-full" data-name="Main Video">
              <div className="content-stretch flex flex-col items-start opacity-30 relative shrink-0" data-name="div">
                <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[64px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
                  <p className="leading-[102.4px]">🎥</p>
                </div>
              </div>
              <div className="absolute content-stretch flex gap-[8px] items-start left-[16px] top-[16px]" data-name="div">
                <div className="bg-[rgba(255,68,68,0.85)] content-stretch flex items-center pb-[5.19px] pt-[4px] px-[12px] relative rounded-[6px] self-stretch shrink-0" data-name="div">
                  <div className="flex flex-col font-['DM_Sans:SemiBold','Noto_Sans_Symbols2:Regular',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                    <p className="leading-[19.2px]">● LIVE</p>
                  </div>
                </div>
                <div className="bg-[rgba(0,0,0,0.7)] content-stretch flex flex-col items-start pb-[5.19px] pt-[4px] px-[12px] relative rounded-[6px] self-stretch shrink-0" data-name="div">
                  <BackgroundImage2>Business English Masterclass</BackgroundImage2>
                </div>
              </div>
              <div className="absolute bg-[rgba(0,0,0,0.75)] content-stretch flex flex-col items-start left-[16px] px-[15px] py-[9px] rounded-[8px] top-[60px]" data-name="div.raised-hands">
                <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <BackgroundImage3 additionalClassNames="text-white">✋ 3 hands raised</BackgroundImage3>
              </div>
              <div className="absolute bg-[rgba(0,0,0,0.7)] bottom-[12px] h-[29.19px] left-[12px] rounded-[6px] w-[134px]" data-name="div.instructor-label">
                <div className="-translate-y-1/2 absolute bg-[#00ff7f] left-[12px] rounded-[3px] shadow-[0px_0px_6px_0px_#00ff7f] size-[6px] top-[calc(50%+0.01px)]" data-name="div.speaking-dot" />
                <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] left-[26px] text-[12px] text-white top-[calc(50%-0.6px)] w-[96.348px]" style={{ fontVariationSettings: "'opsz' 9" }}>
                  <p className="leading-[19.2px] whitespace-pre-wrap">Dr. Mary K. (Host)</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[10px] h-[100px] items-start justify-center relative shrink-0 w-full" data-name="Participants">
              <div className="bg-[#1a1a2a] h-full relative rounded-[10px] shrink-0 w-[267px]" data-name="div.participant-thumb">
                <div className="content-stretch flex items-center justify-center overflow-clip p-[2px] relative rounded-[inherit] size-full">
                  <div className="relative rounded-[22px] shrink-0 size-[44px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap">
                        <p className="leading-[27.2px]">{getUserInitials()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-[rgba(0,0,0,0.6)] bottom-[7.59px] left-[10px] rounded-[4px]" data-name="div.participant-label">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative">
                      <BackgroundImageAndText text="You" additionalClassNames="text-[#bfff00]" />
                    </div>
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border-2 border-[#bfff00] border-solid inset-0 pointer-events-none rounded-[10px]" />
              </div>
              <div className="bg-[#1a1a2a] content-stretch flex h-full items-center justify-center overflow-clip relative rounded-[10px] shrink-0 w-[263px]" data-name="div.participant-thumb">
                <div className="relative rounded-[22px] shrink-0 size-[44px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[17px] text-black text-center top-[calc(50%-0.09px)] w-[46.932px]">
                    <p className="leading-[27.2px] whitespace-pre-wrap">AM</p>
                  </div>
                </div>
                <div className="absolute bg-[rgba(0,0,0,0.6)] bottom-[5.59px] content-stretch flex flex-col items-start left-[8px] px-[8px] py-[2px] rounded-[4px]" data-name="div.participant-label">
                  <BackgroundImageAndText text="Amina M." additionalClassNames="text-white" />
                </div>
              </div>
              <div className="bg-[#1a1a2a] content-stretch flex h-full items-center justify-center overflow-clip relative rounded-[10px] shrink-0 w-[263px]" data-name="div.participant-thumb">
                <div className="content-stretch flex items-center justify-center relative rounded-[22px] shrink-0 size-[44px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                  <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap">
                    <p className="leading-[27.2px]">KR</p>
                  </div>
                </div>
                <div className="absolute bg-[rgba(0,0,0,0.6)] bottom-[5.59px] content-stretch flex flex-col items-start left-[8px] px-[8px] py-[2px] rounded-[4px]" data-name="div.participant-label">
                  <BackgroundImageAndText text="Kagiso" additionalClassNames="text-white" />
                </div>
              </div>
              <div className="bg-[#1a1a1a] h-full relative rounded-[10px] shrink-0 w-[265px]" data-name="div.participant-thumb">
                <div className="content-stretch flex items-center justify-center overflow-clip pb-[39.61px] pt-[38.59px] px-px relative rounded-[inherit] size-full">
                  <div className="relative shrink-0" data-name="div">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative">
                      <BackgroundImage3 additionalClassNames="text-[#888]">+44 more</BackgroundImage3>
                    </div>
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[10px]" />
              </div>
            </div>
            <div className="absolute bg-[rgba(10,10,10,0.95)] bottom-0 content-stretch flex gap-[16px] items-center justify-center left-0 pb-[14px] pt-[15px] px-[24px] right-[-320px]" data-name="Controls">
              <div aria-hidden="true" className="absolute border-[#2a2a2a] border-solid border-t inset-0 pointer-events-none" />
              <div className="bg-[#bfff00] relative rounded-[24px] shrink-0 size-[48px]" data-name="div.ctrl-btn">
                <div aria-hidden="true" className="absolute border border-[#bfff00] border-solid inset-0 pointer-events-none rounded-[24px]" />
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[9.91px] pt-[9.09px] px-px relative size-full">
                  <div className="flex flex-col font-['Noto_Sans_Symbols:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] text-black text-center whitespace-nowrap">
                    <p className="leading-[28.8px]">🎙</p>
                  </div>
                </div>
              </div>
              <DivCtrlBtnBackgroundImageAndText text="📷" />
              <BackgroundImage1>
                <div className="flex flex-col font-['Noto_Sans_Symbols:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">
                  <p className="leading-[28.8px]">🖥</p>
                </div>
              </BackgroundImage1>
              <DivCtrlBtnBackgroundImageAndText text="✋" />
              <DivCtrlBtnBackgroundImageAndText text="😊" />
              <div className="h-[32px] relative shrink-0 w-[17px]" data-name="div:margin">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] relative size-full">
                  <div className="bg-[#2a2a2a] h-[32px] shrink-0 w-px" data-name="div" />
                </div>
              </div>
              <div className="bg-[#f44] relative rounded-[24px] shrink-0 size-[48px]" data-name="div.ctrl-btn">
                <div aria-hidden="true" className="absolute border border-[#f44] border-solid inset-0 pointer-events-none rounded-[24px]" />
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[9.91px] pt-[9.09px] px-px relative size-full">
                  <div className="flex flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                    <p className="leading-[28.8px]">✕</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#0f0f0f] h-[900px] relative shrink-0 w-[320px]" data-name="Chat Panel">
            <div className="content-stretch flex flex-col items-start overflow-clip pl-px relative rounded-[inherit] size-full">
              <div className="bg-[#0a0a0a] relative shrink-0 w-full" data-name="div.chat-header">
                <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
                <div className="flex flex-row items-center size-full">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[20px] relative w-full">
                    <DivBackgroundImage>
                      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                        <p className="leading-[22.4px]">Session Chat</p>
                      </div>
                    </DivBackgroundImage>
                    <DivBackgroundImage>
                      <BackgroundImage2>47 participants</BackgroundImage2>
                    </DivBackgroundImage>
                  </div>
                </div>
              </div>
              <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="div.chat-messages">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-auto relative size-full">
                  <div className="absolute h-[102.09px] left-[16px] right-[16px] top-[16px]" data-name="div.chat-msg-row">
                    <div className="absolute left-0 rounded-[16px] size-[32px] top-0" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.41px)] w-[36.65px]">
                        <p className="leading-[20.8px] whitespace-pre-wrap">MK</p>
                      </div>
                    </div>
                    <div className="absolute content-stretch flex flex-col gap-[4.59px] items-start left-[40px] pr-[49.41px] top-[-1px]" data-name="div">
                      <BackgroundImage4 additionalClassNames="text-[#888]">Dr. Mary K.</BackgroundImage4>
                      <DivChatMsgBubbleBackgroundImage additionalClassNames="pr-[19.28px]">
                        <p className="mb-0">{`Welcome everyone! Let's`}</p>
                        <p className="mb-0">start with a quick warm-up</p>
                        <p>exercise 🎉</p>
                      </DivChatMsgBubbleBackgroundImage>
                    </div>
                  </div>
                  <div className="absolute h-[82.59px] left-[16px] right-[16px] top-[130.09px]" data-name="div.chat-msg-row">
                    <div className="absolute left-0 rounded-[16px] size-[32px] top-0" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 128, 255) 0%, rgb(0, 207, 255) 100%)" }}>
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.4px)] w-[35.938px]">
                        <p className="leading-[20.8px] whitespace-pre-wrap">AM</p>
                      </div>
                    </div>
                    <div className="absolute content-stretch flex flex-col gap-[4.6px] items-start left-[40px] pr-[28.63px] top-[-1px]" data-name="div">
                      <BackgroundImage4 additionalClassNames="text-[#888]">Amina M.</BackgroundImage4>
                      <div className="bg-[#1a1a1a] content-stretch flex flex-col items-start max-w-[114.48799896240234px] pl-[15px] pr-[19.89px] py-[11px] relative rounded-[10px] shrink-0" data-name="div.chat-msg-bubble">
                        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[10px]" />
                        <BackgroundImage text="Excited to be" text1="here!" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute content-stretch flex items-start justify-end left-[16px] right-[16px] top-[223.69px]" data-name="div.chat-msg-row">
                    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="div">
                      <div className="content-stretch flex flex-col items-end pb-[0.59px] pl-[185.91px] relative shrink-0" data-name="div">
                        <BackgroundImage4 additionalClassNames="text-[#bfff00] text-right">You</BackgroundImage4>
                      </div>
                      <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex flex-col items-start max-w-[163.3280029296875px] pl-[15px] pr-[28.35px] py-[11px] relative rounded-[10px] shrink-0" data-name="div.chat-msg-bubble">
                        <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
                        <BackgroundImage text="Hello everyone from" text1="Kigali 👋" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute h-[121.59px] left-[16px] right-[16px] top-[319.28px]" data-name="div.chat-msg-row">
                    <div className="absolute left-0 rounded-[16px] size-[32px] top-0" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.4px)] w-[36.65px]">
                        <p className="leading-[20.8px] whitespace-pre-wrap">MK</p>
                      </div>
                    </div>
                    <div className="absolute content-stretch flex flex-col gap-[4.6px] items-start left-[40px] pr-[49.41px] top-[-1px]" data-name="div">
                      <BackgroundImage4 additionalClassNames="text-[#888]">Dr. Mary K.</BackgroundImage4>
                      <DivChatMsgBubbleBackgroundImage additionalClassNames="pr-[20.87px]">
                        <p className="mb-0">{`Today we'll practice formal`}</p>
                        <p className="mb-0">email writing for business</p>
                        <p className="mb-0">contexts. Please open your</p>
                        <p>notebooks!</p>
                      </DivChatMsgBubbleBackgroundImage>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full" data-name="div.chat-footer">
                <div aria-hidden="true" className="absolute border-[#2a2a2a] border-solid border-t inset-0 pointer-events-none" />
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-start pb-[14px] pt-[15px] px-[16px] relative w-full">
                  <div className="bg-[#1f1f1f] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] self-stretch" data-name="input.chat-input">
                    <div className="overflow-clip rounded-[inherit] size-full">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[15px] py-[11px] relative size-full">
                        <div className="relative shrink-0 w-full" data-name="div#placeholder">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
                            <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#757575] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
                              <p className="leading-[normal] whitespace-pre-wrap">Send a message...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </div>
                  <div className="aspect-[39/39] bg-[#bfff00] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0" data-name="button.btn">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[12.92px] pr-[12.94px] py-[11px] relative w-full">
                      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                        <p className="leading-[normal]">→</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border-[#2a2a2a] border-l border-solid inset-0 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
