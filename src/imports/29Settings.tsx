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
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🔔</p>
        </div>
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🔒</p>
        </div>
      </div>
    </div>
  );
}

function Span2() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🔑</p>
        </div>
      </div>
    </div>
  );
}

function Span3() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🎨</p>
        </div>
      </div>
    </div>
  );
}

function Span4() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">🌍</p>
        </div>
      </div>
    </div>
  );
}

function Span5() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[22.4px]">💳</p>
        </div>
      </div>
    </div>
  );
}

function Span6() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Noto_Sans_Symbols:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#f44] text-[14px] whitespace-nowrap">
          <p className="leading-[22.4px]">🗑</p>
        </div>
      </div>
    </div>
  );
}

function DivSettingsNav() {
  return (
    <div className="bg-[#0f0f0f] h-full relative shrink-0 w-[220px]" data-name="div.settings-nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-r border-solid inset-0 pointer-events-none" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] left-[24px] text-[#888] text-[10px] top-[31.5px] tracking-[1.2px] uppercase w-[57.987px]">
        <p className="leading-[16px] whitespace-pre-wrap">Settings</p>
      </div>
      <div className="absolute bg-[rgba(191,255,0,0.1)] content-stretch flex gap-[10px] items-center left-0 pb-[10.89px] pl-[26px] pr-[81.58px] pt-[10.5px] top-[54px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-[#bfff00] border-l-2 border-solid inset-0 pointer-events-none" />
        <Span />
        <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px]">Notifications</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[10px] items-center left-0 pb-[10.89px] pl-[26px] pr-[117.26px] pt-[10.5px] top-[98.39px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
        <Span1 />
        <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px]">Privacy</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[10px] items-center left-0 pb-[10.89px] pl-[26px] pr-[102.67px] pt-[10.5px] top-[142.78px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
        <Span2 />
        <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px]">Password</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[10px] items-center left-0 pb-[10.89px] pl-[26px] pr-[84.7px] pt-[10.5px] top-[187.17px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
        <Span3 />
        <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px]">Appearance</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[10px] items-center left-0 pb-[10.89px] pl-[26px] pr-[102.17px] pt-[10.5px] top-[231.56px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
        <Span4 />
        <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px]">Language</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[10px] items-center left-0 pb-[10.89px] pl-[26px] pr-[127.05px] pt-[10.5px] top-[275.95px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid inset-0 pointer-events-none" />
        <Span5 />
        <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px]">Billing</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[10px] items-center left-0 pb-[10.89px] pl-[26px] pr-[68.2px] pt-[16.5px] top-[344.34px]" data-name="Component 1">
        <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-l-2 border-solid border-t inset-0 pointer-events-none" />
        <Span6 />
        <div className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f44] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px]">Delete Account</p>
        </div>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-white tracking-[-0.64px] uppercase w-full">
        <p className="text-[32px] whitespace-pre-wrap">
          <span className="leading-[51.2px] text-white">{`Notification `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Settings</span>
        </p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="p">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px] whitespace-pre-wrap">Choose what updates you want to receive</p>
      </div>
    </div>
  );
}

function DivPageHdr() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[40px] right-[39.99px] top-[36px]" data-name="div.page-hdr">
      <Div1 />
      <P />
    </div>
  );
}

function Div2() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">Push Notifications</p>
        </div>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[13.8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">Manage in-app notification preferences</p>
        </div>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Daily Streak Reminder</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Get reminded to keep your streak alive</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative">
        <Div5 />
        <Div6 />
      </div>
    </div>
  );
}

function DivToggle() {
  return (
    <div className="bg-[#bfff00] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-black left-[23px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
      </div>
    </div>
  );
}

function DivSettingRow() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] relative w-full">
        <Div4 />
        <DivToggle />
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">New Lesson Available</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">When new content is added to your courses</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative">
        <Div8 />
        <Div9 />
      </div>
    </div>
  );
}

function DivToggle1() {
  return (
    <div className="bg-[#bfff00] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-black left-[23px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
      </div>
    </div>
  );
}

function DivSettingRow1() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[12.99px] relative w-full">
        <Div7 />
        <DivToggle1 />
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Live Session Starting</p>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">15 minutes before a session begins</p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative">
        <Div11 />
        <Div12 />
      </div>
    </div>
  );
}

function DivToggle2() {
  return (
    <div className="bg-[#bfff00] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-black left-[23px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
      </div>
    </div>
  );
}

function DivSettingRow2() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[13px] relative w-full">
        <Div10 />
        <DivToggle2 />
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Community Replies</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">When someone replies to your posts</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative">
        <Div14 />
        <Div15 />
      </div>
    </div>
  );
}

function DivToggle3() {
  return (
    <div className="bg-[#2a2a2a] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-white left-[3px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
      </div>
    </div>
  );
}

function DivSettingRow3() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[13px] relative w-full">
        <Div13 />
        <DivToggle3 />
      </div>
    </div>
  );
}

function Div17() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Achievement Unlocked</p>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Celebrate your milestones</p>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0" data-name="div">
      <Div17 />
      <Div18 />
    </div>
  );
}

function DivToggle4() {
  return (
    <div className="bg-[#bfff00] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="absolute bg-black left-[23px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
    </div>
  );
}

function DivSettingRow4() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[16px] pt-[13px] relative w-full">
        <Div16 />
        <DivToggle4 />
      </div>
    </div>
  );
}

