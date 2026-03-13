import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

function DivScreenId() {
  return null;
}

function DivLogoMark() {
  return (
    <div className="bg-[var(--accent-primary)] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-[var(--text-tertiary)] text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[28.8px]">🧠</p>
      </div>
    </div>
  );
}

function DivLogoName() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-left text-[var(--text-primary)] tracking-[-0.36px] uppercase whitespace-nowrap">
        <p className="text-[18px]">
          <span className="leading-[28.8px] text-[var(--text-primary)]">FLUENT</span>
          <span className="leading-[28.8px] text-[var(--accent-primary)]">FUSION</span>
        </p>
      </div>
    </div>
  );
}

function ALogo({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="cursor-pointer relative shrink-0" onClick={onNavigate}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </div>
  );
}

function NavAvatar({ initials }: { initials: string }) {
  return (
    <div className="content-stretch flex items-center justify-center pb-[5.91px] pt-[5.09px] relative rounded-[16px] shrink-0 size-[32px]" style={{ backgroundImage: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)" }}>
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[13px] text-[var(--text-tertiary)] text-center whitespace-nowrap">
        <p className="leading-[20.8px]">{initials}</p>
      </div>
    </div>
  );
}

function NavSpan({ text }: { text: string }) {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] relative shrink-0">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">{text}</p>
      </div>
    </div>
  );
}

