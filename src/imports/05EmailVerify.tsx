import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { authApi } from "../app/api/config";
import { imgGradient } from "./svg-cxw8d";

type InputBackgroundImage1Props = {
  text: string;
  value: string;
  onChange: (value: string) => void;
  index: number;
  total: number;
};

function InputBackgroundImage1({ text, value, onChange, index, total }: InputBackgroundImage1Props) {
  return (
    <div className="bg-[#1f1f1f] h-[64px] relative rounded-[10px] shrink-0 w-[56px]">
      <div className="content-stretch flex flex-col items-start overflow-clip px-px py-[15px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center overflow-auto relative w-full">
            <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[var(--accent-primary)] text-[28px] text-center whitespace-nowrap">
              <p className="leading-[normal]">{value || text}</p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[var(--accent-primary)] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_0px_0px_2px_rgba(var(--accent-primary-rgb),0.12)]" />
    </div>
  );
}

function InputBackgroundImage({ value, onChange, index }: { value: string; onChange: (value: string) => void; index: number }) {
  return (
    <div className="bg-[#1f1f1f] h-[64px] relative rounded-[10px] shrink-0 w-[56px]">
      <div className="content-stretch flex flex-col items-start overflow-clip px-px py-[15px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] w-full">
            <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[28px] text-center whitespace-nowrap">
              <p className="leading-[normal]">{value || "—"}</p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[var(--border-subtle)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

export default function Component05EmailVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage or URL query params
    const storedEmail = localStorage.getItem('verification_email');
    const urlParams = new URLSearchParams(location.search);
    const urlEmail = urlParams.get('email');
    
    if (storedEmail) {
      setEmail(storedEmail);
    } else if (urlEmail) {
      setEmail(urlEmail);
    }

    // Start resend timer
    setResendTimer(47);
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  // Handle OTP input - auto-verify when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      // Small delay to allow UI to update
      const timer = setTimeout(() => {
        handleVerify(otp);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp, isLoading]);

  // Verify function that can be called with or without code
  const handleVerify = async (code?: string) => {
    const verifyCode = code || otp;
    if (!verifyCode || verifyCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      setSuccess("");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await authApi.verifyEmail({ email, code: verifyCode });
      setSuccess("Email verified successfully!");
      setError("");
      // Clear the verification email and redirect to login
      localStorage.removeItem('verification_email');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Invalid verification code. Please try again.");
      setSuccess("");
      // Clear OTP so user can try again
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    setError("");

    try {
      await authApi.resendVerification({ email });
      setSuccess("A new verification code has been sent to your email.");
      setResendTimer(47);
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmailSubmit = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const result = await authApi.changeEmail({ old_email: email, new_email: newEmail });
      setEmail(newEmail);
      localStorage.setItem('verification_email', newEmail);
      setSuccess("Verification code sent to " + newEmail);
      setShowChangeEmail(false);
      setNewEmail("");
      setOtp("");
      setResendTimer(47);
    } catch (err: any) {
      setError(err.message || "Failed to change email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setShowChangeEmail(true);
    setError("");
    setSuccess("");
  };

  const handleCancelChangeEmail = () => {
    setShowChangeEmail(false);
    setNewEmail("");
    setError("");
  };

  // Split OTP into individual digits for display
  const otpDigits = otp.split("");
  while (otpDigits.length < 6) {
    otpDigits.push("");
  }

  // Handle OTP input
  const handleOtpChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(cleaned);
  };

  return (
    <div className="bg-[var(--bg-primary)] content-stretch flex flex-col isolate items-start pointer-events-auto relative size-full" data-name="05-email-verify">
      <div className="backdrop-blur-[8px] bg-[rgba(var(--bg-primary-rgb),0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="Nav">
        <div aria-hidden="true" className="absolute border-[var(--border-subtle)] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center pb-px px-[40px] relative size-full">
            <div className="relative shrink-0" data-name="Link">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
                <div className="bg-[var(--accent-primary)] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="Background">
                  <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-black whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
                    <p className="leading-[28.8px]">🧠</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
                  <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-[var(--text-primary)] tracking-[-0.36px] uppercase whitespace-nowrap">
                    <p className="text-[18px]">
                      <span className="leading-[28.8px] text-[var(--text-primary)]">FLUENT</span>
                      <span className="leading-[28.8px] text-[var(--accent-primary)]">FUSION</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[834px] pointer-events-auto relative shrink-0 w-full z-[10]" data-name="Container">
        <div className="flex flex-row items-center justify-center min-h-[inherit] overflow-clip pointer-events-auto rounded-[inherit] size-full z-[5]">
          <div className="content-stretch flex items-center justify-center min-h-[inherit] px-[40px] py-[111.31px] relative w-full">
            <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute left-1/2 size-[600px] top-1/2 z-[0]" data-name="Gradient" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 600 600\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(42.426 0 0 42.426 300 300)\\'><stop stop-color=\\'rgba(191,255,0,0.06)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.65\\'/></radialGradient></defs></svg>')" }} />
            <div className="bg-[var(--bg-secondary)] h-[611.38px] max-w-[460px] pointer-events-auto relative rounded-[20px] shrink-0 w-[460px] z-[10]" data-name="Background+Border">
              <div aria-hidden="true" className="absolute border border-[var(--border-subtle)] border-solid inset-0 pointer-events-none rounded-[20px]" />
              <div className="-translate-x-1/2 absolute bg-[rgba(var(--accent-primary-rgb),0.1)] content-stretch flex items-center justify-center left-1/2 p-px rounded-[48px] size-[96px] top-[49px]" data-name="Overlay+Border+Shadow">
                <div aria-hidden="true" className="absolute border border-[rgba(var(--accent-primary-rgb),0.2)] border-solid inset-0 pointer-events-none rounded-[48px] shadow-[0px_0px_12px_0px_rgba(var(--accent-primary-rgb),0.25)]" />
                <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[40px] text-center text-[var(--text-primary)] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
                  <p className="leading-[64px]">📧</p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col items-center left-[49px] right-[49px] top-[172.3px]" data-name="Container">
                <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[41.6px] relative shrink-0 text-[26px] text-center text-[var(--text-primary)] tracking-[-0.52px] uppercase whitespace-nowrap">
                  <p className="mb-0">Check Your</p>
                  <p>Email</p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col items-center left-[49px] pb-[0.69px] right-[49px] top-[265.09px]" data-name="Container">
                <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[23.8px] relative shrink-0 text-[var(--text-tertiary)] text-[0px] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                  <p className="mb-0" style={{ fontVariationSettings: "'opsz' 9" }}>
                    We sent a verification code to
                  </p>
                  <p className="font-['DM_Sans:Bold',sans-serif] font-bold text-[var(--text-primary)]" style={{ fontVariationSettings: "'opsz' 14" }}>
                    {email || "your email"}
                  </p>
                </div>
              </div>

              {/* Error/Success Messages - show only one at a time */}
              <div className="absolute content-stretch flex flex-col items-center left-[49px] right-[49px] top-[310px] z-[15]">
                {error && (
                  <div className="bg-[rgba(var(--color-danger-rgb),0.1)] border border-[var(--color-danger)] border-solid px-[12px] py-[8px] rounded-[8px] w-full">
                    <p className="text-[var(--color-danger)] text-[13px] leading-[20px] text-center">{error}</p>
                  </div>
                )}
                {success && !error && (
                  <div className="bg-[rgba(var(--color-success-rgb),0.1)] border border-[var(--color-success)] border-solid px-[12px] py-[8px] rounded-[8px] w-full">
                    <p className="text-[var(--color-success)] text-[13px] leading-[20px] text-center">{success}</p>
                  </div>
                )}
              </div>

              {/* OTP Input - single input field styled as 6 boxes */}
                <div className="absolute content-stretch flex gap-[10px] items-start justify-center left-[37px] right-[37px] top-[341.78px] z-[20]">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      placeholder="-"
                      value={otpDigits[index] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val) {
                          // If user types a digit, update the full OTP and move focus to next
                          const newOtp = otp.slice(0, index) + val + otp.slice(index + 1);
                          setOtp(newOtp);
                          // Move focus to next input if available
                          if (index < 5) {
                            const inputs = document.querySelectorAll('.otp-input');
                            (inputs[index + 1] as HTMLInputElement)?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          if (!otpDigits[index] && index > 0) {
                            // If current is empty, focus previous input
                            const inputs = document.querySelectorAll('.otp-input');
                            (inputs[index - 1] as HTMLInputElement)?.focus();
                          }
                          // Clear the current digit
                          const newOtp = otp.slice(0, index) + '' + otp.slice(index + 1);
                          setOtp(newOtp);
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text');
                        const cleaned = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
                        if (cleaned.length > 0) {
                          setOtp(cleaned);
                          // Focus the last filled input or first empty
                          const focusIndex = Math.min(cleaned.length, 5);
                          setTimeout(() => {
                            const inputs = document.querySelectorAll('.otp-input');
                            (inputs[focusIndex] as HTMLInputElement)?.focus();
                          }, 0);
                        }
                      }}
                      className="otp-input bg-[var(--bg-tertiary)] h-[64px] rounded-[10px] shrink-0 w-[56px] text-[var(--accent-primary)] text-[28px] text-center font-['Syne:ExtraBold'] font-extrabold outline-none border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] cursor-pointer placeholder:text-[var(--text-tertiary)]"
                      style={{ fontFamily: "'Syne:ExtraBold', sans-serif" }}
                    />
                  ))}
                </div>
              <div 
                className={`absolute bg-[#bfff00] content-stretch flex items-center justify-center left-[49px] px-[36px] py-[15px] right-[49px] rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] top-[433.78px] cursor-pointer z-[25] ${isLoading ? 'opacity-50' : ''}`} 
                data-name="Button"
                onClick={() => !isLoading && handleVerify()}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
              >
                <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[var(--bg-primary)] text-[16px] text-center tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                  <p className="leading-[normal]">{isLoading ? 'Verifying...' : 'Verify Email →'}</p>
                </div>
              </div>
              <div className="absolute content-stretch flex gap-[5.99px] items-start left-[49px] pb-[0.8px] pl-[57.88px] pr-[57.89px] right-[49px] top-[507.78px] z-[20]" data-name="Container">
                <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[var(--text-tertiary)] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
                  <p className="leading-[20.8px]">{`Didn't receive the code? `}</p>
                </div>
                <div 
                  className={`content-stretch flex items-start justify-center relative shrink-0 cursor-pointer z-[20] ${resendTimer > 0 ? 'opacity-50' : ''}`}
                  onClick={handleResend}
                >
                  <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[var(--accent-primary)] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                    <p className="leading-[20.8px]">{resendTimer > 0 ? `Resend in 0:${resendTimer.toString().padStart(2, '0')}` : 'Resend Code'}</p>
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col items-center left-[49px] pb-[0.8px] right-[49px] top-[540.58px] z-[20]" data-name="Container">
                <div 
                  className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center whitespace-nowrap cursor-pointer" 
                  style={{ fontVariationSettings: "'opsz' 9" }}
                  onClick={handleChangeEmail}
                >
                  <p className="text-[13px]">
                    <span className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[20.8px] text-[var(--text-tertiary)]" style={{ fontVariationSettings: "'opsz' 9" }}>Wrong email? </span>
                    <span className="font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[20.8px] text-[var(--accent-primary)]" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Change it
                    </span>
                  </p>
                </div>
              </div>
              <div className="absolute inset-px pointer-events-none" data-name="Mask Group">
                <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0%_0%] mask-size-[100%_100%] rounded-[20px]" data-name="Gradient" style={{ backgroundImage: "linear-gradient(145deg, rgba(191, 255, 0, 0.15) 0%, rgba(191, 255, 0, 0) 50%)", maskImage: `url('${imgGradient}')` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Email Modal */}
      {showChangeEmail && (
        <div className="absolute inset-0 z-[50] flex items-center justify-center bg-[rgba(var(--bg-primary-rgb),0.8)]">
          <div className="bg-[var(--bg-secondary)] p-[24px] rounded-[20px] w-[360px] border border-[var(--border-subtle)]">
            <div className="text-center mb-[20px]">
              <h3 className="text-[var(--text-primary)] text-[20px] font-['Syne:ExtraBold'] font-bold">Change Email</h3>
              <p className="text-[var(--text-tertiary)] text-[14px] mt-[8px]">Enter your correct email to receive a new verification code</p>
            </div>
            
            <div className="mb-[16px]">
              <label className="text-[var(--text-tertiary)] text-[12px] block mb-[8px]">Current Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[10px] px-[12px] py-[12px] text-[var(--text-tertiary)] text-[14px]"
              />
            </div>

            <div className="mb-[20px]">
              <label className="text-[var(--text-tertiary)] text-[12px] block mb-[8px]">New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your correct email"
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[10px] px-[12px] py-[12px] text-[var(--text-primary)] text-[14px] focus:border-[var(--accent-primary)] outline-none"
              />
            </div>

            {error && (
              <div className="mb-[16px] bg-[rgba(var(--color-danger-rgb),0.1)] border border-[var(--color-danger)] border-solid px-[12px] py-[8px] rounded-[8px]">
                <p className="text-[var(--color-danger)] text-[13px] text-center">{error}</p>
              </div>
            )}

            <div className="flex gap-[12px]">
              <button
                onClick={handleCancelChangeEmail}
                className="flex-1 bg-[var(--border-default)] text-[var(--text-primary)] py-[12px] rounded-[10px] text-[14px] font-semibold hover:bg-[var(--border-subtle)]"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeEmailSubmit}
                disabled={isLoading}
                className={`flex-1 bg-[var(--accent-primary)] text-[var(--bg-primary)] py-[12px] rounded-[10px] text-[14px] font-semibold ${isLoading ? 'opacity-50' : 'hover:bg-[var(--accent-primary-hover)]'}`}
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
