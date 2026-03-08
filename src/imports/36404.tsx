import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

function DivScreenId() {
  return (
    <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
        <p className="leading-[16px]">13.1 · 404 Not Found</p>
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

function ButtonBtn() {
  return (
    <div className="content-stretch flex items-center justify-center px-[24px] py-[11px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">← Go Back</p>
      </div>
    </div>
  );
}

function ButtonBtn1() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center px-[24px] py-[11px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-center tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Home</p>
      </div>
    </div>
  );
}

function DivFlex() {
  return (
    <div className="relative shrink-0" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-center relative">
        <ButtonBtn />
        <ButtonBtn1 />
      </div>
    </div>
  );
}

function NavNav() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo />
          <DivFlex />
        </div>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[140px]" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[28px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[44.8px]">Page Not Found</p>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[48.31px] max-w-[400px] pb-[0.75px] right-[48.33px] top-[196.05px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[25.5px] relative shrink-0 text-[#888] text-[15px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">{`Looks like this lesson doesn't exist yet. Head back to your`}</p>
        <p>dashboard and keep learning!</p>
      </div>
    </div>
  );
}

function ButtonBtn2() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center px-[36px] py-[16px] relative rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] text-center tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Go to Dashboard →</p>
      </div>
    </div>
  );
}

function ButtonBtn3() {
  return (
    <div className="content-stretch flex items-center justify-center px-[37px] py-[16px] relative rounded-[10px] shrink-0" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Browse Courses</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-0 right-0 top-[279.8px]" data-name="div.flex">
      <ButtonBtn2 />
      <ButtonBtn3 />
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] top-[19px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">{`While you're here — today's word of the day:`}</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pl-[45.79px] pr-[45.82px] top-[52.79px]" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[28px] text-center whitespace-nowrap">
        <p className="leading-[44.8px]">Impano</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] px-[62.92px] top-[101.59px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">{`Kinyarwanda for "Gift"`}</p>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[145.98px] left-[94.52px] rounded-[14px] top-[380.8px] w-[307.61px]" data-name="div">
      <Div4 />
      <Div5 />
      <Div6 />
    </div>
  );
}

function DivErrNum() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-0" data-name="div.err-num">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[160px] text-[transparent] text-center tracking-[-8px] whitespace-nowrap">
        <p className="leading-[160px]">404</p>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="h-[526.78px] relative shrink-0 w-[496.64px]" data-name="div">
      <Div1 />
      <Div2 />
      <DivFlex1 />
      <Div3 />
      <DivErrNum />
    </div>
  );
}

function DivErrWrap() {
  return (
    <div className="min-h-[834px] relative shrink-0 w-full z-[1]" data-name="div.err-wrap">
      <div className="flex flex-row items-center justify-center min-h-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-h-[inherit] px-[40px] py-[153.61px] relative w-full">
          <div className="absolute inset-0" data-name="div.err-bg" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1440 834\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(86.4 0 0 41.7 720 333.6)\\'><stop stop-color=\\'rgba(191,255,0,0.05)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />
          <Div />
        </div>
      </div>
    </div>
  );
}

export default function Component() {
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
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="36-404">
      <DivScreenId />
      <NavNav />
      <DivErrWrap />
    </div>
  );
}