function DivCard() {
  return (
    <div className="absolute bg-[#151515] left-[40px] right-[40px] rounded-[14px] top-[141.58px]" data-name="div.card">
      <div className="content-stretch flex flex-col gap-[3px] items-start overflow-clip p-[25px] relative rounded-[inherit] w-full">
        <Div2 />
        <Div3 />
        <DivSettingRow />
        <DivSettingRow1 />
        <DivSettingRow2 />
        <DivSettingRow3 />
        <DivSettingRow4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.22)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Div19() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">Email Notifications</p>
        </div>
      </div>
    </div>
  );
}

function Div20() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[13.79px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">Control what arrives in your inbox</p>
        </div>
      </div>
    </div>
  );
}

function Div22() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Weekly Progress Report</p>
      </div>
    </div>
  );
}

function Div23() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Summary of your weekly learning activity</p>
      </div>
    </div>
  );
}

function Div21() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative">
        <Div22 />
        <Div23 />
      </div>
    </div>
  );
}

function DivToggle5() {
  return (
    <div className="bg-[#bfff00] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-black left-[23px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
      </div>
    </div>
  );
}

function DivSettingRow5() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] relative w-full">
        <Div21 />
        <DivToggle5 />
      </div>
    </div>
  );
}

function Div25() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Promotional Emails</p>
      </div>
    </div>
  );
}

function Div26() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Discounts, new courses, special offers</p>
      </div>
    </div>
  );
}

function Div24() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative">
        <Div25 />
        <Div26 />
      </div>
    </div>
  );
}

function DivToggle6() {
  return (
    <div className="bg-[#2a2a2a] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-white left-[3px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
      </div>
    </div>
  );
}

function DivSettingRow6() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div aria-hidden="true" className="absolute border-[rgba(42,42,42,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[13px] relative w-full">
        <Div24 />
        <DivToggle6 />
      </div>
    </div>
  );
}

function Div28() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Instructor Messages</p>
      </div>
    </div>
  );
}

function Div29() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Direct messages from your instructors</p>
      </div>
    </div>
  );
}

function Div27() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0" data-name="div">
      <Div28 />
      <Div29 />
    </div>
  );
}

function DivToggle7() {
  return (
    <div className="bg-[#bfff00] h-[24px] relative rounded-[12px] shrink-0 w-[44px]" data-name="div.toggle">
      <div className="absolute bg-black left-[23px] rounded-[9px] size-[18px] top-[3px]" data-name="::after" />
    </div>
  );
}

function DivSettingRow7() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.setting-row">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[16px] pt-[13px] relative w-full">
        <Div27 />
        <DivToggle7 />
      </div>
    </div>
  );
}

function DivCard1() {
  return (
    <div className="absolute bg-[#151515] left-[40px] right-[40px] rounded-[14px] top-[626.66px]" data-name="div.card">
      <div className="content-stretch flex flex-col gap-[3px] items-start overflow-clip p-[25px] relative rounded-[inherit] w-full">
        <Div19 />
        <Div20 />
        <DivSettingRow5 />
        <DivSettingRow6 />
        <DivSettingRow7 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Div30() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#f44] text-[14px] tracking-[0.7px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">Danger Zone</p>
        </div>
      </div>
    </div>
  );
}

function Div31() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20.8px] whitespace-pre-wrap">These actions are irreversible. Please be certain.</p>
        </div>
      </div>
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="bg-[rgba(255,68,68,0.12)] content-stretch flex items-center justify-center px-[17px] py-[8px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[rgba(255,68,68,0.25)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#f44] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Reset All Progress</p>
      </div>
    </div>
  );
}

function ButtonBtn1() {
  return (
    <div className="bg-[rgba(255,68,68,0.12)] content-stretch flex items-center justify-center px-[17px] py-[8px] relative rounded-[8px] shrink-0" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[rgba(255,68,68,0.25)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#f44] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Delete My Account</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.flex">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start pt-[9px] relative w-full">
        <ButtonBtn />
        <ButtonBtn1 />
      </div>
    </div>
  );
}

function DivCard2() {
  return (
    <div className="absolute bg-[#151515] left-[40px] right-[40px] rounded-[14px] top-[962.58px]" data-name="div.card">
      <div className="content-stretch flex flex-col gap-[7px] items-start overflow-clip p-[25px] relative rounded-[inherit] w-full">
        <Div30 />
        <Div31 />
        <DivFlex1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,68,68,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Main() {
  return (
    <div className="h-full overflow-auto relative shrink-0 w-[736.52px]" data-name="main">
      <DivPageHdr />
      <DivCard />
      <DivCard1 />
      <DivCard2 />
    </div>
  );
}

function DivSettingsLayout() {
  return (
    <div className="content-stretch flex items-start min-h-[834px] relative self-stretch shrink-0" data-name="div.settings-layout">
      <DivSettingsNav />
      <Main />
    </div>
  );
}

function DivAppWrap() {
  return (
    <div className="content-stretch flex items-start min-h-[834px] relative shrink-0 w-full z-[1]" data-name="div.app-wrap">
      <DivSettingsLayout />
    </div>
  );
}

export default function Component29Settings() {
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
      <StudentLayout title="Settings" subtitle="Manage your account preferences">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Settings" subtitle="Manage your account preferences">
      <DivAppWrap />
    </StudentLayout>
  );
}