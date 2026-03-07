import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { authApi, practiceApi } from '../app/api/config';
import Sidebar from '../app/components/Sidebar';

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

function ALogo() {
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

function Span() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Card 8 of 24</p>
      </div>
    </div>
  );
}

function DivProgressTrack() {
  return (
    <div className="bg-[#2a2a2a] h-[6px] overflow-clip relative rounded-[99px] shrink-0 w-full" data-name="div.progress-track">
      <div className="absolute bg-gradient-to-r from-[#8fef00] inset-[0_67%_0_0] rounded-[99px] shadow-[0px_0px_8px_0px_rgba(191,255,0,0.4)] to-[#bfff00]" data-name="div.progress-fill" />
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[100px]" data-name="div">
      <DivProgressTrack />
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div.flex">
      <Span />
      <Div />
    </div>
  );
}

function DivAvatar() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative rounded-[16px] shrink-0 size-[32px]" data-name="div.avatar" style={{ backgroundImage: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-black text-center whitespace-nowrap">
        <p className="leading-[20.8px]">JP</p>
      </div>
    </div>
  );
}

function DivFlex() {
  return (
    <div className="relative shrink-0" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <DivFlex1 />
        <DivAvatar />
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

function Span1() {
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
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/16-flashcards.html">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span1 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Dashboard</p>
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

function ASidebarItem1() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/16-flashcards.html">
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
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🎯</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem2() {
  return (
    <a className="bg-[rgba(191,255,0,0.1)] relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/16-flashcards.html">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span3 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
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

function ASidebarItem3() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/16-flashcards.html">
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

function ASidebarItem4() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/16-flashcards.html">
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

function ASidebarItem5() {
  return (
    <a className="relative shrink-0 w-full" data-name="a.sidebar-item" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/16-flashcards.html">
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

function DivMargin({ current, total }: { current?: number; total?: number }) {
  return (
    <div className="h-[37.59px] relative shrink-0 w-[316.83px]" data-name="div:margin">
      <div className="-translate-y-1/2 absolute flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal h-[18px] justify-center leading-[0] left-0 text-[#888] text-[11px] top-[8px] tracking-[1.32px] uppercase w-[317.153px]">
        <p className="leading-[17.6px] whitespace-pre-wrap">Tap card to flip · Kinyarwanda → English</p>
      </div>
    </div>
  );
}

function DivMargin1() {
  return (
    <div className="relative shrink-0" data-name="div:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">Kinyarwanda</p>
        </div>
      </div>
    </div>
  );
}

function DivCardWordMargin() {
  return (
    <div className="relative shrink-0" data-name="div.card-word:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[48px] text-shadow-[0px_0px_24px_rgba(191,255,0,0.28),0px_0px_12px_rgba(191,255,0,0.55)] uppercase whitespace-nowrap">
          <p className="leading-[76.8px]">Murakoze</p>
        </div>
      </div>
    </div>
  );
}

function DivCardHint() {
  return (
    <div className="relative shrink-0" data-name="div.card-hint">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[22.4px]">Tap to reveal translation →</p>
        </div>
      </div>
    </div>
  );
}

function DivFlashcardFront({ onClick }: { onClick?: () => void }) {
  return (
    <div onClick={onClick} className="absolute bg-[#151515] content-stretch flex flex-col inset-[0_-1px_0_-0.98px] items-center justify-center p-[41px] rounded-[20px] cursor-pointer hover:border-[#bfff00] transition-colors" data-name="div.flashcard-front">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_1px_0_0.98px] rounded-[20px] shadow-[0px_0px_0px_1px_rgba(191,255,0,0.08),0px_16px_48px_0px_rgba(0,0,0,0.4)]" data-name="div.flashcard-front:shadow" />
      <DivMargin1 />
      <DivCardWordMargin />
      <DivCardHint />
    </div>
  );
}

function DivMargin2() {
  return (
    <div className="h-[32px] relative shrink-0 w-[50.4px]" data-name="div:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] left-0 text-[#00cfff] text-[10px] top-[7px] tracking-[1.2px] uppercase w-[50.764px]">
          <p className="leading-[16px] whitespace-pre-wrap">English</p>
        </div>
      </div>
    </div>
  );
}

function DivCardTranslationMargin() {
  return (
    <div className="relative shrink-0" data-name="div.card-translation:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#00cfff] text-[36px] uppercase whitespace-nowrap">
          <p className="leading-[57.6px]">Thank You</p>
        </div>
      </div>
    </div>
  );
}

function DivCardExample() {
  return (
    <div className="relative shrink-0" data-name="div.card-example">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['DM_Sans:9pt_Italic',sans-serif] font-normal italic justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[22.4px]">{`"Murakoze cyane" means "Thank you very much"`}</p>
        </div>
      </div>
    </div>
  );
}

function DivFlashcardBack() {
  return (
    <div className="bg-[#0a1520] content-stretch flex flex-col items-center justify-center p-[41px] relative rounded-[20px] size-full" data-name="div.flashcard-back">
      <div aria-hidden="true" className="absolute border border-[rgba(0,207,255,0.2)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <DivMargin2 />
      <DivCardTranslationMargin />
      <DivCardExample />
    </div>
  );
}

function DivFlashcardInner() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="div.flashcard-inner">
      <DivFlashcardFront />
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="-scale-y-100 flex-none h-[300px] rotate-180 w-[480px]">
          <DivFlashcardBack />
        </div>
      </div>
    </div>
  );
}

function DivFlashcard() {
  return (
    <div className="content-stretch flex flex-col h-[300px] items-start justify-center relative shrink-0 w-[480px]" data-name="div.flashcard">
      <DivFlashcardInner />
    </div>
  );
}

function DivFlashcardMargin() {
  return (
    <div className="content-stretch flex flex-col h-[332px] items-start pb-[32px] relative shrink-0 w-[480px]" data-name="div.flashcard:margin">
      <DivFlashcard />
    </div>
  );
}

function DivCardActions({ onKnown, onShuffle, onLearning }: { onKnown?: () => void; onShuffle?: () => void; onLearning?: () => void }) {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="div.card-actions">
      <div onClick={onLearning} className="bg-[rgba(255,68,68,0.12)] content-stretch flex items-center justify-center relative rounded-[28px] shrink-0 size-[56px] cursor-pointer hover:bg-[rgba(255,68,68,0.2)] transition-colors" data-name="Component 1">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#f44] text-[22px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[35.2px]">✕</p>
        </div>
      </div>
      <div onClick={onShuffle} className="bg-[rgba(191,255,0,0.1)] content-stretch flex items-center justify-center pb-[21.91px] pt-[21.09px] px-px relative rounded-[36px] shrink-0 size-[72px] cursor-pointer hover:bg-[rgba(191,255,0,0.2)] transition-colors" data-name="Component 2">
        <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[36px]" />
        <div className="flex flex-col font-['Noto_Sans_Math:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bfff00] text-[18px] text-center whitespace-nowrap">
          <p className="leading-[28.8px]">↻</p>
        </div>
      </div>
      <div onClick={onKnown} className="bg-[rgba(0,255,127,0.12)] content-stretch flex items-center justify-center relative rounded-[28px] shrink-0 size-[56px] cursor-pointer hover:bg-[rgba(0,255,127,0.2)] transition-colors" data-name="Component 1">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[22px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[35.2px]">✓</p>
        </div>
      </div>
    </div>
  );
}

function ButtonBtn({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <div onClick={disabled ? undefined : onClick} className={`content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#1f1f1f]'} transition-colors`} data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">← Previous</p>
      </div>
    </div>
  );
}

function ButtonBtn1({ onClick }: { onClick?: () => void }) {
  return (
    <div onClick={onClick} className="content-stretch flex items-center justify-center px-[17px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#1f1f1f] transition-colors" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Shuffle Deck</p>
      </div>
    </div>
  );
}

function ButtonBtn2({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <div onClick={disabled ? undefined : onClick} className={`content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#1f1f1f]'} transition-colors`} data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Next →</p>
      </div>
    </div>
  );
}

function DivFlex2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0" data-name="div.flex">
      <ButtonBtn />
      <ButtonBtn1 />
      <ButtonBtn2 />
    </div>
  );
}

function DivFlexMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0" data-name="div.flex:margin">
      <DivFlex2 />
    </div>
  );
}

