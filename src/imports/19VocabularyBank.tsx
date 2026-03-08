import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

function DivScreenId() {
  return (
    <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
        <p className="leading-[16px]">5.4 · Vocabulary Bank</p>
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
        <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="Component 1">
          <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[28.8px]">🧠</p>
          </div>
        </div>
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
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
        <SidebarLink to="/practice" icon="🎯" label="Practice" active={true} />
        <SidebarLink to="/live-sessions" icon="🎥" label="Live Sessions" />
        <SidebarLink to="/community" icon="🌍" label="Community" />
        <SidebarLink to="/profile" icon="👤" label="Profile" />
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
          <span className="leading-[51.2px] text-white">{`Vocabulary `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Bank</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">All your saved words in one place</p>
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

function DivPlaceholder() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Search saved words...</p>
        </div>
      </div>
    </div>
  );
}

function InputInput() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[45px] pr-[17px] py-[13px] relative w-full">
          <DivPlaceholder />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function SpanInputIcon() {
  return (
    <div className="absolute bottom-[22.2%] content-stretch flex flex-col items-start left-[14px] top-[22.17%]" data-name="span.input-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[25.6px]">🔍</p>
      </div>
    </div>
  );
}

function DivInputIconWrap() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[360px] relative shrink-0 w-[360px]" data-name="div.input-icon-wrap">
      <InputInput />
      <SpanInputIcon />
    </div>
  );
}

function Div2() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[21.44px] relative rounded-[inherit]">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20px]">All Languages</p>
        </div>
      </div>
    </div>
  );
}

function SelectSelect() {
  return (
    <div className="bg-[#1f1f1f] content-stretch flex flex-col items-start justify-center min-w-[150px] px-[17px] py-[13px] relative rounded-[8px] shrink-0" data-name="select.select">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div2 />
    </div>
  );
}

function Div3() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[20.34px] relative rounded-[inherit]">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20px]">All Categories</p>
        </div>
      </div>
    </div>
  );
}

function SelectSelect1() {
  return (
    <div className="bg-[#1f1f1f] content-stretch flex flex-col items-start justify-center min-w-[150px] px-[17px] py-[13px] relative rounded-[8px] shrink-0" data-name="select.select">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div3 />
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center px-[16px] py-[7px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">+ Add Word</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[40px] right-[40px] top-[141.58px]" data-name="div.flex">
      <DivInputIconWrap />
      <SelectSelect />
      <SelectSelect1 />
      <ButtonBtn />
    </div>
  );
}

function SpanBadge() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[7.59px] pt-[6px] px-[15px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">All (124)</p>
      </div>
    </div>
  );
}

function SpanBadge1() {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center pb-[7.59px] pt-[6px] px-[15px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">Bookmarked (28)</p>
      </div>
    </div>
  );
}

function SpanBadge2() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] content-stretch flex items-center pb-[7.59px] pt-[6px] px-[15px] relative rounded-[99px] self-stretch shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">Review (14)</p>
      </div>
    </div>
  );
}

function DivFlex2() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[40px] right-[40px] top-[187.58px]" data-name="div.flex">
      <SpanBadge />
      <SpanBadge1 />
      <SpanBadge2 />
    </div>
  );
}

function Span6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Showing 1–20 of 124 words</p>
      </div>
    </div>
  );
}

function ButtonBtn1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">← Prev</p>
      </div>
    </div>
  );
}

function ButtonBtn2() {
  return (
    <div className="content-stretch flex items-center justify-center px-[17px] py-[8px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#bfff00] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function ButtonBtn3() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function ButtonBtn4() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function ButtonBtn5() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Next →</p>
      </div>
    </div>
  );
}

function DivFlex4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="div.flex">
      <ButtonBtn1 />
      <ButtonBtn2 />
      <ButtonBtn3 />
      <ButtonBtn4 />
      <ButtonBtn5 />
    </div>
  );
}

function DivFlex3() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[40px] right-[40px] top-[563.17px]" data-name="div.flex">
      <Span6 />
      <DivFlex4 />
    </div>
  );
}

function Th() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[16px] relative shrink-0 w-[169.69px]" data-name="th">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Word</p>
      </div>
    </div>
  );
}

function Th1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[16px] relative shrink-0 w-[177.58px]" data-name="th">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Translation</p>
      </div>
    </div>
  );
}

function Th2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[16px] relative shrink-0 w-[196.89px]" data-name="th">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Category</p>
      </div>
    </div>
  );
}

function Th3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[16px] relative shrink-0 w-[287.44px]" data-name="th">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Notes</p>
      </div>
    </div>
  );
}

