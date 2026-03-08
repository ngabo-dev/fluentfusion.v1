import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { authApi } from '../app/api/config';

function DivScreenId() {
  return null; // Hide debug screen ID
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

function ALogo({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/dashboard')} className="cursor-pointer relative shrink-0" data-name="a.logo">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </div>
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

function DivAvatar({ user }: { user?: any }) {
  const getInitials = () => {
    if (!user) return 'JP';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    return 'JP';
  };
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">{getInitials()}</p>
      </div>
    </div>
  );
}

function DivFlex({ user }: { user?: any }) {
  return (
    <div className="relative shrink-0" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Div />
        <DivAvatar user={user} />
      </div>
    </div>
  );
}

function NavNav({ user }: { user?: any }) {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo />
          <DivFlex user={user} />
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
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
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
          <p className="leading-[22.4px]">📊</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem1() {
  return (
    <a className="bg-[rgba(191,255,0,0.1)] relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span1 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Progress</p>
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
          <p className="leading-[22.4px]">📚</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem2() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span2 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">My Courses</p>
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
          <p className="leading-[22.4px]">🎯</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem3() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span3 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Practice</p>
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
          <p className="leading-[22.4px]">🎥</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem4() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span4 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Live Sessions</p>
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
          <p className="leading-[22.4px]">🌍</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem5() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span5 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Community</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Span6() {
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

function ASidebarItem6() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span6 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Profile</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function Span7() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">⚙️</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem7() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/15-progress.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span7 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Settings</p>
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
        <ASidebarItem6 />
        <ASidebarItem7 />
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
          <span className="leading-[51.2px] text-white">{`Your `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Progress</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Track your language learning journey in detail</p>
      </div>
    </div>
  );
}

function DivPageHdr() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[40px] right-[40px] top-[36px]" data-name="div.page-hdr">
      <Div1 />
      <P />
    </div>
  );
}

function DivStatLabel() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[23px]" data-name="div.stat-label">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Courses Completed</p>
      </div>
    </div>
  );
}

function DivStatValue() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[47px]" data-name="div.stat-value">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[34px] whitespace-nowrap">
        <p className="leading-[34px]">3</p>
      </div>
    </div>
  );
}

function DivStatSub() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[84px]" data-name="div.stat-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">of 5 enrolled</p>
      </div>
    </div>
  );
}

function DivStatCard() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="div.stat-card">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivStatLabel />
      <DivStatValue />
      <DivStatSub />
    </div>
  );
}

function DivStatLabel1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[23px]" data-name="div.stat-label">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Total XP</p>
      </div>
    </div>
  );
}

function DivStatValue1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[47px]" data-name="div.stat-value">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[34px] whitespace-nowrap">
        <p className="leading-[34px]">4,820</p>
      </div>
    </div>
  );
}

function DivStatSub1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[84px]" data-name="div.stat-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Level 6 · Gold</p>
      </div>
    </div>
  );
}

function DivStatCard1() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="div.stat-card">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivStatLabel1 />
      <DivStatValue1 />
      <DivStatSub1 />
    </div>
  );
}

function DivStatLabel2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[23px]" data-name="div.stat-label">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Best Streak</p>
      </div>
    </div>
  );
}

function DivStatValue2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[47px]" data-name="div.stat-value">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[34px] whitespace-nowrap">
        <p className="leading-[34px]">14🔥</p>
      </div>
    </div>
  );
}

function DivStatSub2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[84px]" data-name="div.stat-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Current: 7 days</p>
      </div>
    </div>
  );
}

function DivStatCard2() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="div.stat-card">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivStatLabel2 />
      <DivStatValue2 />
      <DivStatSub2 />
    </div>
  );
}

function DivStatLabel3() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.stat-label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[16px] whitespace-pre-wrap">Avg Quiz Score</p>
        </div>
      </div>
    </div>
  );
}

