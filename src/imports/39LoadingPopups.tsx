import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

function DivScreenId() {
  return (
    <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
        <p className="leading-[16px]">13.4 · Loading & Popups</p>
      </div>
    </div>
  );
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
  return (
    <Link to="/dashboard" className="cursor-pointer relative shrink-0" data-name="a.logo">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </Link>
  );
}

function NavNav() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo />
        </div>
      </div>
    </div>
  );
}

function PageHdrTitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div.page-hdr">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[32px] text-left text-white tracking-[-0.64px] uppercase whitespace-nowrap">
        <p className="text-[32px]">
          <span className="text-[#bfff00]">Loading</span>
          <span> & Popups</span>
        </p>
      </div>
    </div>
  );
}

function PageHdrSubtitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[15px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[24px]">All feedback components — loading states, toasts, modals</p>
      </div>
    </div>
  );
}

function DivPageHdr() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[40px] relative shrink-0 gap-[8px]" data-name="div.page-hdr">
      <PageHdrTitle />
      <PageHdrSubtitle />
    </div>
  );
}

// Loading 1: Spinner
function Spinner() {
  return (
    <div className="w-[40px] h-[40px] border-[3px] border-[#2a2a2a] border-t-[#bfff00] rounded-[50%] animate-[spin_0.8s_linear_infinite]" data-name="div.spinner" />
  );
}

function SpinnerLabel() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[#888] text-[13px]" data-name="div">
      <p className="leading-[normal]">Loading lessons...</p>
    </div>
  );
}

function SpinnerTitle() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Spinner Loading</p>
    </div>
  );
}

function SpinnerShowcase() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <Spinner />
      <SpinnerLabel />
      <SpinnerTitle />
    </div>
  );
}

// Loading 2: Animated Dots
function Dot1() {
  return <div className="w-[10px] h-[10px] bg-[#bfff00] rounded-[50%] animate-[bounce_1.2s_ease-in-out_infinite]" data-name="div.dot" />;
}

function Dot2() {
  return <div className="w-[10px] h-[10px] bg-[#bfff00] rounded-[50%] animate-[bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} data-name="div.dot" />;
}

function Dot3() {
  return <div className="w-[10px] h-[10px] bg-[#bfff00] rounded-[50%] animate-[bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} data-name="div.dot" />;
}

function DotsContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div.dots">
      <Dot1 />
      <Dot2 />
      <Dot3 />
    </div>
  );
}

function DotsLabel() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[#888] text-[13px]" data-name="div">
      <p className="leading-[normal]">AI is thinking...</p>
    </div>
  );
}

function DotsTitle() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Animated Dots</p>
    </div>
  );
}

function DotsShowcase() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <DotsContainer />
      <DotsLabel />
      <DotsTitle />
    </div>
  );
}

// Loading 3: Progress Bar
function ProgressFill() {
  return (
    <div className="h-[100%] bg-gradient-to-r from-[#00cfff] to-[#bfff00] rounded-[99px] animate-[load_2s_ease-in-out_infinite] w-[70%]" data-name="div.prog-fill-anim" style={{ marginLeft: '15%' }} />
  );
}

function ProgressBar() {
  return (
    <div className="w-[100%] h-[4px] bg-[#2a2a2a] rounded-[99px] overflow-hidden" data-name="div.prog-bar-anim">
      <ProgressFill />
    </div>
  );
}

function ProgressIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[32px]" data-name="div">
      <p className="leading-[normal]">📹</p>
    </div>
  );
}

function ProgressTitle() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[13px] text-white font-semibold" data-name="div">
      <p className="leading-[20.8px] mb-[8px]">Uploading video...</p>
    </div>
  );
}

function ProgressBarTitle() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Progress Bar Loading</p>
    </div>
  );
}

function ProgressShowcase() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <ProgressIcon />
      <ProgressTitle />
      <ProgressBar />
      <ProgressBarTitle />
    </div>
  );
}

// Loading 4: Splash Screen
function SplashLogo() {
  return (
    <div className="w-[52px] h-[52px] bg-[#bfff00] rounded-[14px] content-stretch flex items-center justify-center relative shrink-0 text-[24px] shadow-[0_0_20px_rgba(191,255,0,0.4)]" data-name="div">
      <p className="leading-[normal]">🧠</p>
    </div>
  );
}

function SplashText() {
  return (
    <div className="content-stretch flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[18px] text-left text-white uppercase tracking-[-0.36px] whitespace-nowrap" data-name="div">
      <p className="text-[18px]">
        <span className="leading-[28.8px]">FLUENT</span>
        <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
      </p>
    </div>
  );
}

