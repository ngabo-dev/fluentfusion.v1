import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

export default function Component34Pricing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  // Check auth status
  const token = localStorage.getItem('access_token');

  const handlePlanClick = (plan: string) => {
    if (!token) {
      navigate(`/login?redirect=/checkout?plan=${plan}`);
    } else {
      navigate(`/checkout?plan=${plan}`);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen" data-name="34-pricing">
      {/* Navigation */}
      <nav className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] sticky top-0 w-full z-50 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between px-[40px] h-full max-w-[1200px] mx-auto">
          <Link to="/" className="flex items-center gap-[11px]">
            <div className="bg-[#bfff00] w-[38px] h-[38px] rounded-[10px] flex items-center justify-center">
              <span className="text-[18px]">🧠</span>
            </div>
            <div className="font-['Syne:ExtraBold'] text-[18px] uppercase tracking-[-0.36px]">
              <span className="text-white">FLUENT</span>
              <span className="text-[#bfff00]">FUSION</span>
            </div>
          </Link>
          <div className="flex items-center gap-[12px]">
            <button 
              onClick={() => navigate('/login')}
              className="px-[24px] py-[11px] rounded-[8px] text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-[#bfff00] px-[24px] py-[11px] rounded-[8px] text-black font-semibold hover:bg-[#a8e600] transition-colors shadow-[0_0_12px_rgba(191,255,0,0.25)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="px-[40px] py-[64px] max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-[16px]">
          <h1 className="font-['Syne:ExtraBold'] text-[44px] font-extrabold uppercase tracking-[-0.03em] mb-[12px]">
            Simple, <span className="text-[#bfff00]">Honest</span> Pricing
          </h1>
          <p className="text-[16px] text-[#888]">Start free. Upgrade when you're ready. Cancel anytime.</p>
          
          {/* Monthly/Annual Toggle */}
          <div className="flex items-center justify-center gap-[10px] mt-[20px]">
            <span className="text-[14px] text-[#888]">Monthly</span>
            <div 
              className="w-[44px] h-[24px] rounded-[12px] bg-[#bfff00] relative cursor-pointer"
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className={`absolute w-[18px] h-[18px] rounded-full bg-black top-[3px] transition-all ${isAnnual ? 'right-[3px]' : 'left-[3px]'}`} />
            </div>
            <span className="text-[14px] font-semibold text-[#bfff00]">
              Annual <span className="bg-[rgba(191,255,0,0.12)] rounded-[4px] px-[6px] py-[2px] text-[11px]">Save 40%</span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-3 gap-[20px] max-w-[900px] mx-auto mt-[40px]">
          {/* Free Starter */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[20px] p-[32px] relative">
            <div className="font-['JetBrains_Mono:Regular'] text-[11px] tracking-[0.12em] uppercase text-[#888] mb-[8px]">Free</div>
            <div className="text-[18px] font-bold mb-[4px]">Starter</div>
            <div className="font-['Syne:ExtraBold'] text-[44px] font-extrabold leading-[1] my-[16px]">
              $0<span className="text-[16px] font-normal text-[#888]">/mo</span>
            </div>
            <div className="text-[13px] text-[#888] mb-[20px]">Perfect to try FluentFusion</div>
            
            <button 
              onClick={() => handlePlanClick('starter')}
              className="w-full border border-[#333] text-white py-[12px] rounded-[8px] mb-[20px] hover:bg-[#1a1a1a] transition-colors"
            >
              Get Started Free
            </button>
            
            {/* Features */}
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                3 free courses
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Basic flashcards
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Community access
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Daily streak tracking
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-[#888] pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#555] text-[10px]">−</div>
                AI Pronunciation feedback
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-[#888] pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#555] text-[10px]">−</div>
                Live sessions
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-[#888]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#555] text-[10px]">−</div>
                Certificates
              </div>
            </div>
          </div>

          {/* Pro Learner - Most Popular */}
          <div className="bg-[#151515] border-2 border-[#bfff00] rounded-[20px] p-[32px] relative shadow-[0_0_24px_rgba(191,255,0,0.3),0_0_48px_rgba(191,255,0,0.14)]">
            <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-[#bfff00] text-black text-[11px] font-bold py-[4px] px-[14px] rounded-[99px] uppercase tracking-[0.06em] whitespace-nowrap">
              ⭐ Most Popular
            </div>
            <div className="font-['JetBrains_Mono:Regular'] text-[11px] tracking-[0.12em] uppercase text-[#bfff00] mb-[8px]">Pro</div>
            <div className="text-[18px] font-bold mb-[4px]">Learner</div>
            <div className="font-['Syne:ExtraBold'] text-[44px] font-extrabold leading-[1] my-[16px] text-[#bfff00]">
              $9<span className="text-[16px] font-normal text-[#888]">/mo</span>
            </div>
            <div className="text-[13px] text-[#888] mb-[20px]">
              <s className="text-[#555]">$15/mo</s> billed annually
            </div>
            
            <button 
              onClick={() => handlePlanClick('pro')}
              className="w-full bg-[#bfff00] text-black font-semibold py-[12px] rounded-[8px] mb-[20px] hover:bg-[#a8e600] transition-colors shadow-[0_0_24px_rgba(191,255,0,0.3)]"
            >
              Start 7-Day Free Trial →
            </button>
            
            {/* Features */}
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Unlimited courses
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                AI pronunciation feedback
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                2 live sessions / month
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Completion certificates
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Offline downloads
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-[#888] pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#555] text-[10px]">−</div>
                Unlimited live sessions
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-[#888]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#555] text-[10px]">−</div>
                1-on-1 tutoring
              </div>
            </div>
          </div>

          {/* Premium Fluent */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[20px] p-[32px] relative">
            <div className="font-['JetBrains_Mono:Regular'] text-[11px] tracking-[0.12em] uppercase text-[#888] mb-[8px]">Premium</div>
            <div className="text-[18px] font-bold mb-[4px]">Fluent</div>
            <div className="font-['Syne:ExtraBold'] text-[44px] font-extrabold leading-[1] my-[16px]">
              $24<span className="text-[16px] font-normal text-[#888]">/mo</span>
            </div>
            <div className="text-[13px] text-[#888] mb-[20px]">
              <s className="text-[#555]">$40/mo</s> billed annually
            </div>
            
            <button 
              onClick={() => handlePlanClick('premium')}
              className="w-full border border-[#333] text-white py-[12px] rounded-[8px] mb-[20px] hover:bg-[#1a1a1a] transition-colors"
            >
              Get Fluent →
            </button>
            
            {/* Features */}
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Everything in Pro
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Unlimited live sessions
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                1-on-1 tutoring sessions
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Priority support
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Custom learning path
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white pb-[8px] border-b border-[rgba(42,42,42,0.4)]">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Advanced analytics
              </div>
              <div className="flex items-center gap-[10px] text-[14px] text-white">
                <div className="w-[18px] h-[18px] rounded-full bg-[rgba(0,255,127,0.12)] flex items-center justify-center text-[#00ff7f] text-[10px]">✓</div>
                Early access features
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Screen ID */}
      <div className="absolute bottom-[224.69px] right-[17px] bg-[#151515] border border-[#2a2a2a] px-[11px] py-[6px] rounded-[6px]">
        <div className="font-['JetBrains_Mono:Regular'] text-[10px] text-[#555] tracking-[1px]">12.1 · Pricing</div>
      </div>
    </div>
  );
}