function DivStatValue3() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.stat-value">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[34px] w-full">
          <p className="leading-[34px] whitespace-pre-wrap">87%</p>
        </div>
      </div>
    </div>
  );
}

function DivProgressTrack() {
  return (
    <div className="bg-[#2a2a2a] h-[6px] relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_13%_0_0] rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] to-[#bfff00]" data-name="div.progress-fill" />
      </div>
    </div>
  );
}

function DivStatCard3() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="div.stat-card">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[23px] relative size-full">
        <DivStatLabel3 />
        <DivStatValue3 />
        <DivProgressTrack />
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="absolute content-stretch flex gap-[18px] items-start justify-center left-[40px] right-[40px] top-[141.58px]" data-name="Stats">
      <DivStatCard />
      <DivStatCard1 />
      <DivStatCard2 />
      <DivStatCard3 />
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] right-[25px] top-[25px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Course Completion</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">English for Tourism</p>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">62%</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="content-stretch flex items-center justify-between mb-[-0.01px] relative shrink-0 w-full" data-name="div.flex">
      <Span8 />
      <Span9 />
    </div>
  );
}

function DivProgressTrack1() {
  return (
    <div className="bg-[#2a2a2a] h-[6px] mb-[-0.01px] overflow-clip relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_38%_0_0] rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] to-[#bfff00]" data-name="div.progress-fill" />
    </div>
  );
}

function Div3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] pb-[0.01px] right-[25px] top-[66.39px]" data-name="div">
      <DivFlex1 />
      <DivProgressTrack1 />
    </div>
  );
}

function Span10() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">French Essentials</p>
      </div>
    </div>
  );
}

function Span11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">15%</p>
      </div>
    </div>
  );
}

function DivFlex2() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.flex">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative w-full">
          <Span10 />
          <Span11 />
        </div>
      </div>
    </div>
  );
}

function DivProgressTrack2() {
  return (
    <div className="bg-[#2a2a2a] h-[6px] overflow-clip relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_85%_0_0] rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] to-[#bfff00]" data-name="div.progress-fill" />
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] right-[25px] top-[109.18px]" data-name="div">
      <DivFlex2 />
      <DivProgressTrack2 />
    </div>
  );
}

function Span12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Spanish Survival</p>
      </div>
    </div>
  );
}

function Span13() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">100%</p>
      </div>
    </div>
  );
}

function DivFlex3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.flex">
      <Span12 />
      <Span13 />
    </div>
  );
}

function DivProgressTrack3() {
  return (
    <div className="bg-[#2a2a2a] content-stretch flex flex-col h-[6px] items-start justify-center overflow-clip relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="bg-[#00ff7f] flex-[1_0_0] min-h-px min-w-px rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] w-full" data-name="div.progress-fill" />
    </div>
  );
}

function Div5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] right-[25px] top-[151.98px]" data-name="div">
      <DivFlex3 />
      <DivProgressTrack3 />
    </div>
  );
}

function CourseCompletion() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="Course Completion">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Div2 />
        <Div3 />
        <Div4 />
        <Div5 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Div6() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">Weekly Activity (XP)</p>
        </div>
      </div>
    </div>
  );
}

function DivBarLbl() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0" data-name="div.bar-lbl">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Mon</p>
      </div>
    </div>
  );
}

function DivBarCol() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[5px] relative shrink-0 w-[62.56px]" data-name="div.bar-col">
      <DivBarLbl />
    </div>
  );
}

function DivBarLbl1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0" data-name="div.bar-lbl">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Tue</p>
      </div>
    </div>
  );
}

function DivBarCol1() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[5px] relative shrink-0 w-[62.58px]" data-name="div.bar-col">
      <DivBarLbl1 />
    </div>
  );
}

function DivBarLbl2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0" data-name="div.bar-lbl">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Wed</p>
      </div>
    </div>
  );
}

