import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

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
    <a className="cursor-pointer relative shrink-0" data-name="a.logo" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/33-streak-tracker.html">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </a>
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
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/33-streak-tracker.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Dashboard</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Span1() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🔥</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem1() {
  return (
    <a className="bg-[rgba(191,255,0,0.1)] relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/33-streak-tracker.html">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span1 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Streak Tracker</p>
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
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/33-streak-tracker.html">
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
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/33-streak-tracker.html">
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
          <p className="leading-[22.4px]">👤</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem4() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/33-streak-tracker.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span4 />
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
      </div>
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-white tracking-[-0.64px] uppercase w-full">
        <p className="text-[32px] whitespace-pre-wrap">
          <span className="leading-[51.2px] text-white">{`Streak `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Tracker</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Track your daily learning consistency</p>
      </div>
    </div>
  );
}

function DivPageHdr() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="div.page-hdr">
      <Div2 />
      <P />
    </div>
  );
}

function SpanFlameBig() {
  return (
    <div className="absolute h-[102.39px] left-[37px] right-[37px] shadow-[0px_0px_16px_0px_rgba(255,120,0,0.5)] top-[37px]" data-name="span.flame-big">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] h-[103px] justify-center leading-[0] left-[calc(50%+0.09px)] text-[64px] text-center text-white top-[50.5px] w-[80.06px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[102.4px] whitespace-pre-wrap">🔥</p>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[147.39px]" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#ffb800] text-[72px] text-center text-shadow-[0px_0px_24px_rgba(255,184,0,0.4)] whitespace-nowrap">
        <p className="leading-[72px]">7</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[227.39px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[28.8px]">Day Streak!</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[260.19px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[0px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="text-[14px]">
          <span className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[22.4px] text-[#888]" style={{ fontVariationSettings: "'opsz' 9" }}>{`Your longest streak: `}</span>
          <span className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[22.4px] text-white" style={{ fontVariationSettings: "'opsz' 14" }}>
            14 days
          </span>
        </p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1.01px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[22px] text-center whitespace-nowrap">
        <p className="leading-[35.2px]">7</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1.01px] pb-[0.59px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Current</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="h-full relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-full items-start pb-[1.01px] relative">
        <Div8 />
        <Div9 />
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1.01px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[22px] text-center text-white whitespace-nowrap">
        <p className="leading-[35.2px]">14</p>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1.01px] pb-[0.59px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Best</p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="h-full relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-full items-start pb-[1.01px] relative">
        <Div11 />
        <Div12 />
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1.01px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[22px] text-center text-white whitespace-nowrap">
        <p className="leading-[35.2px]">38</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1.01px] pb-[0.59px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Total Days</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="h-full relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-full items-start pb-[1.01px] relative">
        <Div14 />
        <Div15 />
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.04)] content-stretch flex gap-[16px] items-end left-[258.7px] pb-[15px] pt-[14px] px-[25px] rounded-[10px] top-[298.58px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-end self-stretch">
        <Div7 />
      </div>
      <div className="bg-[#2a2a2a] h-[52.78px] shrink-0 w-px" data-name="div" />
      <div className="flex flex-row items-end self-stretch">
        <Div10 />
      </div>
      <div className="bg-[#2a2a2a] h-[52.78px] shrink-0 w-px" data-name="div" />
      <div className="flex flex-row items-end self-stretch">
        <Div13 />
      </div>
    </div>
  );
}

function BigStreakDisplay() {
  return (
    <div className="h-[418.36px] relative rounded-[20px] shrink-0 w-full" data-name="Big Streak Display" style={{ backgroundImage: "linear-gradient(134.938deg, rgba(255, 120, 0, 0.06) 0%, rgba(255, 120, 0, 0) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(255,120,0,0.2)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <SpanFlameBig />
      <Div3 />
      <Div4 />
      <Div5 />
      <Div6 />
    </div>
  );
}

function Div16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px]">February 2026</p>
      </div>
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[7px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">← Jan</p>
      </div>
    </div>
  );
}

function ButtonBtn1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[7px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Mar →</p>
      </div>
    </div>
  );
}

function DivFlex2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="div.flex">
      <ButtonBtn />
      <ButtonBtn1 />
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[25px] right-[25px] top-[25px]" data-name="div.flex">
      <Div16 />
      <DivFlex2 />
    </div>
  );
}

