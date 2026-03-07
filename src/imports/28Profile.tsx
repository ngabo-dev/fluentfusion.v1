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
    <Link to="/dashboard" className="cursor-pointer relative shrink-0 w-full" data-name="a.sidebar-item">
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
    <Link to="/courses" className="cursor-pointer relative shrink-0 w-full" data-name="a.sidebar-item">
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
    <Link to="/practice" className="cursor-pointer relative shrink-0 w-full" data-name="a.sidebar-item">
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
    <Link to="/live" className="cursor-pointer relative shrink-0 w-full" data-name="a.sidebar-item">
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
    <Link to="/community" className="cursor-pointer relative shrink-0 w-full" data-name="a.sidebar-item">
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
          <p className="leading-[22.4px]">👤</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem5() {
  return (
    <Link to="/profile" className="bg-[rgba(191,255,0,0.1)] cursor-pointer relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span5 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Profile</p>
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
          <p className="leading-[22.4px]">⚙️</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem6() {
  return (
    <Link to="/settings" className="cursor-pointer relative shrink-0 w-full" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span6 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Settings</p>
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
          <span className="leading-[51.2px] text-white">{`My `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Profile</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Manage your public profile and learning identity</p>
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
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[123px]" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[22px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[35.2px]">Jean Pierre H.</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 pb-[0.8px] right-0 top-[162.19px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">{`Kigali, Rwanda · Learning English & French`}</p>
      </div>
    </div>
  );
}

function SpanBadge() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center justify-center pb-[5.59px] pt-[4px] px-[13px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">🎓 Student</p>
      </div>
    </div>
  );
}

function SpanBadge1() {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center justify-center pb-[5.59px] pt-[4px] px-[13px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] text-center tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">Level 6</p>
      </div>
    </div>
  );
}

function SpanBadge2() {
  return (
    <div className="bg-[rgba(255,184,0,0.1)] content-stretch flex items-center justify-center pb-[5.59px] pt-[4px] px-[12px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#ffb800] text-[11px] text-center tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">🔥 7-Day Streak</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-0 right-0 top-[183.98px]" data-name="div.flex">
      <SpanBadge />
      <SpanBadge1 />
      <SpanBadge2 />
    </div>
  );
}

function DivAvatar1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[48px] shrink-0 size-[96px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[34px] text-black text-center whitespace-nowrap">
        <p className="leading-[54.4px]">JP</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="absolute bg-[#bfff00] bottom-[2px] content-stretch flex items-center justify-center p-[2px] right-[2px] rounded-[14px] size-[28px]" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#0a0a0a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[22.4px]">✏️</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-[201px] top-[12px]" data-name="div">
      <DivAvatar1 />
      <Div6 />
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute h-[235.58px] left-[25px] right-[25px] top-[25px]" data-name="div">
      <Div3 />
      <Div4 />
      <DivFlex1 />
      <Div5 />
    </div>
  );
}

function LabelLabel() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Full Name</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Jean Pierre Habimana</p>
        </div>
      </div>
    </div>
  );
}

function InputInput() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[17px] py-[13px] relative w-full">
          <Div7 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-start left-[25px] right-[25px] top-[309.58px]" data-name="div.form-group">
      <LabelLabel />
      <InputInput />
    </div>
  );
}

function LabelLabel1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Bio</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[normal] relative shrink-0 text-[15px] text-white w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="mb-0">{`Tourism worker based in Kigali, learning English to better serve `}</p>
          <p>international guests at my hotel.</p>
        </div>
      </div>
    </div>
  );
}

function TextareaInput() {
  return (
    <div className="bg-[#1f1f1f] min-h-[72px] relative rounded-[8px] shrink-0 w-full" data-name="textarea.input">
      <div className="flex flex-row justify-center min-h-[inherit] overflow-auto size-full">
        <div className="content-stretch flex items-start justify-center min-h-[inherit] pb-[19px] pt-[13px] px-[17px] relative w-full">
          <Div8 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-start left-[25px] pb-[7px] right-[25px] top-[396.58px]" data-name="div.form-group">
      <LabelLabel1 />
      <TextareaInput />
    </div>
  );
}

function LabelLabel2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Location</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Kigali, Rwanda</p>
        </div>
      </div>
    </div>
  );
}

