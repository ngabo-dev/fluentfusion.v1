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
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">📚</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem1() {
  return (
    <Link to="/courses" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span1 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">My Courses</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Span2() {
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

function ASidebarItem2() {
  return (
    <Link to="/practice" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span2 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Practice</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Span3() {
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

function ASidebarItem3() {
  return (
    <Link to="/live" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span3 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Live Sessions</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Span4() {
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

function ASidebarItem4() {
  return (
    <Link to="/community" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span4 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Community</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Span5() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🏆</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem5() {
  return (
    <Link to="/achievements" className="bg-[rgba(191,255,0,0.1)] relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span5 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Achievements</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Span6() {
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

function ASidebarItem6() {
  return (
    <Link to="/leaderboard" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span6 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Leaderboard</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Span7() {
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

function ASidebarItem7() {
  return (
    <Link to="/profile" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span7 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Profile</p>
          </div>
        </div>
      </div>
    </Link>
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
          <span className="leading-[51.2px] text-[#bfff00]">Achievements</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">8 of 32 badges earned · Keep learning to unlock more!</p>
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
        <p className="leading-[16px]">Badges Earned</p>
      </div>
    </div>
  );
}

function DivStatValue() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[47px]" data-name="div.stat-value">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[34px] whitespace-nowrap">
        <p className="leading-[34px]">8</p>
      </div>
    </div>
  );
}

function DivStatSub() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[84px]" data-name="div.stat-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">of 32 total</p>
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
        <p className="leading-[16px]">XP from Badges</p>
      </div>
    </div>
  );
}

function DivStatValue1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[47px]" data-name="div.stat-value">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[34px] whitespace-nowrap">
        <p className="leading-[34px]">1,200</p>
      </div>
    </div>
  );
}

function DivStatSub1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[84px]" data-name="div.stat-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">+50 this week</p>
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
        <p className="leading-[16px]">Rarest Badge</p>
      </div>
    </div>
  );
}

function DivStatValue2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[47px]" data-name="div.stat-value">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[28px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[28px]">⚡</p>
      </div>
    </div>
  );
}

function DivStatSub2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[78px]" data-name="div.stat-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Speed Learner</p>
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
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[23px]" data-name="div.stat-label">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Next Badge</p>
      </div>
    </div>
  );
}

function DivStatValue3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[47px]" data-name="div.stat-value">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[28px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[28px]">🔥</p>
      </div>
    </div>
  );
}

function DivStatSub3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[23px] right-[23px] top-[78px]" data-name="div.stat-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">14-Day Streak · 7 left</p>
      </div>
    </div>
  );
}

function DivStatCard3() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="div.stat-card">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivStatLabel3 />
      <DivStatValue3 />
      <DivStatSub3 />
    </div>
  );
}

function DivGrid() {
  return (
    <div className="absolute content-stretch flex gap-[18px] items-start justify-center left-[40px] right-[40px] top-[141.58px]" data-name="div.grid-4">
      <DivStatCard />
      <DivStatCard1 />
      <DivStatCard2 />
      <DivStatCard3 />
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[40px] right-[40px] top-[268.77px]" data-name="div">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Earned · 8 Badges</p>
      </div>
    </div>
  );
}

function DivAchIcon() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">🎯</p>
      </div>
    </div>
  );
}

function DivAchName() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">First Step</p>
      </div>
    </div>
  );
}

function DivAchDesc() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Completed your very first lesson</p>
      </div>
    </div>
  );
}

function DivAchXp() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+50 XP · Earned Jan 10</p>
      </div>
    </div>
  );
}

function DivAchIcon1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">🔥</p>
      </div>
    </div>
  );
}

function DivAchName1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">7-Day Streak</p>
      </div>
    </div>
  );
}

function DivAchDesc1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">7 consecutive days of learning</p>
      </div>
    </div>
  );
}

function DivAchXp1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+100 XP · Earned Feb 5</p>
      </div>
    </div>
  );
}

function DivAchIcon2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">⚡</p>
      </div>
    </div>
  );
}

function DivAchName2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Speed Learner</p>
      </div>
    </div>
  );
}

function DivAchDesc2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Completed 5 lessons in one day</p>
      </div>
    </div>
  );
}

function DivAchXp2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+150 XP · Earned Jan 15</p>
      </div>
    </div>
  );
}

function DivAchIcon3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">🏆</p>
      </div>
    </div>
  );
}

function DivAchName3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Perfect Score</p>
      </div>
    </div>
  );
}

function DivAchDesc3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">100% on any quiz</p>
      </div>
    </div>
  );
}