function Th4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[16px] relative shrink-0 w-[190.58px]" data-name="th">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Mastery</p>
      </div>
    </div>
  );
}

function Tr() {
  return (
    <div className="relative shrink-0 w-full" data-name="tr">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
        <Th />
        <Th1 />
        <Th2 />
        <Th3 />
        <Th4 />
        <div className="h-[40.5px] relative shrink-0 w-[95.83px]" data-name="th">
          <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function DivKinyarwandaWord() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.kinyarwanda-word">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[16px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[25.6px] whitespace-pre-wrap">Muraho</p>
        </div>
      </div>
    </div>
  );
}

function Td() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15.7px] pt-[15.71px] px-[16px] relative shrink-0 w-[169.69px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivKinyarwandaWord />
    </div>
  );
}

function Td1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[177.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Hello</p>
      </div>
    </div>
  );
}

function SpanBadge3() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] relative rounded-[99px] shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[13px] py-[5px] relative">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[17.6px]">Greetings</p>
        </div>
      </div>
    </div>
  );
}

function Td2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[196.89px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <SpanBadge3 />
    </div>
  );
}

function Div4() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Most common greeting</p>
        </div>
      </div>
    </div>
  );
}

function Td3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[19.7px] pt-[20.3px] px-[16px] relative shrink-0 w-[287.44px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Div4 />
    </div>
  );
}

function Div5() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative w-full">
        <div className="flex flex-[1_0_0] flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px relative text-[14px] text-white" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">⭐⭐⭐⭐⭐</p>
        </div>
      </div>
    </div>
  );
}

function Td4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[190.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Div5 />
    </div>
  );
}

function Td5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[95.83px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="relative rounded-[6px] shrink-0 size-[28px]" data-name="Component 1">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
          <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[22.4px]">🔖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DivKinyarwandaWord1() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.kinyarwanda-word">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[16px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[25.6px] whitespace-pre-wrap">Murakoze</p>
        </div>
      </div>
    </div>
  );
}

function Td6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15.7px] pt-[15.71px] px-[16px] relative shrink-0 w-[169.69px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivKinyarwandaWord1 />
    </div>
  );
}

function Td7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[177.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Thank you</p>
      </div>
    </div>
  );
}

function SpanBadge4() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] relative rounded-[99px] shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[13px] py-[5px] relative">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[17.6px]">Greetings</p>
        </div>
      </div>
    </div>
  );
}

function Td8() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[196.89px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <SpanBadge4 />
    </div>
  );
}

function Div6() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{`Add 'cyane' for emphasis`}</p>
        </div>
      </div>
    </div>
  );
}

function Td9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[19.7px] pt-[20.3px] px-[16px] relative shrink-0 w-[287.44px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Div6 />
    </div>
  );
}

function Div7() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative w-full">
        <div className="flex flex-[1_0_0] flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px relative text-[14px] text-white" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">⭐⭐⭐⭐☆</p>
        </div>
      </div>
    </div>
  );
}

function Td10() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[190.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Div7 />
    </div>
  );
}

function Td11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[95.83px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="relative rounded-[6px] shrink-0 size-[28px]" data-name="Component 1">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
          <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[22.4px]">🔖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DivKinyarwandaWord2() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.kinyarwanda-word">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[16px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[25.6px] whitespace-pre-wrap">Resitora</p>
        </div>
      </div>
    </div>
  );
}

function Td12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15.7px] pt-[15.71px] px-[16px] relative shrink-0 w-[169.69px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivKinyarwandaWord2 />
    </div>
  );
}

function Td13() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[177.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Restaurant</p>
      </div>
    </div>
  );
}

function SpanBadge5() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] relative rounded-[99px] shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[13px] py-[5px] relative">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[17.6px]">Places</p>
        </div>
      </div>
    </div>
  );
}

function Td14() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[196.89px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <SpanBadge5 />
    </div>
  );
}

function DivPlaceholder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Add a note...</p>
        </div>
      </div>
    </div>
  );
}

function Td15() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[19.7px] pt-[20.3px] px-[16px] relative shrink-0 w-[287.44px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivPlaceholder1 />
    </div>
  );
}

function Div8() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative w-full">
        <div className="flex flex-[1_0_0] flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px relative text-[14px] text-white" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">⭐⭐⭐☆☆</p>
        </div>
      </div>
    </div>
  );
}

function Td16() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[190.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Div8 />
    </div>
  );
}

function Td17() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[95.83px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="relative rounded-[6px] shrink-0 size-[28px]" data-name="Component 1">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
          <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[22.4px]">🔖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DivKinyarwandaWord3() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.kinyarwanda-word">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[16px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[25.6px] whitespace-pre-wrap">Akarito</p>
        </div>
      </div>
    </div>
  );
}

