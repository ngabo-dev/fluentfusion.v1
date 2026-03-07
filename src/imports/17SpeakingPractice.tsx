import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

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

function ALogo({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="cursor-pointer relative shrink-0" data-name="a.logo" onClick={onNavigate}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </div>
  );
}

function Span({ language }: { language: string }) {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Speaking Practice · {language}</p>
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

function DivFlex({ language, initials }: { language: string; initials: string }) {
  return (
    <div className="relative shrink-0" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Span language={language} />
        <DivAvatar initials={initials} />
      </div>
    </div>
  );
}

function NavNav({ language, initials, onLogoClick }: { language: string; initials: string; onLogoClick: () => void }) {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo onNavigate={onLogoClick} />
          <DivFlex language={language} initials={initials} />
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
    <Link to="/dashboard" className="relative shrink-0 w-full block" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span1 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Dashboard</p>
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
          <p className="leading-[22.4px]">📚</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem1() {
  return (
    <Link to="/courses" className="relative shrink-0 w-full block" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span2 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">My Courses</p>
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
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🎯</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem2() {
  return (
    <Link to="/practice" className="bg-[rgba(191,255,0,0.1)] relative shrink-0 w-full block" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span3 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
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
          <p className="leading-[22.4px]">🎥</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem3() {
  return (
    <Link to="/live-sessions" className="relative shrink-0 w-full block" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span4 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Live Sessions</p>
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
          <p className="leading-[22.4px]">🌍</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem4() {
  return (
    <Link to="/community" className="relative shrink-0 w-full block" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span5 />
          <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">Community</p>
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
          <p className="leading-[22.4px]">👤</p>
        </div>
      </div>
    </div>
  );
}

function ASidebarItem5() {
  return (
    <Link to="/profile" className="relative shrink-0 w-full block" data-name="a.sidebar-item">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <Span6 />
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

function Div() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-white tracking-[-0.64px] uppercase w-full">
        <p className="text-[32px] whitespace-pre-wrap">
          <span className="leading-[51.2px] text-white">{`Speaking `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Practice</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Record yourself and get instant AI pronunciation feedback</p>
      </div>
    </div>
  );
}

function DivPageHdr() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="div.page-hdr">
      <Div />
      <P />
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[37px]" data-name="div">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] text-center tracking-[1.5px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">Say this phrase:</p>
      </div>
    </div>
  );
}

function DivPhraseText({ phrase }: { phrase: string }) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[69px]" data-name="div.phrase-text">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[36px] text-center text-shadow-[0px_0px_24px_rgba(191,255,0,0.28),0px_0px_12px_rgba(191,255,0,0.55)] tracking-[-0.72px] uppercase whitespace-nowrap">
        <p className="leading-[57.6px]">{phrase}</p>
      </div>
    </div>
  );
}

function DivPhrasePhonetic({ phonetic }: { phonetic: string }) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[134.59px]" data-name="div.phrase-phonetic">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[25.6px]">{phonetic}</p>
      </div>
    </div>
  );
}

function DivPhraseMeaning({ meaning }: { meaning: string }) {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[37px] right-[37px] top-[164.19px]" data-name="div.phrase-meaning">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[15px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[24px]">{meaning}</p>
      </div>
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[297.55px] px-[17px] py-[8px] rounded-[8px] top-[204.19px] cursor-pointer" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">🔊 Play Native Audio</p>
      </div>
    </div>
  );
}

function PhraseToSay({ phrase, phonetic, meaning }: { phrase: string; phonetic: string; meaning: string }) {
  return (
    <div className="h-[274.19px] relative rounded-[20px] shrink-0 w-full" data-name="Phrase to Say" style={{ backgroundImage: "linear-gradient(134.866deg, rgba(191, 255, 0, 0.06) 0%, rgba(191, 255, 0, 0.02) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.15)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <Div1 />
      <DivPhraseText phrase={phrase} />
      <DivPhrasePhonetic phonetic={phonetic} />
      <DivPhraseMeaning meaning={meaning} />
      <ButtonBtn />
    </div>
  );
}

function Div2() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20.8px]">Press the mic to start recording...</p>
        </div>
      </div>
    </div>
  );
}

function DivWaveform() {
  return (
    <div className="absolute bg-[#151515] h-[56px] left-0 right-0 rounded-[14px] top-0" data-name="div#waveform">
      <div className="content-stretch flex items-center overflow-clip pb-[17.61px] pt-[16.59px] px-[21px] relative rounded-[inherit] size-full">
        <Div2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function DivRecBtn() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#f44] content-stretch flex items-center justify-center left-1/2 pb-[18.6px] pt-[17.4px] rounded-[44px] size-[88px] top-[76px] cursor-pointer" data-name="div#recBtn">
      <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0)] left-1/2 rounded-[44px] shadow-[0px_0px_0px_12px_rgba(255,68,68,0.2)] size-[88px] top-0" data-name="div#recBtn:shadow" />
      <div className="flex flex-col font-['Noto_Sans_Symbols:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[32px] text-center text-white whitespace-nowrap">
        <p className="leading-[51.2px]">🎙</p>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-start left-[calc(50%+0.17px)] top-[183px]" data-name="div">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#f44] text-[12px] whitespace-nowrap">
        <p className="leading-[19.2px]">● Recording · 0:03</p>
      </div>
    </div>
  );
}

