import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import StudentLayout from '../app/components/StudentLayout';

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
          <p className="leading-[22.4px]">🏆</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem1() {
  return (
    <Link to="/achievements" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span1 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Achievements</p>
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
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">📊</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem2() {
  return (
    <Link to="/leaderboard" className="bg-[rgba(191,255,0,0.1)] relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span2 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Leaderboard</p>
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
          <p className="leading-[22.4px]">🎯</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem3() {
  return (
    <Link to="/practice" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span3 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Practice</p>
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
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">👤</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem5() {
  return (
    <Link to="/profile" className="relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span5 />
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
          <span className="leading-[51.2px] text-white">{`Weekly `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Leaderboard</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Compete with learners globally · Resets every Monday</p>
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

function DivBadge() {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center pb-[14.8px] pt-[13.2px] px-[17px] relative rounded-[99px] self-stretch shrink-0" data-name="div.badge">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">This Week</p>
      </div>
    </div>
  );
}

function DivBadge1() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[14.8px] pt-[13.2px] px-[17px] relative rounded-[99px] self-stretch shrink-0" data-name="div.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">All Time</p>
      </div>
    </div>
  );
}

function DivBadge2() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[14.8px] pt-[13.2px] px-[17px] relative rounded-[99px] self-stretch shrink-0" data-name="div.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">Friends</p>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20px]">All Languages</p>
        </div>
      </div>
    </div>
  );
}

function SelectSelect() {
  return (
    <div className="bg-[#1f1f1f] content-stretch flex items-center px-[17px] py-[13px] relative rounded-[8px] shrink-0" data-name="select.select">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div3 />
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="div">
      <SelectSelect />
    </div>
  );
}

function DivMargin() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-[129px] relative self-stretch" data-name="div:margin">
      <div className="flex flex-col items-end justify-center min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end justify-center min-w-[inherit] pl-[702.672px] relative size-full">
          <Div2 />
        </div>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="div.flex">
      <DivBadge />
      <DivBadge1 />
      <DivBadge2 />
      <DivMargin />
    </div>
  );
}

function DivAvatar1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[22px] shrink-0 size-[44px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 128, 255) 0%, rgb(0, 207, 255) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap">
        <p className="leading-[27.2px]">KR</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Kagiso R.</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">4,200 XP</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0" data-name="div">
      <Div5 />
      <Div6 />
    </div>
  );
}

function DivPodiumBlock() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#c0c0c0] h-[90px] items-center justify-center pb-[26.21px] pt-[24.79px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 to-[#a0a0a0] w-[100px]" data-name="div.podium-block">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[38.4px]">2</p>
      </div>
    </div>
  );
}

function DivPodiumPlace() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0" data-name="div.podium-place">
      <DivAvatar1 />
      <Div4 />
      <DivPodiumBlock />
    </div>
  );
}

function DivAvatar2() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[15.3px] pt-[14.7px] relative rounded-[36px] shrink-0 size-[72px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[26px] text-black text-center whitespace-nowrap">
        <p className="leading-[41.6px]">AM</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[32.67%] right-[32.65%] top-[-8px]" data-name="div">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[20px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[32px]">👑</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <DivAvatar2 />
      <Div8 />
    </div>
  );
}

function Div10() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px]">Amina M.</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1px] pb-[0.8px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">5,840 XP</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0" data-name="div">
      <Div10 />
      <Div11 />
    </div>
  );
}

function DivPodiumBlock1() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#bfff00] h-[120px] items-center justify-center pb-[41.21px] pt-[39.79px] relative rounded-tl-[8px] rounded-tr-[8px] shadow-[0px_0px_24px_0px_rgba(191,255,0,0.3),0px_0px_48px_0px_rgba(191,255,0,0.14)] shrink-0 to-[#8fef00] w-[100px]" data-name="div.podium-block">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[38.4px]">1</p>
      </div>
    </div>
  );
}

function DivPodiumPlace1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0" data-name="div.podium-place">
      <Div7 />
      <Div9 />
      <DivPodiumBlock1 />
    </div>
  );
}

function DivAvatar3() {
  return (
    <div className="relative rounded-[22px] shrink-0 size-[44px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 184, 0) 0%, rgb(255, 204, 0) 100%)" }}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[17px] text-black text-center top-[calc(50%-0.1px)] w-[48.979px]">
        <p className="leading-[27.2px] whitespace-pre-wrap">MH</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Marie H.</p>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">3,650 XP</p>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0" data-name="div">
      <Div13 />
      <Div14 />
    </div>
  );
}

