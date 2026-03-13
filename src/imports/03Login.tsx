import clsx from "clsx";
import { imgGradient } from "./svg-49x50";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { authApi } from "../app/api/config";

export default function Component03Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      if (userRole === 'super_admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
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
      
      // Provide more specific error messages
      if (errorMessage.includes("No account found")) {
        setError("No account found with this email. Please sign up first.");
      } else if (errorMessage.includes("Password is incorrect")) {
        setError("Password is incorrect. Please check your password and try again.");
      } else if (errorMessage.includes("verify your email")) {
        setError("Please verify your email first. Check your inbox for the verification link.");
      } else if (errorMessage.includes("inactive") || errorMessage.includes("deactivated")) {
        setError("Your account has been deactivated. Please contact support.");
      } else if (errorMessage.includes("banned")) {
        setError("Your account has been banned. Please contact support.");
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        setError("Unable to connect to server. Please check your internet connection.");
      } else if (errorMessage) {
        // Show the actual error message for debugging
        setError(`Error: ${errorMessage}`);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen flex flex-col" data-name="03-login">
      {/* Navigation bar - Top */}
      <nav className="backdrop-blur-[8px] bg-[rgba(var(--bg-primary-rgb),0.95)] h-[66px] sticky top-0 w-full z-50 border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between px-10 h-full max-w-[1200px] mx-auto">
           <button onClick={() => navigate('/')} className="flex items-center gap-[11px]">
             <div className="bg-[var(--accent-primary)] w-[38px] h-[38px] rounded-[10px] flex items-center justify-center">
               <span className="text-[18px]">🧠</span>
             </div>
             <div className="font-['Syne:ExtraBold'] text-[18px] uppercase tracking-[-0.36px]">
               <span className="text-[var(--text-primary)]">FLUENT</span>
               <span className="text-[var(--accent-primary)]">FUSION</span>
             </div>
           </button>
           <button 
             onClick={() => navigate('/signup')}
             className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
           >
             Sign Up
           </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[440px]">
          {/* Gradient background */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 600 600\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(42.426 0 0 42.426 300 300)\\'><stop stop-color=\\'rgba(191,255,0,0.06)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,255,0,0)\\' offset=\\'0.65\\'/></radialGradient></defs></svg>')" }}
          />

           <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[20px] p-8 relative overflow-hidden">
           {/* Mask gradient overlay */}
             <div className="absolute inset-0 rounded-[20px] pointer-events-none" 
               style={{ background: "linear-gradient(145deg, rgba(var(--accent-primary-rgb),0.18) 0%, rgba(var(--accent-primary-rgb),0) 50%)" }}
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
               <div className="bg-[var(--accent-primary)] w-8 h-8 rounded-lg flex items-center justify-center">
                 <span className="text-[15px]">🧠</span>
               </div>
               <div className="font-['Syne:ExtraBold'] text-[15px] uppercase tracking-wide">
                 <span className="text-[var(--text-primary)]">FLUENT</span>
                 <span className="text-[var(--accent-primary)]">FUSION</span>
               </div>
             </div>

             {/* Title */}
             <h1 className="font-['Syne:ExtraBold'] text-[26px] font-extrabold uppercase tracking-wide text-[var(--text-primary)] mb-2">
               Welcome<br />
               <span className="text-[var(--accent-primary)]">Back</span>
             </h1>
             <p className="text-[var(--text-tertiary)] text-[14px] mb-6">
               Sign in to continue your learning journey
             </p>

             {/* Error Message - Above form, no layout shift */}
             <div 
               className={clsx(
                 "mb-4 p-3 rounded-lg border transition-all duration-300 ease-in-out",
                 error && errorVisible 
                   ? "opacity-100 translate-y-0" 
                   : "opacity-0 -translate-y-2 pointer-events-none",
                 error && errorVisible ? "bg-[var(--color-danger)/10] border-[var(--color-danger)]" : ""
               )}
             >
               <p className="text-[var(--color-danger)] text-sm">{error}</p>
             </div>

             {/* Form - using proper form structure for browser password manager */}
             <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
               {/* Email */}
               <div>
                 <label htmlFor="email" className="block text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider mb-2">
                   Email Address
                 </label>
                 <div className="relative">
                   <input
                     ref={emailInputRef}
                     id="email"
                     name="email"
                     type="email"
                     autoComplete="email"
                     aria-label="Email address"
                     value={email}
                     onChange={(e) => handleEmailChange(e.target.value)}
                     placeholder="Enter your email"
                     className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg py-3 pl-11 pr-4 text-[var(--text-primary)] text-[15px] placeholder-[var(--text-tertiary)] outline-none focus:border-[var(--accent-primary)] transition-colors"
                   />
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">✉️</span>
                 </div>
               </div>

               {/* Password */}
               <div>
                 <label htmlFor="password" className="block text-[var(--text-tertiary)] text-[10px] uppercase tracking-wider mb-2">
                   Password
                 </label>
                 <div className="relative">
                   <input
                     ref={passwordInputRef}
                     id="password"
                     name="password"
                     type={showPassword ? "text" : "password"}
                     autoComplete="current-password"
                     aria-label="Password"
                     value={password}
                     onChange={(e) => handlePasswordChange(e.target.value)}
                     placeholder="Enter your password"
                     className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg py-3 pl-11 pr-12 text-[var(--text-primary)] text-[15px] placeholder-[var(--text-tertiary)] outline-none focus:border-[var(--accent-primary)] transition-colors"
                   />
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">🔒</span>
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                   >
                     {showPassword ? "👁️" : "👁️‍🗨️"}
                   </button>
                 </div>
               </div>

               {/* Remember me & Forgot password */}
               <div className="flex items-center justify-between">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <div 
                     className={clsx(
                       "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                       rememberMe ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]" : "border-[var(--border-default)]"
                     )}
                     onClick={() => setRememberMe(!rememberMe)}
                   >
                     {rememberMe && <span className="text-[var(--text-tertiary)] text-[10px]">✓</span>}
                   </div>
                   <span className="text-[var(--text-tertiary)] text-[13px]">Remember me</span>
                 </label>
                 <button 
                   onClick={() => navigate('/forgot-password')}
                   className="text-[var(--accent-primary)] text-[13px] hover:underline"
                 >
                   Forgot Password?
                 </button>
               </div>

               {/* Sign in button */}
               <button
                 type="submit"
                 disabled={isLoading}
                 className={clsx(
                   "w-full bg-[var(--accent-primary)] text-[var(--text-tertiary)] font-semibold py-3 rounded-lg transition-all duration-200",
                   isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--accent-primary-hover)] shadow-[0_0_12px_rgba(var(--accent-primary-rgb),0.25)]"
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
    </div>
  );
}