function DivBarCol2() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[5px] relative shrink-0 w-[62.56px]" data-name="div.bar-col">
      <DivBarLbl2 />
    </div>
  );
}

function DivBarLbl3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0" data-name="div.bar-lbl">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Thu</p>
      </div>
    </div>
  );
}

function DivBarCol3() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[5px] relative shrink-0 w-[62.58px]" data-name="div.bar-col">
      <DivBarLbl3 />
    </div>
  );
}

function DivBarLbl4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0" data-name="div.bar-lbl">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Fri</p>
      </div>
    </div>
  );
}

function DivBarCol4() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[5px] relative shrink-0 w-[62.56px]" data-name="div.bar-col">
      <DivBarLbl4 />
    </div>
  );
}

function DivBarLbl5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0" data-name="div.bar-lbl">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Sat</p>
      </div>
    </div>
  );
}

function DivBarCol5() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[5px] relative shrink-0 w-[62.58px]" data-name="div.bar-col">
      <DivBarLbl5 />
    </div>
  );
}

function DivBarLbl6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0" data-name="div.bar-lbl">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Sun</p>
      </div>
    </div>
  );
}

function DivBarCol6() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[5px] relative shrink-0 w-[62.58px]" data-name="div.bar-col">
      <DivBarLbl6 />
    </div>
  );
}

function DivBarChartRow() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="div.bar-chart-row">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-end justify-center relative size-full">
        <DivBarCol />
        <DivBarCol1 />
        <DivBarCol2 />
        <DivBarCol3 />
        <DivBarCol4 />
        <DivBarCol5 />
        <DivBarCol6 />
      </div>
    </div>
  );
}

function WeeklyActivity() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="Weekly Activity">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[20px] items-start p-[25px] relative size-full">
          <Div6 />
          <DivBarChartRow />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.22)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function DivGrid() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-start justify-center left-[40px] min-h-[204.77999877929688px] right-[40px] top-[268.77px]" data-name="div.grid-2">
      <CourseCompletion />
      <WeeklyActivity />
    </div>
  );
}

function Div7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Achievements · 8 of 24 Earned</p>
      </div>
    </div>
  );
}

function DivAchIcon() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] right-[18px] top-[17px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">🎯</p>
      </div>
    </div>
  );
}

function DivAchName() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.8px] right-[18px] top-[76.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">First Lesson</p>
      </div>
    </div>
  );
}

function DivAchDesc() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.59px] right-[18px] top-[99.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Completed your first lesson</p>
      </div>
    </div>
  );
}

function DivAchievementCard() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[138.58px] left-0 right-[850.5px] rounded-[14px] top-0" data-name="div.achievement-card">
      <DivAchIcon />
      <DivAchName />
      <DivAchDesc />
    </div>
  );
}

function DivAchIcon1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] right-[18px] top-[17px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">🔥</p>
      </div>
    </div>
  );
}

function DivAchName1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.8px] right-[18px] top-[76.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">7-Day Streak</p>
      </div>
    </div>
  );
}

function DivAchDesc1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.59px] right-[18px] top-[99.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">7 days in a row</p>
      </div>
    </div>
  );
}

function DivAchievementCard1() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[138.58px] left-[283.5px] right-[567px] rounded-[14px] top-0" data-name="div.achievement-card">
      <DivAchIcon1 />
      <DivAchName1 />
      <DivAchDesc1 />
    </div>
  );
}

function DivAchIcon2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] right-[18px] top-[17px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">⚡</p>
      </div>
    </div>
  );
}

function DivAchName2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.8px] right-[18px] top-[76.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Speed Learner</p>
      </div>
    </div>
  );
}

function DivAchDesc2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.59px] right-[18px] top-[99.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">5 lessons in one day</p>
      </div>
    </div>
  );
}

function DivAchievementCard2() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[138.58px] left-[567px] right-[283.5px] rounded-[14px] top-0" data-name="div.achievement-card">
      <DivAchIcon2 />
      <DivAchName2 />
      <DivAchDesc2 />
    </div>
  );
}