function DivPodiumBlock2() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#ffb800] h-[70px] items-center justify-center pb-[16.21px] pt-[14.79px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 to-[#a06428] w-[100px]" data-name="div.podium-block">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[24px] text-black text-center whitespace-nowrap">
        <p className="leading-[38.4px]">3</p>
      </div>
    </div>
  );
}

function DivPodiumPlace2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0" data-name="div.podium-place">
      <DivAvatar3 />
      <Div12 />
      <DivPodiumBlock2 />
    </div>
  );
}

function PodiumTop() {
  return (
    <div className="content-stretch flex gap-[12px] items-end justify-center pt-[4px] relative shrink-0 w-full" data-name="Podium Top 3">
      <DivPodiumPlace />
      <DivPodiumPlace1 />
      <DivPodiumPlace2 />
    </div>
  );
}

function DivRankNum() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[28px]" data-name="div.rank-num">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[22.4px]">1</p>
      </div>
    </div>
  );
}

function DivAvatar4() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.41px)] w-[35.938px]">
        <p className="leading-[20.8px] whitespace-pre-wrap">AM</p>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Amina M.</p>
      </div>
    </div>
  );
}

function Div17() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">English · Level 12</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px pb-px relative" data-name="div">
      <Div16 />
      <Div17 />
    </div>
  );
}

function Div19() {
  return (
    <div className="content-stretch flex flex-col items-end mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">5,840 XP</p>
      </div>
    </div>
  );
}

function Div20() {
  return (
    <div className="content-stretch flex flex-col items-end mb-[-1px] pb-[0.59px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">🔥 14-day streak</p>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0" data-name="div">
      <Div19 />
      <Div20 />
    </div>
  );
}

function DivRankNum1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[28px]" data-name="div.rank-num">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[22.4px]">2</p>
      </div>
    </div>
  );
}

function DivAvatar5() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.9px] pt-[5.1px] relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 128, 255) 0%, rgb(0, 207, 255) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">KR</p>
      </div>
    </div>
  );
}

function Div22() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Kagiso R.</p>
      </div>
    </div>
  );
}

function Div23() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">Kinyarwanda · Level 10</p>
      </div>
    </div>
  );
}

function Div21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px pb-px relative" data-name="div">
      <Div22 />
      <Div23 />
    </div>
  );
}

function Div25() {
  return (
    <div className="content-stretch flex flex-col items-end mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">4,200 XP</p>
      </div>
    </div>
  );
}

function Div26() {
  return (
    <div className="content-stretch flex flex-col items-end mb-[-1px] pb-[0.59px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">🔥 9-day streak</p>
      </div>
    </div>
  );
}

function Div24() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0" data-name="div">
      <Div25 />
      <Div26 />
    </div>
  );
}

function DivRankNum2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[28px]" data-name="div.rank-num">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[22.4px]">3</p>
      </div>
    </div>
  );
}

function DivAvatar6() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 184, 0) 0%, rgb(255, 204, 0) 100%)" }}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.4px)] w-[37.503px]">
        <p className="leading-[20.8px] whitespace-pre-wrap">MH</p>
      </div>
    </div>
  );
}

function Div28() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Marie H.</p>
      </div>
    </div>
  );
}

function Div29() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">French · Level 9</p>
      </div>
    </div>
  );
}

function Div27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px pb-px relative" data-name="div">
      <Div28 />
      <Div29 />
    </div>
  );
}

function Div31() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">3,650 XP</p>
      </div>
    </div>
  );
}

function Div30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <Div31 />
    </div>
  );
}

function DivRankNum3() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[28px]" data-name="div.rank-num">
      <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[22.4px]">4</p>
      </div>
    </div>
  );
}

function DivAvatar7() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(127, 0, 255) 0%, rgb(0, 207, 255) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">PH</p>
      </div>
    </div>
  );
}

function Div33() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Patrick H.</p>
      </div>
    </div>
  );
}

function Div34() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">English · Level 8</p>
      </div>
    </div>
  );
}

function Div32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px pb-px relative" data-name="div">
      <Div33 />
      <Div34 />
    </div>
  );
}

