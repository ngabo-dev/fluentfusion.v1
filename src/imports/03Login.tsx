import clsx from "clsx";
import { imgGradient } from "./svg-49x50";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { authApi } from "../app/api/config";

export default function Component03Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  // Handle error display with animation
  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      // Auto-dismiss after 5 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setErrorVisible(false);
        setTimeout(() => setError(""), 300); // Clear after fade animation
      }, 5000);
    } else {
      setErrorVisible(false);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  // Clear error when user starts typing
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      setErrorVisible(false);
      setTimeout(() => setError(""), 300);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) {
      setErrorVisible(false);
      setTimeout(() => setError(""), 300);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.login({ email, password });
      // Successful login - redirect based on user role
      const userRole = response.user?.role;
      
      // Only show onboarding for students (not instructors or admins)
      if (userRole === 'admin') {
        navigate('/admin/analytics');
      } else if (userRole === 'instructor') {
        navigate('/instructor/dashboard');
      } else if (userRole === 'student') {
        // Check if student needs to complete onboarding (stored in localStorage during signup)
        const onboardingData = localStorage.getItem('onboarding_native_lang');
        if (!onboardingData) {
          navigate('/onboard/native-language');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Default fallback for any other role
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Show user-friendly error message
      const errorMessage = err.message || "";
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        setError("Invalid email or password.");
      } else if (errorMessage.includes("verify your email")) {
        setError("Please verify your email first.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col" data-name="03-login">
      {/* Screen ID */}
      <div className="absolute top-4 right-4 bg-[#151515] border border-[#2a2a2a] px-3 py-1.5 rounded-md z-10">
        <div className="text-[10px] text-[#555] tracking-widest">1.3 · Login</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[440px]">
          {/* Gradient background */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 600 600\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(42.426 0 0 42.426 300 300)\\'><stop stop-color=\\'rgba(191,255,0,0.06)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.65\\'/></radialGradient></defs></svg>')" }}
          />

          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[20px] p-8 relative overflow-hidden">
            {/* Mask gradient overlay */}
            <div className="absolute inset-0 rounded-[20px] pointer-events-none" 
              style={{ background: "linear-gradient(145deg, rgba(191, 255, 0, 0.18) 0%, rgba(191, 255, 0, 0) 50%)" }}
            />

            {/* Back link */}
            <button 
              onClick={() => navigate('/')} 
              className="text-[#888] text-[13px] hover:text-white transition-colors mb-6"
            >
              ← Back to Home
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="bg-[#bfff00] w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-[15px]">🧠</span>
              </div>
              <div className="font-['Syne:ExtraBold'] text-[15px] uppercase tracking-wide">
                <span className="text-white">FLUENT</span>
                <span className="text-[#bfff00]">FUSION</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-['Syne:ExtraBold'] text-[26px] font-extrabold uppercase tracking-wide text-white mb-2">
              Welcome<br />
              <span className="text-[#bfff00]">Back</span>
            </h1>
            <p className="text-[#888] text-[14px] mb-6">
              Sign in to continue your learning journey
            </p>

            {/* Error Message - Above form, no layout shift */}
            <div 
              className={clsx(
                "mb-4 p-3 rounded-lg border transition-all duration-300 ease-in-out",
                error && errorVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 -translate-y-2 pointer-events-none",
                error && errorVisible ? "bg-red-500/10 border-red-500" : ""
              )}
            >
              <p className="text-red-500 text-sm">{error}</p>
            </div>

            {/* Form - using proper form structure for browser password manager */}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[#888] text-[10px] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    ref={emailInputRef}
                    type="email"
                    autoComplete="email"
                    name="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg py-3 pl-11 pr-4 text-white text-[15px] placeholder-[#555] outline-none focus:border-[#bfff00] transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]">✉️</span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#888] text-[10px] uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg py-3 pl-11 pr-4 text-white text-[15px] placeholder-[#555] outline-none focus:border-[#bfff00] transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]">🔒</span>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div 
                    className={clsx(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      rememberMe ? "bg-[#bfff00] border-[#bfff00]" : "border-[#bfff00]"
                    )}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <span className="text-black text-[10px]">✓</span>}
                  </div>
                  <span className="text-[#888] text-[13px]">Remember me</span>
                </label>
                <button 
                  onClick={() => navigate('/forgot-password')}
                  className="text-[#bfff00] text-[13px] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={isLoading}
                className={clsx(
                  "w-full bg-[#bfff00] text-black font-semibold py-3 rounded-lg transition-all duration-200",
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#a8e600] shadow-[0_0_12px_rgba(191,255,0,0.25)]"
                )}
              >
                {isLoading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-[#888] text-[12px]">or</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            {/* Social login buttons */}
            <button className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg py-3 flex items-center justify-center gap-2 mb-3 hover:bg-[#252525] transition-colors">
              <span>🇬</span>
              <span className="text-white text-[14px]">Continue with Google</span>
            </button>
            <button className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-[#252525] transition-colors">
              <span>🍎</span>
              <span className="text-white text-[14px]">Continue with Apple</span>
            </button>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <span className="text-[#888] text-[14px]">Don't have an account? </span>
              <button 
                onClick={() => navigate('/signup')}
                className="text-[#bfff00] text-[14px] font-semibold hover:underline"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] sticky top-0 w-full z-50 border-t border-[#2a2a2a]">
        <div className="flex items-center justify-between px-10 h-full max-w-[1200px] mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-[11px]">
            <div className="bg-[#bfff00] w-[38px] h-[38px] rounded-[10px] flex items-center justify-center">
              <span className="text-[18px]">🧠</span>
            </div>
            <div className="font-['Syne:ExtraBold'] text-[18px] uppercase tracking-[-0.36px]">
              <span className="text-white">FLUENT</span>
              <span className="text-[#bfff00]">FUSION</span>
            </div>
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="text-white hover:text-[#bfff00] transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>
    </div>
  );
}