function DivCardArea() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="div.card-area">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[40px] relative size-full">
          <DivMargin />
          <DivFlashcardMargin />
          <DivCardActions />
          <DivFlexMargin />
        </div>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] pb-[0.8px] right-[24px] top-[23px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[13px] text-white tracking-[0.65px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">Deck · Greetings</p>
      </div>
    </div>
  );
}

function SpanBadge() {
  return (
    <div className="absolute bg-[rgba(0,255,127,0.1)] bottom-[35.6px] content-stretch flex items-center left-0 pb-[4.59px] pt-[3px] px-[12px] rounded-[99px] top-0" data-name="span.badge">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">8 Known</p>
      </div>
    </div>
  );
}

function SpanBadge1() {
  return (
    <div className="absolute bg-[rgba(255,68,68,0.1)] bottom-[35.6px] content-stretch flex items-center left-[87.52px] pb-[4.59px] pt-[3px] px-[12px] rounded-[99px] top-0" data-name="span.badge">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#f44] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">3 Learning</p>
      </div>
    </div>
  );
}

function SpanBadge2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.06)] bottom-[0.01px] content-stretch flex items-center left-0 pb-[5.59px] pt-[4px] px-[13px] rounded-[99px] top-[33.59px]" data-name="span.badge">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[17.6px]">13 New</p>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute h-[61.19px] left-[25px] right-[24px] top-[60.8px]" data-name="div">
      <SpanBadge />
      <SpanBadge1 />
      <SpanBadge2 />
    </div>
  );
}

