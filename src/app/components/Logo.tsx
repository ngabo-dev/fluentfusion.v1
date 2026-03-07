import { useFluentNavigation } from '../hooks/useFluentNavigation';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Logo({ size = 'md', onClick }: LogoProps) {
  const nav = useFluentNavigation();
  
  const sizes = {
    sm: { container: 'size-[30px]', text: 'text-[14px]', logoText: 'text-[14px]' },
    md: { container: 'size-[38px]', text: 'text-[18px]', logoText: 'text-[18px]' },
    lg: { container: 'size-[48px]', text: 'text-[22px]', logoText: 'text-[22px]' },
  };
  
  const s = sizes[size];
  
  return (
    <div 
      className="flex gap-[11px] items-center cursor-pointer" 
      onClick={onClick || nav.toWelcome}
    >
      <div className={`bg-[#bfff00] flex items-center justify-center rounded-[10px] ${s.container}`}>
        <div className={`font-['Noto_Color_Emoji:Regular',sans-serif] ${s.text} text-black text-center`}>
          🧠
        </div>
      </div>
      <div className={`font-['Syne:ExtraBold',sans-serif] font-extrabold ${s.logoText} text-white tracking-[-0.36px] uppercase`}>
        <span>FLUENT</span>
        <span className="text-[#bfff00]">FUSION</span>
      </div>
    </div>
  );
}
