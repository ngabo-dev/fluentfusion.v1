import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

function DivScreenId() {
  return (
    <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
        <p className="leading-[16px]">13.3 · Empty States</p>
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
          <span className="text-[#bfff00]">Empty</span>
          <span> States</span>
        </p>
      </div>
    </div>
  );
}

function PageHdrSubtitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[15px] text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[24px]">Designs for when there's no content to show</p>
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

// Empty State 1: No Courses Yet
function EmptyCoursesIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[52px] opacity-50" data-name="div.empty-icon">
      <p className="leading-[normal]">📚</p>
    </div>
  );
}

function EmptyCoursesTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div.empty-title">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[32px]">No Courses Yet</p>
      </div>
    </div>
  );
}

function EmptyCoursesSub() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[300px] relative shrink-0" data-name="div.empty-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[22.4px] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">You haven't enrolled in any courses. Explore our catalog to get started!</p>
      </div>
    </div>
  );
}

function EmptyCoursesButton() {
  return (
    <button className="bg-[#bfff00] content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[#0a0a0a] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Browse Courses →</p>
      </div>
    </button>
  );
}

function EmptyCoursesBox() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-dashed border-solid content-stretch flex flex-col items-center justify-center px-[40px] py-[60px] relative rounded-[16px] shrink-0 gap-[16px]" data-name="div.empty-box">
      <EmptyCoursesIcon />
      <EmptyCoursesTitle />
      <EmptyCoursesSub />
      <EmptyCoursesButton />
    </div>
  );
}

// Empty State 2: No Badges Earned
function EmptyBadgesIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[52px] opacity-50" data-name="div.empty-icon">
      <p className="leading-[normal]">🏆</p>
    </div>
  );
}

function EmptyBadgesTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div.empty-title">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[32px]">No Badges Earned</p>
      </div>
    </div>
  );
}

function EmptyBadgesSub() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[300px] relative shrink-0" data-name="div.empty-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[22.4px] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">Complete your first lesson to earn your first achievement badge!</p>
      </div>
    </div>
  );
}

function EmptyBadgesButton() {
  return (
    <button className="bg-[#bfff00] content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[#0a0a0a] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Start Learning →</p>
      </div>
    </button>
  );
}

function EmptyBadgesBox() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-dashed border-solid content-stretch flex flex-col items-center justify-center px-[40px] py-[60px] relative rounded-[16px] shrink-0 gap-[16px]" data-name="div.empty-box">
      <EmptyBadgesIcon />
      <EmptyBadgesTitle />
      <EmptyBadgesSub />
      <EmptyBadgesButton />
    </div>
  );
}

// Empty State 3: No Posts Yet
function EmptyPostsIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[52px] opacity-50" data-name="div.empty-icon">
      <p className="leading-[normal]">💬</p>
    </div>
  );
}

function EmptyPostsTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div.empty-title">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[32px]">No Posts Yet</p>
      </div>
    </div>
  );
}

function EmptyPostsSub() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[300px] relative shrink-0" data-name="div.empty-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[22.4px] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">Be the first to ask a question or share a tip with the community!</p>
      </div>
    </div>
  );
}

function EmptyPostsButton() {
  return (
    <button className="bg-[#bfff00] content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[#0a0a0a] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Post Something →</p>
      </div>
    </button>
  );
}

function EmptyPostsBox() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-dashed border-solid content-stretch flex flex-col items-center justify-center px-[40px] py-[60px] relative rounded-[16px] shrink-0 gap-[16px]" data-name="div.empty-box">
      <EmptyPostsIcon />
      <EmptyPostsTitle />
      <EmptyPostsSub />
      <EmptyPostsButton />
    </div>
  );
}

// Empty State 4: No Notifications
function EmptyNotifIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[52px] opacity-50" data-name="div.empty-icon">
      <p className="leading-[normal]">🔔</p>
    </div>
  );
}

function EmptyNotifTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div.empty-title">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[32px]">No Notifications</p>
      </div>
    </div>
  );
}

function EmptyNotifSub() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[300px] relative shrink-0" data-name="div.empty-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[22.4px] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">You're all caught up! We'll notify you when something needs your attention.</p>
      </div>
    </div>
  );
}

function EmptyNotifBox() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-dashed border-solid content-stretch flex flex-col items-center justify-center px-[40px] py-[60px] relative rounded-[16px] shrink-0 gap-[16px]" data-name="div.empty-box">
      <EmptyNotifIcon />
      <EmptyNotifTitle />
      <EmptyNotifSub />
    </div>
  );
}

// Empty State 5: No Search Results
function EmptySearchIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[52px] opacity-50" data-name="div.empty-icon">
      <p className="leading-[normal]">🔍</p>
    </div>
  );
}

function EmptySearchTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div.empty-title">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[32px]">No Search Results</p>
      </div>
    </div>
  );
}

function EmptySearchSub() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[300px] relative shrink-0" data-name="div.empty-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[22.4px] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">We couldn't find anything matching "frnch gramar". Check your spelling and try again.</p>
      </div>
    </div>
  );
}

function EmptySearchButton() {
  return (
    <button className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Clear Search</p>
      </div>
    </button>
  );
}

function EmptySearchBox() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-dashed border-solid content-stretch flex flex-col items-center justify-center px-[40px] py-[60px] relative rounded-[16px] shrink-0 gap-[16px]" data-name="div.empty-box">
      <EmptySearchIcon />
      <EmptySearchTitle />
      <EmptySearchSub />
      <EmptySearchButton />
    </div>
  );
}

// Empty State 6: No Live Sessions
function EmptyLiveIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 text-[52px] opacity-50" data-name="div.empty-icon">
      <p className="leading-[normal]">🎥</p>
    </div>
  );
}

function EmptyLiveTitle() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="div.empty-title">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[32px]">No Live Sessions</p>
      </div>
    </div>
  );
}

function EmptyLiveSub() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[300px] relative shrink-0" data-name="div.empty-sub">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[22.4px] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="mb-0">No sessions scheduled right now. Check back later or browse recorded lessons.</p>
      </div>
    </div>
  );
}

function EmptyLiveButton() {
  return (
    <button className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="button.btn">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">View Recordings</p>
      </div>
    </button>
  );
}

function EmptyLiveBox() {
  return (
    <div className="bg-[#151515] border border-[#2a2a2a] border-dashed border-solid content-stretch flex flex-col items-center justify-center px-[40px] py-[60px] relative rounded-[16px] shrink-0 gap-[16px]" data-name="div.empty-box">
      <EmptyLiveIcon />
      <EmptyLiveTitle />
      <EmptyLiveSub />
      <EmptyLiveButton />
    </div>
  );
}

// Grid of all empty states
function DivGrid() {
  return (
    <div className="content-stretch grid grid-cols-3 gap-[20px] relative shrink-0" data-name="div.states-grid">
      <EmptyCoursesBox />
      <EmptyBadgesBox />
      <EmptyPostsBox />
      <EmptyNotifBox />
      <EmptySearchBox />
      <EmptyLiveBox />
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

export default function EmptyStates() {
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
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start min-h-[100vh] relative size-full" data-name="38-empty-states">
      <DivScreenId />
      <NavNav />
      <MainContent />
    </div>
  );
}