function Span7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Muraho</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">✓</p>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Amakuru</p>
      </div>
    </div>
  );
}

function Span10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">✓</p>
      </div>
    </div>
  );
}

function Span11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Ni meza</p>
      </div>
    </div>
  );
}

function Span12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">✓</p>
      </div>
    </div>
  );
}

function Span13() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Murakoze</p>
      </div>
    </div>
  );
}

function Span14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">→</p>
      </div>
    </div>
  );
}

function DivDeckItem() {
  return (
    <div className="absolute bg-[rgba(191,255,0,0.1)] content-stretch flex items-center justify-between left-[25px] pb-[10px] pt-[9px] px-[14px] right-[24px] rounded-[8px] top-[278.38px]" data-name="div.deck-item">
      <Span13 />
      <Span14 />
    </div>
  );
}

function Span15() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Mwiriwe</p>
      </div>
    </div>
  );
}

function Span16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">·</p>
      </div>
    </div>
  );
}

function Span17() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Bwakeye</p>
      </div>
    </div>
  );
}

function Span18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">·</p>
      </div>
    </div>
  );
}

function Span19() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Urakomeye</p>
      </div>
    </div>
  );
}

function Span20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">·</p>
      </div>
    </div>
  );
}

function DivDeckPanel() {
  return (
    <div className="bg-[#0f0f0f] h-full relative shrink-0 w-[280px]" data-name="div.deck-panel">
      <div className="overflow-auto relative size-full">
        <Div1 />
        <Div2 />
        <div className="absolute content-stretch flex items-center justify-between left-[25px] pt-[9px] px-[14px] right-[24px] rounded-[8px] top-[137.98px]" data-name="Component 3">
          <Span7 />
          <Span8 />
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[25px] pt-[9px] px-[14px] right-[24px] rounded-[8px] top-[184.78px]" data-name="Component 3">
          <Span9 />
          <Span10 />
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[25px] pt-[9px] px-[14px] right-[24px] rounded-[8px] top-[231.58px]" data-name="Component 3">
          <Span11 />
          <Span12 />
        </div>
        <DivDeckItem />
        <div className="absolute content-stretch flex items-center justify-between left-[25px] pb-[10px] pt-[9px] px-[14px] right-[24px] rounded-[8px] top-[325.17px]" data-name="Component 3">
          <Span15 />
          <Span16 />
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[25px] pb-[10px] pt-[9px] px-[14px] right-[24px] rounded-[8px] top-[371.97px]" data-name="Component 3">
          <Span17 />
          <Span18 />
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[25px] pb-[10px] pt-[9px] px-[14px] right-[24px] rounded-[8px] top-[418.77px]" data-name="Component 3">
          <Span19 />
          <Span20 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-l border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function MainMain({ currentCard, isFlipped, onFlip, onKnown, onShuffle, onLearning, onPrevious, onNext, knownCount, learningCount, isFirst, isLast, deckName, decks, currentDeckId, onDeckChange, loadingCards, flashcards, knownCards, learningCards, currentCardIndex, onCardSelect }: { 
  currentCard: any; 
  isFlipped: boolean; 
  onFlip: () => void;
  onKnown: () => void;
  onShuffle: () => void;
  onLearning: () => void;
  onPrevious: () => void;
  onNext: () => void;
  knownCount: number;
  learningCount: number;
  isFirst: boolean;
  isLast: boolean;
  deckName: string;
  decks: any[];
  currentDeckId: number | null;
  onDeckChange: (deckId: number) => void;
  loadingCards: boolean;
  flashcards: any[];
  knownCards: string[];
  learningCards: string[];
  currentCardIndex: number;
  onCardSelect: (index: number) => void;
}) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px overflow-x-clip overflow-y-auto relative self-stretch ml-[240px]" data-name="main.main">
      {/* Flashcard Area */}
      <div className="flex-[1_0_0] h-full min-h-px min-w-px relative">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col items-center justify-center p-[40px] relative size-full">
            {/* Progress indicator */}
            <div className="h-[37.59px] relative shrink-0 w-[316.83px] mb-4">
              <div className="-translate-y-1/2 absolute flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal h-[18px] justify-center leading-[0] left-0 text-[#888] text-[11px] top-[8px] tracking-[1.32px] uppercase w-[317.153px]">
                <p className="leading-[17.6px] whitespace-pre-wrap">Tap card to flip · Kinyarwanda → English</p>
              </div>
            </div>
            
            {/* Flashcard with flip effect */}
            <div className="content-stretch flex flex-col h-[332px] items-start pb-[32px] relative shrink-0 w-[480px]">
              <div 
                onClick={onFlip}
                className="relative w-[480px] h-[300px] cursor-pointer"
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="relative w-full h-full transition-transform duration-500"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front - Word */}
                  <div 
                    className="absolute inset-0 bg-[#151515] rounded-[20px] p-[41px] flex flex-col items-center justify-center border border-[rgba(191,255,0,0.2)]"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="text-[#888] text-[10px] tracking-[1.2px] uppercase mb-4">Kinyarwanda</div>
                    <div className="text-[#bfff00] text-[48px] font-bold uppercase text-shadow-[0px_0px_24px_rgba(191,255,0,0.28)] mb-4">
                      {currentCard.word}
                    </div>
                    <div className="text-[#888] text-[14px]">Tap to reveal translation →</div>
                  </div>
                  
                  {/* Back - Translation */}
                  <div 
                    className="absolute inset-0 bg-[#0a1520] rounded-[20px] p-[41px] flex flex-col items-center justify-center border border-[rgba(0,207,255,0.2)]"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="text-[#00cfff] text-[10px] tracking-[1.2px] uppercase mb-2">English</div>
                    <div className="text-[#00cfff] text-[36px] font-bold uppercase mb-4">
                      {currentCard.translation}
                    </div>
                    <div className="text-[#888] text-[14px] italic text-center">
                      "{currentCard.example}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-4 mt-4">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onLearning(); }}
                className="w-14 h-14 rounded-full bg-[rgba(255,68,68,0.12)] text-[#f44] text-[22px] hover:bg-[rgba(255,68,68,0.2)] transition-colors cursor-pointer"
              >
                ✕
              </button>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onShuffle(); }}
                className="w-[72px] h-[72px] rounded-full bg-[rgba(191,255,0,0.1)] text-[#bfff00] text-[18px] hover:bg-[rgba(191,255,0,0.2)] transition-colors cursor-pointer border border-[rgba(191,255,0,0.2)]"
              >
                ↻
              </button>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onKnown(); }}
                className="w-14 h-14 rounded-full bg-[rgba(0,255,127,0.12)] text-[#00ff7f] text-[22px] hover:bg-[rgba(0,255,127,0.2)] transition-colors cursor-pointer"
              >
                ✓
              </button>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={onPrevious}
                disabled={isFirst}
                className={`px-4 py-2 rounded-[8px] text-[13px] ${isFirst ? 'text-[#555] cursor-not-allowed' : 'text-[#888] hover:bg-[#1f1f1f] cursor-pointer'}`}
              >
                ← Previous
              </button>
              <button 
                type="button"
                onClick={onShuffle}
                className="px-4 py-2 rounded-[8px] text-[13px] text-white hover:bg-[#1f1f1f] cursor-pointer border border-[#333]"
              >
                Shuffle Deck
              </button>
              <button 
                type="button"
                onClick={onNext}
                disabled={isLast}
                className={`px-4 py-2 rounded-[8px] text-[13px] ${isLast ? 'text-[#555] cursor-not-allowed' : 'text-[#888] hover:bg-[#1f1f1f] cursor-pointer'}`}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Deck Panel */}
      <div className="bg-[#0f0f0f] h-full relative shrink-0 w-[280px] overflow-auto">
        <div className="p-4">
          {/* Deck selector */}
          <div className="mb-4">
            <label className="text-[#888] text-[10px] tracking-[1.2px] uppercase mb-2 block">Select Deck</label>
            <select 
              value={currentDeckId || ''}
              onChange={(e) => onDeckChange(Number(e.target.value))}
              className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-[8px] px-3 py-2 text-[13px] cursor-pointer"
              disabled={loadingCards}
            >
              {decks.map(deck => (
                <option key={deck.id} value={deck.id}>
                  {deck.name} ({deck.card_count || 0} cards)
                </option>
              ))}
            </select>
            {loadingCards && <p className="text-[#888] text-[11px] mt-1">Loading...</p>}
          </div>
          
          <h3 className="text-white text-[13px] font-bold uppercase tracking-[0.65px] mb-2">Deck · {deckName}</h3>
          
          {/* Stats badges */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-[rgba(0,255,127,0.1)] text-[#00ff7f] text-[11px]">{knownCount} Known</span>
            <span className="px-3 py-1 rounded-full bg-[rgba(255,68,68,0.1)] text-[#f44] text-[11px]">{learningCount} Learning</span>
            <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[#888] text-[11px]">{flashcards.length - knownCount - learningCount} New</span>
          </div>
          
          {/* Card list */}
          <div className="space-y-1">
            {flashcards.map((card, index) => {
              const isKnown = knownCards.includes(card.front_text);
              const isLearning = learningCards.includes(card.front_text);
              const isCurrent = index === currentCardIndex;
              
              return (
                <div 
                  key={card.id}
                  onClick={() => onCardSelect(index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer transition-colors ${
                    isCurrent 
                      ? 'bg-[rgba(191,255,0,0.1)] border border-[#bfff00]' 
                      : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  <span className={`text-[13px] ${isCurrent ? 'text-[#bfff00]' : isKnown ? 'text-[#00ff7f]' : isLearning ? 'text-[#f44]' : 'text-white'}`}>
                    {card.front_text}
                  </span>
                  <span className="text-[12px]">
                    {isKnown ? '✓' : isLearning ? '✕' : '·'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-l border-[#2a2a2a]" />
      </div>
    </div>
  );
}

function DivAppWrap({ currentCard, isFlipped, onFlip, onKnown, onShuffle, onLearning, onPrevious, onNext, knownCount, learningCount, isFirst, isLast, deckName, decks, currentDeckId, onDeckChange, loadingCards, flashcards, knownCards, learningCards, currentCardIndex, onCardSelect }: { 
  currentCard: any; 
  isFlipped: boolean; 
  onFlip: () => void;
  onKnown: () => void;
  onShuffle: () => void;
  onLearning: () => void;
  onPrevious: () => void;
  onNext: () => void;
  knownCount: number;
  learningCount: number;
  isFirst: boolean;
  isLast: boolean;
  deckName: string;
  decks: any[];
  currentDeckId: number | null;
  onDeckChange: (deckId: number) => void;
  loadingCards: boolean;
  flashcards: any[];
  knownCards: string[];
  learningCards: string[];
  currentCardIndex: number;
  onCardSelect: (index: number) => void;
}) {
  return (
    <div className="min-h-[834px] relative shrink-0 w-full z-[1]" data-name="div.app-wrap">
      <div className="flex flex-row justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center min-h-[inherit] relative w-full">
          <Sidebar />
          <MainMain 
            currentCard={currentCard}
            isFlipped={isFlipped}
            onFlip={onFlip}
            onKnown={onKnown}
            onShuffle={onShuffle}
            onLearning={onLearning}
            onPrevious={onPrevious}
            onNext={onNext}
            knownCount={knownCount}
            learningCount={learningCount}
            isFirst={isFirst}
            isLast={isLast}
            deckName={deckName}
            decks={decks}
            currentDeckId={currentDeckId}
            onDeckChange={onDeckChange}
            loadingCards={loadingCards}
            flashcards={flashcards}
            knownCards={knownCards}
            learningCards={learningCards}
            currentCardIndex={currentCardIndex}
            onCardSelect={onCardSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default function Component16Flashcards() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  const [learningCards, setLearningCards] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [deckName, setDeckName] = useState('Greetings');
  const [decks, setDecks] = useState<any[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<number | null>(null);
  const [progressMap, setProgressMap] = useState<Record<number, any>>({});
  const [loadingCards, setLoadingCards] = useState(false);

  // Load decks on mount
  useEffect(() => {
    const loadDecks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) {
          navigate('/login');
          return;
        }
        setUser(JSON.parse(userData));
        
        // Fetch flashcard decks
        const decksResponse = await practiceApi.getFlashcardDecks();
        setDecks(decksResponse.decks || []);
        
        // Select first deck if available
        if (decksResponse.decks && decksResponse.decks.length > 0) {
          const firstDeck = decksResponse.decks[0];
          setCurrentDeckId(firstDeck.id);
          setDeckName(firstDeck.name);
          
          // Load cards for first deck
          const cardsResponse = await practiceApi.getFlashcardDeck(firstDeck.id);
          setFlashcards(cardsResponse.flashcards || []);
          setProgressMap(cardsResponse.progress || {});
          
          // Update known/learning counts based on progress
          const known: string[] = [];
          const learning: string[] = [];
          cardsResponse.flashcards?.forEach((card: any) => {
            const prog = cardsResponse.progress?.[card.id];
            if (prog?.status === 'known') {
              known.push(card.front_text);
            } else if (prog?.status === 'learning') {
              learning.push(card.front_text);
            }
          });
          setKnownCards(known);
          setLearningCards(learning);
        } else {
          // Fallback to mock data if no decks
          setFlashcards([
            { id: 1, front_text: 'Murakoze', back_text: 'Thank You', example_sentence: 'Murakoze cyane means Thank you very much' },
            { id: 2, front_text: 'Muraho', back_text: 'Hello', example_sentence: 'Muraho neza? - How are you?' },
            { id: 3, front_text: 'Amakuru', back_text: 'News', example_sentence: 'Amakuru meza? - Any news?' },
            { id: 4, front_text: 'Ni meza', back_text: 'It\'s good', example_sentence: 'Ni meza - It\'s good' },
            { id: 5, front_text: 'Mwiriwe', back_text: 'Good morning', example_sentence: 'Mwiriwe abafite ibitabo - Good morning to those with books' },
            { id: 6, front_text: 'Bwakeye', back_text: 'Good evening', example_sentence: 'Bwakeye - Good evening' },
            { id: 7, front_text: 'Urakomeye', back_text: 'Good job', example_sentence: 'Urakomeye - Good job/Well done' },
            { id: 8, front_text: 'Ndagukunda', back_text: 'I love you', example_sentence: 'Ndagukunda cyane - I love you very much' },
          ]);
        }
      } catch (error) {
        console.error('Error loading flashcards:', error);
        // Fallback to mock data on error
        setFlashcards([
          { id: 1, front_text: 'Murakoze', back_text: 'Thank You', example_sentence: 'Murakoze cyane means Thank you very much' },
          { id: 2, front_text: 'Muraho', back_text: 'Hello', example_sentence: 'Muraho neza? - How are you?' },
          { id: 3, front_text: 'Amakuru', back_text: 'News', example_sentence: 'Amakuru meza? - Any news?' },
          { id: 4, front_text: 'Ni meza', back_text: 'It\'s good', example_sentence: 'Ni meza - It\'s good' },
          { id: 5, front_text: 'Mwiriwe', back_text: 'Good morning', example_sentence: 'Mwiriwe abafite ibitabo - Good morning to those with books' },
          { id: 6, front_text: 'Bwakeye', back_text: 'Good evening', example_sentence: 'Bwakeye - Good evening' },
          { id: 7, front_text: 'Urakomeye', back_text: 'Good job', example_sentence: 'Urakomeye - Good job/Well done' },
          { id: 8, front_text: 'Ndagukunda', back_text: 'I love you', example_sentence: 'Ndagukunda cyane - I love you very much' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDecks();
  }, [navigate]);

  // Handle deck change
  const handleDeckChange = async (deckId: number) => {
    setLoadingCards(true);
    try {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        setDeckName(deck.name);
        setCurrentDeckId(deckId);
        
        const cardsResponse = await practiceApi.getFlashcardDeck(deckId);
        setFlashcards(cardsResponse.flashcards || []);
        setProgressMap(cardsResponse.progress || {});
        setCurrentCardIndex(0);
        setIsFlipped(false);
        
        // Update known/learning counts
        const known: string[] = [];
        const learning: string[] = [];
        cardsResponse.flashcards?.forEach((card: any) => {
          const prog = cardsResponse.progress?.[card.id];
          if (prog?.status === 'known') {
            known.push(card.front_text);
          } else if (prog?.status === 'learning') {
            learning.push(card.front_text);
          }
        });
        setKnownCards(known);
        setLearningCards(learning);
      }
    } catch (error) {
      console.error('Error loading deck:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  // Current card from API data
  const currentCard = flashcards.length > 0 ? {
    word: flashcards[currentCardIndex]?.front_text || '',
    translation: flashcards[currentCardIndex]?.back_text || '',
    example: flashcards[currentCardIndex]?.example_sentence || ''
  } : { word: '', translation: '', example: '' };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    // Simple shuffle
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(!isFlipped); // Toggle flip
  };

  const handleKnown = async () => {
    const card = flashcards[currentCardIndex];
    if (card) {
      // Update local state
      if (!knownCards.includes(card.front_text)) {
        setKnownCards([...knownCards, card.front_text]);
      }
      // Remove from learning if there
      setLearningCards(learningCards.filter(c => c !== card.front_text));
      
      // Update in API
      try {
        await practiceApi.reviewFlashcard(card.id, 'known');
        setProgressMap({...progressMap, [card.id]: { status: 'known' }});
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleLearning = async () => {
    const card = flashcards[currentCardIndex];
    if (card) {
      // Update local state
      if (!learningCards.includes(card.front_text)) {
        setLearningCards([...learningCards, card.front_text]);
      }
      // Remove from known if there
      setKnownCards(knownCards.filter(c => c !== card.front_text));
      
      // Update in API
      try {
        await practiceApi.reviewFlashcard(card.id, 'learning');
        setProgressMap({...progressMap, [card.id]: { status: 'learning' }});
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const getUserInitials = () => {
    if (!user) return 'JP';
    const fullName = user.full_name || '';
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase() || 'JP';
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col h-screen isolate items-start justify-center relative size-full" data-name="16-flashcards">
        <DivScreenId />
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="16-flashcards">
      <DivScreenId />
      <NavNav />
      <DivAppWrap 
        currentCard={currentCard}
        isFlipped={isFlipped}
        onFlip={handleCardClick}
        onKnown={handleKnown}
        onShuffle={handleShuffle}
        onLearning={handleLearning}
        onPrevious={handlePrevious}
        onNext={handleNext}
        knownCount={knownCards.length}
        learningCount={learningCards.length}
        isFirst={currentCardIndex === 0}
        isLast={currentCardIndex === flashcards.length - 1}
        deckName={deckName}
        decks={decks}
        currentDeckId={currentDeckId}
        onDeckChange={handleDeckChange}
        loadingCards={loadingCards}
        flashcards={flashcards}
        knownCards={knownCards}
        learningCards={learningCards}
        currentCardIndex={currentCardIndex}
        onCardSelect={(index) => { setCurrentCardIndex(index); setIsFlipped(false); }}
      />
    </div>
  );
}