function DivAchXp3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+200 XP · Earned Jan 18</p>
      </div>
    </div>
  );
}

function DivAchIcon4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">📚</p>
      </div>
    </div>
  );
}

function DivAchName4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Bookworm</p>
      </div>
    </div>
  );
}

function DivAchDesc4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Completed 20 lessons total</p>
      </div>
    </div>
  );
}

function DivAchXp4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+100 XP · Earned Feb 1</p>
      </div>
    </div>
  );
}

function DivAchIcon5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">💬</p>
      </div>
    </div>
  );
}

function DivAchName5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Conversationalist</p>
      </div>
    </div>
  );
}

function DivAchDesc5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Posted 5 community questions</p>
      </div>
    </div>
  );
}

function DivAchXp5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+75 XP · Earned Feb 10</p>
      </div>
    </div>
  );
}

function DivAchIcon6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Sans_Symbols:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap">
        <p className="leading-[57.6px]">🎙</p>
      </div>
    </div>
  );
}

function DivAchName6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Pronunciation Pro</p>
      </div>
    </div>
  );
}

function DivAchDesc6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">90%+ on speaking practice</p>
      </div>
    </div>
  );
}

function DivAchXp6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+150 XP · Earned Feb 12</p>
      </div>
    </div>
  );
}

function DivAchCard() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[174.38px] left-[567px] right-[283.5px] rounded-[14px] top-[188.37px]" data-name="div.ach-card">
      <DivAchIcon6 />
      <DivAchName6 />
      <DivAchDesc6 />
      <DivAchXp6 />
    </div>
  );
}

function DivAchIcon7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[20px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">🌍</p>
      </div>
    </div>
  );
}

function DivAchName7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.8px] right-[20px] top-[86.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Multilingual</p>
      </div>
    </div>
  );
}

function DivAchDesc7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] right-[20px] top-[110.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Enrolled in 2 language courses</p>
      </div>
    </div>
  );
}

function DivAchXp7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[20px] pb-[0.59px] right-[20px] top-[133.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+100 XP · Earned Feb 14</p>
      </div>
    </div>
  );
}

function DivBadgeGrid() {
  return (
    <div className="absolute h-[362.75px] left-[40px] right-[40px] top-[300.77px]" data-name="div.badge-grid">
      <div className="absolute bg-[rgba(191,255,0,0.04)] border border-[rgba(191,255,0,0.3)] border-solid h-[174.38px] left-0 right-[850.5px] rounded-[14px] top-0" data-name="Component 1">
        <DivAchIcon />
        <DivAchName />
        <DivAchDesc />
        <DivAchXp />
      </div>
      <div className="absolute bg-[rgba(191,255,0,0.04)] border border-[rgba(191,255,0,0.3)] border-solid h-[174.38px] left-[283.5px] right-[567px] rounded-[14px] top-0" data-name="Component 1">
        <DivAchIcon1 />
        <DivAchName1 />
        <DivAchDesc1 />
        <DivAchXp1 />
      </div>
      <div className="absolute bg-[rgba(191,255,0,0.04)] border border-[rgba(191,255,0,0.3)] border-solid h-[174.38px] left-[567px] right-[283.5px] rounded-[14px] top-[-2px]" data-name="Component 1">
        <DivAchIcon2 />
        <DivAchName2 />
        <DivAchDesc2 />
        <DivAchXp2 />
      </div>
      <div className="absolute bg-[rgba(191,255,0,0.04)] border border-[rgba(191,255,0,0.3)] border-solid h-[174.38px] left-[850.5px] right-0 rounded-[14px] top-0" data-name="Component 1">
        <DivAchIcon3 />
        <DivAchName3 />
        <DivAchDesc3 />
        <DivAchXp3 />
      </div>
      <div className="absolute bg-[rgba(191,255,0,0.04)] border border-[rgba(191,255,0,0.3)] border-solid h-[174.38px] left-0 right-[850.5px] rounded-[14px] top-[188.37px]" data-name="Component 1">
        <DivAchIcon4 />
        <DivAchName4 />
        <DivAchDesc4 />
        <DivAchXp4 />
      </div>
      <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[174.38px] left-[283.5px] right-[567px] rounded-[14px] top-[188.37px]" data-name="Component 1">
        <DivAchIcon5 />
        <DivAchName5 />
        <DivAchDesc5 />
        <DivAchXp5 />
      </div>
      <DivAchCard />
      <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[174.38px] left-[850.5px] right-0 rounded-[14px] top-[188.37px]" data-name="Component 1">
        <DivAchIcon7 />
        <DivAchName7 />
        <DivAchDesc7 />
        <DivAchXp7 />
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[40px] right-[40px] top-[663.52px]" data-name="div">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Locked · 24 Badges</p>
      </div>
    </div>
  );
}