function Td18() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15.7px] pt-[15.71px] px-[16px] relative shrink-0 w-[169.69px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivKinyarwandaWord3 />
    </div>
  );
}

function Td19() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[177.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Market</p>
      </div>
    </div>
  );
}

function SpanBadge6() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] relative rounded-[99px] shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[13px] py-[5px] relative">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[17.6px]">Places</p>
        </div>
      </div>
    </div>
  );
}

function Td20() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[196.89px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <SpanBadge6 />
    </div>
  );
}

function DivPlaceholder2() {
  return (
    <div className="relative shrink-0 w-full" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Add a note...</p>
        </div>
      </div>
    </div>
  );
}

function Td21() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[19.7px] pt-[20.3px] px-[16px] relative shrink-0 w-[287.44px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivPlaceholder2 />
    </div>
  );
}

function Div9() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative w-full">
        <div className="flex flex-[1_0_0] flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[14px] text-white" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">⭐⭐☆☆☆</p>
        </div>
      </div>
    </div>
  );
}

function Td22() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[190.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Div9 />
    </div>
  );
}

function Td23() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[95.83px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="relative rounded-[6px] shrink-0 size-[28px]" data-name="Component 1">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
          <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[22.4px]">🔖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DivKinyarwandaWord4() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.kinyarwanda-word">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[16px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[25.6px] whitespace-pre-wrap">Igifu</p>
        </div>
      </div>
    </div>
  );
}

function Td24() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15.7px] pt-[15.71px] px-[16px] relative shrink-0 w-[169.69px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivKinyarwandaWord4 />
    </div>
  );
}

function Td25() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[177.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Food / Meal</p>
      </div>
    </div>
  );
}

function SpanBadge7() {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] relative rounded-[99px] shrink-0" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[13px] py-[5px] relative">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[17.6px]">Food</p>
        </div>
      </div>
    </div>
  );
}

function Td26() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[196.89px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <SpanBadge7 />
    </div>
  );
}

function DivPlaceholder3() {
  return (
    <div className="relative shrink-0 w-full" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Add a note...</p>
        </div>
      </div>
    </div>
  );
}

function Td27() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[19.7px] pt-[20.3px] px-[16px] relative shrink-0 w-[287.44px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivPlaceholder3 />
    </div>
  );
}

function Div10() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative w-full">
        <div className="flex flex-[1_0_0] flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[14px] text-white" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">⭐☆☆☆☆</p>
        </div>
      </div>
    </div>
  );
}

function Td28() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[17.2px] pt-[16.8px] px-[16px] relative shrink-0 w-[190.58px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Div10 />
    </div>
  );
}

function Td29() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pt-[14px] px-[16px] relative shrink-0 w-[95.83px]" data-name="td">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="relative rounded-[6px] shrink-0 size-[28px]" data-name="Component 1">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
          <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[22.4px]">🔖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DivCard() {
  return (
    <div className="absolute bg-[#151515] left-[40px] right-[40px] rounded-[14px] top-[219.17px]" data-name="div.card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Tr />
        <div className="relative shrink-0 w-full" data-name="Component 2">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
            <Td />
            <Td1 />
            <Td2 />
            <Td3 />
            <Td4 />
            <Td5 />
          </div>
        </div>
        <div className="relative shrink-0 w-full" data-name="Component 2">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
            <Td6 />
            <Td7 />
            <Td8 />
            <Td9 />
            <Td10 />
            <Td11 />
          </div>
        </div>
        <div className="relative shrink-0 w-full" data-name="Component 2">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
            <Td12 />
            <Td13 />
            <Td14 />
            <Td15 />
            <Td16 />
            <Td17 />
          </div>
        </div>
        <div className="relative shrink-0 w-full" data-name="Component 3">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
            <Td18 />
            <Td19 />
            <Td20 />
            <Td21 />
            <Td22 />
            <Td23 />
          </div>
        </div>
        <div className="relative shrink-0 w-full" data-name="Component 3">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
            <Td24 />
            <Td25 />
            <Td26 />
            <Td27 />
            <Td28 />
            <Td29 />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px overflow-x-clip overflow-y-auto relative self-stretch" data-name="main.main">
      <DivPageHdr />
      <DivFlex1 />
      <DivFlex2 />
      <DivFlex3 />
      <DivCard />
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

export default function Component19VocabularyBank() {
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
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="19-vocabulary-bank">
      <DivScreenId />
      <NavNav onLogoClick={handleLogoClick} initials={getUserInitials()} />
      <DivAppWrap />
    </div>
  );
}