function DivAchIcon3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] right-[18px] top-[17px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">🏆</p>
      </div>
    </div>
  );
}

function DivAchName3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.8px] right-[18px] top-[76.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Perfect Score</p>
      </div>
    </div>
  );
}

function DivAchDesc3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[18px] pb-[0.59px] right-[18px] top-[99.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">100% on any quiz</p>
      </div>
    </div>
  );
}

function DivAchievementCard3() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[138.58px] left-[850.5px] right-0 rounded-[14px] top-0" data-name="div.achievement-card">
      <DivAchIcon3 />
      <DivAchName3 />
      <DivAchDesc3 />
    </div>
  );
}

function DivAchIcon4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] right-[19px] top-[18px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">💎</p>
      </div>
    </div>
  );
}

function DivAchName4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.8px] right-[19px] top-[77.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Diamond</p>
      </div>
    </div>
  );
}

function DivAchDesc4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.59px] right-[19px] top-[100.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">30-day streak</p>
      </div>
    </div>
  );
}

function DivAchievementCard4() {
  return (
    <div className="absolute h-[138.58px] left-0 opacity-40 right-[850.5px] rounded-[14px] top-[152.58px]" data-name="div.achievement-card">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
        <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
        <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivAchIcon4 />
      <DivAchName4 />
      <DivAchDesc4 />
    </div>
  );
}

function DivAchIcon5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] right-[19px] top-[18px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">🌍</p>
      </div>
    </div>
  );
}

function DivAchName5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.8px] right-[19px] top-[77.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Polyglot</p>
      </div>
    </div>
  );
}

function DivAchDesc5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.59px] right-[19px] top-[100.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Learn 3 languages</p>
      </div>
    </div>
  );
}

function DivAchievementCard5() {
  return (
    <div className="absolute h-[138.58px] left-[283.5px] opacity-40 right-[567px] rounded-[14px] top-[152.58px]" data-name="div.achievement-card">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
        <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
        <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivAchIcon5 />
      <DivAchName5 />
      <DivAchDesc5 />
    </div>
  );
}

function DivAchIcon6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] right-[19px] top-[18px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">👑</p>
      </div>
    </div>
  );
}

function DivAchName6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.8px] right-[19px] top-[77.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Top Learner</p>
      </div>
    </div>
  );
}

function DivAchDesc6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.59px] right-[19px] top-[100.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Rank #1 on leaderboard</p>
      </div>
    </div>
  );
}

function DivAchievementCard6() {
  return (
    <div className="absolute h-[138.58px] left-[567px] opacity-40 right-[283.5px] rounded-[14px] top-[152.58px]" data-name="div.achievement-card">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
        <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
        <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivAchIcon6 />
      <DivAchName6 />
      <DivAchDesc6 />
    </div>
  );
}

function DivAchIcon7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] right-[19px] top-[18px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[51.2px]">🎓</p>
      </div>
    </div>
  );
}

function DivAchName7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.8px] right-[19px] top-[77.19px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Graduate</p>
      </div>
    </div>
  );
}

function DivAchDesc7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[19px] pb-[0.59px] right-[19px] top-[100.99px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">Complete any full course</p>
      </div>
    </div>
  );
}

function DivAchievementCard7() {
  return (
    <div className="absolute h-[138.58px] left-[850.5px] opacity-40 right-0 rounded-[14px] top-[152.58px]" data-name="div.achievement-card">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
        <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
        <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivAchIcon7 />
      <DivAchName7 />
      <DivAchDesc7 />
    </div>
  );
}

function DivBadgeGrid() {
  return (
    <div className="h-[291.16px] relative shrink-0 w-full" data-name="div.badge-grid">
      <DivAchievementCard />
      <DivAchievementCard1 />
      <DivAchievementCard2 />
      <DivAchievementCard3 />
      <DivAchievementCard4 />
      <DivAchievementCard5 />
      <DivAchievementCard6 />
      <DivAchievementCard7 />
    </div>
  );
}

