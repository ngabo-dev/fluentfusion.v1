import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

function DivScreenId() {
  return (
    <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
        <p className="leading-[16px]">13.2 · No Internet</p>
      </div>
    </div>
  );
}

function DivLogoMark() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="div.logo-mark">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[28.8px]">🧠</p>
      </div>
    </div>
  );
}

function DivLogoName() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div.logo-name">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-left text-white tracking-[-0.36px] uppercase whitespace-nowrap">
        <p className="text-[18px]">
          <span className="leading-[28.8px] text-white">FLUENT</span>
          <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
        </p>
      </div>
    </div>
  );
}

function ALogo() {
  return (
    <Link to="/dashboard" className="cursor-pointer relative shrink-0" data-name="a.logo">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </Link>
  );
}

function NavNav() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo />
        </div>
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="div.signal-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[72px] text-center whitespace-nowrap opacity-40" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[86.4px] grayscale">📡</p>
      </div>
    </div>
  );
}

function DivTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[28px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[44.8px]">No Internet Connection</p>
      </div>
    </div>
  );
}

function DivSubtitle() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[380px] relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[25.5px] relative shrink-0 text-[#888] text-[15px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">You're offline. Check your connection and try again.</p>
        <p>Your progress has been saved locally.</p>
      </div>
    </div>
  );
}

function ButtonPrimary() {
  return (
    <button className="bg-[#bfff00] content-stretch flex items-center justify-center px-[36px] py-[16px] relative rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] text-center tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">↻ Try Again</p>
      </div>
    </button>
  );
}

function ButtonOutline() {
  return (
    <button className="content-stretch flex items-center justify-center px-[36px] py-[16px] relative rounded-[10px] shrink-0 cursor-pointer" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">View Offline Content</p>
      </div>
    </button>
  );
}

function DivFlexButtons() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="div.flex">
      <ButtonPrimary />
      <ButtonOutline />
    </div>
  );
}

function DivOfflineIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[20px]" data-name="div">
      <p className="leading-[normal]">💾</p>
    </div>
  );
}

function DivOfflineTitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-white text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">3 lessons saved offline</p>
      </div>
    </div>
  );
}

function DivOfflineSub() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Available without internet</p>
      </div>
    </div>
  );
}

function DivOfflineContent() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <DivOfflineTitle />
      <DivOfflineSub />
    </div>
  );
}

function DivOfflineBox() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-solid content-stretch flex items-center px-[24px] py-[16px] relative rounded-[14px] shrink-0 gap-[12px]" data-name="div">
      <DivOfflineIcon />
      <DivOfflineContent />
    </div>
  );
}

function DivContent() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 gap-[32px]" data-name="div">
      <SignalIcon />
      <DivTitle />
      <DivSubtitle />
      <DivFlexButtons />
      <DivOfflineBox />
    </div>
  );
}

function DivErrWrap() {
  return (
    <div className="min-h-[calc(100vh-66px)] relative shrink-0 w-full z-[1]" data-name="div.err-wrap">
      <div className="flex flex-row items-center justify-center min-h-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-h-[inherit] px-[40px] py-[100px] relative w-full">
          <DivContent />
        </div>
      </div>
    </div>
  );
}

export default function NoInternet() {
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

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col h-screen isolate items-start justify-center relative size-full">
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start min-h-[100vh] relative size-full" data-name="37-no-internet">
      <DivScreenId />
      <NavNav />
      <DivErrWrap />
    </div>
  );
}
