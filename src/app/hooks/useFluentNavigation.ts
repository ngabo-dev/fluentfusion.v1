import { useNavigate } from 'react-router';

export const useFluentNavigation = () => {
  const navigate = useNavigate();

  return {
    toWelcome: () => navigate('/'),
    toSignup: () => navigate('/signup'),
    toLogin: () => navigate('/login'),
    toForgotPassword: () => navigate('/forgot-password'),
    toVerifyEmail: () => navigate('/verify-email'),
    toOnboardNativeLang: () => navigate('/onboard/native-language'),
    toOnboardLearnLang: () => navigate('/onboard/learn-language'),
    toOnboardGoal: () => navigate('/onboard/goal'),
    toOnboardLevel: () => navigate('/onboard/level'),
    toDashboard: () => navigate('/dashboard'),
    goBack: () => navigate(-1),
  };
};
