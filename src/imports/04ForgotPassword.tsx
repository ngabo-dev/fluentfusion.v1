import { imgGradient } from "./svg-xvfp9";
import { useNavigate } from "react-router";
import { useState } from "react";
import { authApi } from "../app/api/config";

export default function Component04ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await authApi.forgotPassword({ email });
      setMessage("If this email exists, a reset link has been sent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start pointer-events-auto relative size-full" data-name="04-forgot-password">
      <div className="absolute bg-[#151515] bottom-[16px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="Background+Border">
        <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
          <p className="leading-[16px]">1.4 · Forgot Password</p>
        </div>
      </div>
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="Nav">
        <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center pb-px px-[40px] relative size-full">
            <div className="relative shrink-0" data-name="Link">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
                <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="Background">
                  <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-center whitespace-nowrap">
                    <p className="leading-[28.8px]">🧠</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
                  <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[18px] text-white tracking-[-0.36px] uppercase whitespace-nowrap">
                    <p>
                      <span className="leading-[28.8px]">FLUENT</span>
                      <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[834px] pointer-events-auto relative shrink-0 w-full z-[10]" data-name="Container">
        <div className="flex flex-row items-center justify-center min-h-[inherit] overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-center min-h-[inherit] pb-[124.62px] pt-[124.63px] px-[40px] relative w-full">
            <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute left-1/2 size-[500px] top-1/2 z-[0]" data-name="Gradient" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 500 500\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(35.355 0 0 35.355 250 250)\\'><stop stop-color=\\'rgba(191,255,0,0.05)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.65\\'/></radialGradient></defs></svg>')" }} />
            <div className="bg-[#151515] content-stretch flex flex-col gap-[28px] items-center max-w-[420px] pb-[45.01px] pt-[44px] px-[45px] relative rounded-[20px] shrink-0 w-[420px]" data-name="Background+Border">
              <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[20px]" />
              <div className="absolute inset-px pointer-events-none" data-name="Mask Group">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                  <div className="absolute inset-[0_0_-0.16px_0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0%_0%] mask-size-[100%_100%] rounded-[20px]" data-name="Gradient" style={{ backgroundImage: "linear-gradient(144.954deg, rgba(191, 255, 0, 0.15) 0%, rgba(191, 255, 0, 0) 50%)", maskImage: `url('${imgGradient}')` }} />
                </div>
              </div>
              <div className="relative shrink-0 w-full" data-name="Link">
                <button onClick={() => navigate('/login')} className="cursor-pointer bg-transparent border-none text-left w-full">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[0.8px] relative w-full">
                    <div className="flex flex-[1_0_0] flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#888] text-[13px] hover:text-white transition-colors" style={{ fontVariationSettings: "'opsz' 9" }}>
                      <p className="leading-[20.8px] whitespace-pre-wrap">← Back to Login</p>
                    </div>
                  </div>
                </button>
              </div>
              <div className="bg-[rgba(191,255,0,0.1)] h-[59.195px] relative rounded-[32px] shrink-0 w-[64px]" data-name="Overlay+Border">
                <div aria-hidden="true" className="absolute border border-[rgba(191,255,0,0.2)] border-solid inset-0 pointer-events-none rounded-[32px]" />
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[5.595px] pt-[8.6px] px-px relative size-full">
                  <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[28px] text-center text-white whitespace-nowrap">
                    <p className="leading-[44.8px]">🔑</p>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative w-full">
                  <div className="content-stretch flex flex-col items-center pb-[0.585px] relative shrink-0 w-full" data-name="Container">
                    <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[38.4px] relative shrink-0 text-[24px] text-center text-white tracking-[-0.48px] uppercase whitespace-nowrap">
                      <p className="mb-0">Forgot</p>
                      <p>Password</p>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
                    <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[22.4px] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                      <p className="mb-0">{`No worries! Enter your email and we'll send you`}</p>
                      <p>reset instructions.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7px] items-start pb-[6px] relative w-full">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
                    <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
                      <p className="leading-[16px] whitespace-pre-wrap">Email Address</p>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
                    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full z-[10]" data-name="Input">
                      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-start justify-center pl-[45px] pr-[17px] py-[13px] relative w-full">
                          <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="jean@example.com"
                              className="w-full bg-transparent border-none outline-none text-white text-[15px] font-['DM_Sans:9pt_Regular'] placeholder:text-[#555]"
                            />
                          </div>
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </div>
                    <div className="absolute bottom-[22.17%] content-stretch flex flex-col items-start left-[14px] top-[22.2%]" data-name="Container">
                      <div className="flex flex-col font-['Noto_Color_Emoji:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888] text-[16px] whitespace-nowrap">
                        <p className="leading-[25.6px]">✉️</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <div className="bg-[rgba(255,0,0,0.1)] border border-red-500 px-[12px] py-[8px] rounded-[8px] w-full">
                  <p className="text-red-500 text-[13px] text-center">{error}</p>
                </div>
              )}
              {message && (
                <div className="bg-[rgba(0,255,0,0.1)] border border-green-500 px-[12px] py-[8px] rounded-[8px] w-full">
                  <p className="text-green-500 text-[13px] text-center">{message}</p>
                </div>
              )}
              <div className="bg-[#bfff00] relative rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 w-full z-[20] cursor-pointer" data-name="Button" onClick={handleSubmit}>
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[11px] pt-[15px] px-[36px] relative w-full">
                    <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] text-center tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                      <p className="leading-[normal]">{isLoading ? 'Sending...' : 'Send Reset Link →'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full" data-name="Container">
                <button onClick={() => navigate('/login')} className="cursor-pointer bg-transparent border-none text-center w-full">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
                    <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center whitespace-nowrap hover:text-[#bfff00] transition-colors" style={{ fontVariationSettings: "'opsz' 9" }}>
                      <p>
                        <span className="leading-[22.4px]">{`Remember your password? `}</span>
                        <span className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[22.4px] text-[#bfff00]" style={{ fontVariationSettings: "'opsz' 14" }}>
                          Sign In
                        </span>
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}