function SplashProgress() {
  return (
    <div className="w-[120px] h-[4px] bg-[#2a2a2a] rounded-[99px] overflow-hidden" data-name="div.prog-bar-anim">
      <div className="h-[100%] bg-gradient-to-r from-[#00cfff] to-[#bfff00] rounded-[99px] animate-[load_2s_ease-in-out_infinite] w-[70%]" style={{ marginLeft: '15%' }} />
    </div>
  );
}

function SplashTitle() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">App Splash Screen</p>
    </div>
  );
}

function SplashShowcase() {
  return (
    <div className="bg-[#0a0a0a] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <SplashLogo />
      <SplashText />
      <SplashProgress />
      <SplashTitle />
    </div>
  );
}

// Toast 1: Success
function ToastSuccess() {
  return (
    <div className="flex items-center gap-[10px] px-[14px] py-[11px] rounded-[8px] bg-[rgba(0,255,127,0.08)] border border-[rgba(0,255,127,0.25)] text-[13px] text-[#00ff7f]" data-name="div.td">
      <span>✅</span>
      <span>Lesson completed! +50 XP earned</span>
    </div>
  );
}

// Toast 2: Error
function ToastError() {
  return (
    <div className="flex items-center gap-[10px] px-[14px] py-[11px] rounded-[8px] bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.25)] text-[13px] text-[#ff4444]" data-name="div.td">
      <span>❌</span>
      <span>Upload failed. Try again.</span>
    </div>
  );
}

// Toast 3: Info
function ToastInfo() {
  return (
    <div className="flex items-center gap-[10px] px-[14px] py-[11px] rounded-[8px] bg-[rgba(0,207,255,0.08)] border border-[rgba(0,207,255,0.25)] text-[13px] text-[#00cfff]" data-name="div.td">
      <span>ℹ️</span>
      <span>Live session starts in 5 min</span>
    </div>
  );
}

function ToastContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] w-full" data-name="div.toast-demo">
      <ToastSuccess />
      <ToastError />
      <ToastInfo />
    </div>
  );
}

function ToastTitle() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Toast Notifications</p>
    </div>
  );
}

function ToastShowcase() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <ToastContainer />
      <ToastTitle />
    </div>
  );
}

// Modal: Confirm Dialog
function ModalTitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[15px] text-left text-white" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px] mb-[6px]">Leave Session?</p>
      </div>
    </div>
  );
}

function ModalSubtitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px] mb-[16px]">You'll lose your current progress in this session if you leave now.</p>
      </div>
    </div>
  );
}

function ModalButtonStay() {
  return (
    <button className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer flex-1" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[#888] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Stay</p>
      </div>
    </button>
  );
}

function ModalButtonLeave() {
  return (
    <button className="bg-[#ff4444] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer flex-1" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Leave</p>
      </div>
    </button>
  );
}

function ModalButtons() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div.flex">
      <ModalButtonStay />
      <ModalButtonLeave />
    </div>
  );
}

function ModalContent() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-start px-[24px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-name="div.modal-demo">
      <ModalTitle />
      <ModalSubtitle />
      <ModalButtons />
    </div>
  );
}

function ModalTitle2() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Confirm Dialog</p>
    </div>
  );
}

function ModalShowcase() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <ModalContent />
      <ModalTitle2 />
    </div>
  );
}

// Achievement Popup
function AchievementIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[44px]" data-name="div" style={{ filter: 'drop-shadow(0 0 12px rgba(191,255,0,0.4))' }}>
      <p className="leading-[normal]">🏆</p>
    </div>
  );
}

function AchievementUnlocked() {
  return (
    <div className="content-stretch flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-[#bfff00] uppercase whitespace-nowrap" data-name="div">
      <p className="leading-[25.6px]">Achievement Unlocked!</p>
    </div>
  );
}

function AchievementName() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">7-Day Streak</p>
      </div>
    </div>
  );
}

function AchievementXP() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">+100 XP earned</p>
      </div>
    </div>
  );
}

function AchievementButton() {
  return (
    <button className="bg-[#bfff00] content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[#0a0a0a] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Claim Reward →</p>
      </div>
    </button>
  );
}

function AchievementTitle() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Achievement Popup</p>
    </div>
  );
}

function AchievementShowcase() {
  return (
    <div className="bg-gradient-to-br from-[rgba(191,255,0,0.06)] to-transparent border border-[rgba(191,255,0,0.2)] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <AchievementIcon />
      <AchievementUnlocked />
      <AchievementName />
      <AchievementXP />
      <AchievementButton />
      <AchievementTitle />
    </div>
  );
}

