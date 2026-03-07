import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

// Screen ID component
function DivScreenId() {
  return (
    <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
        <p className="leading-[16px]">6.1 · Live Sessions List</p>
      </div>
    </div>
  );
}

// Logo components
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

function ALogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="cursor-pointer relative shrink-0" data-name="a.logo" onClick={onNavigate}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </div>
  );
}

// Nav components
function Div() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[20px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[32px]">🔔</p>
      </div>
    </div>
  );
}

function DivAvatar({ initials }: { initials: string }) {
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">{initials}</p>
      </div>
    </div>
  );
}

function DivFlex({ initials }: { initials: string }) {
  return (
    <div className="relative shrink-0" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Div />
        <DivAvatar initials={initials} />
      </div>
    </div>
  );
}

function NavNav({ onLogoClick, initials }: { onLogoClick?: () => void; initials: string }) {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo onNavigate={onLogoClick} />
          <DivFlex initials={initials} />
        </div>
      </div>
    </div>
  );
}

// Sidebar Link component
function SidebarLink({ to, icon, label, active }: { to: string; icon: string; label: string; active?: boolean }) {
  return (
    <Link to={to} className={`relative shrink-0 w-full block ${active ? 'bg-[rgba(191,255,0,0.1)]' : ''}`}>
      <div aria-hidden="true" className={`absolute border-l-2 border-solid inset-0 pointer-events-none ${active ? 'border-[#bfff00]' : 'border-[rgba(0,0,0,0)]'}`} />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
              <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400", color: active ? '#bfff00' : '#888' }}>
                <p className="leading-[22.4px]">{icon}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14", color: active ? '#bfff00' : '#888' }}>
            <p className="leading-[22.4px]">{label}</p>
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
        <SidebarLink to="/dashboard" icon="⚡" label="Dashboard" />
        <SidebarLink to="/courses" icon="📚" label="My Courses" />
        <SidebarLink to="/practice" icon="🎯" label="Practice" />
        <SidebarLink to="/live-sessions" icon="🎥" label="Live Sessions" active={true} />
        <SidebarLink to="/community" icon="🌍" label="Community" />
        <SidebarLink to="/profile" icon="👤" label="Profile" />
      </div>
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

// Page header components
function Div1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-white tracking-[-0.64px] uppercase whitespace-nowrap">
        <p className="text-[32px]">
          <span className="leading-[51.2px] text-white">{`Live `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Sessions</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Join real-time classes with certified instructors</p>
      </div>
    </div>
  );
}

function DivPageHdr() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="div.page-hdr">
      <Div1 />
      <P />
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center px-[24px] py-[11px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-center tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">+ Schedule Session</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[40px] right-[40px] top-[36px]" data-name="div.flex">
      <DivPageHdr />
      <ButtonBtn />
    </div>
  );
}

// Live session card components
function LiveNow() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[40px] right-[40px] top-[137.58px]" data-name="Live Now">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00cfff] text-[10px] tracking-[1.5px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">🔴 Live Now · 2 Sessions</p>
      </div>
    </div>
  );
}

function SpanLiveBadge() {
  return (
    <div className="h-[17.59px] relative shrink-0 w-[71.89px]" data-name="span.live-badge">
      <div className="-translate-y-1/2 absolute bg-[#00cfff] left-0 rounded-[3px] shadow-[0px_0px_6px_0px_#00cfff] size-[6px] top-[calc(50%-0.01px)]" data-name="::before" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold h-[18px] justify-center leading-[0] left-[12px] text-[#00cfff] text-[11px] top-[calc(50%-0.8px)] tracking-[0.88px] uppercase w-[60.274px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px] whitespace-pre-wrap">Live Now</p>
      </div>
    </div>
  );
}

function Span6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">47 watching</p>
      </div>
    </div>
  );
}

function DivFlex2() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div.flex">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
          <SpanLiveBadge />
          <Span6 />
        </div>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[17px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[27.2px] whitespace-pre-wrap">Business English Masterclass</p>
        </div>
      </div>
    </div>
  );
}

function DivAvatar1() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold h-[21px] justify-center leading-[0] left-[calc(50%+0.16px)] text-[13px] text-black text-center top-[calc(50%-0.4px)] w-[36.65px]">
        <p className="leading-[20.8px] whitespace-pre-wrap">MK</p>
      </div>
    </div>
  );
}

function Span7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Dr. Mary K.</p>
      </div>
    </div>
  );
}

function DivFlex3() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pt-[8.99px] relative w-full">
        <DivAvatar1 />
        <Span7 />
      </div>
    </div>
  );
}