function RecordArea() {
  return (
    <div className="h-[203.19px] relative shrink-0 w-full" data-name="Record Area">
      <DivWaveform />
      <DivRecBtn />
      <Div3 />
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] right-[25px] top-[25px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">AI Pronunciation Score</p>
      </div>
    </div>
  );
}

function DivScoreLabel({ label }: { label: string }) {
  return (
    <div className="relative shrink-0" data-name="div.score-label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[22.4px]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function DivScoreVal({ score, color }: { score: string; color: string }) {
  return (
    <div className="relative shrink-0" data-name="div.score-val">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[22px] whitespace-nowrap" style={{ color }}>
          <p className="leading-[35.2px]">{score}</p>
        </div>
      </div>
    </div>
  );
}

function DivScoreRow({ label, score, color }: { label: string; score: string; color: string }) {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[25px] pb-[11px] pt-[9px] right-[25px] top-[63.39px]" data-name="div.score-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivScoreLabel label={label} />
      <DivScoreVal score={score} color={color} />
    </div>
  );
}

function DivScoreRow1({ label, score, color }: { label: string; score: string; color: string }) {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[25px] pb-[11px] pt-[9px] right-[25px] top-[119.58px]" data-name="div.score-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivScoreLabel label={label} />
      <DivScoreVal score={score} color={color} />
    </div>
  );
}

function DivScoreRow2({ label, score, color }: { label: string; score: string; color: string }) {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[25px] pb-[11px] pt-[9px] right-[25px] top-[175.77px]" data-name="div.score-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivScoreLabel label={label} />
      <DivScoreVal score={score} color={color} />
    </div>
  );
}

function DivScoreRow3({ label, score, color }: { label: string; score: string; color: string }) {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[25px] pb-[11px] pt-[9px] right-[25px] top-[231.96px]" data-name="div.score-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <DivScoreLabel label={label} />
      <DivScoreVal score={score} color={color} />
    </div>
  );
}

function Div6() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">💡 AI Tip</p>
        </div>
      </div>
    </div>
  );
}

function Div7({ tip }: { tip: string }) {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">{tip}</p>
        </div>
      </div>
    </div>
  );
}

function Div5({ tip }: { tip: string }) {
  return (
    <div className="absolute bg-[rgba(191,255,0,0.05)] content-stretch flex flex-col gap-[3px] items-start left-[25px] pb-[14.99px] pt-[14px] px-[15px] right-[25px] rounded-[8px] top-[304.14px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.12)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div6 />
      <Div7 tip={tip} />
    </div>
  );
}

function ButtonBtn1() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[16px] pt-[12px] px-[24px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-center tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Try Again 🎙</p>
      </div>
    </div>
  );
}

function ButtonBtn2() {
  return (
    <div className="content-stretch flex items-center justify-center px-[25px] py-[14px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Next Phrase →</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[25px] right-[25px] top-[395.74px]" data-name="div.flex">
      <ButtonBtn1 />
      <ButtonBtn2 />
    </div>
  );
}

function AiFeedback({ overallScore, toneScore, vowelScore, rhythmScore, tip }: { overallScore: string; toneScore: string; vowelScore: string; rhythmScore: string; tip: string }) {
  return (
    <div className="bg-[#151515] h-[466.73px] relative rounded-[14px] shrink-0 w-full" data-name="AI Feedback">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Div4 />
      <DivScoreRow label="Overall Score" score={overallScore} color="#bfff00" />
      <DivScoreRow1 label="Tone & Intonation" score={toneScore} color={toneScore} />
      <DivScoreRow2 label="Vowel Accuracy" score={vowelScore} color={vowelScore} />
      <DivScoreRow3 label="Rhythm & Pace" score={rhythmScore} color={rhythmScore} />
      <Div5 tip={tip} />
      <DivFlex1 />
    </div>
  );
}

function DivSpeakWrap() {
  // Sample phrase data - in production this would come from API
  const phrase = "Muraho, amakuru?";
  const phonetic = "/mu-RA-ho, a-MA-ku-ru/";
  const meaning = "Hello, how are you?";
  
  // Sample scores - in production this would come from API
  const overallScore = "82%";
  const toneScore = "#00ff7f";
  const vowelScore = "#ffb800";
  const rhythmScore = "#bfff00";
  const tip = "Great tone! Try to soften the \"ku\" syllable in \"amakuru\" — it should be short and light.";

  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start max-w-[760px] relative shrink-0 w-[760px]" data-name="div.speak-wrap">
      <PhraseToSay phrase={phrase} phonetic={phonetic} meaning={meaning} />
      <RecordArea />
      <AiFeedback 
        overallScore={overallScore} 
        toneScore={toneScore} 
        vowelScore={vowelScore} 
        rhythmScore={rhythmScore} 
        tip={tip} 
      />
    </div>
  );
}

function MainMain() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="main.main">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[28px] items-center px-[40px] py-[36px] relative size-full">
          <DivPageHdr />
          <DivSpeakWrap />
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

export default function Component17SpeakingPractice() {
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
      <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start min-h-screen relative size-full">
        <div className="flex items-center justify-center min-h-screen w-full">
          <div className="text-[#bfff00] text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="17-speaking-practice">
      <DivScreenId />
      <NavNav 
        language={user?.native_language || 'Kinyarwanda'} 
        initials={getUserInitials()} 
        onLogoClick={handleLogoClick}
      />
      <DivAppWrap />
    </div>
  );
}