function Badges() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[40px] right-[40px] top-[765.92px]" data-name="Badges">
      <Div7 />
      <DivBadgeGrid />
    </div>
  );
}

function Div8() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">Skill Breakdown · English</p>
        </div>
      </div>
    </div>
  );
}

function SpanSkillName() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0 w-[120px]" data-name="span.skill-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Vocabulary</p>
      </div>
    </div>
  );
}

function DivSkillTrack() {
  return (
    <div className="bg-[#2a2a2a] flex-[1_0_0] h-[8px] min-h-px min-w-px overflow-clip relative rounded-[99px]" data-name="div.skill-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_22%_0_0] rounded-[99px] to-[#bfff00]" data-name="div.skill-fill" />
    </div>
  );
}

function Span14() {
  return (
    <div className="content-stretch flex flex-col items-end min-w-[36px] pl-[11.77px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[19.2px]">78%</p>
      </div>
    </div>
  );
}

function DivSkillBarRow() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-name="div.skill-bar-row">
      <SpanSkillName />
      <DivSkillTrack />
      <Span14 />
    </div>
  );
}

function SpanSkillName1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0 w-[120px]" data-name="span.skill-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Grammar</p>
      </div>
    </div>
  );
}

function DivSkillTrack1() {
  return (
    <div className="bg-[#2a2a2a] flex-[1_0_0] h-[8px] min-h-px min-w-px overflow-clip relative rounded-[99px]" data-name="div.skill-track">
      <div className="absolute bg-gradient-to-r from-[#00cfff] inset-[0_35%_0_0] rounded-[99px] to-[#0080ff]" data-name="div.skill-fill" />
    </div>
  );
}

function Span15() {
  return (
    <div className="content-stretch flex flex-col items-end min-w-[36px] pl-[10.81px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#00cfff] text-[12px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[19.2px]">65%</p>
      </div>
    </div>
  );
}

function DivSkillBarRow1() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-name="div.skill-bar-row">
      <SpanSkillName1 />
      <DivSkillTrack1 />
      <Span15 />
    </div>
  );
}

function SpanSkillName2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0 w-[120px]" data-name="span.skill-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Speaking</p>
      </div>
    </div>
  );
}

function DivSkillTrack2() {
  return (
    <div className="bg-[#2a2a2a] flex-[1_0_0] h-[8px] min-h-px min-w-px overflow-clip relative rounded-[99px]" data-name="div.skill-track">
      <div className="absolute bg-[#ffb800] inset-[0_46%_0_0] rounded-[99px]" data-name="div.skill-fill" />
    </div>
  );
}

function Span16() {
  return (
    <div className="content-stretch flex flex-col items-end min-w-[36px] pl-[10.69px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#ffb800] text-[12px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[19.2px]">54%</p>
      </div>
    </div>
  );
}

function DivSkillBarRow2() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-name="div.skill-bar-row">
      <SpanSkillName2 />
      <DivSkillTrack2 />
      <Span16 />
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[13px] items-start min-h-px min-w-px relative self-stretch" data-name="div">
      <DivSkillBarRow />
      <DivSkillBarRow1 />
      <DivSkillBarRow2 />
    </div>
  );
}

function SpanSkillName3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0 w-[120px]" data-name="span.skill-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Listening</p>
      </div>
    </div>
  );
}

function DivSkillTrack3() {
  return (
    <div className="bg-[#2a2a2a] flex-[1_0_0] h-[8px] min-h-px min-w-px overflow-clip relative rounded-[99px]" data-name="div.skill-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_18%_0_0] rounded-[99px] to-[#bfff00]" data-name="div.skill-fill" />
    </div>
  );
}

function Span17() {
  return (
    <div className="content-stretch flex flex-col items-end min-w-[36px] pl-[11.27px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[19.2px]">82%</p>
      </div>
    </div>
  );
}