function SpanBadge() {
  return (
    <div className="bg-[rgba(0,207,255,0.1)] content-stretch flex items-center pb-[5.59px] pt-[4px] px-[12px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#00cfff] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">🇬🇧 English</p>
      </div>
    </div>
  );
}

function SpanBadge1() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[5.59px] pt-[4px] px-[13px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">Intermediate</p>
      </div>
    </div>
  );
}

function DivFlex4() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start pb-[17.01px] pt-px relative w-full">
        <SpanBadge />
        <SpanBadge1 />
      </div>
    </div>
  );
}

function ButtonBtn1() {
  return (
    <div className="bg-[#bfff00] mb-[-1px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 w-full" data-name="button.btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[7px] relative w-full">
          <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[normal]">Join Now →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DivSessionCard() {
  return (
    <div className="bg-[rgba(0,207,255,0.03)] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="div.session-card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,207,255,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start pb-[24px] pt-[22px] px-[23px] relative size-full">
        <DivFlex2 />
        <Div2 />
        <DivFlex3 />
        <DivFlex4 />
        <ButtonBtn1 />
      </div>
    </div>
  );
}

// Second live session card
function SpanLiveBadge1() {
  return (
    <div className="h-[17.59px] relative shrink-0 w-[71.89px]" data-name="span.live-badge">
      <div className="-translate-y-1/2 absolute bg-[#00cfff] left-0 rounded-[3px] shadow-[0px_0px_6px_0px_#00cfff] size-[6px] top-[calc(50%-0.01px)]" data-name="::before" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold h-[18px] justify-center leading-[0] left-[12px] text-[#00cfff] text-[11px] top-[calc(50%-0.8px)] tracking-[0.88px] uppercase w-[60.274px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px] whitespace-pre-wrap">Live Now</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">23 watching</p>
      </div>
    </div>
  );
}

function DivFlex5() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <SpanLiveBadge1 />
        <Span8 />
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[17px] text-white w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[27.2px] whitespace-pre-wrap">Kinyarwanda Conversation Club</p>
        </div>
      </div>
    </div>
  );
}

function DivAvatar2() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.9px] pt-[5.1px] relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">JN</p>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Prof. Jean N.</p>
      </div>
    </div>
  );
}

function DivFlex6() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pt-[8.99px] relative w-full">
        <DivAvatar2 />
        <Span9 />
      </div>
    </div>
  );
}

function SpanBadge2() {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center pb-[5.59px] pt-[4px] px-[13px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">🇷🇼 Kinyarwanda</p>
      </div>
    </div>
  );
}

function SpanBadge3() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[5.59px] pt-[4px] px-[13px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">Beginner</p>
      </div>
    </div>
  );
}

function DivFlex7() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start pb-[17.01px] pt-px relative w-full">
        <SpanBadge2 />
        <SpanBadge3 />
      </div>
    </div>
  );
}

function ButtonBtn2() {
  return (
    <div className="bg-[#bfff00] mb-[-1px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 w-full" data-name="button.btn">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[7px] relative w-full">
          <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[normal]">Join Now →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DivSessionCard1() {
  return (
    <div className="bg-[rgba(0,207,255,0.03)] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] self-stretch" data-name="div.session-card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,207,255,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start pb-[24px] pt-[22px] px-[23px] relative size-full">
        <DivFlex5 />
        <Div3 />
        <DivFlex6 />
        <DivFlex7 />
        <ButtonBtn2 />
      </div>
    </div>
  );
}

function DivSessionsGrid() {
  return (
    <div className="absolute content-stretch flex gap-[18px] items-start justify-center left-[40px] right-[40px] top-[161.58px]" data-name="div.sessions-grid">
      <DivSessionCard />
      <DivSessionCard1 />
    </div>
  );
}

// Upcoming sessions
function Upcoming() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[40px] right-[40px] top-[368.55px]" data-name="Upcoming">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1.5px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Upcoming Sessions</p>
      </div>
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px overflow-x-clip overflow-y-auto relative self-stretch" data-name="main.main">
      <DivFlex1 />
      <LiveNow />
      <DivSessionsGrid />
      <Upcoming />
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

export default function Component20LiveSessionsList() {
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
    return 'U';
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start justify-center min-h-screen relative size-full">
        <div className="flex items-center justify-center">
          <div className="text-[#bfff00] text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="20-live-sessions-list">
      <DivScreenId />
      <NavNav onLogoClick={handleLogoClick} initials={getUserInitials()} />
      <DivAppWrap />
    </div>
  );
}
