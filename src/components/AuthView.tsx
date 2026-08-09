import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentPersona, TrackType, ExperienceLevel } from '../types';
import { Sparkles, LogIn, UserPlus, Zap, Rocket, ShieldCheck } from 'lucide-react';

interface AuthViewProps {
  initialTab?: 'login' | 'signup';
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialTab = 'login', onSuccess, onNavigateHome }) => {
  const { login, signUp, switchPersona } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  // Login state
  const [email, setEmail] = useState('');

  // Signup state
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [track, setTrack] = useState<TrackType>('frontend');
  const [level, setLevel] = useState<ExperienceLevel>('beginner');
  const [goal, setGoal] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim());
    onSuccess();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !signUpEmail.trim()) return;
    signUp(name.trim(), signUpEmail.trim(), track, level, goal || 'Learn software engineering step by step');
    onSuccess();
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
          {tab === 'login' ? 'Sign In to ABTalks' : 'Create Your ABTalks Account'}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          60-Day Technical Consistency & Proof of Work Platform
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'login' ? 'border-slate-900 text-slate-900 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'signup' ? 'border-slate-900 text-slate-900 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-6">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@student.abtalks.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (Mock)
                </label>
                <input
                  type="password"
                  value="••••••••"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-400 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Sign In to Dashboard</span>
              </button>

              {/* DEMO ACCOUNTS QUICK ACCESS */}
              <div className="pt-5 border-t border-slate-100 space-y-3">
                <div className="text-center space-y-0.5">
                  <p className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">
                    Try Demo Account (Instant Login)
                  </p>
                  <p className="text-[10px] text-slate-400">Select any student persona to test state flow</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('new')}
                    className="p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/80 text-left space-y-0.5 transition-all text-emerald-950"
                  >
                    <p className="font-bold text-xs text-emerald-950">Aarav (New Student)</p>
                    <p className="text-[10px] text-emerald-700 font-medium">Day 1 • Onboarding</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('active')}
                    className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200/80 text-left space-y-0.5 transition-all text-blue-950"
                  >
                    <p className="font-bold text-xs text-blue-950">Ananya (Active)</p>
                    <p className="text-[10px] text-blue-700 font-medium">Day 12 • 7d Streak</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('inconsistent')}
                    className="p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 text-left space-y-0.5 transition-all text-amber-950"
                  >
                    <p className="font-bold text-xs text-amber-950">Rahul (Inconsistent)</p>
                    <p className="text-[10px] text-amber-700 font-medium">Day 23 • Recovery</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('completed')}
                    className="p-3 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/80 text-left space-y-0.5 transition-all text-purple-950"
                  >
                    <p className="font-bold text-xs text-purple-950">Meera (Completed)</p>
                    <p className="text-[10px] text-purple-700 font-medium">Day 60 • Graduate</p>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
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
                  placeholder="aarav@student.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Track</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as TrackType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 outline-hidden bg-white"
                  >
                    <option value="frontend">Frontend Eng</option>
                    <option value="fullstack">Full-Stack Web</option>
                    <option value="backend">Backend Systems</option>
                    <option value="ai">AI Applied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 outline-hidden bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Build daily habits for 60 days"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-transform hover:scale-102"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Start Onboarding</span>
              </button>
            </form>
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