function InputInput1() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[17px] py-[13px] relative w-full">
          <Div9 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-start left-[25px] right-[25px] top-[516.58px]" data-name="div.form-group">
      <LabelLabel2 />
      <InputInput1 />
    </div>
  );
}

function LabelLabel3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Native Language</p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20px] whitespace-pre-wrap">🇷🇼 Kinyarwanda</p>
        </div>
      </div>
    </div>
  );
}

function SelectSelect() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="select.select">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[17px] py-[13px] relative w-full">
          <Div10 />
        </div>
      </div>
    </div>
  );
}

function DivFormGroup3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-h-px min-w-px relative w-full" data-name="div.form-group">
      <LabelLabel3 />
      <SelectSelect />
    </div>
  );
}

function DivFormGroupMargin() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px pb-[18px] relative self-stretch" data-name="div.form-group:margin">
      <DivFormGroup3 />
    </div>
  );
}

function LabelLabel4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Learning</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20px] whitespace-pre-wrap">🇬🇧 English</p>
        </div>
      </div>
    </div>
  );
}

function SelectSelect1() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="select.select">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[17px] py-[13px] relative w-full">
          <Div11 />
        </div>
      </div>
    </div>
  );
}

function DivFormGroup4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-h-px min-w-px relative w-full" data-name="div.form-group">
      <LabelLabel4 />
      <SelectSelect1 />
    </div>
  );
}

function DivFormGroupMargin1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px pb-[18px] relative self-stretch" data-name="div.form-group:margin">
      <DivFormGroup4 />
    </div>
  );
}

function DivGrid1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start justify-center left-[25px] right-[25px] top-[603.58px]" data-name="div.grid-2">
      <DivFormGroupMargin />
      <DivFormGroupMargin1 />
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="absolute bg-[#bfff00] content-stretch flex items-center justify-center left-[25px] px-[24px] py-[11px] right-[25px] rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] top-[690.58px]" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-center tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Save Profile</p>
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="bg-[#151515] flex-[1_0_0] h-[755.58px] min-h-px min-w-px relative rounded-[14px]" data-name="Profile Card">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Div2 />
        <div className="absolute bg-[#2a2a2a] h-px left-[25px] right-[25px] top-[284.58px]" data-name="div.divider" />
        <DivFormGroup />
        <DivFormGroup1 />
        <DivFormGroup2 />
        <DivGrid1 />
        <ButtonBtn />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Div13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] pb-[0.8px] right-[25px] top-[24px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-white tracking-[0.65px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Learning Stats</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[28px] text-center whitespace-nowrap">
          <p className="leading-[44.8px]">1,240</p>
        </div>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[19.2px]">XP Points</p>
        </div>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col gap-[2.99px] items-start left-0 p-[17px] right-[255px] rounded-[14px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Div15 />
      <Div16 />
    </div>
  );
}

function Div18() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[28px] text-center whitespace-nowrap">
          <p className="leading-[44.8px]">24</p>
        </div>
      </div>
    </div>
  );
}

function Div19() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[19.2px]">Lessons Done</p>
        </div>
      </div>
    </div>
  );
}

function Div17() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col gap-[2.99px] items-start left-[255px] p-[17px] right-0 rounded-[14px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Div18 />
      <Div19 />
    </div>
  );
}

function Div21() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[28px] text-center whitespace-nowrap">
          <p className="leading-[44.8px]">87%</p>
        </div>
      </div>
    </div>
  );
}

function Div22() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[19.2px]">Avg Score</p>
        </div>
      </div>
    </div>
  );
}

function Div20() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col gap-[3px] items-start left-0 p-[17px] right-[255px] rounded-[14px] top-[113.98px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Div21 />
      <Div22 />
    </div>
  );
}

function Div24() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[28px] text-center whitespace-nowrap">
          <p className="leading-[44.8px]">8</p>
        </div>
      </div>
    </div>
  );
}

function Div25() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[19.2px]">Badges Earned</p>
        </div>
      </div>
    </div>
  );
}

function Div23() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col gap-[3px] items-start left-[255px] p-[17px] right-0 rounded-[14px] top-[113.98px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Div24 />
      <Div25 />
    </div>
  );
}