function Div36() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">2,980 XP</p>
      </div>
    </div>
  );
}

function Div35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <Div36 />
    </div>
  );
}

function Div37() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-dashed border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pb-[6.19px] pt-[8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[19.2px]">· · · 12 more · · ·</p>
        </div>
      </div>
    </div>
  );
}

function DivRankNum4() {
  return (
    <div className="relative shrink-0 w-[28px]" data-name="div.rank-num">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[22.4px]">17</p>
        </div>
      </div>
    </div>
  );
}

function DivAvatar8() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative size-full">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
          <p className="leading-[20.8px]">JP</p>
        </div>
      </div>
    </div>
  );
}

function Div39() {
  return (
    <div className="font-['DM_Sans:SemiBold',sans-serif] font-semibold h-[22.39px] leading-[0] mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="-translate-y-1/2 absolute flex flex-col h-[23px] justify-center left-0 text-[14px] text-white top-[11px] w-[95.687px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">{`Jean Pierre H. `}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col h-[18px] justify-center left-[95.34px] text-[#bfff00] text-[11px] top-[12px] w-[28.208px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px] whitespace-pre-wrap">(You)</p>
      </div>
    </div>
  );
}

function Div40() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">English · Level 6</p>
      </div>
    </div>
  );
}

function Div38() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative w-full">
        <Div39 />
        <Div40 />
      </div>
    </div>
  );
}

function Div42() {
  return (
    <div className="content-stretch flex flex-col items-end mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">1,240 XP</p>
      </div>
    </div>
  );
}

function Div43() {
  return (
    <div className="content-stretch flex flex-col items-end mb-[-1px] pb-[0.59px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-right whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[17.6px]">🔥 7-day streak</p>
      </div>
    </div>
  );
}

function Div41() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative">
        <Div42 />
        <Div43 />
      </div>
    </div>
  );
}

function DivLbRow() {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] relative rounded-[8px] shrink-0 w-full" data-name="div.lb-row">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center pb-[14px] pt-[16px] px-[17px] relative w-full">
          <DivRankNum4 />
          <DivAvatar8 />
          <Div38 />
          <Div41 />
        </div>
      </div>
    </div>
  );
}

function FullList() {
  return (
    <div className="bg-[#151515] relative rounded-[14px] shrink-0 w-full" data-name="Full List">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-start pb-[23px] pt-[21px] px-[17px] relative w-full">
          <div className="relative rounded-[8px] shrink-0 w-full" data-name="Component 1">
            <div className="flex flex-row items-center size-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center px-[16px] py-[13px] relative w-full">
                <DivRankNum />
                <DivAvatar4 />
                <Div15 />
                <Div18 />
              </div>
            </div>
          </div>
          <div className="relative rounded-[8px] shrink-0 w-full" data-name="Component 1">
            <div className="flex flex-row items-center size-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center px-[16px] py-[13px] relative w-full">
                <DivRankNum1 />
                <DivAvatar5 />
                <Div21 />
                <Div24 />
              </div>
            </div>
          </div>
          <div className="relative rounded-[8px] shrink-0 w-full" data-name="Component 1">
            <div className="flex flex-row items-center size-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center px-[16px] py-[13px] relative w-full">
                <DivRankNum2 />
                <DivAvatar6 />
                <Div27 />
                <Div30 />
              </div>
            </div>
          </div>
          <div className="relative rounded-[8px] shrink-0 w-full" data-name="Component 1">
            <div className="flex flex-row items-center size-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center px-[16px] py-[13px] relative w-full">
                <DivRankNum3 />
                <DivAvatar7 />
                <Div32 />
                <Div35 />
              </div>
            </div>
          </div>
          <Div37 />
          <DivLbRow />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="main.main">
      <div className="overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col gap-[28px] items-start px-[40px] py-[36px] relative size-full">
          <DivPageHdr />
          <DivFlex1 />
          <PodiumTop />
          <FullList />
        </div>
      </div>
    </div>
  );
}

function DivAppWrap() {
  return (
    <div className="relative w-full" data-name="div.app-wrap">
      <MainMain />
    </div>
  );
}

export default function Component31Leaderboard() {
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
      <StudentLayout title="Leaderboard" subtitle="See how you rank among learners">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Leaderboard" subtitle="See how you rank among learners">
      <DivAppWrap />
    </StudentLayout>
  );
}