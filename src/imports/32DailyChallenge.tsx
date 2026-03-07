import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import svgPaths from "./svg-1qfqjj4pp9";

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

function Div() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[20px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[32px]">🔔</p>
      </div>
    </div>
  );
}

function DivAvatar({ userInitials }: { userInitials: string }) {
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">{userInitials}</p>
      </div>
    </div>
  );
}

function DivFlex({ userInitials }: { userInitials: string }) {
  return (
    <div className="relative shrink-0" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Div />
        <DivAvatar userInitials={userInitials} />
      </div>
    </div>
  );
}

function NavNav({ userInitials }: { userInitials: string }) {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo />
          <DivFlex userInitials={userInitials} />
        </div>
      </div>
    </div>
  );
}

function Span() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">⚡</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem() {
  return (
    <Link to="/dashboard" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Dashboard</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Span1() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🎯</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem1() {
  return (
    <a className="bg-[rgba(191,255,0,0.1)] relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/32-daily-challenge.html">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span1 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Daily Challenge</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Span2() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🏆</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem2() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/32-daily-challenge.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span2 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Achievements</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Span3() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">📊</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem3() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/32-daily-challenge.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span3 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Leaderboard</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Span4() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">📚</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem4() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/32-daily-challenge.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span4 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">My Courses</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Span5() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">👤</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem5() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/32-daily-challenge.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span5 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Profile</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function AsideSidebar() {
  return (
    <div className="absolute bg-[#0f0f0f] h-[834px] left-0 top-0 w-[240px]" data-name="aside.sidebar">
      <div className="content-stretch cursor-pointer flex flex-col items-start overflow-auto pr-px py-[20px] relative size-full">
        <ASidebarItem />
        <ASidebarItem1 />
        <ASidebarItem2 />
        <ASidebarItem3 />
        <ASidebarItem4 />
        <ASidebarItem5 />
      </div>
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Div1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-white tracking-[-0.64px] uppercase w-full">
        <p className="text-[32px] whitespace-pre-wrap">
          <span className="leading-[51.2px] text-white">{`Daily `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Challenge</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Complete all tasks today to earn bonus XP and maintain your streak!</p>
      </div>
    </div>
  );
}

function DivPageHdr() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="div.page-hdr">
      <Div1 />
      <P />
    </div>
  );
}

function Div3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[177px]" data-name="div">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] text-center tracking-[1.5px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Time Remaining Today</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[201px]" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[26px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[41.6px]">{`Today's Challenge`}</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[248.59px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[0px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="text-[14px]">
          <span className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[22.4px] text-[#888]" style={{ fontVariationSettings: "'opsz' 9" }}>{`Complete 3 tasks to earn `}</span>
          <span className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[22.4px] text-[#bfff00]" style={{ fontVariationSettings: "'opsz' 14" }}>
            +300 Bonus XP
          </span>
        </p>
      </div>
    </div>
  );
}

function DivProgressTrack() {
  return (
    <div className="bg-[#2a2a2a] h-[8px] overflow-clip relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_34.01%_0_0] rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] to-[#bfff00]" data-name="div.progress-fill" />
    </div>
  );
}

function Div7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[140px]" data-name="div">
      <DivProgressTrack />
    </div>
  );
}

function Span6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">2 / 3 done</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center justify-center left-[37px] right-[37px] top-[286.98px]" data-name="div">
      <Div7 />
      <Span6 />
    </div>
  );
}

function DivTimerNum() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[34.5%_17.86%_35.34%_17.86%] items-center" data-name="div.timer-num">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[22px] text-center whitespace-nowrap">
        <p className="leading-[35.2px]">4:32</p>
      </div>
    </div>
  );
}

function DivTimerRing() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-start left-1/2 size-[120px] top-[37px]" data-name="div.timer-ring">
      <div className="flex items-center justify-center relative shrink-0 size-[120px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "38" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="overflow-clip relative size-[120px]" data-name="Component 1">
            <div className="absolute inset-[5%]" data-name="Vector">
              <div className="absolute inset-[-3.7%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 116">
                  <path d={svgPaths.p58d8e80} id="Vector" stroke="var(--stroke-0, #2A2A2A)" strokeWidth="8" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-[5%]" data-name="Vector">
              <div className="absolute inset-[-3.7%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 116">
                  <path d={svgPaths.p58d8e80} id="Vector" stroke="var(--stroke-0, #BFFF00)" strokeLinecap="round" strokeWidth="8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DivTimerNum />
    </div>
  );
}