function DivGrid2() {
  return (
    <div className="absolute h-[215.97px] left-[25px] right-[25px] top-[61.8px]" data-name="div.grid-2">
      <Div14 />
      <Div17 />
      <Div20 />
      <Div23 />
    </div>
  );
}

function Span7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Level 6 → Level 7</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">1,240 / 2,000 XP</p>
      </div>
    </div>
  );
}

function DivFlex2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.flex">
      <Span7 />
      <Span8 />
    </div>
  );
}

function DivProgressTrack() {
  return (
    <div className="bg-[#2a2a2a] h-[6px] overflow-clip relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_38%_0_0] rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] to-[#bfff00]" data-name="div.progress-fill" />
    </div>
  );
}

function Div26() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] right-[25px] top-[292.76px]" data-name="div">
      <DivFlex2 />
      <DivProgressTrack />
    </div>
  );
}

function Stats() {
  return (
    <div className="bg-[#151515] h-[343.95px] relative rounded-[14px] shrink-0 w-full" data-name="Stats">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Div13 />
        <DivGrid2 />
        <Div26 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.22)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Div27() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-white tracking-[0.65px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">Languages</p>
        </div>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[24px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[38.4px]">🇷🇼</p>
        </div>
      </div>
    </div>
  );
}

function Div30() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Kinyarwanda</p>
      </div>
    </div>
  );
}

function Div31() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">Native</p>
      </div>
    </div>
  );
}

function Div29() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative w-full">
        <Div30 />
        <Div31 />
      </div>
    </div>
  );
}

function Div28() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center p-[13px] relative w-full">
          <Span9 />
          <Div29 />
        </div>
      </div>
    </div>
  );
}

function Span10() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[24px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[38.4px]">🇬🇧</p>
        </div>
      </div>
    </div>
  );
}

function Div34() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">English</p>
      </div>
    </div>
  );
}

function Div35() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">Learning · Intermediate</p>
      </div>
    </div>
  );
}

function Div33() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative w-full">
        <Div34 />
        <Div35 />
      </div>
    </div>
  );
}

function DivProgressTrack1() {
  return (
    <div className="bg-[#2a2a2a] h-[6px] overflow-clip relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_38.01%_0_0] rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] to-[#bfff00]" data-name="div.progress-fill" />
    </div>
  );
}

function Div36() {
  return (
    <div className="relative shrink-0 w-[80px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <DivProgressTrack1 />
      </div>
    </div>
  );
}

function Div32() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[13px] pt-[11px] px-[13px] relative w-full">
          <Span10 />
          <Div33 />
          <Div36 />
        </div>
      </div>
    </div>
  );
}

function Span11() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[24px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[38.4px]">🇫🇷</p>
        </div>
      </div>
    </div>
  );
}

function Div39() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.99px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">French</p>
      </div>
    </div>
  );
}

function Div40() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.99px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px] whitespace-pre-wrap">Learning · Beginner</p>
      </div>
    </div>
  );
}

function Div38() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.99px] relative w-full">
        <Div39 />
        <Div40 />
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

function Div41() {
  return (
    <div className="relative shrink-0 w-[80px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <DivProgressTrack2 />
      </div>
    </div>
  );
}

function Div37() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[13px] pt-[10.99px] px-[13px] relative w-full">
          <Span11 />
          <Div38 />
          <Div41 />
        </div>
      </div>
    </div>
  );
}

function Languages() {
  return (
    <div className="bg-[#151515] relative rounded-[14px] shrink-0 w-full" data-name="Languages">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[14px] items-start pb-[25px] pt-[24px] px-[25px] relative w-full">
          <Div27 />
          <Div28 />
          <Div32 />
          <Div37 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Div12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px pb-[16px] relative" data-name="div">
      <Stats />
      <Languages />
    </div>
  );
}

function DivGrid() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="div.grid-2">
      <ProfileCard />
      <Div12 />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="main.main">
      <div className="overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col gap-[28px] items-start px-[40px] py-[36px] relative size-full">
          <DivPageHdr />
          <DivGrid />
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

export default function Component28Profile() {
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
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="28-profile">
      <NavNav userInitials={userInitials} />
      <DivAppWrap />
    </div>
  );
}