import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/auth';
import { User, StudentPersona, TrackType, ExperienceLevel } from '../types';
import { Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle2, KeyRound, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  initialTab?: 'login' | 'signup';
  onSuccess: (user?: User) => void;
  onNavigateHome: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialTab = 'login', onSuccess, onNavigateHome }) => {
  const { login, signUp, switchPersona } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [track, setTrack] = useState<TrackType>('frontend');
  const [level, setLevel] = useState<ExperienceLevel>('beginner');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [goal, setGoal] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      const loggedInUser = login(loginEmail.trim(), loginPassword);
      onSuccess(loggedInUser);
    } catch (err: any) {
      setErrorMsg(err.message || 'Email or password is incorrect.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@') || !signUpEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      const signedUpUser = signUp(
        name.trim(),
        signUpEmail.trim(),
        password,
        track,
        level,
        goal || 'Build coding consistency over 60 days',
        college,
        graduationYear
      );
      onSuccess(signedUpUser);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setAccountNotFound(false);

    if (!forgotEmail.trim() || !forgotEmail.includes('@') || !forgotEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const verifiedUser = AuthService.verifyAccountExists(forgotEmail.trim());

    if (!verifiedUser) {
      setAccountNotFound(true);
      setIsAccountVerified(false);
      setErrorMsg(`No account found with email "${forgotEmail.trim()}". You need to create an account first.`);
      return;
    }

    setAccountNotFound(false);
    setIsAccountVerified(true);
    setSuccessMsg(`Account verified for ${verifiedUser.name}! A password reset verification link was generated for ${verifiedUser.email}. Please set your new password below.`);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      AuthService.resetPassword(forgotEmail, newPassword);
      setLoginEmail(forgotEmail.trim());
      setLoginPassword(newPassword);
      setSuccessMsg(`Password reset successful! You can now sign in with your new password.`);
      setTab('login');
      setIsAccountVerified(false);
      setForgotEmail('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password.');
    }
  };

  const handleQuickDemoSelect = (personaKey: StudentPersona) => {
    switchPersona(personaKey);
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Student Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {tab === 'login' ? 'Sign In to ABTalks' : tab === 'signup' ? 'Create Your Account' : 'Reset Password'}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          60-Day Technical Consistency & Proof of Work Platform
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Tab Switcher */}
        {tab !== 'forgot' && (
          <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
            <button
              onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                tab === 'login' ? 'border-slate-900 text-slate-900 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                tab === 'signup' ? 'border-slate-900 text-slate-900 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Global Alert Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2 font-medium">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              {accountNotFound && (
                <div className="pt-2 border-t border-rose-200/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSignUpEmail(forgotEmail.trim());
                      setTab('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      setAccountNotFound(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <span>Create Account Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. aarav@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[11px] text-indigo-600 hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102 min-h-[44px]"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Sign In to Dashboard</span>
              </button>

              {/* DEMO ACCOUNTS QUICK ACCESS */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="text-center space-y-0.5">
                  <p className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">
                    Demo Accounts (Password: DemoPassword123)
                  </p>
                  <p className="text-[10px] text-slate-500">Click any student below for instant sign in</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('aarav@example.com');
                      setLoginPassword('DemoPassword123');
                      const u = login('aarav@example.com', 'DemoPassword123');
                      onSuccess(u);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80 text-left space-y-0.5 transition-all"
                  >
                    <p className="font-bold text-xs text-emerald-950">Aarav Sharma</p>
                    <p className="text-[10px] text-emerald-700">Frontend • Day 1</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('ananya@example.com');
                      setLoginPassword('DemoPassword123');
                      const u = login('ananya@example.com', 'DemoPassword123');
                      onSuccess(u);
                    }}
                    className="p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 text-left space-y-0.5 transition-all"
                  >
                    <p className="font-bold text-xs text-blue-950">Ananya Reddy</p>
                    <p className="text-[10px] text-blue-700">Full-Stack • Day 18</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('rahul@example.com');
                      setLoginPassword('DemoPassword123');
                      const u = login('rahul@example.com', 'DemoPassword123');
                      onSuccess(u);
                    }}
                    className="p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 text-left space-y-0.5 transition-all"
                  >
                    <p className="font-bold text-xs text-amber-950">Rahul Kumar</p>
                    <p className="text-[10px] text-amber-700">Backend • Recovery</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('priya@example.com');
                      setLoginPassword('DemoPassword123');
                      const u = login('priya@example.com', 'DemoPassword123');
                      onSuccess(u);
                    }}
                    className="p-2.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200/80 text-left space-y-0.5 transition-all"
                  >
                    <p className="font-bold text-xs text-purple-950">Priya Nair</p>
                    <p className="text-[10px] text-purple-700">Data/AI • Graduate</p>
                  </button>
                </div>
              </div>
            </form>
          ) : tab === 'signup' ? (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="aarav@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102 min-h-[44px]"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Create Account & Start Onboarding</span>
              </button>
            </form>
          ) : (
            /* Forgot Password / Reset Password view */
            !isAccountVerified ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700 mb-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-bold">Verify Account & Reset Password</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      setErrorMsg(null);
                      setAccountNotFound(false);
                    }}
                    placeholder="e.g. aarav@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    We will verify your registered account before generating a reset authorization.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Account & Send Reset Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); setAccountNotFound(false); }}
                  className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs font-bold">Account Verified: {forgotEmail}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Set New Password & Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountVerified(false);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Use Different Email</span>
                </button>
              </form>
            )
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onNavigateHome}
          className="text-xs text-slate-500 hover:text-slate-900 font-medium underline"
        >
          Return to Public Landing Page
        </button>
      </div>
    </div>
  );
};