function NavNav({ initials, onLogoClick }: { initials: string; onLogoClick: () => void }) {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(var(--bg-primary-rgb),0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]">
      <div aria-hidden="true" className="absolute border-[var(--border-default)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo onNavigate={onLogoClick} />
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
              <NavSpan text="Listening Practice · 3 of 8" />
              <NavAvatar initials={initials} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }: { to: string; icon: string; label: string; active?: boolean }) {
  return (
    <Link to={to} className={`relative shrink-0 w-full block ${active ? 'bg-[var(--accent-primary-muted)]' : ''}`}>
      <div aria-hidden="true" className={`absolute border-l-2 border-solid inset-0 pointer-events-none ${active ? 'border-[var(--accent-primary)]' : 'border-[transparent]'}`} />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center pb-[10.89px] pl-[26px] pr-[24px] pt-[10.5px] relative w-full">
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
              <div className={`flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-left whitespace-nowrap ${active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                <p className="leading-[22.4px]">{icon}</p>
              </div>
            </div>
          </div>
          <div className={`flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-left whitespace-nowrap ${active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`} style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="leading-[22.4px]">{label}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AsideSidebar() {
  return (
    <div className="absolute bg-[var(--bg-secondary)] h-[834px] left-0 top-0 w-[240px]">
      <div className="content-stretch cursor-pointer flex flex-col items-start overflow-auto pr-px py-[20px] relative size-full">
        <SidebarLink to="/dashboard" icon="⚡" label="Dashboard" />
        <SidebarLink to="/courses" icon="📚" label="My Courses" />
        <SidebarLink to="/practice" icon="🎯" label="Practice" active />
        <SidebarLink to="/live-sessions" icon="🎥" label="Live Sessions" />
        <SidebarLink to="/community" icon="🌍" label="Community" />
        <SidebarLink to="/profile" icon="👤" label="Profile" />
      </div>
      <div aria-hidden="true" className="absolute border-[var(--border-default)] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-[var(--text-primary)] tracking-[-0.64px] uppercase w-full">
          <p className="text-[32px] whitespace-pre-wrap">
            <span className="leading-[51.2px] text-[var(--text-primary)]">Listening </span>
            <span className="leading-[51.2px] text-[var(--accent-primary)]">Practice</span>
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">Listen carefully and type exactly what you hear</p>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer() {
  return (
    <div className="absolute border border-[var(--accent-primary-muted)] border-solid h-[352.38px] left-0 right-0 rounded-[20px] top-0" style={{ backgroundImage: "linear-gradient(134.921deg, var(--accent-primary-muted) 0%, var(--accent-primary-muted) 100%)" }}>
      <div className="absolute content-stretch flex flex-col items-center left-[36px] right-[36px] top-[36px]">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[var(--accent-primary)] text-[10px] text-center tracking-[1.5px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">Listen & Type · Exercise 3</p>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-[var(--accent-primary)] content-stretch flex items-center justify-center left-1/2 pb-[18.41px] pt-[16.59px] rounded-[40px] shadow-[0px_0px_20px_0px_rgba(var(--accent-primary-rgb),0.3)] size-[80px] top-[72px] cursor-pointer">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[28px] text-[var(--text-tertiary)] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[44.8px]">▶</p>
        </div>
      </div>
      <div className="absolute bg-[var(--bg-tertiary)] content-stretch flex gap-[3px] h-[64px] items-center left-[36px] overflow-clip px-[20px] right-[36px] rounded-[14px] top-[172px]">
        {[20,36,28,48,32,40,24,44,18,52,30,42].map((h, i) => (
          <div key={i} className={`${i < 6 ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-elevated)]'} ${i < 6 ? 'opacity-90' : 'opacity-60'} h-[${h}px] rounded-[2px] shrink-0 w-[3px]`} />
        ))}
      </div>
      <div className="absolute content-stretch flex flex-col items-center left-[36px] right-[36px] top-[247px]">
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[19.2px]">0:04 / 0:09 · Plays remaining: 2</p>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[8px] items-start justify-center left-[36px] right-[36px] top-[283.19px]">
        {['0.75×', '1×', '1.25×', '1.5×'].map((speed, i) => {
          const speedClass = i === 1 ? 'bg-[var(--accent-primary-muted)]' : 'bg-[var(--bg-elevated)]';
          const borderClass = i === 1 ? 'border-[var(--accent-primary)]' : 'border-[var(--border-default)]';
          const textClass = i === 1 ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]';
          
          return (
            <div key={i} className={`content-stretch flex flex-col items-center pb-[6.19px] pt-[5px] px-[13px] relative rounded-[6px] self-stretch shrink-0 cursor-pointer ${speedClass}`}>
              <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[6px] ${borderClass}`} />
              <div className={`flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[12px] text-center whitespace-nowrap ${textClass}`} style={{ fontVariationSettings: "'opsz' 14" }}>
                <p className="leading-[19.2px]">{speed}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InputArea() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-0 pb-[7px] right-0 top-[376.37px]">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-[var(--text-primary)] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[22.4px] whitespace-pre-wrap">Type what you heard:</p>
        </div>
      </div>
      <div className="bg-[var(--bg-elevated)] min-h-[80px] relative rounded-[14px] shrink-0 w-full">
        <div className="flex flex-row justify-center min-h-[inherit] overflow-auto size-full">
          <div className="content-stretch flex items-start justify-center min-h-[inherit] pb-[41px] pt-[18px] px-[22px] relative w-full">
            <div className="flex-[1_0_0] min-h-px min-w-px relative">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
                <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[16px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
                  <p className="leading-[normal] whitespace-pre-wrap">Type what you hear in Kinyarwanda...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[var(--border-default)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function HintRow() {
  const hints = ['Muraho', 'amakuru', 'cyane', 'ni'];
  return (
    <>
      <div className="absolute content-stretch flex flex-col items-start left-0 pb-[0.8px] right-0 top-[510.76px]">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[20.8px]">Word hints (click to reveal):</p>
        </div>
      </div>
      <div className="absolute content-start flex flex-wrap gap-[0px_8px] items-start left-0 right-0 top-[542.56px]">
        {hints.map((hint, i) => (
          <div key={i} className={`bg-[var(--bg-tertiary)] content-stretch flex flex-col h-[13.8px] items-start pb-[7.8px] pt-[6px] px-[15px] relative rounded-[8px] shrink-0 cursor-pointer ${i === 1 ? 'opacity-40' : ''}`}>
            <div aria-hidden="true" className="absolute border border-[var(--border-default)] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-[var(--text-primary)] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
              <p className="leading-[20.8px]">{hint}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ActionButtons() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-0 right-0 top-[593.36px]">
      <div className="bg-[var(--accent-primary)] content-stretch flex items-center justify-center px-[24px] py-[12px] relative rounded-[8px] shadow-[0px_0px_12px_0px_rgba(var(--accent-primary-rgb),0.25)] shrink-0 cursor-pointer">
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[14px] text-center tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[normal]">Check Answer →</p>
        </div>
      </div>
      <div className="content-stretch flex items-center justify-center px-[25px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer">
        <div aria-hidden="true" className="absolute border border-[var(--border-default)] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-[var(--text-primary)] tracking-[0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[normal]">Skip</p>
        </div>
      </div>
      <div className="flex-[1_0_0] min-h-px min-w-[102.95px] relative">
        <div className="flex flex-col items-end min-w-[inherit] size-full">
          <div className="content-stretch flex flex-col items-end min-w-[inherit] pl-[309.48px] relative w-full">
            <div className="content-stretch flex items-center justify-center px-[16px] py-[12.5px] relative rounded-[8px] shrink-0 cursor-pointer">
              <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[13px] text-center tracking-[0.13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                <p className="leading-[normal]">← Previous</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PracticeContent() {
  return (
    <div className="h-[635.36px] max-w-[680px] relative shrink-0 w-[680px]">
      <AudioPlayer />
      <InputArea />
      <HintRow />
      <ActionButtons />
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch">
      <div className="flex flex-col items-center overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col gap-[28px] items-center px-[40px] py-[36px] relative size-full">
          <PageHeader />
          <PracticeContent />
        </div>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <div className="min-h-[834px] relative shrink-0 w-full z-[1]">
      <div className="flex flex-row justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center min-h-[inherit] pl-[240px] relative w-full">
          <AsideSidebar />
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default function Component18ListeningPractice() {
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
      <div className="bg-[var(--bg-primary)] content-stretch flex flex-col isolate items-start min-h-screen relative size-full">
        <div className="flex items-center justify-center min-h-screen w-full">
          <div className="text-[var(--accent-primary)] text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] content-stretch flex flex-col isolate items-start relative size-full">
      <DivScreenId />
      <NavNav initials={getUserInitials()} onLogoClick={handleLogoClick} />
      <AppWrapper />
    </div>
  );
}