// Quiz Result Popup
function QuizIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[44px]" data-name="div">
      <p className="leading-[normal]">🎯</p>
    </div>
  );
}

function QuizScore() {
  return (
    <div className="content-stretch flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[36px] text-center text-[#00ff7f] uppercase whitespace-nowrap" data-name="div">
      <p className="leading-[57.6px]">87%</p>
    </div>
  );
}

function QuizTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Quiz Completed!</p>
      </div>
    </div>
  );
}

function QuizSubtitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">4 of 5 correct · +80 XP</p>
      </div>
    </div>
  );
}

function QuizButtonReview() {
  return (
    <button className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[#888] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Review</p>
      </div>
    </button>
  );
}

function QuizButtonNext() {
  return (
    <button className="bg-[#bfff00] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[#0a0a0a] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Next Lesson →</p>
      </div>
    </button>
  );
}

function QuizButtons() {
  return (
    <div className="content-stretch flex gap-[8px] items-center mt-[8px] relative shrink-0" data-name="div.flex">
      <QuizButtonReview />
      <QuizButtonNext />
    </div>
  );
}

function QuizTitle2() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Quiz Result Popup</p>
    </div>
  );
}

function QuizShowcase() {
  return (
    <div className="bg-gradient-to-br from-[rgba(0,255,127,0.05)] to-transparent border border-[rgba(0,255,127,0.2)] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <QuizIcon />
      <QuizScore />
      <QuizTitle />
      <QuizSubtitle />
      <QuizButtons />
      <QuizTitle2 />
    </div>
  );
}

// Skeleton Loading
function SkeletonAvatar() {
  return (
    <div className="w-[40px] h-[40px] rounded-[50%] bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] animate-pulse" data-name="div" />
  );
}

function SkeletonLine1() {
  return (
    <div className="h-[12px] rounded-[4px] bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] animate-pulse w-[60%]" data-name="div" />
  );
}

function SkeletonLine2() {
  return (
    <div className="h-[10px] rounded-[4px] bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] animate-pulse w-[40%]" data-name="div" />
  );
}

function SkeletonTextCol() {
  return (
    <div className="flex-1 flex flex-col gap-[8px] justify-center" data-name="div">
      <SkeletonLine1 />
      <SkeletonLine2 />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-[12px] w-full mb-[12px]" data-name="div">
      <SkeletonAvatar />
      <SkeletonTextCol />
    </div>
  );
}

function SkeletonLineFull() {
  return (
    <div className="h-[10px] rounded-[4px] bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] animate-pulse w-full mb-[8px]" data-name="div" />
  );
}

function SkeletonLine80() {
  return (
    <div className="h-[10px] rounded-[4px] bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] animate-pulse w-[80%]" data-name="div" />
  );
}

function SkeletonContent() {
  return (
    <div className="content-stretch flex flex-col relative shrink-0 w-full" data-name="div">
      <SkeletonRow />
      <SkeletonLineFull />
      <SkeletonLine80 />
    </div>
  );
}

function SkeletonTitle() {
  return (
    <div className="absolute bottom-[10px] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] left-0 relative shrink-0 right-0 text-[#555] text-[9px] text-center tracking-[0.14em] uppercase whitespace-nowrap" data-name="div.showcase-label">
      <p className="leading-[14.4px]">Skeleton Loading</p>
    </div>
  );
}

function SkeletonShowcase() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-solid content-stretch flex flex-col items-center justify-center min-h-[180px] px-[28px] py-[28px] relative rounded-[12px] shrink-0 gap-[14px]" data-name="div.showcase-item">
      <SkeletonContent />
      <SkeletonTitle />
    </div>
  );
}

// Grid of all showcases
function DivGrid() {
  return (
    <div className="content-stretch grid grid-cols-3 gap-[20px] relative shrink-0" data-name="div.showcase">
      <SpinnerShowcase />
      <DotsShowcase />
      <ProgressShowcase />
      <SplashShowcase />
      <ToastShowcase />
      <ModalShowcase />
      <AchievementShowcase />
      <QuizShowcase />
      <SkeletonShowcase />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-col px-[40px] py-[40px] relative shrink-0" data-name="main">
      <DivPageHdr />
      <DivGrid />
    </div>
  );
}

export default function LoadingPopups() {
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

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col h-screen isolate items-start justify-center relative size-full">
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start min-h-[100vh] relative size-full" data-name="39-loading-popups">
      <DivScreenId />
      <NavNav />
      <MainContent />
    </div>
  );
}