function DivAchIcon8() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[21px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">💎</p>
      </div>
    </div>
  );
}

function DivAchName8() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.8px] right-[21px] top-[87.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Diamond Streak</p>
      </div>
    </div>
  );
}

function DivAchDesc8() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[111.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">30-day streak</p>
      </div>
    </div>
  );
}

function DivAchXp8() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.59px] right-[21px] top-[134.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+500 XP</p>
      </div>
    </div>
  );
}

function DivAchIcon9() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[21px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">👑</p>
      </div>
    </div>
  );
}

function DivAchName9() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.8px] right-[21px] top-[87.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Top Learner</p>
      </div>
    </div>
  );
}

function DivAchDesc9() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[111.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Rank #1 on weekly leaderboard</p>
      </div>
    </div>
  );
}

function DivAchXp9() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.59px] right-[21px] top-[134.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+300 XP</p>
      </div>
    </div>
  );
}

function DivAchIcon10() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[21px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[57.6px]">🎓</p>
      </div>
    </div>
  );
}

function DivAchName10() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.8px] right-[21px] top-[87.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Graduate</p>
      </div>
    </div>
  );
}

function DivAchDesc10() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[111.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Complete an entire course</p>
      </div>
    </div>
  );
}

function DivAchXp10() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.59px] right-[21px] top-[134.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+400 XP</p>
      </div>
    </div>
  );
}

function DivAchIcon11() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[21px]" data-name="div.ach-icon">
      <div className="flex flex-col font-['Noto_Sans_Symbols:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white whitespace-nowrap">
        <p className="leading-[57.6px]">🗣</p>
      </div>
    </div>
  );
}

function DivAchName11() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.8px] right-[21px] top-[87.59px]" data-name="div.ach-name">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Fluent</p>
      </div>
    </div>
  );
}

function DivAchDesc11() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] right-[21px] top-[111.39px]" data-name="div.ach-desc">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[15.4px]">Reach 90% fluency score</p>
      </div>
    </div>
  );
}

function DivAchXp11() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[21px] pb-[0.59px] right-[21px] top-[134.78px]" data-name="div.ach-xp">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[17.6px]">+600 XP</p>
      </div>
    </div>
  );
}

function DivAchCard1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px opacity-35 relative rounded-[14px] self-stretch" data-name="div.ach-card">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
        <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
        <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <DivAchIcon11 />
      <DivAchName11 />
      <DivAchDesc11 />
      <DivAchXp11 />
    </div>
  );
}

function DivBadgeGrid1() {
  return (
    <div className="absolute content-stretch flex gap-[14px] items-start justify-center left-[40px] right-[40px] top-[695.52px]" data-name="div.badge-grid">
      <div className="flex-[1_0_0] min-h-px min-w-px opacity-35 relative rounded-[14px] self-stretch" data-name="Component 1">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
          <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
          <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
        </div>
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <DivAchIcon8 />
        <DivAchName8 />
        <DivAchDesc8 />
        <DivAchXp8 />
      </div>
      <div className="flex-[1_0_0] min-h-px min-w-px opacity-35 relative rounded-[14px] self-stretch" data-name="Component 1">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
          <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
          <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
        </div>
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <DivAchIcon9 />
        <DivAchName9 />
        <DivAchDesc9 />
        <DivAchXp9 />
      </div>
      <div className="flex-[1_0_0] min-h-px min-w-px opacity-35 relative rounded-[14px] self-stretch" data-name="Component 1">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
          <div className="absolute bg-[#151515] inset-0 rounded-[14px]" />
          <div className="absolute bg-white inset-0 mix-blend-saturation rounded-[14px]" />
        </div>
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <DivAchIcon10 />
        <DivAchName10 />
        <DivAchDesc10 />
        <DivAchXp10 />
      </div>
      <DivAchCard1 />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px overflow-x-clip overflow-y-auto relative self-stretch" data-name="main.main">
      <DivPageHdr />
      <DivGrid />
      <Div2 />
      <DivBadgeGrid />
      <Div3 />
      <DivBadgeGrid1 />
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

export default function Component30Achievements() {
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

  // Get user initials
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
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="30-achievements">
      <NavNav userInitials={userInitials} />
      <DivAppWrap />
    </div>
  );
}