function DivChallengeHero() {
  return (
    <div className="h-[350.38px] relative rounded-[20px] shrink-0 w-full" data-name="div.challenge-hero" style={{ backgroundImage: "linear-gradient(134.92deg, rgba(191, 255, 0, 0.08) 0%, rgba(191, 255, 0, 0.02) 100%)" }}>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Div3 />
        <Div4 />
        <Div5 />
        <Div6 />
        <div className="absolute right-[-59px] size-[300px] top-[-59px]" data-name="::before" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 300 300\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(21.213 0 0 21.213 150 150)\\'><stop stop-color=\\'rgba(191,255,0,0.07)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />
        <DivTimerRing />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.15)] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function DivStepIco() {
  return (
    <div className="bg-[rgba(0,255,127,0.1)] relative rounded-[10px] shrink-0 size-[44px]" data-name="div.step-ico">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[32px]">✅</p>
        </div>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px] whitespace-pre-wrap">Vocabulary Review</p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] pb-[0.8px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px] whitespace-pre-wrap">Learn 10 new words in Kinyarwanda</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative w-full">
        <Div9 />
        <Div10 />
      </div>
    </div>
  );
}

function Span7() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.59px] relative">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[11px] whitespace-nowrap">
          <p className="leading-[17.6px]">+100 XP · Done</p>
        </div>
      </div>
    </div>
  );
}

function DivChallengeStep() {
  return (
    <div className="bg-[rgba(0,255,127,0.04)] relative rounded-[14px] shrink-0 w-full" data-name="div.challenge-step">
      <div aria-hidden="true" className="absolute border border-[rgba(0,255,127,0.25)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[19px] py-[17px] relative w-full">
          <DivStepIco />
          <Div8 />
          <Span7 />
        </div>
      </div>
    </div>
  );
}

function DivStepIco1() {
  return (
    <div className="bg-[rgba(0,255,127,0.1)] relative rounded-[10px] shrink-0 size-[44px]" data-name="div.step-ico">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[32px]">✅</p>
        </div>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px] whitespace-pre-wrap">Speaking Practice</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] pb-[0.8px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px] whitespace-pre-wrap">Record 3 pronunciation exercises</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative w-full">
        <Div12 />
        <Div13 />
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.59px] relative">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[11px] whitespace-nowrap">
          <p className="leading-[17.6px]">+100 XP · Done</p>
        </div>
      </div>
    </div>
  );
}

function DivChallengeStep1() {
  return (
    <div className="bg-[rgba(0,255,127,0.04)] relative rounded-[14px] shrink-0 w-full" data-name="div.challenge-step">
      <div aria-hidden="true" className="absolute border border-[rgba(0,255,127,0.25)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[19px] py-[17px] relative w-full">
          <DivStepIco1 />
          <Div11 />
          <Span8 />
        </div>
      </div>
    </div>
  );
}

function DivStepIco2() {
  return (
    <div className="bg-[rgba(191,255,0,0.12)] relative rounded-[10px] shrink-0 size-[44px]" data-name="div.step-ico">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[32px]">🎯</p>
        </div>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px] whitespace-pre-wrap">Complete a Lesson</p>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] pb-[0.8px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px] whitespace-pre-wrap">Finish any lesson in your enrolled courses</p>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative w-full">
        <Div15 />
        <Div16 />
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.59px] relative">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] whitespace-nowrap">
          <p className="leading-[17.6px]">+100 XP · Pending</p>
        </div>
      </div>
    </div>
  );
}

function DivChallengeStep2() {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] relative rounded-[14px] shrink-0 w-full" data-name="div.challenge-step">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[19px] py-[17px] relative w-full">
          <DivStepIco2 />
          <Div14 />
          <Span9 />
        </div>
      </div>
    </div>
  );
}

function DivChallengeSteps() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="div.challenge-steps">
      <DivChallengeStep />
      <DivChallengeStep1 />
      <DivChallengeStep2 />
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center px-[36px] py-[15px] relative rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] text-center tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Start Next Task →</p>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Complete before midnight to keep your 7-day streak 🔥</p>
      </div>
    </div>
  );
}

function Div17() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-center relative shrink-0 w-full" data-name="div">
      <ButtonBtn />
      <Div18 />
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[680px] relative shrink-0 w-[680px]" data-name="div">
      <DivChallengeHero />
      <DivChallengeSteps />
      <Div17 />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="main.main">
      <div className="flex flex-col items-center overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col gap-[28px] items-center px-[40px] py-[36px] relative size-full">
          <DivPageHdr />
          <Div2 />
        </div>
      </div>
    </div>
  );
}

function DivAppWrap() {
  return (
    <div className="min-h-[834px] relative shrink-0 w-full z-[1]" data-name="div.app-wrap">
      <div className="flex flex-row justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center min-h-[inherit] pl-[240px] relative w-full">
          <AsideSidebar />
          <MainMain />
        </div>
      </div>
    </div>
  );
}

export default function Component32DailyChallenge() {
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
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'JP';
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col h-screen isolate items-start justify-center relative size-full">
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const userInitials = getUserInitials();

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="32-daily-challenge">
      <NavNav userInitials={userInitials} />
      <DivAppWrap />
    </div>
  );
}