function DivSkillBarRow3() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-name="div.skill-bar-row">
      <SpanSkillName3 />
      <DivSkillTrack3 />
      <Span17 />
    </div>
  );
}

function SpanSkillName4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0 w-[120px]" data-name="span.skill-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Reading</p>
      </div>
    </div>
  );
}

function DivSkillTrack4() {
  return (
    <div className="bg-[#2a2a2a] flex-[1_0_0] h-[8px] min-h-px min-w-px overflow-clip relative rounded-[99px]" data-name="div.skill-track">
      <div className="absolute bg-gradient-to-r from-[#00cfff] inset-[0_29%_0_0] rounded-[99px] to-[#0080ff]" data-name="div.skill-fill" />
    </div>
  );
}

function Span18() {
  return (
    <div className="content-stretch flex flex-col items-end min-w-[36px] pl-[14.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#00cfff] text-[12px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[19.2px]">71%</p>
      </div>
    </div>
  );
}

function DivSkillBarRow4() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-name="div.skill-bar-row">
      <SpanSkillName4 />
      <DivSkillTrack4 />
      <Span18 />
    </div>
  );
}

function SpanSkillName5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0 w-[120px]" data-name="span.skill-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Writing</p>
      </div>
    </div>
  );
}

function DivSkillTrack5() {
  return (
    <div className="bg-[#2a2a2a] flex-[1_0_0] h-[8px] min-h-px min-w-px overflow-clip relative rounded-[99px]" data-name="div.skill-track">
      <div className="absolute bg-[#ffb800] inset-[0_52%_0_0] rounded-[99px]" data-name="div.skill-fill" />
    </div>
  );
}

function Span19() {
  return (
    <div className="content-stretch flex flex-col items-end min-w-[36px] pl-[10.42px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#ffb800] text-[12px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[19.2px]">48%</p>
      </div>
    </div>
  );
}

function DivSkillBarRow5() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-name="div.skill-bar-row">
      <SpanSkillName5 />
      <DivSkillTrack5 />
      <Span19 />
    </div>
  );
}

function Div10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[13px] items-start min-h-px min-w-px relative self-stretch" data-name="div">
      <DivSkillBarRow3 />
      <DivSkillBarRow4 />
      <DivSkillBarRow5 />
    </div>
  );
}

function DivGrid1() {
  return (
    <div className="min-h-[105.38999938964844px] relative shrink-0 w-full" data-name="div.grid-2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start justify-center min-h-[inherit] relative w-full">
        <Div9 />
        <Div10 />
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">💡 AI Suggestion</p>
        </div>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">Your Speaking score is the weakest area. Try 3 speaking practice sessions this week to boost it above 70%.</p>
        </div>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-[rgba(191,255,0,0.05)] relative rounded-[14px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.12)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3px] items-start px-[19px] py-[15px] relative w-full">
        <Div12 />
        <Div13 />
      </div>
    </div>
  );
}

function SkillBreakdown() {
  return (
    <div className="absolute bg-[#151515] left-[40px] right-[40px] rounded-[14px] top-[473.55px]" data-name="Skill Breakdown">
      <div className="content-stretch flex flex-col gap-[19px] items-start overflow-clip p-[25px] relative rounded-[inherit] w-full">
        <Div8 />
        <DivGrid1 />
        <Div11 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px overflow-x-clip overflow-y-auto relative self-stretch" data-name="main.main">
      <DivPageHdr />
      <Stats />
      <DivGrid />
      <Badges />
      <SkillBreakdown />
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

export default function Component15Progress() {
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
    if (!user) return 'JP';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    return 'JP';
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col h-screen isolate items-start justify-center relative size-full" data-name="15-progress">
        <DivScreenId />
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="15-progress">
      <DivScreenId />
      <NavNav user={user} />
      <DivAppWrap />
    </div>
  );
}