function Div17() {
  return (
    <div className="absolute content-stretch flex gap-[6px] items-start justify-center left-[25px] right-[25px] top-[72px]" data-name="div">
      <div className="content-stretch flex flex-col items-center p-[4px] relative self-stretch shrink-0 w-[96.28px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center whitespace-nowrap">
          <p className="leading-[16px]">M</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center p-[4px] relative self-stretch shrink-0 w-[96.28px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center whitespace-nowrap">
          <p className="leading-[16px]">T</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center p-[4px] relative self-stretch shrink-0 w-[96.28px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center whitespace-nowrap">
          <p className="leading-[16px]">W</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center p-[4px] relative self-stretch shrink-0 w-[96.3px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center whitespace-nowrap">
          <p className="leading-[16px]">T</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center p-[4px] relative self-stretch shrink-0 w-[96.28px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center whitespace-nowrap">
          <p className="leading-[16px]">F</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center p-[4px] relative self-stretch shrink-0 w-[96.28px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center whitespace-nowrap">
          <p className="leading-[16px]">S</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center p-[4px] relative self-stretch shrink-0 w-[96.28px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] text-center whitespace-nowrap">
          <p className="leading-[16px]">S</p>
        </div>
      </div>
    </div>
  );
}

function DivCalendarGrid() {
  return (
    <div className="absolute h-[505.48px] left-[25px] right-[25px] top-[106px]" data-name="div.calendar-grid">
      <div className="absolute aspect-[96.30000305175781/96.30000305175781] bg-[#151515] border border-[#2a2a2a] border-solid left-0 right-[613.7px] rounded-[8px] top-0" data-name="div.cal-day" />
      <div className="absolute aspect-[96.30000305175781/96.30000305175781] bg-[#151515] border border-[#2a2a2a] border-solid left-[102.3px] right-[511.4px] rounded-[8px] top-0" data-name="div.cal-day" />
      <div className="absolute aspect-[96.30000305175781/96.30000305175781] bg-[#151515] border border-[#2a2a2a] border-solid left-[204.59px] right-[409.11px] rounded-[8px] top-0" data-name="div.cal-day" />
      <div className="absolute aspect-[96.30000305175781/96.30000305175781] bg-[#151515] border border-[#2a2a2a] border-solid left-[306.89px] right-[306.81px] rounded-[8px] top-0" data-name="div.cal-day" />
      <div className="absolute aspect-[96.30000305175781/96.30000305175781] bg-[#151515] border border-[#2a2a2a] border-solid left-[409.19px] right-[204.51px] rounded-[8px] top-0" data-name="div.cal-day" />
      <div className="absolute content-stretch flex items-center justify-center left-[511.48px] pb-[38.76px] pt-[37.54px] right-[102.22px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-0" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">1</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[613.78px] pb-[38.76px] pt-[37.54px] right-[-0.08px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-0" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">2</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-0 pb-[38.75px] pt-[37.55px] right-[613.7px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[102.29px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">3</p>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,68,68,0.1)] content-stretch flex items-center justify-center left-[102.3px] pb-[38.75px] pt-[37.55px] right-[511.4px] rounded-[8px] top-[102.29px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#f44] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[19.2px]">4</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[204.59px] pb-[38.75px] pt-[37.55px] right-[409.11px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[102.29px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">5</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[306.89px] pb-[38.75px] pt-[37.55px] right-[306.81px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[102.29px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">6</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[409.19px] pb-[38.75px] pt-[37.55px] right-[204.51px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[102.29px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">7</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[511.48px] pb-[38.75px] pt-[37.55px] right-[102.22px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[102.29px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">8</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[613.78px] pb-[38.75px] pt-[37.55px] right-[-0.08px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[102.29px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">9</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-0 pb-[38.75px] pt-[37.55px] right-[613.7px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[204.59px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">10</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[102.3px] pb-[38.75px] pt-[37.55px] right-[511.4px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[204.59px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">11</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[204.59px] pb-[38.75px] pt-[37.55px] right-[409.11px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[204.59px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">12</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[306.89px] pb-[38.75px] pt-[37.55px] right-[306.81px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[204.59px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">13</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[409.19px] pb-[38.75px] pt-[37.55px] right-[204.51px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[204.59px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">14</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[511.48px] pb-[38.75px] pt-[37.55px] right-[102.22px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[204.59px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">15</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[613.78px] pb-[38.75px] pt-[37.55px] right-[-0.08px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[204.59px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">16</p>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,68,68,0.1)] content-stretch flex items-center justify-center left-0 pb-[38.75px] pt-[37.55px] right-[613.7px] rounded-[8px] top-[306.89px]" data-name="Component 1">
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#f44] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[19.2px]">17</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[102.3px] pb-[38.75px] pt-[37.55px] right-[511.4px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[306.89px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">18</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[204.59px] pb-[38.75px] pt-[37.55px] right-[409.11px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[306.89px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">19</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[306.89px] pb-[38.75px] pt-[37.55px] right-[306.81px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[306.89px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">20</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[409.19px] pb-[38.75px] pt-[37.55px] right-[204.51px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[306.89px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">21</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[511.48px] pb-[38.75px] pt-[37.55px] right-[102.22px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[306.89px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">22</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[613.78px] pb-[38.75px] pt-[37.55px] right-[-0.08px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[306.89px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">23</p>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-0 pb-[38.76px] pt-[37.54px] right-[613.7px] rounded-[8px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.3)] top-[409.19px]" data-name="Component 1" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
          <p className="leading-[19.2px]">24</p>
        </div>
      </div>
      <div className="absolute bg-[rgba(191,255,0,0.15)] content-stretch flex items-center justify-center left-[102.3px] pb-[38.76px] pt-[37.54px] px-[2px] right-[511.4px] rounded-[8px] top-[409.19px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-2 border-[#bfff00] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[19.2px]">25</p>
        </div>
      </div>
      <div className="absolute bg-[#151515] content-stretch flex items-center justify-center left-[204.59px] pb-[38.76px] pt-[37.54px] px-px right-[409.11px] rounded-[8px] top-[409.19px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#555] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[19.2px]">26</p>
        </div>
      </div>
      <div className="absolute bg-[#151515] content-stretch flex items-center justify-center left-[306.89px] pb-[38.76px] pt-[37.54px] px-px right-[306.81px] rounded-[8px] top-[409.19px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#555] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[19.2px]">27</p>
        </div>
      </div>
      <div className="absolute bg-[#151515] content-stretch flex items-center justify-center left-[409.19px] pb-[38.76px] pt-[37.54px] px-px right-[204.51px] rounded-[8px] top-[409.19px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#555] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[19.2px]">28</p>
        </div>
      </div>
    </div>
  );
}

function Span5() {
  return (
    <div className="relative self-stretch shrink-0 w-[80.09px]" data-name="span">
      <div className="-translate-y-1/2 absolute bg-[#bfff00] left-0 rounded-[3px] size-[12px] top-1/2" data-name="span" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] left-[18px] text-[12px] text-white top-[calc(50%-0.6px)] w-[62.481px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">Completed</p>
      </div>
    </div>
  );
}

function Span6() {
  return (
    <div className="relative self-stretch shrink-0 w-[57.38px]" data-name="span">
      <div className="-translate-y-1/2 absolute bg-[rgba(255,68,68,0.3)] left-0 rounded-[3px] size-[12px] top-1/2" data-name="span" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] left-[18px] text-[12px] text-white top-[calc(50%-0.6px)] w-[39.7px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">Missed</p>
      </div>
    </div>
  );
}

function Span7() {
  return (
    <div className="content-stretch flex items-center pb-[1.19px] relative self-stretch shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Today = Feb 25</p>
      </div>
    </div>
  );
}

function DivFlex3() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-[25px] right-[25px] top-[627.48px]" data-name="div.flex">
      <Span5 />
      <Span6 />
      <Span7 />
    </div>
  );
}

function CalendarFebruary() {
  return (
    <div className="bg-[#151515] h-[679.67px] relative rounded-[14px] shrink-0 w-full" data-name="Calendar - February 2026">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <DivFlex1 />
        <Div17 />
        <DivCalendarGrid />
        <DivFlex3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Div1() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start max-w-[760px] relative shrink-0 w-full" data-name="div">
      <DivPageHdr />
      <BigStreakDisplay />
      <CalendarFebruary />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="main.main">
      <div className="overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col items-start px-[220px] py-[36px] relative size-full">
          <Div1 />
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

export default function Component33StreakTracker() {
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
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="33-streak-tracker">
      <NavNav userInitials={userInitials} />
      <DivAppWrap />
    </div>
  );
}